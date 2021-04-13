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

function setupWebSocket(url) {
    ws = new WebSocket(url);

    ws.onopen = function (event) {
        console.log("WebSocket Connection Opened");
    };

    ws.onmessage = function (event) {
        console.log("Received:", event.data);
    };

    ws.onclose = function (event) {
        console.log("WebSocket Connection Closed");
        console.log("Reconnecting . . .");
        setupWebSocket(url);
    };
}

setupWebSocket(wsUrl);
