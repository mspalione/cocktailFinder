//input required api key for code to work. See Readme for instructions on obtaining api key.
//import countryIds from 'countryIds.js'
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
const map = anychart.map();
let chart
let clickedCountry


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

let countryList = (data) => {
    let options = data.response.map(item => `
        <option value='${item}'>${item}</option>
    `).join('')
    countries.innerHTML = options
    countryStats()
}

let getCountries = getJson(countriesUrl, apiheaders) 
                    .then(data => countryList(data))     

let countryStats = () => {
    const selectedCountry = countries.value 
    series2(selectedCountry)
    
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

countries.addEventListener('change', countryStats)  

const countryCodes = fetch('https://cdn.anychart.com/samples/maps-choropleth/world-governments-map/data.json')
                   .then(res => res.json())
          
//dataset for map
const worldStats = getJson(statisticsUrl, apiheaders)
                .then(data => data.response)
                .then(async res => {
                    const countryCode = await countryCodes
                    let country
                    let obj
                    let arr = [
                        {
                            "id":"Somaliland",
                            "value": 0
                        },
                        {
                            "id":"TM",
                            "value": 0
                        },
                        {
                            "id":"KP",
                            "value": 0
                        }
                    ]

                    for (var r of res) {
                        country = countryCode.find(item => item.name === r.country)
                        if(!country) 
                            country = countryIds.find(item => item.country === r.country)                        

                        if(country) {
                            obj = {
                                "id":country.id,
                                "value": r.cases.total,
                                "country":r.country,
                                "deaths": r.deaths.total,
                                "population": r.population
                            }
                            
                            arr.push(obj)
                        }
                    }
                    
                    return arr
                })

let series2 = async (selectedCountry) => {
    const data = await worldStats
    const countryToHighlight = data.find(item => item.country === selectedCountry)
    secondSeries = map.choropleth(countryToHighlight)
    debugger
    secondSeries.fill('#302E2F')
}                

//create interactive map utilizing anychart.com
anychart.onDocumentReady(async function () {
    const data = await worldStats
    
    map.geoData(anychart.maps.world);
    map.colorRange(true)
        .title()
        .enabled(true)
        .hAlign('center')
        .useHtml(true)
        .fontFamily('\'Lora\', serif')
        .text(`<span style="font-size: 18px; color: #302E2F;">Total Positive Test Cases By Country<br/></span> 
                <span style="font-size: 14px; color: #302E2F;">Grouped by 1,000,000<br/></span> 
                <span style="font-size: 14px; color: #302E2F;">Double Click on a Country to See the Full Stats List Below</span>`)

    let series = map.choropleth(data);
    //series.colorScale(anychart.scales.linearColor('#81d4fa', '#014377'));
    series.hovered().fill('#302E2F')

    let scale = anychart.scales.ordinalColor([
         { from: 0, to: 0}
        ,{ from: 1, to: 1000000 }
        ,{ from: 1000000, to: 2000000 }
        ,{ from: 2000000, to: 3000000 }
        ,{ from: 3000000, to: 4000000 }
        ,{ from: 4000000, to: 5000000 }
        ,{ from: 5000000, to: 6000000 }
        ,{ from: 6000000, to: 7000000 }
        ,{ from: 7000000, to: 8000000 }
        ,{ from: 8000000, to: 9000000 }
        ,{ greater: 9000000 }
    ])

    scale.colors([
          '#b5b8ba'
        , '#bddcf0'
        , '#9dd1eb'
        , '#64a4cc'
        , '#7cc8f7'
        , '#6895ab'
        , '#5cb9f2'
        , '#31aaf5'
        , '#2587c4'
        , '#065c91'
        , '#124c70'
    ])

    series.colorScale(scale)

    //Data shown on hover
    map.tooltip()
        .useHtml(true)
        .format(function () {
            //set clickedCountry
            clickedCountry = this
            
            const dataDisplay = `
                                Positive Cases: ${this.value}  <br/> 
                                Deaths: ${this.getData('deaths')}  <br/> 
                                Total Population: ${this.getData('population')} 
                                `
            const noData = `
                           Unknown Covid Data
                           `                                
            return this.value === 0 ? noData : dataDisplay
    })    

    
    
    
    //Trigger countryStats to match stats list to country selected in map
    map.listen('dblclick', function () {
        countries.value = clickedCountry.getData('country')
        countryStats()
    })

    //set where to put map in html via id
    map.container('world')
    map.draw()
  });         
          
