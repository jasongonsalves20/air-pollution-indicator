const latInp = document.querySelector("#latitude");
const lonInp = document.querySelector("#longitude");
const airQuality = document.querySelector(".air-quality");
const airQualityStat = document.querySelector(".air-quality-status");
const srchBtn = document.querySelector(".search-btn");
const errorLabel = document.querySelector("label[for='error-msg']");
const componentsEle = document.querySelectorAll(".component-val");

const appId = "c1d2d185956c5e93de7e48f777e18c9b";
const link = "https://api.openweathermap.org/data/2.5/air_pollution";

const getUserLocation = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(onPostionGathered, onPostionGatherError);
    } else {
        onPostionGatherError({ message: "Can't access location, Enter Co-ordinates manually." });
    }
}

const onPostionGathered = pos => {
    let lat = pos.coords.latitude.toFixed(4);
    let lon = pos.coords.longitude.toFixed(4);

    latInp.value = lat;
    lonInp.value = lon;
    getAirQuality(lat, lon);
}

const getAirQuality = async (lat, lon) => {
    const rawData = await fetch(`${link}?lat=${lat}&lon=${lon}&appid=${appId}`).catch(err => {
        onPostionGatherError(err);
    });

    const airData = await rawData.json();
    
    if (rawData.status != 200) {
        onPostionGatherError({ message: airData.message });
    } else {
        setValueOfAir(airData);
        setComponentsOfAir(airData);
    }
}

const setValueOfAir = airData => {
    const aqi = airData.list[0].main.aqi;
    let airStat = "", color = "";

    airQuality.innerText = aqi;

    switch (aqi) {
        case 1:
            airStat = "Good";
			color = "rgb(19, 201, 28)";
            break;
        case 2:
            airStat = "Fair";
			color = "rgb(15, 134, 25)";
            break;
        case 3:
            airStat = "Moderate";
			color = "rgb(201, 204, 13)";
            break;
        case 4:
            airStat = "Poor";
			color = "rgb(204, 83, 13)";
            break;
        case 5:
            airStat = "Very Poor";
			color = "rgb(204, 13, 13)";
            break;
        default:
            airStat = "Unknown";
            break;
    }

    airQualityStat.innerText = airStat;
    airQualityStat.style.color = color;
}

const setComponentsOfAir = airData => {
    let components = { ...airData.list[0].components };
    componentsEle.forEach(ele => {
        const attr = ele.getAttribute("data-comp");
        ele.innerText = components[attr] += " μg/m³";
    })
}

srchBtn.addEventListener("click", () => {
    errorLabel.innerText = "";
    let lat = parseFloat(latInp.value).toFixed(4);
    let lon = parseFloat(lonInp.value).toFixed(4);
    getAirQuality(lat, lon);
})

const onPostionGatherError = e => {
    if(e.message == "User denied Geolocation") {
        errorLabel.innerText = "\n\nError : Location permission was denied.\nEither enter Co-ordinates manually or Select 'Allow' in 'Know your location?' Prompt to get Co-ordinates automatically."
    } else {
        errorLabel.innerText = e.message;
    }
}

getUserLocation();