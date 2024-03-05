function searchWeather() {
  const apiKey = "73e04db5047167ef0f5199e9292faa16";
  const city = document.getElementById("cityInput").value;

  if (city.trim() === "") {
    alert("Veuillez entrer le nom de la ville.");
    return;
  }

  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

  fetchData(apiUrl);
  addToHistory(city);
}

function fetchData(apiUrl) {
  axios
    .get(apiUrl)
    .then((response) => {
      const weatherData = response.data;

      displayWeather(weatherData);
    })
    .catch((error) => {
      console.log("Erreur lors de la récupération des données ", error);
      document.getElementById("weather-data").innerHTML =
        "<p>Erreur de recherche. Veuillez réessayer.</p>";
    });
}

function changeTemperatureFormat(kelvinTemperature) {
  const celsiusTemperature = kelvinTemperature - 273.15;
  return celsiusTemperature;
}

function displayWeather(weatherData) {
  const celsiusTemperature = changeTemperatureFormat(weatherData.main.temp);
  document.getElementById("weather-data").innerHTML = `
      <h2>${weatherData.name}, ${weatherData.sys.country}</h2>
      <p>Temperature: ${celsiusTemperature.toFixed(2)}°C</p>
      <p>Weather: ${weatherData.weather[0].description}</p>
      <img id="weather-icon" alt="Weather Icon" />
    `;

  displayWeatherIcon(weatherData.weather[0].icon);
}

function displayWeatherIcon(iconCode) {
  const iconUrl = `http://openweathermap.org/img/w/${iconCode}.png`;
  document.getElementById("weather-icon").src = iconUrl;
}

function getUserCoordinates() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        getCityFromCoordinates(latitude, longitude);
      },
      (error) => {
        console.error("Erreur de géolocalisation:", error);
      }
    );
  } else {
    console.error(
      "La géolocalisation n'est pas prise en charge par ce navigateur."
    );
  }
}

function getCityFromCoordinates(latitude, longitude) {
  const apiKey = "6228bbc7cddd4f4995b90543c66ab101";
  const apiUrl = `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&type=city&lang=fr&limit=1&format=json&apiKey=${apiKey}`;

  fetch(apiUrl)
    .then((response) => response.json())
    .then((result) => {
      const city =
        result.results && result.results.length > 0
          ? result.results[0].city
          : "Ville inconnue";
      console.log("Ville de l'utilisateur:", city);

      document.getElementById("cityInput").value = city;

      searchWeather();
    })
    .catch((error) =>
      console.log("Erreur lors de la récupération de la ville:", error)
    );
}

function addToHistory(city) {
  const history = JSON.parse(localStorage.getItem("weatherHistory")) || [];

  // Ajouter la nouvelle ville à l'historique
  history.push(city);

  const maxHistorySize = 10;
  if (history.length > maxHistorySize) {
    history.shift();
  }

  localStorage.setItem("weatherHistory", JSON.stringify(history));
}

function getWeatherHistory() {
  return JSON.parse(localStorage.getItem("weatherHistory")) || [];
}

console.log("Historique des villes :", getWeatherHistory());
getUserCoordinates();
