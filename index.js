const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const result = document.getElementById("result");

searchBtn.addEventListener("click", getWeather);

async function getWeather() {
    const city = cityInput.value.trim();
    if (city === "") return;

    result.innerHTML = "Loading...";

    try {
        const geoRes = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`
        );
        const geoData = await geoRes.json();

        if (!geoData.results || geoData.results.length === 0) {
            result.innerHTML = `<p class="error">City not found</p>`;
            return;
        }

        const { latitude, longitude, name, country } = geoData.results[0];

        const weatherRes = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
        );
        const weatherData = await weatherRes.json();
        const weather = weatherData.current_weather;
        result.innerHTML = `
            <h3>${name}, ${country}</h3>
            <div class="temp">${weather.temperature}°C</div>
            <p>Wind: ${weather.windspeed} km/h</p>
            <p>${getWeatherDescription(weather.weathercode)}</p>
        `;
    } catch (error) {
        result.innerHTML = `<p class="error">Something went wrong</p>`;
        console.error(error);
    }
}

function getWeatherDescription(code) {
    const codes = {
        0: "Clear sky",
        1: "Mainly clear",
        2: "Partly cloudy",
        3: "Overcast",
        45: "Fog",
        61: "Slight rain",
        63: "Moderate rain",
        65: "Heavy rain",
        71: "Slight snow",
        80: "Rain showers",
        95: "Thunderstorm"
    };
    return codes[code] || "Weather condition unknown";
}
