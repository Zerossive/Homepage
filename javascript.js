// Run at Startup
async function startup() {
    // Update time every second
    showTime();

    // Database URL
    dburl = "https://zerossive-homepage-default-rtdb.firebaseio.com/";

    // Setup Note Elements
    const textL = document.getElementById("textL");
    const textM = document.getElementById("textM");
    const textR = document.getElementById("textR");

    // Fill Notes w/ Database Values
    setupStickyNotes(textL, textM, textR);

    // Setup Note Event Listeners
    textL.addEventListener("keydown", updateNote);
    textM.addEventListener("keydown", updateNote);
    textR.addEventListener("keydown", updateNote);

    // Event Listeners to Save Notes
    textL.addEventListener("keyup", saveNote);
    textM.addEventListener("keyup", saveNote);
    textR.addEventListener("keyup", saveNote);
}

// Sets up the initial states for the sticky notes based on database values
async function setupStickyNotes(textL, textM, textR) {
    stickyData = await getData(dburl, "Sticky Notes");
    textL.value = await stickyData.textL;
    textM.value = await stickyData.textM;
    textR.value = await stickyData.textR;
    console.log("Sticky Notes Set Up!");
}

// Search on "Enter" Pressed
function enterSearch(e) {
    if (e.keyCode == 13) {
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

    if (e.key == "Tab") {
        // Case for "Tab"
        note.value =
            note.value.slice(0, startPos) + "\t" + note.value.slice(startPos);
        e.preventDefault();
        note.setSelectionRange(startPos + "\t".length, startPos + "\t".length);
    } else if (e.key == " " && note.value[startPos - 1] == "*") {
        // Case for "Bullet Point"
        note.value =
            note.value.slice(0, startPos - 1) +
            " \u25CF" +
            note.value.slice(startPos);
    } else if (e.key == "Enter" && note.value.includes("\u25CF")) {
        // Case for "Enter"
        note.value =
            note.value.slice(0, startPos) +
            " \u25CF " +
            note.value.slice(startPos);
        note.setSelectionRange(startPos, startPos);
    }
}

// Saves Notes on keyup After Editing
function saveNote(e) {
    note = e.target;
    if (e.key == "Enter" && note.value.includes("\u25CF")) {
        note.setSelectionRange(startPos + 4, startPos + 4);
    }

    patchDatabase(dburl, "Sticky Notes", note.id, note.value);
}

// Updates database
async function patchDatabase(url, item, name, value) {
    data = { [name]: value };
    const response = await fetch(url + item + ".json", {
        method: "PATCH",
        body: JSON.stringify(data),
    });
}

// Gets data from database
async function getData(url, item) {
    const response = await fetch(url + item + ".json");
    return response.json();
}

// Button to Delete Note
function eraseNote(note) {
    var selectedId = note.id;
    noteId =
        "text" + selectedId.substring(selectedId.length - 1, selectedId.length);
    document.getElementById(noteId).value = "";

    patchDatabase(dburl, "Sticky Notes", noteId, "");

    console.log(noteId + " erased");
}

// Display Time
function showTime() {
    var date = new Date();
    var h = date.getHours(); // 0 - 23
    var m = date.getMinutes(); // 0 - 59
    var s = date.getSeconds(); // 0 - 59
    var session = "AM";

    var months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
    var days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];

    if (h == 0) {
        h = 12;
    }

    if (h > 12) {
        h = h - 12;
        session = "PM";
    }

    //Add zeroes
    // h = (h < 10) ? "0" + h : h;
    m = m < 10 ? "0" + m : m;
    s = s < 10 ? "0" + s : s;

    //Set Time
    var time = h + ":" + m + ":" + s + " " + session;
    document.getElementById("time").innerText = time;
    document.getElementById("time").textContent = time;

    //Set date
    var calDate =
        days[date.getDay()] +
        ", " +
        months[date.getMonth()] +
        " " +
        date.getDate();
    document.getElementById("date").innerText = calDate;

    setTimeout(showTime, 1000);
}
