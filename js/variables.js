// Page Changer
pageIndex = 0;
animDuration = 0.2;

// Card Info
selectedCard = {
    id: "",
    text: "",
};

// Link Page
currentLink = "";
linkData = {
    customLink1: {
        icon: "add_link",
        color: "",
        title: "custom",
        link: "",
    },
    customLink2: {
        icon: "add_link",
        color: "",
        title: "custom",
        link: "",
    },
    customLink3: {
        icon: "add_link",
        color: "",
        title: "custom",
        link: "",
    },
    customLink4: {
        icon: "add_link",
        color: "",
        title: "custom",
        link: "",
    },
    customLink5: {
        icon: "add_link",
        color: "",
        title: "custom",
        link: "",
    },
    customLink6: {
        icon: "add_link",
        color: "",
        title: "custom",
        link: "",
    },
    customLink7: {
        icon: "add_link",
        color: "",
        title: "custom",
        link: "",
    },
    customLink8: {
        icon: "add_link",
        color: "",
        title: "custom",
        link: "",
    },
    customLink9: {
        icon: "add_link",
        color: "",
        title: "custom",
        link: "",
    },
};

// URLs
dbUrl = "https://zerossive-homepage-default-rtdb.firebaseio.com/";
userDbUrl =
    "https://zerossive-homepage-default-rtdb.firebaseio.com/Homepage/Users/Default User/Card List/";

// Users
currentUser = "Zerossive";

// TESTING - WebSocket
wsUrl = "wss://frozen-garden-78592.herokuapp.com/";

// Sets up the websocket
function setupWebSocket(url) {
    ws = new WebSocket(url);

    // Confirmation of open socket and refresh timer setup
    ws.onopen = function (event) {
        console.log("WebSocket Connection Opened");

        myTimer = setInterval(socketSendTimer, 30000);
    };

    // Handle received messages
    ws.onmessage = function (event) {
        if (event.data != "Socket Refreshed") {
            console.log("Received:", event.data);
        }
    };

    // Confirmation of closed socket and attempt to reconnect
    ws.onclose = function (event) {
        console.log("WebSocket Connection Closed");
        console.log("Reconnecting . . .");
        setupWebSocket(url);
    };
}

// Sends message to websocket to refresh the connection (must be < 55s)
function socketSendTimer() {
    ws.send("Socket Refreshed");
}

setupWebSocket(wsUrl);

// Opens the link edit context menu
function openContextMenu(buttonId) {
    // Get selected button info
    let button = document.querySelector("#" + buttonId);
    currentIcon = button.firstElementChild.firstElementChild.textContent;
    currentColor = button.firstElementChild.style.backgroundColor;
    currentTitle = button.firstElementChild.innerText.split("\n")[0];
    currentAddress = button.title;

    // Setup link popup
    let linkPopup = document.querySelector("#linkPopup");
    let linkIcon = linkPopup.firstElementChild.childNodes[3].firstElementChild;
    linkIcon.value = currentIcon;
    let linkColor = linkPopup.firstElementChild.childNodes[7].firstElementChild;
    linkColor.value = currentColor;
    let linkTitle =
        linkPopup.firstElementChild.childNodes[11].firstElementChild;
    linkTitle.value = currentTitle;
    let linkAddress =
        linkPopup.firstElementChild.childNodes[15].firstElementChild;
    linkAddress.value = currentAddress;
    linkPopup.style.visibility = "visible";

    currentLink = button.id;

    console.log("Editing the", button.id, "button");
}

// Submits the link edit changes from the link edit context menu
function submitLinkPopup() {
    // Get input field values
    let linkPopup = document.querySelector("#linkPopup");
    let linkIcon =
        linkPopup.firstElementChild.childNodes[3].firstElementChild.value;
    let linkColor =
        linkPopup.firstElementChild.childNodes[7].firstElementChild.value;
    let linkTitle =
        linkPopup.firstElementChild.childNodes[11].firstElementChild.value;
    let linkAddress =
        linkPopup.firstElementChild.childNodes[15].firstElementChild.value;

    // Get and edit current button
    let button = document.querySelector("#" + currentLink);
    button.firstElementChild.firstElementChild.textContent = linkIcon;
    button.firstElementChild.style.backgroundColor = linkColor;
    let originalTitleHTML = button.firstElementChild.innerHTML;
    let newTitleHTML = originalTitleHTML.split("<i");
    let titleHTML = linkTitle + "<i" + newTitleHTML[1];
    button.firstElementChild.innerHTML = titleHTML;
    button.title = linkAddress;
    button.onmouseup = function (e) {
        if (e.button == 0) {
            // Left click
            window.location = linkAddress;
        } else if (e.button == 1) {
            // Middle click
            window.open(linkAddress, "_blank");
        }
    };

    linkData[button.id].icon = linkIcon;
    linkData[button.id].color = linkColor;
    linkData[button.id].title = linkTitle;
    linkData[button.id].link = linkAddress;

    // Save link data to database
    patchData(userDbUrl, "", "Link Data", linkData);

    linkPopup.style.visibility = "hidden";

    // Save links to database
    // patchData(
    //     userDbUrl,
    //     "",
    //     "Link Data",
    //     document.querySelector("#linkData").innerHTML
    // );

    console.log("Link Edit Submitted");
}

function createLink(id, data) {
    // Create link
    let link = document.createElement("div");
    link.classList = "col s12";
    link.id = id;
    link.title = data.link;
    link.onmouseup = function (e) {
        if (e.button == 0) {
            // Left click
            window.location = data.link;
        } else if (e.button == 1) {
            // Middle click
            window.open(data.link, "_blank");
        }
    };
    link.oncontextmenu = function (e) {
        openContextMenu(link.id);
        return false;
    };

    // Create button
    let button = document.createElement("div");
    button.classList = "btn-large col s12 waves-effect waves-light hoverable";
    button.style.backgroundColor = data.color;
    button.innerHTML = data.title;

    // Create icon
    let icon = document.createElement("i");
    icon.classList = "material-icons left";
    icon.innerHTML = data.icon;

    // Create divider
    let divider = document.createElement("div");
    divider.classList = "row";

    // Place elements in page
    button.appendChild(icon);
    link.appendChild(button);
    document.querySelector("#linkArea").appendChild(link);
    document.querySelector("#linkArea").appendChild(divider);
}

function setupLinks() {
    for (let i = 1; i <= 9; i++) {
        createLink("customLink" + i, linkData["customLink" + i]);
    }
}
