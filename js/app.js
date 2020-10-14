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
const graph = document.querySelector('.graph')
const title = document.querySelector('.title')
const error = document.getElementById('error')
const dropDown = document.getElementById('dropDown')
let chart



let countryStats = () => {
    const selectedCountry = countries.value 
    
    getJson(`${statisticsUrl}?country=${selectedCountry}`, apiheaders)
        .then(data => {
            const countryData = data.response[0]

            country = {
                continent: countryData.continent || 'unknown',
                continent: countryData.continent || 'unknown',
                country: countryData.country || 'unknown',
                day: countryData.day || 'unknown',
                deaths: countryData.deaths.total || 'unknown',
                population: countryData.population || 'unknown',
                tests: countryData.tests.total || 'unknown',
                newCases: countryData.cases.new || 'unknown',
                activeCases: countryData.cases.active || 'unknown',
                criticalCases: countryData.cases.critical || 'unknown',
                recoveredCases: countryData.cases.recovered || 'unknown',
                totalCases: countryData.cases.total || 'unknown'
            }
            
            createHtml(country)

            makeAGraph([
                {x: "Population Without Covid Diagnosis", value: difference(parseInt(country.population), parseInt(country.totalCases))},
                {x: "Population With Covid Diagnosis", value: parseInt(country.totalCases)}
              ], `Percentage of ${country.country}'s Population With Positive Covid Diagnosis`, document.getElementById('one'))

            makeAGraph([
                {x: "Total Deaths", value: parseInt(country.deaths)},
                {x: "Active Cases", value: parseInt(country.activeCases)},
                {x: "Recovered Cases", value: parseInt(country.recoveredCases)}
              ], `Breakdown of Total Positive Covid Cases in ${country.country}`, document.getElementById('two'))
        })
}

let createHtml = (country) => {
    let titleLabel = `
        <h2>Covid Case Statistics for the country of ${country.country} in the continent of ${country.continent}</h2>
    `        
    
    let html = `
                <div>
                    <h3>Population: ${country.population}</h3>
                    <h3>Statistics as of: ${country.day}</h3>
                    <h3>Total Tests Given: ${country.tests}</h3>
                    <h3>Total Positive Cases: ${country.totalCases}</h3>
                    <h3>Total Deaths: ${country.deaths}</h3>
                    <h3>Total Recovered Cases: ${country.recoveredCases}</h3>
                    <h3>New Cases: ${country.newCases}</h3>
                    <h3>Current Active Cases: ${country.activeCases}</h3>
                    <h3>Current Critical Cases: ${country.criticalCases}</h3>
                </div>
            `

            title.innerHTML = titleLabel
            card.innerHTML = html
}

let makeAGraph = (data, title, container) => {
    container.innerHTML = '' // reset div to prevent multiple graphs from populating
    let div = document.createElement("div")
    div.style.height = '90%'
    let newContainer = container.appendChild(div)
    chart = anychart.pie3d(data)
    chart.innerRadius("50%")
    chart.labels().position("outside")
    chart.title(title)
    chart.container(newContainer)
    chart.draw()
}

let difference = (x, y) => x-y

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
