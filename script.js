var keyMap = [
    {
        "id": "a",
        "name":"A",
    },
    {
        "id": "as",
        "name":"A#",
    },
    {
        "id": "b",
        "name":"B",
    },
    {
        "id": "c",
        "name":"C",
    },
    {
        "id": "cs",
        "name":"C#",
    },
    {
        "id": "d",
        "name":"D",
    },
    {
        "id": "ds",
        "name":"D#",
    },
    {
        "id": "e",
        "name":"E",
    },
    {
        "id": "f",
        "name":"F",
    },
    {
        "id": "fs",
        "name":"F#",
    },
    {
        "id": "g",
        "name":"G",
    },
    {
        "id": "gs",
        "name":"G#",
    }
];

var scalesData = null;

var hashVars = window.location.hash.substr(1).split('+');
var settings = {
    "key": 3,
    "scale": 0
};

hashVars.forEach( function(s){
    var [key, value] = s.split("=");
    if (key == "key"){
        for (var i=0; i<keyMap.length; i++) {
            if (keyMap[i].id == value){
                settings[key] = i;
            }
        };
    } else if (key == "scale" && scalesData != null) {
        for (var i=0; i<scalesData.length; i++) {
            if (scalesData[i].id == value){
                settings[key] = i;
            }
        };
    }
});

var curIntervals = [0,0,0,0,0,0,0,0,0,0,0,0];
var keyButtons = [];
var scaleButtons = [];

// static data
var keys = [
    'A',
    'A#\nBb',
    'B',
    'C',
    'C#\nDb',
    'D',
    'D#\nEb',
    'E',
    'F',
    'F#\nGb',
    'G',
    'G#\nAb'
];

var keyIdentifier = [
    true,
    false,
    true,
    true,
    false,
    true,
    false,
    true,
    true,
    false,
    true,
    false
]

// converts key position into a normalized 0-12 piano key
function convertPos( pos ){
    while ( pos >= 12){
        pos -= 12;
    }
    while (pos < 0){
        pos += 12;
    }
    return pos;
}

function convertKey( start, note, key, intervals ){
    let pos = start + note;

    let normalizedPos = convertPos(pos)
    let label = keys[normalizedPos];

    // determin key type
    let keyType = "white";
    if (!keyIdentifier[normalizedPos]){
        keyType = "black"
    }

    // check if selected
    let selected = false;
    let intervalIndex = convertPos(normalizedPos-key);
    if (intervals[intervalIndex]){
        selected = true;
    }

    return {
        position: pos,
        label: label,
        keyType: keyType,
        selected: selected
    }
}

function highlightOption( elementList, index ) {
    for (var i=0; i<elementList.length; i++){
        if (i == index) {
            elementList[i].classList.add('selected');
        } else {
            elementList[i].classList.remove('selected');
        }
    }
}

function updatePage(){

    console.log("key", settings.key);
    console.log("scale", settings.scale);

    var width = window.innerWidth
    || document.documentElement.clientWidth
    || document.body.clientWidth;

    var height = window.innerHeight
    || document.documentElement.clientHeight
    || document.body.clientHeight;

    if (scalesData == null){
        return;
    }

    highlightOption( keyButtons, settings.key );
    highlightOption( scaleButtons, settings.scale );

    curIntervals = scalesData[settings.scale].intervals;


    let scaleDisplay = document.getElementById('scale-display');

    // clear
    scaleDisplay.innerHTML = ""

    // add scales
    let totalKeys = 24;
    if (width < 500){
        totalKeys = 12;
    }

    let targetContainer = null;
    for (var i=0; i<totalKeys; i++)
    {
        let keyValues = convertKey(3, i, settings.key, curIntervals);

        if (keyValues.keyType == 'white'){

            // make new key container
            let keyContainer = document.createElement("div");
            keyContainer.className += "key-container";
            scaleDisplay.appendChild(keyContainer);
            targetContainer = keyContainer;
        }

        let note = document.createElement("div");
        note.className += "key";
        note.className += " " + keyValues.keyType;
        note.innerHTML = keyValues.label;

        if (keyValues.selected){
            note.className += " selected-key";
        }

        targetContainer.appendChild(note);
    }

    // update title
    let scaleTitle = document.getElementById('scale-title');
    scaleTitle.innerHTML = keys[settings.key] + " " + scalesData[settings.scale].name;
}

// Setup Dropdowns ======================================================

// generate key buttons
let keyDropdown = document.getElementById('keyDropdown');
for (var i=0; i<keys.length; i++){
    let b = document.createElement("button");
    b.className += "dropdownbtn";
    b.innerHTML = keys[i].replace('\n', ' / ');

    b.name = i;
    b.onclick = function(){
        settings.key = parseInt(this.name);
        updatePage();
    };

    keyDropdown.appendChild(b);
}

function createScaleButtons(){
    let scaleDropdown = document.getElementById('scaleDropdown');
    for (let scale in scalesData){
        let b = document.createElement("button");
        b.className += "dropdownbtn";
        b.innerHTML = scalesData[scale].name;

        b.onclick = function(){
            settings.scale = scale;
            updateHash();
        };

        scaleDropdown.appendChild(b);
        scaleButtons.push(b);
    }
}

function enableDropdown(name, enabled ){
    var dropdowns = document.getElementsByClassName("dropdown-content");

    var wasOn = false;

    // hide all dropdowns and check to see if selected dropdown was already on for toggling
    for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')){
            if (openDropdown.id == name + "Dropdown"){
                wasOn = true;
            }
            openDropdown.classList.remove('show');
        }
    }

    if (name != null && enabled && !wasOn){
        document.getElementById(name + "Dropdown").classList.add("show");
    }
}

var mainButtons = document.getElementsByClassName('dropbtn');
for (var i=0; i<mainButtons.length; i++ )
{
    mainButtons[i].onclick = function(){
        enableDropdown( this.innerHTML.toLowerCase(), true );
    };
};


// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
        enableDropdown( null, false );
    }
}

function updateHash()
{
    if (scalesData == null){
        return;
    }
    const newHash = "key=" + keyMap[settings.key].id + "+scale=" + scalesData[settings.scale].id;
    console.log(newHash);
    window.location.hash = newHash;
}

// key buttons
var keyButtons = document.getElementById('keyDropdown').getElementsByTagName('button');
for (var i=0; i<keyButtons.length; i++ )
{
    keyButtons[i].name = i;
    keyButtons[i].onclick = function(){
        settings.key = parseInt(this.name);
        //updatePage();
        updateHash();
    };
};

// AJAX load JSON
function loadScales() {
    try {
       var http_request = new XMLHttpRequest();
    } catch (e) {
         console.log(e);
         return false;
    }

    http_request.onreadystatechange = function() {
        console.log("scaleData.js load status code:", this.status);
        if (this.readyState == 4 && this.status == 200 ) {
            scalesData = JSON.parse(http_request.responseText);
            curIntervals = scalesData[settings.scale].intervals;
            createScaleButtons();
            updatePage();
        }
    }

    http_request.open("GET", "scales.json", true);
    http_request.send();
 }

// initial setup
loadScales();
updatePage();

window.addEventListener("resize", updatePage);

window.onhashchange = function(){
    updatePage();
}
