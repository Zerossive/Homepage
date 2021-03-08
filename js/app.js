// SELECT ELEMENTS
const iconElement = document.querySelector(".weather-icon");
const tempElement = document.querySelector(".temperature-value p");
const descElement = document.querySelector(".temperature-description p");
const locationElement = document.querySelector(".location p");
const notificationElement = document.querySelector(".notification");

// App data
const weather = {};

weather.temperature = {
    unit: "fahrenheit",
};

// APP CONSTS AND VARS
const KELVIN = 273;
// API KEY
const key = "e5a1dd15ec531bafc87845455fce1571";

// CHECK IF BROWSER SUPPORTS GEOLOCATION
if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(setPosition, showError);
} else {
    notificationElement.style.display = "block";
    notificationElement.innerHTML =
        "<p>Browser doesn't Support Geolocation</p>";
}

// SET USER'S POSITION
function setPosition(position) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;

    getWeather(latitude, longitude);
}

// SHOW ERROR WHEN THERE IS AN ISSUE WITH GEOLOCATION SERVICE
function showError(error) {
    notificationElement.style.display = "block";
    notificationElement.innerHTML = `<p> ${error.message} </p>`;
}

// GET WEATHER FROM API PROVIDER
function getWeather(latitude, longitude) {
    let api = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;
    // let api = api.openweathermap.org/data/2.5/weather?q={city name},{state code},{country code}&appid={API key};
    fetch(api)
        .then(function (response) {
            let data = response.json();
            return data;
        })
        .then(function (data) {
            // weather.temperature.value = Math.floor(data.main.temp - KELVIN);
            weather.temperature.value = Math.floor(
                celsiusToFahrenheit(data.main.temp - KELVIN)
            );
            weather.description = data.weather[0].description;
            weather.iconId = data.weather[0].icon;
            weather.city = data.name;
            weather.country = data.sys.country;
        })
        .then(function () {
            displayWeather();
        });
}

// DISPLAY WEATHER TO UI
function displayWeather() {
    iconElement.innerHTML = `<img src="icons/${weather.iconId}.png"/>`;
    tempElement.innerHTML = `${weather.temperature.value}°<span>F</span>`;
    descElement.innerHTML = weather.description;
    locationElement.innerHTML = `${weather.city}, ${weather.country}`;
}

// C to F conversion
function celsiusToFahrenheit(temperature) {
    return (temperature * 9) / 5 + 32;
}

// F to C conversion
function fahrenheitToCelsius(temperature) {
    return ((temperature - 32) * 5) / 9;
}

// WHEN THE USER CLICKS ON THE TEMPERATURE ELEMENET
tempElement.addEventListener("click", function () {
    if (weather.temperature.value === undefined) return;

    if (weather.temperature.unit == "fahrenheit") {
        let celsius = fahrenheitToCelsius(weather.temperature.value);
        celsius = Math.floor(celsius);

        tempElement.innerHTML = `${celsius}°<span>C</span>`;
        weather.temperature.unit = "celsius";
    } else {
        tempElement.innerHTML = `${weather.temperature.value}°<span>F</span>`;
        weather.temperature.unit = "fahrenheit";
    }
});
