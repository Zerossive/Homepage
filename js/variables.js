// Page Changer
pageIndex = 0;
animDuration = 0.2;

// Card Info
selectedCard = {
    id: "",
    text: "",
};

// URLs
dbUrl = "https://zerossive-homepage-default-rtdb.firebaseio.com/Card List/";

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
