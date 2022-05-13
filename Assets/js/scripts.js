const searchBtn = document.getElementById("search-button");

searchBtn.addEventListener("click", () => {
  const cityInput = document.getElementById("city-input").value;
  // check for empty input
  getLatLon(cityInput);
});

function getLatLon(city) {

  const APIKey = "d085326e9285b26166dacc06e92c94ca";

  let queryURL =
    "http://api.openweathermap.org/geo/1.0/direct?q=" +
      city +
      "&limit=1&appid=" +
      APIKey;  
    // "http://api.openweathermap.org/data/2.5/weather?q=" +
    // city +
    // "&appid=" +
    // APIKey +
    // "&units=imperial";

  // insert error for typing city that doesn't exist
  fetch(queryURL)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      // let selectedCity = document.getElementById("selected-city");
      // let temp = document.getElementById("temp");
      // let wind = document.getElementById("wind");
      // let humidity = document.getElementById("humidity");
      //   let uv = document.getElementById("uv");

      // selectedCity.innerHTML += data.name;
      // temp.innerHTML += data.main.temp;
      // wind.innerHTML += data.wind.speed;
      // humidity.innerHTML += data.main.humidity;

      let lat = data.lat;
      let lon = data.lon;
      console.log(lat);
      //   uv.innerHTML += data.main.uv;
    });
};
