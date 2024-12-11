const apiKey = "9470f162a34d93086760b16d1426a9ed";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&";

// DOM elements
const searchBox = document.querySelector(".search input");
const searchButton = document.querySelector(".search button");

// Function to convert UTC time to local time
function convertToLocalTime(utcTime, timezoneOffset) {
    const localDate = new Date((utcTime + timezoneOffset) * 1000);
    const hours = localDate.getHours();
    const minutes = localDate.getMinutes();
    const seconds = localDate.getSeconds();
    return `${hours}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
}

// Function to update the local time
function updateLocalTime() {
    const localTimeElement = document.querySelector(".local-time");
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    localTimeElement.innerHTML = `${hours}:${minutes}:${seconds}`;
}

// Update local time every second
setInterval(updateLocalTime, 1000);

// Function to get weather by city name
async function getWeatherByCity(city) {
    const response = await fetch(`${apiUrl}q=${city}&appid=${apiKey}`);

    if (response.status === 404) {
        let img = document.querySelector("#icon");
        img.style.width = "30rem";
        document.querySelector(".detail").style.display = "none";
        document.querySelector(".temp2").style.display = "none";

        img.src = 'images/404.png';
        document.querySelector(".temp").innerHTML = "Error! 404";
        document.querySelector(".name").innerHTML = "City Not Found";
        document.getElementById("temp").style.fontSize = "3rem";

        return;
    } else {
        const data = await response.json();

        document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°c";
        document.querySelector(".name").innerHTML = `${data.name}, ${data.sys.country}`;
        document.querySelector(".mintemp").innerHTML = Math.round(data.main.temp_min) + "°c";
        document.querySelector(".maxtemp").innerHTML = Math.round(data.main.temp_max) + "°c";
        document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
        document.querySelector(".wind").innerHTML = Math.round(data.wind.speed) + " km/h";

        // Convert UTC time to local time
        const localTime = convertToLocalTime(data.dt, data.timezone);
        document.querySelector(".local-time").innerHTML = `Local Time: ${localTime}`;

        let img = document.querySelector("#icon");
        switch (data.weather[0].main) {
            case 'Clear':
                img.src = 'images/clear.png';
                break;
            case 'Rain':
                img.src = 'images/rain.png';
                break;
            case 'Snow':
                img.src = 'images/snow.png';
                break;
            case 'Clouds':
                img.src = 'images/cloud.png';
                break;
            case 'Mist':
                img.src = 'images/mist.png';
                break;
            case 'Haze':
                img.src = 'images/mist.png';
                break;
            default:
                img.src = 'images/cloud.png';
                break;
        }

        document.querySelector(".detail").style.display = "flex";
        document.querySelector(".temp2").style.display = "flex";
        document.getElementById("temp").style.fontSize = "5.2rem";
        img.style.width = "16rem";
    }
}

// Function to get weather by geolocation
async function getWeatherByLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async function(position) {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            const response = await fetch(`${apiUrl}lat=${lat}&lon=${lon}&appid=${apiKey}`);

            if (response.status === 404) {
                alert("Location not found!");
                return;
            } else {
                const data = await response.json();

                document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°c";
                document.querySelector(".name").innerHTML = `${data.name}, ${data.sys.country}`;
                document.querySelector(".mintemp").innerHTML = Math.round(data.main.temp_min) + "°c";
                document.querySelector(".maxtemp").innerHTML = Math.round(data.main.temp_max) + "°c";
                document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
                document.querySelector(".wind").innerHTML = Math.round(data.wind.speed) + " km/h";

                // Convert UTC time to local time
                const localTime = convertToLocalTime(data.dt, data.timezone);
                document.querySelector(".local-time").innerHTML = `Local Time: ${localTime}`;

                let img = document.querySelector("#icon");
                switch (data.weather[0].main) {
                    case 'Clear':
                        img.src = 'images/clear.png';
                        break;
                    case 'Rain':
                        img.src = 'images/rain.png';
                        break;
                    case 'Snow':
                        img.src = 'images/snow.png';
                        break;
                    case 'Clouds':
                        img.src = 'images/cloud.png';
                        break;
                    case 'Mist':
                        img.src = 'images/mist.png';
                        break;
                    case 'Haze':
                        img.src = 'images/mist.png';
                        break;
                    default:
                        img.src = 'images/cloud.png';
                        break;
                }

                document.querySelector(".detail").style.display = "flex";
                document.querySelector(".temp2").style.display = "flex";
                document.getElementById("temp").style.fontSize = "5.2rem";
                img.style.width = "16rem";
            }
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

// Event listener for the search button (city search)
searchButton.addEventListener("click", function () {
    const city = searchBox.value.trim();
    if (city) {
        getWeatherByCity(city);
    } else {
        getWeatherByLocation();
    }
});

// Get weather based on geolocation when the page loads
getWeatherByLocation();

// Update the weather periodically based on geolocation
setInterval(() => {
    getWeatherByLocation();
}, 600000);  // 10 minutes
