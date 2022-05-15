const APIKey = config.APIKey;
const searchBtn = document.getElementById("search-btn");
const cityArchive = document.getElementById("city-archive");
const selectedCity = document.getElementById("selected-city");

// GET CURRENT DATE
let today = new Date();
const dd = today.getDate();
const mm = today.getMonth() + 1;
const yyyy = today.getFullYear();
today = mm + "/" + dd + "/" + yyyy;

// ADD CITY TO ARCHIVE via button list & localstorage
const addToArchive = (city, lat, lon) => {
  const cityCoord = {
    lat: lat,
    lon: lon,
  };
  localStorage.setItem(city, JSON.stringify(cityCoord));
  addCity(city, lat, lon);
};

// ADD CITY BTN TO LIST
const addCity = (city, lat, lon) => {
  // todo: check to see if city is already in list
  cityArchive.innerHTML += `<button onclick="getWeather('${city}',${lat},${lon})">${city}</button>`;
};

// GET WEATHER FOR SEARCHED / SELECTED CITY
const getWeather = (city, lat, lon) => {
  let queryURL =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    lat +
    "&lon=" +
    lon +
    "&units=imperial&exclude=minutely,hourly,alerts&appid=" +
    APIKey;

  fetch(queryURL)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);

      selectedCity.innerHTML = "";

      let tempCurrent = document.getElementById("temp-current");
      let windCurrent = document.getElementById("wind-current");
      let humidityCurrent = document.getElementById("humidity-current");
      let uviCurrent = document.getElementById("uvi-current");
      let icon = data.current.weather[0].icon;

      selectedCity.innerHTML += `<span>${city}</span>`;
      selectedCity.innerHTML += ` <span>(${today})</span>`;
      selectedCity.innerHTML += ` <img src="https://openweathermap.org/img/wn/${icon}@2x.png" width="50" height="50">`;

      tempCurrent.innerHTML = data.current.temp;
      windCurrent.innerHTML = data.current.wind_speed;
      humidityCurrent.innerHTML = data.current.humidity;

      let dataUVI = data.current.uvi;
      uviCurrent.innerHTML = dataUVI;

      // set uvi threshhold colors
      if (dataUVI <= 3) {
        uviCurrent.style.backgroundColor = "green";
      } else if (dataUVI >= 3 && dataUVI <= 5) {
        uviCurrent.style.backgroundColor = "yellow";
      } else if (dataUVI >= 6 && dataUVI <= 7) {
        uviCurrent.style.backgroundColor = "orange";
      } else if (dataUVI >= 8 && dataUVI <= 10) {
        uviCurrent.style.backgroundColor = "red";
      } else {
        uviCurrent.style.backgroundColor = "purple";
      }

      // add data to 5 day forecast cards
      for (var i = 0; i <= 4; i++) {
        let day = document.getElementById("day" + (i + 1));
        let addDate = i + 1;

        let date = mm + "/" + (dd + addDate) + "/" + yyyy;
        let iconForecast = data.daily[i].weather[0].icon;
        let tempForecast = data.daily[i].temp.day;
        let windForecast = data.daily[i].wind_speed;
        let humidityForecast = data.daily[i].humidity;

        day.innerHTML = `<h2>${date}</h2>
          <img src="https://openweathermap.org/img/wn/${iconForecast}@2x.png">
          <ul>
            <li>Temp: ${tempForecast} &#8457;</li>
            <li>Wind: ${windForecast} MPH</li>
            <li>Humidity: ${humidityForecast} %</li>
          </ul>`;
      }

      let weatherResults = document.getElementById("weather-results");
      weatherResults.style.visibility = "visible";
    });
};

// ADD CITY BTN TO LIST
const getLatLon = (city) => {
  let queryURL =
    "https://api.openweathermap.org/geo/1.0/direct?q=" +
    city +
    "&limit=1&appid=" +
    APIKey;

  // todo: insert error for typing city that doesn't exist
  fetch(queryURL)
    .then((response) => response.json())
    .then((data) => {
      const lat = data[0].lat;
      const lon = data[0].lon;
      getWeather(city, lat, lon);
      addToArchive(city, lat, lon);
    });
};

// upon search btn click, get lat/lon and add city to archive
searchBtn.addEventListener("click", () => {
  const city = document.getElementById("city-input").value;
  // check for empty input
  getLatLon(city);
  document.getElementById("city-input").value = "";
});

// add archived city btns
for (var i = 0; i < localStorage.length; i++) {
  var key = localStorage.key(i);
  var item = JSON.parse(localStorage.getItem(key));
  addCity(key, item.lat, item.lon);
}
