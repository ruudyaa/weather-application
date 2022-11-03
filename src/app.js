function formatDateAndTime(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];
  return `${day} ${hours}:${minutes}`;
}

function formatDate(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return days[day];
}

function formatTime(timestamp) {
  let date = new Date(timestamp * 1000);
  let hours = date.getHours();
  return hours;
}

function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = "";
  forecast.forEach(function (forecastDay, index) {
    if (index < 5) {
      forecastHTML =
        forecastHTML +
        `
              <div class="card">
              <div class="card-body1">
                <div class="weather-forecast-date">${formatDate(
                  forecastDay.dt
                )}</div>
                <div class="weather-forecast-temperatures">
                  <span class="weather-forecast-temperatures-max">${Math.round(
                    forecastDay.temp.max
                  )}°</span>
                  <br />
                  <span class="weather-forecast-temperatures-min">${Math.round(
                    forecastDay.temp.min
                  )}°</span>
                </div>
                <img
                  src="http://openweathermap.org/img/wn/${
                    forecastDay.weather[0].icon
                  }@2x.png"
                  alt=""
                  width="70"
                />
              </div>
            </div>
  `;
    }
  });
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  let apiKey = "c95d60a1e3adbeb286133f1ebebc2579";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function displayHourlyForecast(response) {
  let hourlyForecast = response.data.hourly;
  let hourlyForecastElement = document.querySelector("#forecast-hourly");
  let forecastHourlyHTML = "";
  hourlyForecast.forEach(function (forecastHour, index) {
    if (index < 4) {
      forecastHourlyHTML =
        forecastHourlyHTML +
        ` 
        <div class="card">
          <div class="card-body1">
            <h5 class="card-title">${formatTime(forecastHour.dt) + `:00`}</h5>
            <h5 class="card-text">${Math.round(forecastHour.temp)}°</h5>
            <img src="http://openweathermap.org/img/wn/${
              forecastHour.weather[0].icon
            }@2x.png"
            alt=""
            width="70"
            />
          </div>
        <div class="card-footer">
          <small class="text-muted">${
            forecastHour.weather[0].description
          }</small>
        </div>
        </div>
`;
    }
  });
  hourlyForecastElement.innerHTML = forecastHourlyHTML;
}

function getHourlyForecast(coordinates) {
  let apiKey = "c95d60a1e3adbeb286133f1ebebc2579";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&exclude=daily,minutely,current,alerts&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayHourlyForecast);
}

function showTemperature(response) {
  document.querySelector("#cityShown").innerHTML = response.data.name;
  document.querySelector("#cityFirst").innerHTML = response.data.name;
  document.querySelector("#citySecond").innerHTML = response.data.name;
  document.querySelector("#cityThird").innerHTML = response.data.name;
  document.querySelector("#temperature").innerHTML = `${Math.round(
    response.data.main.temp
  )}°C`;
  document.querySelector("#temperatureSecond").innerHTML = `${Math.round(
    response.data.main.temp
  )}`;
  document.querySelector("#humidity").innerHTML = response.data.main.humidity;
  document.querySelector("#visibility").innerHTML = response.data.visibility;
  document.querySelector("#pressure").innerHTML = response.data.main.pressure;
  document.querySelector("#windSpeed").innerHTML = Math.round(
    response.data.wind.speed
  );
  document.querySelector("#highTemp").innerHTML = Math.round(
    response.data.main.temp_max
  );
  document.querySelector("#lowTemp").innerHTML = Math.round(
    response.data.main.temp_min
  );
  document.querySelector("#skyClouds").innerHTML = response.data.clouds.all;
  document.querySelector("#feelsLike").innerHTML = Math.round(
    response.data.main.feels_like
  );
  document.querySelector("#date").innerHTML = formatDateAndTime(
    response.data.dt * 1000
  );

  document
    .querySelector("#icon")
    .setAttribute(
      "src",
      `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
    );
  document.querySelector("#description").innerHTML =
    response.data.weather[0].description;

  celciusTemperature = Math.round(response.data.main.temp);

  getForecast(response.data.coord);
  getHourlyForecast(response.data.coord);
}

function searchCity(city) {
  var apiKey = "c95d60a1e3adbeb286133f1ebebc2579";
  var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q="
    .concat(city, "&appid=")
    .concat(apiKey, "&units=metric");
  axios.get(apiUrl).then(showTemperature);
}

function showCity(event) {
  event.preventDefault();
  var city = document.querySelector("#inputCity").value;
  searchCity(city);
}

function currentLocationTemperature(position) {
  let apiKey = "c95d60a1e3adbeb286133f1ebebc2579";
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
  axios.get(`${apiUrl}`).then(showTemperature);
}

function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(currentLocationTemperature);
}

var searchForm = document.querySelector(".searchCity");
searchForm.addEventListener("submit", showCity);
var currentLocationButton = document.querySelector(".location-btn");
currentLocationButton.addEventListener("click", getCurrentLocation);

searchCity("Kyiv");
