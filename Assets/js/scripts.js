// grab API Key from config and Search btn from HTML
const key = config.APIKey;
const searchBtn = document.getElementById("search-btn");

// add city to archive (button list & localstorage)
const addToArchive = (city) => {
  const cityArchive = document.getElementById("city-archive");
  cityArchive.innerHTML += `<button class="city-btn">${city}</button>`;
};

// get lat/lon based on city name
const getLatLon = (city) => {
  let queryURL =
    "http://api.openweathermap.org/geo/1.0/direct?q=" +
    city +
    "&limit=1&appid=" +
    key;

  // todo: insert error for typing city that doesn't exist
  fetch(queryURL)
    .then((response) => response.json())
    .then((data) => {
      let lat = data[0].lat;
      let lon = data[0].lon;
      getWeather(city, lat, lon);
    });
};

const getWeather = (city, lat, lon) => {
  let queryURL =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    lat +
    "&lon=" +
    lon +
    "&exclude=minutely,hourly,alerts&appid=" +
    key;

  fetch(queryURL)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);

      let selectedCity = document.getElementById("selected-city");
      let temp = document.getElementById("temp");
      let wind = document.getElementById("wind");
      let humidity = document.getElementById("humidity");
      let uvi = document.getElementById("uvi");

      selectedCity.innerHTML = city;
      temp.innerHTML = data.current.temp;
      wind.innerHTML = data.current.wind_speed;
      humidity.innerHTML = data.current.humidity;
      uvi.innerHTML = data.current.uvi;
    });
};

// upon search btn click, get lat/lon and add city to archive
searchBtn.addEventListener("click", () => {
  const city = document.getElementById("city-input").value;
  // check for empty input
  getLatLon(city);
  addToArchive(city);
});