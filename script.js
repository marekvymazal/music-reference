var curKey = 3;
var curScale = "Major";

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

var scales = [
    {
        name: "Major",
        intervals: [1,0,1,0,1,1,0,1,0,1,0,1]
    },
    {
        name: "Natural Minor",
        intervals: [1,0,1,1,0,1,0,1,1,0,1,0]
    },
    {
        name: "Melodic Minor",
        intervals: [1,0,1,1,0,1,0,1,0,1,0,1]
    },
    {
        name: "Harmonic Minor",
        intervals: [1,0,1,1,0,1,0,1,1,0,0,1]
    }
];

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

function updateScale(){

    var width = window.innerWidth
    || document.documentElement.clientWidth
    || document.body.clientWidth;

    var height = window.innerHeight
    || document.documentElement.clientHeight
    || document.body.clientHeight;

    console.log(curKey);
    console.log(curScale);
    console.log(width);

    let curIntervals = null;
    scales.forEach( function( s ){
        if (s.name == curScale){
            curIntervals = s.intervals;
        }
    });

    let scaleDisplay = document.getElementById('scale-display');

    // clear
    scaleDisplay.innerHTML = ""
    //scaleDisplay.removeChildren();

    // add scales
    let totalKeys = 24;
    if (width < 500){
        totalKeys = 12;
    }

    let targetContainer = null;
    for (var i=0; i<totalKeys; i++)
    {
        let keyValues = convertKey(3, i, curKey, curIntervals);

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
            note.className += " selected";
        }

        targetContainer.appendChild(note);
    }

    // update title
    let scaleTitle = document.getElementById('scale-title');
    scaleTitle.innerHTML = keys[curKey] + " " + curScale;
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
        curKey = parseInt(this.name);
        updateScale();
    };

    keyDropdown.appendChild(b);
}

// generate scale buttons
let scaleDropdown = document.getElementById('scaleDropdown');
for (var i=0; i<scales.length; i++){
    let b = document.createElement("button");
    b.className += "dropdownbtn";
    b.innerHTML = scales[i].name;

    b.onclick = function(){
        curScale = this.innerHTML;
        updateScale();
    };

    scaleDropdown.appendChild(b);
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

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

// key buttons
var keyButtons = document.getElementById('keyDropdown').getElementsByTagName('button');
for (var i=0; i<keyButtons.length; i++ )
{
    keyButtons[i].name = i;
    keyButtons[i].onclick = function(){
        curKey = parseInt(this.name);
        updateScale();
    };
};

// initial setup
updateScale();

window.addEventListener("resize", updateScale);
