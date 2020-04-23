function startup() {
    showTime();

    document.getElementById("textL").value = localStorage.getItem("textL");
    document.getElementById("textM").value = localStorage.getItem("textM");
    document.getElementById("textR").value = localStorage.getItem("textR");
}

function enterSearch() {
    if (event.keyCode == 13) {
        search();
    }
}

function search() {
    let searchText = document.getElementById("searchText").value;
    window.open("https://www.google.com/search?q=" + searchText, "_self");
}

function updateNote() {
    var selectedId = event.target.id;
    note = document.getElementById(selectedId);
    localStorage.setItem(selectedId, note.value);
}

function eraseNote() {
    var selectedId = event.target.id;
    noteId = "text" + selectedId.substring(selectedId.length - 1, selectedId.length);
    document.getElementById(noteId).value = "";
    localStorage.removeItem(noteId);
}

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