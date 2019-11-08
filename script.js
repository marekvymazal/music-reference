var curKey = 3;
var curScale = "major";

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
        name: "major",
        intervals: [1,0,1,0,1,1,0,1,0,1,0,1]
    },
    {
        name: "natural-minor",
        intervals: [1,0,1,1,0,1,0,1,1,0,1,0]
    },
    {
        name: "melodic-minor",
        intervals: [1,0,1,1,0,1,0,1,0,1,0,1]
    },
    {
        name: "harmonic-minor",
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
    console.log(curKey);
    console.log(curScale);

    let curIntervals = null;
    scales.forEach( function( s ){
        if (s.name == curScale){
            curIntervals = s.intervals;
        }
    });
    console.log( curIntervals );

    let scaleDisplay = document.getElementById('scale-display');

    // clear
    scaleDisplay.innerHTML = ""
    //scaleDisplay.removeChildren();

    // add scales
    for (var i=0; i<24; i++)
    {
        let keyValues = convertKey(3, i, curKey, curIntervals);

        let note = document.createElement("div");
        note.className += "key";
        note.className += " " + keyValues.keyType;
        note.innerHTML = keyValues.label;

        if (keyValues.selected){
            note.className += " selected";
        }

        scaleDisplay.appendChild(note);
    }

    // update title
    let scaleTitle = document.getElementById('scale-title');
    scaleTitle.innerHTML = keys[curKey] + " " + curScale;
}

// Setup Dropdowns ======================================================
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

// scale buttons
var scaleButtons = document.getElementById('scaleDropdown').getElementsByTagName('button');
for (var i=0; i<scaleButtons.length; i++ )
{
    scaleButtons[i].onclick = function(){
        curScale = this.innerHTML.replace(' ', '-').toLowerCase();
        updateScale();
    };
};

// initial setup
updateScale();
