const API_BASE_URL = 'https://api.api-ninjas.com/v1';

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

const WEATHER_CODES = {
    CLEAR: [0, 1],
    CLOUDY: [2, 3],
    RAINY: [51, 53, 55, 61, 63, 65, 81, 82, 85],
    SNOWY: [71, 73, 75, 77, 85, 86],
    STORMY: [95, 96, 99],
};

const WEATHER_DESCRIPTIONS = {
    CLEAR: 'Clear skies',
    CLOUDY: 'Cloudy',
    RAINY: 'Rainy',
    SNOWY: 'Snowy',
    STORMY: 'Stormy',
};

const WEATHER_STYLES = {
    CLEAR: {
        backgroundImage: 'url("./image/jeito.jpg")',
        appBackground: 'linear-gradient(135deg, #FFFACD, #FFE4B5)',
        appImageBackground: 'url("./image/sun.png")',
        buttonColor: '#fffacd',
        inputBackground: '#ffffff',
        inputBorderColor: '#5c582b',
        color: '#BDB76B',
    },
    CLOUDY: {
        backgroundImage: 'url("./image/sinii.jpg")',
        appBackground: 'linear-gradient(135deg, #778899, #F0F8FF)',
        appImageBackground: 'url("./image/cloudy.png")',
        buttonColor: '#7297af',
        inputBackground: '#ffffff',
        inputBorderColor: '#04273e',
        color: '#04273e',
    },
    RAINY: {
        backgroundImage: 'url("./image/rainfon.jpg")',
        appBackground: 'linear-gradient(135deg, #808080, #ADD8E6)',
        appImageBackground: 'url("./image/rain.png")',
        buttonColor: '#9cbbd6',
        inputBackground: '#ffffff',
        inputBorderColor: '#b5ccdf',
        color: '#04273e',
    },
    SNOWY: {
        backgroundImage: 'url("./image/snowfon.jpg")',
        appBackground: 'linear-gradient(135deg, #778899, #F5F5F5)',
        appImageBackground: 'url("./image/snow.png")',
        buttonColor: 'rgba(191,191,191,0.88)',
        inputBackground: '#ffffff',
        inputBorderColor: '#b5ccdf',
        color: '#ffffff',
    },
    STORMY: {
        backgroundImage: 'url("./image/stormfon.jpg")',
        appBackground: 'linear-gradient(135deg, #C0C0C0, #FFE4C4)',
        appImageBackground: 'url("./image/storm.png")',
        buttonColor: 'rgba(191,191,191,0.88)',
        inputBackground: '#ffffff',
        inputBorderColor: '#292928',
        color: '#292928',
    },
};

function mapWeatherCodeToEnum(code) {
    for (const [key, codes] of Object.entries(WEATHER_CODES)) {
        if (codes.includes(code)) {
            return key;
        }
    }
    return null;
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
    };

    const currentLang = 'en';

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
        alert('City not found');
        return;
    }

    let weatherData;
    try {
        weatherData = await fetchWeatherData(cityData);
    } catch (error) {
        console.error('Error fetching weather data:', error.message);
        alert('Weather data not found');
        return;
    }

    displayWeather(weatherData);
}

async function fetchCityData(city) {
    const cityApiUrl = `${API_BASE_URL}/city?name=${city}`;
    const cityResponse = await fetch(cityApiUrl, {
        headers: { 'X-Api-Key': '9aIAxYHHQOQnmq4dOkuXOA==wfQa96nJcyX8b14o' },
    });

    if (!cityResponse.ok) {
        throw new CityNotFoundError('City not found');
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
        throw new WeatherDataError('Weather data not found');
    }

    const weatherData = await weatherResponse.json();
    return weatherData;
}

function updateWeatherStyle(code) {
    const weatherType = mapWeatherCodeToEnum(code);
    const styles = WEATHER_STYLES[weatherType] || {};

    const body = document.body;
    const appContainer = document.querySelector('.weather-app');
    const appImage = document.querySelector('.weather-app__image');
    const button = document.getElementById('city-submit');
    const input = document.getElementById('city-input');

    body.style.transition = 'background 2s ease';
    body.style.backgroundImage = styles.backgroundImage || '';
    body.style.backgroundSize = 'cover';
    body.style.backgroundRepeat = 'no-repeat';
    body.style.backgroundPosition = 'center';

    appContainer.style.transition = 'background 1.5s ease, color 1.5s ease';
    appContainer.style.background = styles.appBackground || '';
    appContainer.style.color = styles.color || '';

    appImage.style.transition = 'background 1.5s ease';
    appImage.style.backgroundImage = styles.appImageBackground || '';

    button.style.transition = 'background 1.5s ease, color 1.5s ease';
    button.style.background = styles.buttonColor || '';
    button.style.color = styles.color || '';

    input.style.transition = 'background 1.5s ease, border-color 1.5s ease, color 1.5s ease';
    input.style.background = styles.inputBackground || '';
    input.style.borderColor = styles.inputBorderColor || '';
    input.style.color = styles.color || '';
}

function displayWeather(data) {
    const { temperature, weathercode } = data.current_weather;
    const weatherType = mapWeatherCodeToEnum(weathercode);
    const description = WEATHER_DESCRIPTIONS[weatherType] || 'Unknown weather';

    const weatherInfo = document.getElementById('weather-info');
    weatherInfo.innerHTML = `
        <h2>Weather according to your request:</h2>
        <p>Temperature: ${temperature}°C</p>
        <p>Precipitation: ${description}</p>
    `;

    updateWeatherStyle(weathercode);
}
