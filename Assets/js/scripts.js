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
    lon: lon,
  };
  localStorage.setItem("city", JSON.stringify(cityStorage));
  // todo: check to see if city exists
  addCity(city);
};

const addCity = (city, lat, lon) => {
  cityArchive.innerHTML += `<button class="city-btn">${city}</button>`;
  cityCount = cityArchive.getElementsByTagName("*").length;

  for (var i = 0; i < cityCount; i++) {
    const cityBtn = document.getElementsByClassName("city-btn");
    cityBtn[i].addEventListener("click", getWeather(city, lat, lon));
  }
};

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

      let selectedCity = document.getElementById("selected-city");
      let tempCurrent = document.getElementById("temp");
      let windCurrent = document.getElementById("wind");
      let humidityCurrent = document.getElementById("humidity");
      let uviCurrent = document.getElementById("uvi");

      let dataUVI = data.current.uvi;

      selectedCity.innerHTML = city;
      getDate();
      tempCurrent.innerHTML = data.current.temp;
      windCurrent.innerHTML = data.current.wind_speed;
      humidityCurrent.innerHTML = data.current.humidity;
      uviCurrent.innerHTML = dataUVI;

      if (dataUVI <= 2) {
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
    });
};

const getDate = () => {
  let selectedCity = document.getElementById("selected-city");

  let today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const yyyy = today.getFullYear();

  today = mm + "/" + dd + "/" + yyyy;
  selectedCity.innerHTML += " " + today;
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
      console.log(lat, lon);
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
