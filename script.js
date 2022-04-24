const latInp = document.querySelector("#latitude");
const lonInp = document.querySelector("#longitude");
const airQuality = document.querySelector(".air-quality");
const airQualityStat = document.querySelector(".air-quality-status");
const srchBtn = document.querySelector(".search-btn");
const spchBtn = document.querySelector(".speech-btn");
const errorLabel = document.querySelector("label[for='error-msg']");
const componentsEle = document.querySelectorAll(".component-val");

const appId = "c1d2d185956c5e93de7e48f777e18c9b";
const link = "https://api.openweathermap.org/data/2.5/air_pollution";
const key = "9a56d1219ae24157a4d7151ea0ea7862";
const loct = "centralindia";

const getUserLocation = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(onPostionGathered, onPostionGatherError);
    } else {
        onPostionGatherError({ message: "\n\nError : Can't access location, Enter Co-ordinates manually." });
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
        onPostionGatherError({ message: `\n\nError : ${airData.message}` });
    } else {
        setValueOfAir(airData);
        setComponentsOfAir(airData);
        spchBtn.disabled = false;
        spchBtn.style.backgroundColor = "#269fe6";
    }
}

const getAudio = async () => {
    let text;
    aqi = parseInt(airQuality.innerText);
    airStat = airQualityStat.innerText;
    text = `Based on the identified co-ordinates, The Air Quality Index value found is ${aqi}, which states that the air quality in your area is ${airStat}, Refer below for more information.`;

    const SpeechSDK = window.SpeechSDK;
    const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(key, loct);
    speechConfig.speechSynthesisLanguage = "en-IN";
    speechConfig.speechSynthesisVoiceName = "en-IN-NeerjaNeural";
    speechConfig.speechSynthesisOutputFormat = SpeechSDK.SpeechSynthesisOutputFormat.Audio16Khz32KBitRateMonoMp3;
    const audioConfig = SpeechSDK.AudioConfig.fromDefaultSpeakerOutput();

    const synthesizer = new SpeechSDK.SpeechSynthesizer(speechConfig, audioConfig);
    synthesizer.speakTextAsync(
        text,
        result => {
            synthesizer.close();
            spchBtn.innerText = "Read Out Again";
        },
        error => {
            synthesizer.close();
            spchBtn.innerText = "Try Again";
        });
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
    spchBtn.disabled = true;
    spchBtn.innerText = "Read Out Loud";
    spchBtn.style.backgroundColor = "#808080";
    let lat = parseFloat(latInp.value).toFixed(4);
    let lon = parseFloat(lonInp.value).toFixed(4);
    getAirQuality(lat, lon);
})

spchBtn.addEventListener("click", () => {
    spchBtn.innerText = "Loading...";
    getAudio();
})

const onPostionGatherError = e => {
    if(e.message == "User denied Geolocation") {
        errorLabel.innerText = "\n\nError : Location permission was denied.\nEither enter Co-ordinates manually or Select 'Allow' in 'Know your location?' Prompt to get Co-ordinates automatically."
    } else {
        errorLabel.innerText = e.message;
    }
}

getUserLocation();