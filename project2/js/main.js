const POKE_URL = "https://pokeapi.co/api/v2/pokemon";
let pokemonToBeGuessedData;
let userGuessData;

// 1
window.onload = (e) => { 
    document.querySelector("#submit").onclick = submitButtonClicked;
    getNewGuess();
    document.querySelector("#refresh").onclick = getNewGuess;
};

// 2
let displayTerm = "";

function getNewGuess() {
    const MAX_POKE = 1008;
    let randNum = Math.floor(Math.random() * MAX_POKE);

    let url = POKE_URL;

    url += "/" + randNum + "/";

    // 9 - see what the URL looks like
    console.log(url);

    // 10 - Request data!
    getData(url);

    console.log("New Pokemon found");
}

// 3
function submitButtonClicked() {
    console.log("submitButtonClicked() called");

    // 2 - build up our URL string
    let url = POKE_URL;

    // 3 - parse the user entered term we wish to search
    let term = document.querySelector("#guessterm").value;
    displayTerm = term;

    // 4 - get rid of any leading and trailing spaces
    term = term.trim();

    // 5 - encode spaces and special characters
    term = encodeURIComponent(term);

    // 6 - if there's no term to serach then bail out the function (return does this)
    if (term.length < 1) return;

    // 7 - append the search term to the URL
    url += "/" + term + "/";

    // 8 - update the UI
    document.querySelector("#status").innerHTML = "<b>Searching for '" + displayTerm + "'</b>";

    // 9 - see what the URL looks like
    console.log(url);

    // 10 - Request data!
    getData(url);
}

function getData(url) {
    // 1 - create a new XHR object
    let xhr = new XMLHttpRequest();

    // 2 - set the onload handler
    xhr.onload = dataLoaded;

    // 3 - set the onerror handler
    xhr.onerror = dataError;

    // 4 - open connection and send the request
    xhr.open("GET", url);
    xhr.send();
}

function dataLoaded(e) {
    // 5 - event.target is the xhr object
    let xhr = e.target;

    // 6 - xhr.responseText is the JSON file we just downloaded
    console.log(xhr.responseText);

    // 7 - turn the text into a parsable JavaScript object
    let obj = JSON.parse(xhr.responseText);

    // 8 - if there are no results, print a message and return
    if (!obj.data || obj.data.length == 0) {
        document.querySelector("#status").innerHTML = "<b>No results found for '" + displayTerm + "'</b>";w
        return; // Bail out
    }

    // 9 - Start building an HTML string we will display to the user
    let results = obj.data;
    console.log("results.length = " + results.length);
    let bigString = "";

    // 10 - loop through the array of results
    for (let i = 0; i < results.length; i++) {
        let result = results[i];

        // 11 - get the URL to the GIF
        let smallURL = result.images.fixed_width_downsampled.url;
        if (!smallURL) smallURL = "images/no-image-found.png";

        // 12 - get the URL to the GIPHY page
        let url = result.url;

        // 12.5 - get rating
        let rating = (result.rating ? result.rating : "NA").toUpperCase();

        // 13 - Build a <div> to hold each result
        // ES6 String Templating
        let line = `<div class = 'result'>`;
        line += `<img src='${smallURL}' title='${result.id}' />`;
        line += `<span><a target='_blank' href='${url}'>View on Giphy</a>`;
        line += `<p>Rating: ${rating}</p></span>`
        line += `</div>`;

        // 15 - add the <div> to 'bigString' and loop
        bigString += line;
    }

    // 16 - all done building the HTML - show it to the user!
    document.querySelector("#content").innerHTML = bigString;

    // 17 - update the status
    document.querySelector("#status").innerHTML = "<b>Success!</b><p><i>Here are " + results.length + " results for '" + displayTerm + "'</i></p>";
}

function dataError(e) {
    console.log("An error occured");
}
