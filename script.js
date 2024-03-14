const form = document.querySelector(".form");
const input = document.querySelector(".form__input ");
const API_KEY = "2a29f2c21b3364c1cdbfb205d78ed2e3";

form.onsubmit = submitHandler;

//корневая функция
async function submitHandler(e) {
  e.preventDefault();
  if (!input.value.trim()) {
    return console.log("Enter city name");
  }

  const cityName = input.value.trim();

  input.value = "";

  const cityInfo = await getGeo(cityName);

  if (!cityInfo.length) return;

  const weatherInfo = await getWeather(cityInfo[0]["lat"], cityInfo[0]["lon"]);

  // полученные данные по Апи заносим в переменную
  const weatherData = {
    name: weatherInfo.name,
    temp: weatherInfo.main.temp,
    humidity: weatherInfo.main.humidity,
    speed: weatherInfo.wind.speed,
    main: weatherInfo.weather[0]["main"],
  };

  // отображаем данные из переменной на экран
  renderWeatherDate(weatherData);
}

// берем данные в формате "город — широта и долгота"
async function getGeo(name) {
  const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${name}&limit=5&appid=${API_KEY}`;
  const response = await fetch(geoUrl);
  const data = await response.json();
  return data;
}

// на основе полученных данных широта
// и долгота берем информацию по погоде
async function getWeather(lat, lon) {
  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${lat}&lon=${lon}&appid=${API_KEY}`;
  const response = await fetch(weatherUrl);
  const data = await response.json();
  return data;
}

// отображаем полученные данные на страницу
function renderWeatherDate(data) {
  // удаляем класс none
  document.querySelector(".image-container").classList.remove("none");
  document.querySelector(".temperature").classList.remove("none");
  document.querySelector(".city").classList.remove("none");
  document.querySelector(".footer").classList.remove("none");

  const temp = document.querySelector(".temperature");
  const city = document.querySelector(".city");
  const humidity = document.querySelector(".text-humidity p:first-child");
  const speed = document.querySelector(".text-wind p:first-child");
  const img = document.querySelector(".image");

  // отображаем данные на странице
  temp.textContent = Math.round(data.temp) + "°c";
  city.textContent = data.name;
  humidity.textContent = data.humidity + "%";
  speed.textContent = Math.round(data.speed) + " km/h";

  // отображаем картинку исходя из погодных условий выбранного города
  const fileNames = {
    Clouds: "clouds",
    Clear: "clear",
    Rain: "rain",
    Mist: "mist",
    Drizzle: "drizzle",
    Snow: "snow",
  };

  if (fileNames[data.main]) {
    img.src = `./img/weather/${fileNames[data.main]}.png`;
  }
}
