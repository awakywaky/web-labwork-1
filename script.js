const cityInput = document.getElementById('city-input');
const citySubmit = document.getElementById('city-submit');
const weatherInfo = document.getElementById('weather-info');

window.onload = () => {
    const savedCity = localStorage.getItem('city');
    if (savedCity) {
        fetchWeather(savedCity);
    }
};

citySubmit.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (!city) {
        alert('Enter city name');
        return;
    }
    if (!/^[a-zA-Z\s-]+$/.test(city)) {
        alert('Enter a city name containing only letters');
        return;
    }
    localStorage.setItem('city', city);
    citySubmit.textContent = 'Loading...';

    fetchWeather(city)
        .then(() => {
            citySubmit.textContent = 'Show weather';
            citySubmit.disabled = false;
        })
        .catch(() => {
            alert('Failed to get weather data :( Shall we try again?');
            citySubmit.textContent = 'Show weather';
            citySubmit.disabled = false;
        });
});

async function fetchWeather(city) {
    try {
        const cityApiUrl = `https://api.api-ninjas.com/v1/city?name=${city}`;
        const cityResponse = await fetch(cityApiUrl, {
            headers: { 'X-Api-Key': '9aIAxYHHQOQnmq4dOkuXOA==wfQa96nJcyX8b14o' }
        });

        if (!cityResponse.ok) {
            throw new Error(`Error finding city: ${cityResponse.status} ${cityResponse.statusText}`);
        }

        const cityData = await cityResponse.json();
        if (!cityData || cityData.length === 0) {
            alert('Such a city has not yet been invented :(');
            return;
        }

        const { latitude, longitude } = cityData[0];
        const weatherApiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
        const weatherResponse = await fetch(weatherApiUrl);

        if (!weatherResponse.ok) {
            throw new Error(`Error when searching for weather: ${weatherResponse.status} ${weatherResponse.statusText}`);
        }

        const weatherData = await weatherResponse.json();
        displayWeather(weatherData);
    } catch (error) {
        console.error('Error:', error.message);
        alert('Weather not found :( Shall we try again?');
    }
}

function updateWeatherStyle(code) {
    const body = document.body;
    const appContainer = document.querySelector('.weather-app');
    const appImage = document.querySelector('.weather-app__image');
    const button = citySubmit;
    const input = cityInput;

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
