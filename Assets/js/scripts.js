// grab API Key from config and Search btn from HTML
const APIKey = config.APIKey;
const searchBtn = document.getElementById("search-btn");
const cityArchive = document.getElementById("city-archive");

// for (var i = 0; i < localStorage.length; i++) {
//   var key = localStorage.key(i);
//   var item = JSON.parse( localStorage.getItem(key) );
//   console.log(item);
//   //addCity();
// }

// add city to archive (button list & localstorage)
const addToArchive = (city, lat, lon) => {
  const cityStorage = {
    name: city,
    lat: lat,
    lon: lon
  }
  localStorage.setItem( "city", JSON.stringify(cityStorage) );
  // todo: check to see if city exists
  addCity(city);
};

const addCity = (city,lat,lon) => {
  cityArchive.innerHTML += `<button class="city-btn">${city}</button>`;
  cityCount = cityArchive.getElementsByTagName('*').length;

  for (var i = 0 ; i < cityCount; i++) {
    const cityBtn = document.getElementsByClassName("city-btn");
    cityBtn[i].addEventListener("click", getWeather(city, lat, lon));
 }
}

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

// get lat/lon based on city name
const getLatLon = (city) => {
  let queryURL =
    "http://api.openweathermap.org/geo/1.0/direct?q=" +
    city +
    "&limit=1&appid=" +
    APIKey;

  // todo: insert error for typing city that doesn't exist
  fetch(queryURL)
    .then((response) => response.json())
    .then((data) => {
      const lat = data[0].lat;
      const lon = data[0].lon;
      console.log(lat,lon);
      getWeather(city, lat, lon);
      // addToArchive(city, lat, lon);
    });

};

// upon search btn click, get lat/lon and add city to archive
searchBtn.addEventListener("click", () => {
  const city = document.getElementById("city-input").value;
  // check for empty input
  getLatLon(city);
});