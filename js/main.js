// Initialization after document content loads
document.addEventListener("DOMContentLoaded", async function () {
    console.log("Page Loaded");

    var elems = document.querySelectorAll(".dropdown-trigger");
    var instances = M.Dropdown.init(elems, {});

    // Set up initial database info
    dburl = "https://zerossive-homepage-default-rtdb.firebaseio.com/Card List/";
    cardListUrl = await getData(dburl, "Current List");
    document.querySelector("#cardListBtn").innerHTML = cardListUrl;

    // Card list button event listeners
    document
        .querySelector("#listBtn1")
        .addEventListener("click", changeCardList);
    document
        .querySelector("#listBtn2")
        .addEventListener("click", changeCardList);
    document
        .querySelector("#listBtn3")
        .addEventListener("click", changeCardList);

    // Window size change event listener
    window.addEventListener("resize", function () {
        // Auto resize text areas
        if (document.querySelector(".materialize-textarea")) {
            M.textareaAutoResize(
                document.querySelector(".materialize-textarea")
            );
        }
    });

    setupCards();

    console.log("Initial Cards Created");

    showTime();
});

// Button function to change the selected card list
function changeCardList(e) {
    let button = e.target;
    cardListUrl = button.innerHTML;
    document.querySelector("#cardListBtn").innerHTML = cardListUrl;
    document.querySelector("#cardArea").innerHTML = "";
    patchData(dburl, "", "Current List", cardListUrl);
    setupCards();

    console.log("Switched to card list: " + button.innerHTML);
}

// Sets up the initial cards from database
async function setupCards() {
    cardList = await getData(dburl, cardListUrl);

    for (const property in cardList) {
        createCard(`${property}`, `${cardList[property]}`);
    }

    // Auto resize text areas
    if (document.querySelector(".materialize-textarea")) {
        M.textareaAutoResize(document.querySelector(".materialize-textarea"));
    }
}

// Creates a new card and updates database
function createNewCard() {
    let card = createCard();
    patchData(dburl, cardListUrl, card.name, card.value);
    card.textField.focus();
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    console.log("Created Card: " + card.name);
}

// Creates a card element
function createCard(name, value) {
    // card
    let newCard = document.createElement("div");
    newCard.setAttribute(
        "class",
        "card-panel blue-grey darken-3 col s12 valign-wrapper"
    );
    !name ? (newCard.id = "card" + new Date().getTime()) : (newCard.id = name);
    newCard.style.transition = "opacity 500ms";
    newCard.style.opacity = "0";
    requestAnimationFrame(() => {
        newCard.style.opacity = "1";
    });
    document.querySelector("#cardArea").appendChild(newCard);

    // input-field
    let inputField = document.createElement("div");
    inputField.setAttribute("class", "col s12 input-field");
    newCard.appendChild(inputField);

    // textarea
    let textArea = document.createElement("textarea");
    textArea.setAttribute("class", "materialize-textarea white-text");
    textArea.id = newCard.id + "text";
    !value ? (textArea.innerHTML = "") : (textArea.innerHTML = value);
    textArea.addEventListener("keyup", function () {
        patchData(dburl, cardListUrl, newCard.id, textArea.value);
    });
    inputField.appendChild(textArea);
    // Auto resize text areas
    M.textareaAutoResize(document.querySelector(".materialize-textarea"));

    // button div
    let buttonDiv = document.createElement("div");
    newCard.appendChild(buttonDiv);

    // button
    let button = document.createElement("a");
    button.setAttribute(
        "class",
        "btn blue-grey waves-effect waves-light hoverable"
    );
    button.addEventListener("mouseover", function () {
        button.style.color = "#e57373";
    });
    button.addEventListener("mouseout", function () {
        button.style.color = "";
    });
    button.addEventListener("click", function () {
        removeCard(button);
    });
    buttonDiv.appendChild(button);

    // button icon
    let buttonIcon = document.createElement("i");
    buttonIcon.setAttribute("class", "material-icons");
    buttonIcon.innerHTML = "remove";
    button.appendChild(buttonIcon);

    let card = {
        name: newCard.id,
        value: textArea.innerHTML,
        textField: textArea,
    };
    return card;
}

// Updates database
async function patchData(url, item, name, value) {
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

// Makes a random id string
function makeid(length) {
    var result = "";
    var characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(
            Math.floor(Math.random() * charactersLength)
        );
    }
    return result;
}

// Removes the selected card
function removeCard(delBtn) {
    while (!delBtn.classList.contains("card-panel")) {
        delBtn = delBtn.parentElement;
    }
    deleteData(dburl, cardListUrl, delBtn.id);
    delBtn.remove();

    M.Toast.dismissAll();
    M.toast({ html: "Card Removed", classes: "red lighten-2" });
    console.log("Removed Card: " + delBtn.id);
}

// Deletes data from database
async function deleteData(url, item, name) {
    // data = { [name]: value };
    const response = await fetch(url + item + "/" + name + ".json", {
        method: "DELETE",
    });
}

// Display Time
function showTime(textArea) {
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

    setTimeout(showTime, 250);
}
