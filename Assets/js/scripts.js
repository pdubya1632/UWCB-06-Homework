
const APIKey = config.APIKey;
const searchBtn = document.getElementById("search-btn");
const cityArchive = document.getElementById("city-archive");
const selectedCity = document.getElementById("selected-city");

// ADD CITY TO ARCHIVE via button list & localstorage
const addToArchive = (city, lat, lon) => {
  const cityCoord = {
    lat: lat,
    lon: lon,
  };
  localStorage.setItem(city, JSON.stringify(cityCoord));
  // todo: check to see if city exists
  addCity(city, lat, lon);
};

const addCity = (city, lat, lon) => {
  cityArchive.innerHTML += 
  `<button class="city-btn" data-lat="${lat}" data-lon="${lon}">${city}</button>`;

  cityCount = cityArchive.getElementsByTagName("*").length;

  for (var i = 0; i < cityCount; i++) {
    // const cityBtn = document.getElementsByClassName("city-btn");
    // console.log(cityBtn[i]);
    // cityBtn[i].addEventListener("click", getWeather(city, lat, lon));
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

      let tempCurrent = document.getElementById("temp-current");
      let windCurrent = document.getElementById("wind-current");
      let humidityCurrent = document.getElementById("humidity-current");
      let uviCurrent = document.getElementById("uvi-current");

      selectedCity.innerHTML += `<span>${city}</span>`;
      getDate();
      getIcon(data.current.weather[0].icon);
      
      tempCurrent.innerHTML = data.current.temp;
      windCurrent.innerHTML = data.current.wind_speed;
      humidityCurrent.innerHTML = data.current.humidity;

      let dataUVI = data.current.uvi;
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

      // add data to 5 day forecast cards
      for ( var i = 0; i <= 4; i++) {
        let day = document.getElementById("day"+(i+1));
        
        let iconForecast = data.daily[i].weather[0].icon;
        let tempForecast = data.daily[i].temp.day;
        let windForecast = data.daily[i].wind_speed;
        let humidityForecast = data.daily[i].humidity;
        
        day.innerHTML =
          `<h2></h2>
          <img src="http://openweathermap.org/img/wn/${iconForecast}@2x.png">
          <ul>
            <li>Temp: ${tempForecast}</li>
            <li>Wind: ${windForecast}</li>
            <li>Humidity: ${humidityForecast}</li>
          </ul>` 
      };

    });
};

// get/add current date
const getDate = () => {

  let today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(1, "0");
  const yyyy = today.getFullYear();

  today = mm + "/" + dd + "/" + yyyy;
  selectedCity.innerHTML += ` <span>${today}</span>`;

};

const getIcon = (icon) => {
  selectedCity.innerHTML += ` <img src="http://openweathermap.org/img/wn/${icon}@2x.png" width="50" height="50">`;
}

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
  var item = JSON.parse( localStorage.getItem(key) );
  addCity( key, item.lat, item.lon );
}
