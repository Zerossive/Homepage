// Initialization after document content loads
document.addEventListener("DOMContentLoaded", async function () {
    console.log("Page Loaded");

    var elems = document.querySelectorAll(".dropdown-trigger");
    var instances = M.Dropdown.init(elems, {});

    // Set up initial database info
    cardListUrl = await getData(dbUrl, "Current List");
    document.querySelector("#cardListBtn").innerHTML = cardListUrl;

    // Page event listeners
    document.querySelector("#nextBtn").addEventListener("click", changePage);
    document.querySelector("#prevBtn").addEventListener("click", changePage);

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

    // Window resize event listener
    window.addEventListener("resize", windowResize);

    setupCards();
    showTime();

    console.log("Initial Cards Created");
});

// Changes the current page
function changePage(e) {
    let direction = e.target.id;
    let pages = ["notesPage", "page2", "page3"];
    let oldPage = pages[pageIndex];

    // Check if next or previous pages button pressed
    if (direction == "nextBtn") {
        pageIndex == pages.length - 1 ? (pageIndex = 0) : pageIndex++;
    } else if (direction == "prevBtn") {
        pageIndex == 0 ? (pageIndex = pages.length - 1) : pageIndex--;
    } else {
        console.log("Could not change pages");

        return;
    }

    let newPage = pages[pageIndex];

    // close current page
    $("#" + oldPage).animate(
        { width: "70%", opacity: "0" },
        {
            duration: animDuration * 1000,
            complete: function () {
                document.querySelector("#" + oldPage).style.visibility =
                    "hidden";
            },
        }
    );

    // open next/previous page
    document.querySelector("#" + newPage).style.visibility = "visible";
    $("#" + newPage).animate(
        { width: "100%", opacity: "1" },
        {
            duration: animDuration * 1000,
        }
    );

    console.log("Switched to", newPage);
}

// Sets up the initial cards from database
async function setupCards() {
    cardList = await getData(dbUrl, cardListUrl);

    for (const property in cardList) {
        createCard(`${property}`, `${cardList[property]}`);
    }

    // Auto resize text areas
    if (document.querySelector(".materialize-textarea")) {
        for (
            let i = 0;
            i < document.querySelectorAll(".materialize-textarea").length;
            i++
        ) {
            M.textareaAutoResize(
                document.querySelectorAll(".materialize-textarea")[i]
            );
        }
    }
}

// Button function to change the selected card list
function changeCardList(e) {
    let button = e.target;
    cardListUrl = button.innerHTML;
    document.querySelector("#cardListBtn").innerHTML = cardListUrl;
    document.querySelector("#cardArea").innerHTML = "";
    patchData(dbUrl, "", "Current List", cardListUrl);
    setupCards();

    console.log("Switched to card list: " + button.innerHTML);
}

// Creates a new card and updates database
function createNewCard() {
    // Create card and update database
    let card = createCard();
    patchData(dbUrl, cardListUrl, card.name, card.value);
    card.textField.focus();

    // Scroll to bottom on creating a new card
    let scrollingElement = document.scrollingElement || document.body;
    scrollingElement.scrollTop = scrollingElement.scrollHeight;

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
    newCard.style.position = "relative";
    newCard.style.transition = "opacity 500ms";
    newCard.style.opacity = "0";
    newCard.style.overflow = "hidden";
    requestAnimationFrame(() => {
        newCard.style.opacity = "1";
    });
    document.querySelector("#cardArea").appendChild(newCard);

    // left button area
    let leftBtnArea = document.createElement("div");
    leftBtnArea.setAttribute("class", "blue-grey darken-2");
    leftBtnArea.style.position = "absolute";
    leftBtnArea.style.left = "0px";
    leftBtnArea.style.height = "100%";
    leftBtnArea.style.width = "51.5px";
    leftBtnArea.style.borderRadius = "10px";
    newCard.appendChild(leftBtnArea);

    // move up button
    let prevBtn = document.createElement("a");
    prevBtn.setAttribute(
        "class",
        "btn-flat blue-grey darken-2 waves-effect waves-light hoverable lighten-2 valign-wrapper white-text"
    );
    prevBtn.style.backgroundColor = "#455a64";
    prevBtn.style.width = "51.5px";
    prevBtn.style.height = "50%";
    prevBtn.style.position = "absolute";
    prevBtn.style.top = "0px";
    prevBtn.style.textAlign = "center";
    prevBtn.addEventListener("mouseover", function () {
        prevBtn.style.backgroundColor = "#e57373";
    });
    prevBtn.addEventListener("mouseout", function () {
        prevBtn.style.backgroundColor = "#455a64";
    });
    prevBtn.addEventListener("click", function () {
        // TESTING
        console.log("Moved up", newCard.id);
    });
    leftBtnArea.appendChild(prevBtn);

    // move up icon
    let prevButtonIcon = document.createElement("i");
    prevButtonIcon.setAttribute("class", "material-icons valign-wrapper");
    prevButtonIcon.style.height = "100%";
    prevButtonIcon.innerHTML = "expand_less";
    prevBtn.appendChild(prevButtonIcon);

    // move down button
    let nextBtn = document.createElement("a");
    nextBtn.setAttribute(
        "class",
        "btn-flat blue-grey darken-2 waves-effect waves-light hoverable lighten-2 valign-wrapper white-text"
    );
    nextBtn.style.backgroundColor = "#455a64";
    nextBtn.style.width = "51.5px";
    nextBtn.style.height = "50%";
    nextBtn.style.position = "absolute";
    nextBtn.style.bottom = "0px";
    nextBtn.style.textAlign = "center";
    nextBtn.addEventListener("mouseover", function () {
        nextBtn.style.backgroundColor = "#e57373";
    });
    nextBtn.addEventListener("mouseout", function () {
        nextBtn.style.backgroundColor = "#455a64";
    });
    nextBtn.addEventListener("click", function () {
        // TESTING
        console.log("Moved down", newCard.id);
    });
    leftBtnArea.appendChild(nextBtn);

    // move down icon
    let nextButtonIcon = document.createElement("i");
    nextButtonIcon.setAttribute("class", "material-icons valign-wrapper");
    nextButtonIcon.style.height = "100%";
    nextButtonIcon.innerHTML = "expand_more";
    nextBtn.appendChild(nextButtonIcon);

    // input-field
    let inputField = document.createElement("div");
    inputField.setAttribute("class", "input-field");
    inputField.style.width = "calc(100% - 2*51.5px";
    inputField.style.marginLeft = "51.5px";
    newCard.appendChild(inputField);

    // textarea
    let textArea = document.createElement("textarea");
    textArea.setAttribute("class", "materialize-textarea white-text");
    textArea.id = newCard.id + "text";
    !value ? (textArea.innerHTML = "") : (textArea.innerHTML = value);
    textArea.addEventListener("keydown", function newText(textEvent) {
        editCard(textEvent, newCard.id, textArea);
    });
    textArea.addEventListener("keyup", function newText(textEvent) {
        updateCard(textEvent, newCard.id, textArea);
    });
    inputField.appendChild(textArea);
    // Auto resize text areas
    if (document.querySelector(".materialize-textarea")) {
        for (
            let i = 0;
            i < document.querySelectorAll(".materialize-textarea").length;
            i++
        ) {
            M.textareaAutoResize(
                document.querySelectorAll(".materialize-textarea")[i]
            );
        }
    }

    // delete button
    let button = document.createElement("a");
    button.setAttribute("class", "btn  waves-effect waves-light hoverable");
    button.style.backgroundColor = "#455a64";
    button.style.width = "51.5px";
    button.style.height = "100%";
    button.style.position = "absolute";
    button.style.right = "0px";
    button.addEventListener("mouseover", function () {
        // button.style.color = "#ef9a9a";
        button.style.backgroundColor = "#e57373";
    });
    button.addEventListener("mouseout", function () {
        // button.style.color = "";
        button.style.backgroundColor = "#455a64";
    });
    button.addEventListener("click", function () {
        removeCard(button);
    });
    newCard.appendChild(button);

    // delete button icon
    let buttonIcon = document.createElement("i");
    buttonIcon.setAttribute("class", "material-icons valign-wrapper");
    buttonIcon.style.height = "100%";
    buttonIcon.innerHTML = "delete_outline";
    button.appendChild(buttonIcon);

    // TESTING - Button resize animation
    // newCard.addEventListener("mouseover", function () {
    //     leftBtnArea.style.left = "0px";
    //     button.style.right = "0px";
    //     // inputField.style.width = "calc(100% - 2*51.5px";
    //     // inputField.style.marginLeft = "51.5px";
    // });
    // newCard.addEventListener("mouseout", function () {
    //     leftBtnArea.style.left = "-51.5px";
    //     button.style.right = "-51.5px";
    //     // inputField.style.width = "calc(100% - 51.5px";
    //     // inputField.style.marginLeft = "0px";
    // });

    // Return card info
    let card = {
        name: newCard.id,
        value: textArea.innerHTML,
        textField: textArea,
    };

    return card;
}

// Edits card text
function editCard(textEvent, cardId, text) {
    startPos = text.selectionStart;

    if (textEvent.key == "Tab") {
        // Case for "Tab"
        text.value =
            text.value.slice(0, startPos) + "\t" + text.value.slice(startPos);
        textEvent.preventDefault();
        text.setSelectionRange(startPos + "\t".length, startPos + "\t".length);
    } else if (textEvent.key == " " && text.value[startPos - 1] == "*") {
        // Case for "Bullet Point"
        text.value =
            text.value.slice(0, startPos - 1) +
            " \u25CF" +
            text.value.slice(startPos);
    }
}

// Updates card in database
function updateCard(textEvent, cardId, text) {
    patchData(dbUrl, cardListUrl, cardId, text.value);
}

// Removes the selected card
function removeCard(delBtn) {
    while (!delBtn.classList.contains("card-panel")) {
        delBtn = delBtn.parentElement;
    }
    deleteData(dbUrl, cardListUrl, delBtn.id);
    delBtn.remove();

    M.Toast.dismissAll();
    M.toast({ html: "Card Removed", classes: "red lighten-2" });
    console.log("Removed Card: " + delBtn.id);
}

// Gets data from database
async function getData(url, item) {
    const response = await fetch(url + item + ".json");
    return response.json();
}

// Updates database
async function patchData(url, item, name, value) {
    data = { [name]: value };
    const response = await fetch(url + item + ".json", {
        method: "PATCH",
        body: JSON.stringify(data),
    });
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

// Run on window resize
function windowResize() {
    // Auto resize text areas
    if (document.querySelector(".materialize-textarea")) {
        for (
            let i = 0;
            i < document.querySelectorAll(".materialize-textarea").length;
            i++
        ) {
            M.textareaAutoResize(
                document.querySelectorAll(".materialize-textarea")[i]
            );
        }
    }
}
