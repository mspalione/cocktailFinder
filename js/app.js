//input required api key for code to work. See Readme for instructions on obtaining api key.

const host =  'covid-193.p.rapidapi.com' 
const statisticsUrl = `https://${host}/statistics`
const countriesUrl = `https://${host}/countries`
const apiheaders = { headers: {
    'x-rapidapi-host': host,
    'x-rapidapi-key': 'f1a6ae16ccmsh20449871d55de20p1ff8e7jsnd50eab233b5a', //input your api key
    'useQueryString': true
}}
const countries = document.getElementById('countries')
const card = document.querySelector('.card')
const error = document.getElementById('error')
const dropDown = document.getElementById('dropDown')



let countryStats = () => {
    const selectedCountry = countries.value 
    
    getJson(`${statisticsUrl}?country=${selectedCountry}`, apiheaders)
        .then(data => {
            const countryData = data.response[0]

            let country = {
                continent: countryData.continent,
                country: countryData.country,
                day: countryData.day,
                deaths: countryData.deaths.total,
                population: countryData.population,
                tests: countryData.tests.total,
                newCases: countryData.cases.new,
                activeCases: countryData.cases.active,
                criticalCases: countryData.cases.critical,
                recoveredCases: countryData.cases.recovered,
                totalCases: countryData.cases.total
            }

            let html = `
                <div>
                    <h1>Covid Case Statistics for the country of ${country.country} in the continent of ${country.continent}</h1>
                    <h3>Population: ${country.population === null ? 'unknown' : country.population}</h3>
                    <h3>Statistics as of ${country.day === null ? 'unknown' : country.day}</h3>
                    <h3>Total Tests Given: ${country.tests === null ? 'unknown' : country.tests}</h3>
                    <h3>Total Positive Cases: ${country.totalCases === null ? 'unknown' : country.totalCases}</h3>
                    <h3>Total Deaths: ${country.deaths === null ? 'unknown' : country.deaths}</h3>
                    <h3>Total Recovered Cases: ${country.recoveredCases === null ? 'unknown' : country.recoveredCases}</h3>
                    <h3>New Cases: ${country.newCases === null ? 'unknown' : country.newCases}</h3>
                    <h3>Current Active Cases: ${country.activeCases === null ? 'unknown' : country.activeCases}</h3>
                    <h3>Current Critical Cases: ${country.criticalCases === null ? 'unknown' : country.criticalCases}</h3>
                </div>
                <div>
                    <h2></h2>
                    <p></p>
                </div>
            `

            card.innerHTML = html
        })
}


let countryList = (data) => {
    let options = data.response.map(item => `
        <option value='${item}'>${item}</option>
    `).join('')
    countries.innerHTML = options
    countryStats()
}

//alerts end user to server error
let statusCheck = (response) => {
    if(response.ok) return Promise.resolve(response)
    else {
        dropDown.remove()
        error.innerHTML = `We're sorry, there was an error processing this request. Please verify your api key, refresh the page and try again.`
        console.log(response.statusText)
    }
} 

let getJson = (url, headers) => fetch(url, headers)
    .then(statusCheck)
    .then(res => res.json())

let getCountries = getJson(countriesUrl, apiheaders) 
                    .then(data => countryList(data))                     

getCountries  
countries.addEventListener('change', countryStats)            

module.exports = {
    statusCheck: statusCheck,
    countryList: countryList,
    getJson: getJson,
    countryStats: countryStats
}