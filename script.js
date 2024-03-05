function searchWeather() {
  const apiKey = "73e04db5047167ef0f5199e9292faa16";
  const city = document.getElementById("cityInput").value;

  // Vérifiez si le champ de recherche n'est pas vide
  if (city.trim() === "") {
    alert("Veuillez entrer le nom de la ville.");
    return;
  }

  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

  fetchData(apiUrl);
}

function fetchData(apiUrl) {
  axios
    .get(apiUrl)
    .then((response) => {
      const weatherData = response.data;

      displayWeather(weatherData);
    })
    .catch((error) => {
      console.error(
        "Erreur lors de la récupération des données météorologiques",
        error
      );
      document.getElementById("weather-data").innerHTML =
        "<p>Erreur de recherche. Veuillez réessayer.</p>";
    });
}

function displayWeather(weatherData) {
  document.getElementById("weather-data").innerHTML = `
      <h2>${weatherData.name}, ${weatherData.sys.country}</h2>
      <p>Temperature: (${weatherData.main.temp}-32)/1.8 C</p>
      <p>Weather: ${weatherData.weather[0].description}</p>
    `;

  displayWeatherIcon(weatherData.weather[0].icon);
}

function displayWeatherIcon(iconCode) {
  // Construisez l'URL complet pour l'icône météorologique
  const iconUrl = `http://openweathermap.org/img/w/${iconCode}.png`;

  // Mettez à jour la source de l'image avec l'URL de l'icône
  document.getElementById("weather-icon").src = iconUrl;
}
