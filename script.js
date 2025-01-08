class CityNotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = "CityNotFoundError";
    }
}

class WeatherDataError extends Error {
    constructor(message) {
        super(message);
        this.name = "WeatherDataError";
    }
}

window.onload = () => {
    const cityInput = document.getElementById('city-input');
    const citySubmit = document.getElementById('city-submit');
    const weatherInfo = document.getElementById('weather-info');
    const errorMessage = document.createElement('p');
    errorMessage.style.color = 'red';
    errorMessage.style.marginTop = '10px';
    errorMessage.style.display = 'none';
    cityInput.parentElement.appendChild(errorMessage);

    const translations = {
        en: {
            enterCity: 'Please enter a city name.',
            invalidCity: 'Enter a city name containing only letters',
            loading: 'Loading...',
            showWeather: 'Show weather',
            weatherNotFound: 'Failed to get weather data :( Shall we try again?',
            cityNotFound: 'Such a city has not yet been invented :(',
        },
        es: {
            enterCity: 'Por favor, ingrese el nombre de una ciudad.',
            invalidCity: 'Ingrese un nombre de ciudad que contenga solo letras',
            loading: 'Cargando...',
            showWeather: 'Mostrar el clima',
            weatherNotFound: 'No se pudo obtener los datos meteorológicos :( ¿Intentamos nuevamente?',
            cityNotFound: 'Todavía no se ha inventado tal ciudad :(',
        },
        ru: {
            enterCity: 'Пожалуйста, введите название города.',
            invalidCity: 'Введите название города, содержащее только буквы',
            loading: 'Загрузка...',
            showWeather: 'Показать погоду',
            weatherNotFound: 'Не удалось получить данные о погоде :( Попробуем еще раз?',
            cityNotFound: 'Такой город еще не изобрели :(',
        },
    };

    const currentLang = 'en'; // Установите язык (en, es, ru, вообще я могу прописать еще что-то если надо будет)

    const savedCity = localStorage.getItem('city');
    if (typeof savedCity === 'string' && savedCity.trim() !== '') {
        fetchWeather(savedCity);
    }

    citySubmit.addEventListener('click', () => {
        const city = cityInput.value.trim();
        errorMessage.style.display = 'none';

        if (!city) {
            errorMessage.textContent = translations[currentLang].enterCity;
            errorMessage.style.display = 'block';
            return;
        }
        if (!/^[a-zA-Z\s-]+$/.test(city)) {
            alert(translations[currentLang].invalidCity);
            return;
        }

        localStorage.setItem('city', city);
        citySubmit.textContent = translations[currentLang].loading;

        fetchWeather(city)
            .then(() => {
                citySubmit.textContent = translations[currentLang].showWeather;
                citySubmit.disabled = false;
            })
            .catch(() => {
                alert(translations[currentLang].weatherNotFound);
                citySubmit.textContent = translations[currentLang].showWeather;
                citySubmit.disabled = false;
            });
    });
};

async function fetchWeather(city) {
    let cityData;
    try {
        cityData = await fetchCityData(city);
    } catch (error) {
        console.error('Error fetching city data:', error.message);
        alert(translations[currentLang].cityNotFound);
        return;
    }

    let weatherData;
    try {
        weatherData = await fetchWeatherData(cityData);
    } catch (error) {
        console.error('Error fetching weather data:', error.message);
        alert(translations[currentLang].weatherNotFound);
        return;
    }

    displayWeather(weatherData);
}

async function fetchCityData(city) {
    const cityApiUrl = `https://api.api-ninjas.com/v1/city?name=${city}`;
    const cityResponse = await fetch(cityApiUrl, {
        headers: { 'X-Api-Key': '9aIAxYHHQOQnmq4dOkuXOA==wfQa96nJcyX8b14o' }
    });

    if (!cityResponse.ok) {
        throw new CityNotFoundError(`Error finding city: ${cityResponse.status} ${cityResponse.statusText}`);
    }

    const cityData = await cityResponse.json();
    if (!cityData || cityData.length === 0) {
        throw new CityNotFoundError('City not found');
    }

    return cityData;
}

async function fetchWeatherData(cityData) {
    const { latitude, longitude } = cityData[0];
    const weatherApiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
    const weatherResponse = await fetch(weatherApiUrl);

    if (!weatherResponse.ok) {
        throw new WeatherDataError(`Error when searching for weather: ${weatherResponse.status} ${weatherResponse.statusText}`);
    }

    const weatherData = await weatherResponse.json();
    return weatherData;
}

function updateWeatherStyle(code) {
    const body = document.body;
    const appContainer = document.querySelector('.weather-app');
    const appImage = document.querySelector('.weather-app__image');
    const button = document.getElementById('city-submit');
    const input = document.getElementById('city-input');

    let backgroundImage, appBackground, appImageBackground, buttonColor, inputBackground, inputBorderColor, color;

    if ([0, 1].includes(code)){
        backgroundImage = 'url("./image/jeito.jpg")';
        appBackground = 'linear-gradient(135deg, #FFFACD, #FFE4B5)';
        appImage.style.cssText = `background-image: url("./image/sun.png"); width: 100px; height: 100px;`;
        buttonColor = '#fffacd';
        inputBackground = '#ffffff';
        inputBorderColor = '#5c582b';
        color = '#BDB76B';
    } else if ([2, 3].includes(code)) {
        backgroundImage = 'url("./image/sinii.jpg")';
        appBackground = 'linear-gradient(135deg, #778899, #F0F8FF)';
        appImage.style.cssText = `background-image: url("./image/cloudy.png"); width: 100px; height: 80px;`
        buttonColor = '#7297af';
        inputBackground = '#ffffff';
        inputBorderColor = '#04273e';
        color = '#04273e';
    } else if ([51, 53, 55, 61, 63, 65, 81, 82, 85].includes(code)) {
        backgroundImage = 'url("./image/rainfon.jpg")';
        appBackground = 'linear-gradient(135deg, #808080, #ADD8E6)';
        appImage.style.cssText = `background-image: url("./image/rain.png"); width: 100px; height: 100px;`
        buttonColor = '#9cbbd6';
        inputBackground = '#ffffff';
        inputBorderColor = '#b5ccdf';
        color = '#04273e';
    } else if ([71, 73, 75, 77, 85, 86].includes(code)) {
        backgroundImage = 'url("./image/snowfon.jpg")';
        appBackground = 'linear-gradient(135deg, #778899, #F5F5F5)';
        appImage.style.cssText = `background-image: url("./image/snow.png"); width: 100px; height: 100px;`
        buttonColor = 'rgba(191,191,191,0.88)';
        inputBackground = '#ffffff';
        inputBorderColor = '#b5ccdf';
        color = '#ffffff';
    } else if ([95, 96, 99].includes(code)) {
        backgroundImage = 'url("./image/stormfon.jpg")';
        appBackground = 'linear-gradient(135deg, #C0C0C0, #FFE4C4)';
        appImage.style.cssText = `background-image: url("./image/storm.png"); width: 100px; height: 100px;`
        buttonColor = 'rgba(191,191,191,0.88)';
        inputBackground = '#ffffff';
        inputBorderColor = '#292928';
        color = '#292928';
    }

    body.style.transition = 'background 2s ease';
    body.style.backgroundImage = backgroundImage;
    body.style.backgroundSize = 'cover';
    body.style.backgroundRepeat = 'no-repeat';
    body.style.backgroundPosition = 'center';

    appContainer.style.transition = 'background 1.5s ease, color 1.5s ease';
    appContainer.style.background = appBackground;
    appContainer.style.color = color;

    appImage.style.transition = 'background 1.5s ease';
    appImage.style.backgroundImage = appImageBackground;

    button.style.transition = 'background 1.5s ease, color 1.5s ease';
    button.style.background = buttonColor;
    button.style.color = color;

    input.style.transition = 'background 1.5s ease, border-color 1.5s ease, color 1.5s ease';
    input.style.background = inputBackground;
    input.style.borderColor = inputBorderColor;
    input.style.color = color;
}

function displayWeather(data) {
    const { temperature, weathercode } = data.current_weather;
    const weatherInfo = document.getElementById('weather-info');
    weatherInfo.innerHTML = `
        <h2>Weather according to your request:</h2>
        <p>Temperature: ${temperature}°C</p>
        <p>Precipitation: ${getWeatherDescription(weathercode)}</p>
    `;
    updateWeatherStyle(weathercode);
}

function getWeatherDescription(code) {
    const descriptions = {
        0: 'Clear skies',
        1: 'Mostly clear',
        2: 'Partly cloudy',
        3: 'Cloudy',
        51: 'Drizzle (light)',
        53: 'Drizzle (moderate)',
        55: 'Drizzle (thick)',
        61: 'Rain (light)',
        63: 'Rain (moderate)',
        65: 'Rain (heavy)',
        71: 'Snowfall (light)',
        73: 'Snowfall (moderate)',
        75: 'Snowfall (heavy)',
        77: 'Snow Grains',
        80: 'Rain (light)',
        81: 'Rainfall (moderate)',
        82: 'Rain: heavy',
        85: 'Intermittent snowfall (light)',
        86: 'Intermittent snowfall (heavy)',
        95: 'Thunderstorm',
        96: 'Thunderstorm with hail (weak)',
        99: 'Hail Thunderstorm (Severe)'
    };

    return descriptions[code] || 'Unknown weather';
}
