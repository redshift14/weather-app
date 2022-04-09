import {UNSPLASH_API_KEY as appImageId, WEATHER_API_KEY as appId} from './keys.js'

const app = document.getElementById('app')
const loader = document.querySelector('.loader')

const unixToTime = (unixTime) => {
    let date = new Date(unixTime * 1000)
    return `${date.getHours()}:${date.getMinutes()}`
}

const setToday = () => {
    let date = new Date()
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-UK', options)
}

const setHtmlBody = (data) => {
    let html = `
    <section class="left-col">
        <h1>${Math.round(data.main.temp)}°</h1>
        <div class="city-and-date">
            <h2>${data.name}</h2>
            <p>${setToday()}</p>
        </div>
        <div class="weather-container">
            <img src="http://openweathermap.org/img/w/${data.weather[0].icon}.png" alt="icon" id="icon">
            <p id="weather">${data.weather[0].main}</p>
        </div>
    </section>
    <section class="right-col">
        <h3>Temperature Details</h3>
        <div class="details">
            <p>Feels Like</p>
            <p id="feels like">${Math.round(data.main.feels_like)}°</p>
            <p>Clouds</p>
            <p id="cloud-percent">${data.clouds.all} %</p>
        </div>
        <hr>
        <h3>Weather Details</h3>
        <div class="details">
            <p>Humidity</p>
            <p id="humidity">${data.main.humidity} %</p>
            <p>Wind</p>
            <p id="wind">${data.wind.speed} m/s</p>
            <p>Visibility</p>
            <p id="visibility">${data.visibility} m</p>
            <p>Pressure</p>
            <p id="pressure">${data.main.pressure} hPa</p>
        </div>
        <hr>
        <h3>Sunrise & Sunset</h3>
        <div class="details">
            <p>Sunrise</p>
            <p id="sunrise">${unixToTime(data.sys.sunrise)}</p>
            <p>Sunset</p>
            <p id="sunset">${unixToTime(data.sys.sunset)}</p>
        </div>
        <hr>
        <h3>Search New Location</h3>
        <div class="input">
            <input type="text" id="city-to-search" placeholder="Type a New Location">
            <button id="search-city-btn"><img src="./icons/search-white.svg"/></button>
        </div>
        <p id="error-msg"></p>
    </section>
    `;
    
    app.innerHTML = html;
}

const searchOtherCity = () => {
    const cityInput = document.getElementById('city-to-search')
    const errorMsg = document.getElementById('error-msg')
    const geocodeApi = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput.value}&appid=${appId}&units=metric`
    fetch(geocodeApi).then(response => {
        if(!response.ok) {
            errorMsg.innerText = 'Location Not Found'
            cityInput.classList.add('error')
            setTimeout(() => {
                errorMsg.innerText = ''
                cityInput.classList.remove('error')
            }, 2000);
            throw new Error('Not Found')             
        }
        else {
            loader.classList.remove('hidden')
            app.innerHTML = ''
            return response.json()
        }
    })
    .then(data => {
        const api = `https://api.unsplash.com/search/photos?page=1&per_page=30&query=${data.name.replace(/\s/g, '&')}&client_id=${appImageId}`
        fetch(api)
            .then(response => {
                return response.json()
            })
            .then(imageData => {
                if (imageData) {
                    let imageIndex = Math.floor(Math.random() * imageData.results.length - 1)
                    let imageSrc = imageData.results[imageIndex].urls.regular
                    document.body.style.backgroundImage = `url(${imageSrc})`
                }
                setHtmlBody(data)
                document.getElementById('search-city-btn').addEventListener('click', searchOtherCity)
                loader.classList.add('hidden')
            })
        setHtmlBody(data)
        loader.classList.add('hidden')
    })
    .catch((error) => {
        console.log(error)
    })
}

window.addEventListener('load' , () => {
    let long;
    let lat;
    console.log(navigator.geolocation)
    navigator.geolocation.getCurrentPosition(position => {
        long = position.coords.longitude;
        lat = position.coords.latitude;
        const api = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${appId}&units=metric`;
        fetch(api).then(response => {
            if (response.ok) { 
                return response.json();
            }
            throw new Error('Error')
        }).then(data => {
            const api = `https://api.unsplash.com/search/photos?page=1&per_page=30&query=${data.name.replace(/\s/g, '&')}&w=${window.innerWidth}&h=${window.innerHeight}&client_id=${appImageId}`
            fetch(api)
                .then(response => {
                    return response.json()
                })
                .then(imageData => {
                    if (imageData.results.length > 0) {                         
                        let imageIndex = Math.floor(Math.random() * imageData.results.length - 1)
                        let imageSrc = imageData.results[imageIndex].urls.regular
                        document.body.style.backgroundImage = `url(${imageSrc})`
                        
                    }
                    setHtmlBody(data)
                    document.getElementById('search-city-btn').addEventListener('click', searchOtherCity)
                    loader.classList.add('hidden')
                })
        }).catch((err) => {
            console.log(err.message)
        })
    }, () => {
        loader.classList.add('hidden')
        app.innerHTML = `
        <section class="left-col">
            <h1>Temp</h1>
            <div class="city-and-date">
                <h2>city</h2>
                <p>date</p>
            </div>
            <div class="weather-container">
                <img id="icon">
                <p id="weather">weather</p>
            </div>
        </section>
        <section class="right-col">
            <h3>Temperature Details</h3>
            <div class="details">
                <p>Feels Like</p>
                <p id="feels like"></p>
                <p>Clouds</p>
                <p id="cloud-percent"> %</p>
            </div>
            <hr>
            <h3>Weather Details</h3>
            <div class="details">
                <p>Humidity</p>
                <p id="humidity">%</p>
                <p>Wind</p>
                <p id="wind">m/s</p>
                <p>Visibility</p>
                <p id="visibility"> m</p>
                <p>Pressure</p>
                <p id="pressure"> hPa</p>
            </div>
            <hr>
            <h3>Sunrise & Sunset</h3>
            <div class="details">
                <p>Sunrise</p>
                <p id="sunrise"></p>
                <p>Sunset</p>
                <p id="sunset"></p>
            </div>
            <hr>
            <h3>Search New Location</h3>
            <div class="input">
                <input type="text" id="city-to-search" placeholder="Type a New Location">
                <button id="search-city-btn"><img src="./icons/search-white.svg"/></button>
            </div>
            <p id="error-msg"></p>
        </section>
        `
        document.getElementById('search-city-btn').addEventListener('click', searchOtherCity)
    });
})