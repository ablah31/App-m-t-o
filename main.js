
const loader = document.querySelector(".loader")

if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(location => {
      const long = location.coords.longitude;
      const lat = location.coords.latitude;
      getWeatherData(long, lat)
    }, () => {
      loader.textContent = "Vous avez refusé la géolocalisation, l'application ne peut pas fonctionner, veuillez l'activer."
    })
  }

async function getWeatherData(long, lat) {
    try {

        const results = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=minutely&metric&lang=fr&appid=c0be91fb574ac023c997a9f6035aaa3c`)
       if(!results.ok) {
        throw new Error(`Erreur: ${results.status}`)
       }

       const data = await results.json()
       console.log(data);
       populateMainInfo(data)
       handleHours(data.hourly)
       handleDays(data.daily)


       loader.classList.add("fade-out")
    }
    catch(e) {
    loader.textContent = e;
    }
}

const position = document.querySelector(".position")
const temperature = document.querySelector(".temperature")
const weatherImage = document.querySelector(".weather-logo")

const currentHour = new Date().getHours()

function populateMainInfo(data){
  temperature.textContent = `${Math.trunc(data.current.temp)}°`
  position.textContent = data.timezone;

  if(currentHour >= 6 && currentHour < 21) {
    weatherImage.src = `ressources/jour/${data.current.weather[0].icon}.svg`
  } else {
    weatherImage.src = `ressources/nuit/${data.current.weather[0].icon}.svg`
  }
}

const hourNameBlocks = document.querySelectorAll(".hour-name")
const hourTemperatures = document.querySelectorAll(".hour-temp")

function handleHours(data){

  hourNameBlocks.forEach((block, index) => {
    const incrementedHour = currentHour + index * 3;

    if(incrementedHour > 24) {
      const calcul = incrementedHour -24;
      hourNameBlocks[index].textContent = `${calcul === 24 ? "00" : calcul}h`
    }
    else if(incrementedHour === 24) {
      hourNameBlocks[index].textContent = "00h"

    }
    else {
      hourNameBlocks[index].textContent = `${incrementedHour}h`
    }
//Bloc de températures
    hourTemperatures[index].textContent = `${Math.trunc(data[index * 3].temp)}°`
  })
}

const weekDays = [
  "lundi",
  "mardi",
  "mercredi",
  "jeudi",
  "vendredi",
  "samedi",
  "dimanche"
] 

const currentDay = new Date().toLocaleDateString("fr-FR",
{weekday: "long"})

const orderedDays = weekDays.slice(weekDays.indexOf(currentDay) + 1).concat
(weekDays.slice(0, weekDays.indexOf(currentDay) + 1))

const daysName = document.querySelectorAll(".day-name")
const perDayTemperature = document.querySelectorAll(".day-temp")

function handleDays(data) {
  orderedDays.forEach((day, index) =>{
    daysName[index].textContent = orderedDays[index].charAt(0).toLocaleUpperCase
    () + orderedDays[index].slice(1, 3)

    perDayTemperature[index].textContent = `${Math.trunc(data[index + 1].
      temp.day)}°`
  })
}

const tabsBtns = [...document.querySelectorAll(".tabs button")]
const tabsContents = [...document.querySelectorAll(".forecast")]

tabsBtns.forEach(btn => btn.addEventListener("click", handleTabs))

function handleTabs(e) {
  const indexToRemove = tabsBtns.findIndex(tab => tab.classList.contains
    ("active"))

    tabsBtns[indexToRemove].classList.remove("active")
    tabsContents[indexToRemove].classList.remove("active")

    const indexToShow = tabsBtns.indexOf(e.target)

    tabsBtns[indexToShow].classList.add("active")
    tabsContents[indexToShow].classList.add("active")
}