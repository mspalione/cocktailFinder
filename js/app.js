//const fetch = require("node-fetch");

const { createSecureServer } = require("http2")

//const { select } = require("async")

const host =  'covid-193.p.rapidapi.com' 
const statisticsUrl = `https://${host}/statistics`
const countriesUrl = `https://${host}/countries`
const countries = document.getElementById('countries')
const card = document.getElementsByClassName('card')
const apiheaders = { headers: {
    'x-rapidapi-host': host,
    'x-rapidapi-key': '',
    'useQueryString': true
}}

let countryList = (data) => {
    let options = data.response.map(item => `
        <option value='${item}'>${item}</option>
    `).join('')
    countries.innerHTML = options
    //console.log(data)
}

let countryStats = () => {
    const country = countries.value 
    //const p = card.querySelector('p')
    
    getJson(`${statisticsUrl}?country=${country}`, apiheaders)
        .then(data => console.log(data.response[0]))
}

let getJson = (url, headers) => fetch(url, headers)
    .then(res => res.json())

let getCountries = getJson(countriesUrl, apiheaders) 
                    .then(data => countryList(data))

let getStats = getJson(statisticsUrl, apiheaders)
                .then(data => countryStats(data))                    

getCountries              

class country {
    constructor(
        continent,
        country,
        day,
        deaths,
        population,
        tests, 
        time
        ) {
        this.continent = continent
        this.country = country
        this.day = day
        this.deaths = deaths
        this.population = population
        this.tests = tests
        this.time = time
    }
}