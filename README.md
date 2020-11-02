# covid

Started with https://rapidapi.com/thecocktaildb/api/the-cocktail-db/endpoints 9/30.
Switched to https://rapidapi.com/api-sports/api/covid-193 10/1.

Integrating css and js from other folders into the html.

API key provided. To get your own, follow the covid link above. Scroll down on the page. Register and you will find the free api key there. Copy and paste into app.js on line 14 inside the const apiheaders.

Features include:

~Responsive design based on screen size.

~Read and parse an JSON external file into your application and display some data from that in your app [ countryList(data) populates a drop down list from a json file. ]

~Retrieve data from an external API and display data in your app (such as with fetch() or with AJAX) [ getJson(url, headers) retrieves data from an external API utilizing fetch() and returns data as json to be displayed in worldStats, countryCodes, countryList() and countryStats(). ]

~Create an array, dictionary or list, populate it with multiple values, retrieve at least one value, and use or display it in your application [ countryStats() creates an object with multiple values and displays the values on the webpage with createHtml(). ]

~Create and use a function that accepts two or more values (parameters), calculates or determines a new value based on those inputs, and returns a new value [ difference(x,y) takes in two values and returns the difference between them ]

~Visualize data in a graph, chart, or other visual representation of data [ Two doughnut charts visualize the data returned for the country's covid statistics ]

*Brought in data to match country code with the related country via api and using .find on the returned array. Created sterilized data in countryIds.js for use with the country codes that did not have a matching country due to spelling and styling differences between the two data sets such as hyphens and spaces.

*Use of https://www.anychart.com/ to create map and pie charts with an external data source.