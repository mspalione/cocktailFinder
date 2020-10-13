# covid

Started with https://rapidapi.com/thecocktaildb/api/the-cocktail-db/endpoints 9/30.
Switched to https://rapidapi.com/api-sports/api/covid-193 10/1.

Integrating css and js from other folders into the html.

You will need to get your API key following the covid link above. Scroll down on the page. You will find the free api key there. Copy and paste into app.js on line 14 inside the const apiheaders.

Initially planned to include unit testing but found it difficult to test with api and significant use of the dom in my functions without relying on external helpers so opted to not include tests at this time.

Features include:

~Responsive design based on screen size.

~Read and parse an external file (such as JSON or CSV) into your application and display some data from that in your app [ countryList(data) populates a drop down list from a json file. ]

~Retrieve data from an external API and display data in your app (such as with fetch() or with AJAX) [ getJson(url, headers) retrieves data from an external API utilizing fetch() and returns data as json to be displayed in countryList() and countryStats(). ]

~Create an array, dictionary or list, populate it with multiple values, retrieve at least one value, and use or display it in your application [ countryStats() creates an object with multiple values and displays the values on the webpage with createHtml(). ]

~Create and use a function that accepts two or more values (parameters), calculates or determines a new value based on those inputs, and returns a new value [ difference(x,y) takes in two values and returns the difference between them ]

~Visualize data in a graph, chart, or other visual representation of data [ Two doughnut charts visualize the data returned for the country's covid statistics ]

