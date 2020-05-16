// Run at Startup
function startup() {
    showTime();
    
    // Setup Note Elements
    var textL = document.getElementById("textL");
    var textM = document.getElementById("textM");
    var textR = document.getElementById("textR");

    // Fill Notes w/ Local Values
    textL.value = localStorage.getItem("textL");
    textM.value = localStorage.getItem("textM");
    textR.value = localStorage.getItem("textR");
    
    // Setup Note Event Listeners
    textL.addEventListener("keydown", updateNote);
    textM.addEventListener("keydown", updateNote);
    textR.addEventListener("keydown", updateNote);
    // Event Listeners to Save Notes
    textL.addEventListener("keyup", saveNote);
    textM.addEventListener("keyup", saveNote);
    textR.addEventListener("keyup", saveNote);
}

// Search on "Enter" Pressed
function enterSearch() {
    if (event.keyCode == 13) {
        search();
    }
}

// Search on Button Press
function search() {
    let searchText = document.getElementById("searchText").value;
    window.open("https://www.google.com/search?q=" + searchText, "_self");
}

// Update Note on keydown
function updateNote(e) {
    note = e.target;
    startPos = note.selectionStart;

    if(e.key == "Tab") {
        // Case for "Tab"
        note.value = note.value.slice(0, startPos) + '\t' + note.value.slice(startPos);
        event.preventDefault();
        note.setSelectionRange(startPos + ('\t').length, startPos + ('\t').length);
    } else if (e.key == " " && note.value[startPos - 1] == "*") {
        // Case for "Bullet Point"
        note.value = note.value.slice(0, startPos - 1) + ' \u25CF' + note.value.slice(startPos);
    } else if (e.key == "Enter" && note.value.includes('\u25CF')) {
        // Case for "Enter"
        note.value = note.value.slice(0, startPos) + ' \u25CF ' + note.value.slice(startPos);
        note.setSelectionRange(startPos, startPos);
    }
}

// Saves Notes on keyup After Editing
function saveNote(e) {
    note = e.target;
    if(e.key == "Enter" && note.value.includes('\u25CF')) {
        note.setSelectionRange(startPos + 4, startPos + 4);
    }
    localStorage.setItem(note.id, note.value);
}

// Button to Delete Note
function eraseNote() {
    var selectedId = event.target.id;
    noteId = "text" + selectedId.substring(selectedId.length - 1, selectedId.length);
    document.getElementById(noteId).value = "";
    localStorage.removeItem(noteId);
}

// Display Time
function showTime(){
    var date = new Date();
    var h = date.getHours(); // 0 - 23
    var m = date.getMinutes(); // 0 - 59
    var s = date.getSeconds(); // 0 - 59
    var session = "AM";

    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    
    if(h == 0){
        h = 12;
    }
    
    if(h > 12){
        h = h - 12;
        session = "PM";
    }
    
    //Add zeroes
    // h = (h < 10) ? "0" + h : h;
    m = (m < 10) ? "0" + m : m;
    s = (s < 10) ? "0" + s : s;
    
    //Set Time
    var time = h + ":" + m + ":" + s + " " + session;
    document.getElementById("time").innerText = time;
    document.getElementById("time").textContent = time;

    //Set date
    var calDate = days[date.getDay()] + ", " + months[date.getMonth()] + " " + date.getDate();
    document.getElementById("date").innerText = calDate;
    
    setTimeout(showTime, 1000);
}