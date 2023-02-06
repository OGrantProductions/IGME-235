const POKE_URL = "https://pokeapi.co/api/v2/pokemon";
let pokemonGuessInfo; // array for the info of the pokemon to be guessed
let userGuessInfo; // array for the info of the pokemon the user guesses
let numGuessesUsed;

// 1
window.onload = (e) => {
    document.querySelector("#submit").onclick = submitButtonClicked;
    getNewGuess();
    document.querySelector("#refresh").onclick = getNewGuess;
};

// 2
let displayTerm = "";

function getNewGuess() {
    numGuessesUsed = 0;
    const MAX_POKE = 1008;
    let randNum = Math.floor(Math.random() * MAX_POKE);

    let url = POKE_URL;

    url += "/" + randNum + "/";

    // 9 - see what the URL looks like
    console.log(url);

    // 10 - Request data!
    getData(url, pokemonGuessInfo);

    console.log("New Pokemon found");
}

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

    // 6 - if there's no term to search then bail out the function (return does this)
    if (term.length < 1) return;

    // 7 - append the search term to the URL
    url += "/" + term + "/";

    // 8 - update the UI
    document.querySelector("#status").innerHTML = "<b>Searching for '" + displayTerm + "'</b>";

    // 9 - see what the URL looks like
    console.log(url);

    // 10 - Request data!
    getData(url, userGuessInfo);
}

function getData(url, pokemonInfo) {
    // 1 - create a new XHR object
    let xhr = new XMLHttpRequest();

    // 2 - set the onload handler
    if (pokemonInfo == pokemonGuessInfo) {
        xhr.onload = mainPokemonDataLoaded;
    }
    else if (pokemonInfo == userGuessInfo) {
        xhr.onload = userGuessDataLoaded;
    }

    // 3 - set the onerror handler
    xhr.onerror = dataError;

    // 4 - open connection and send the request
    xhr.open("GET", url);
    xhr.send();
}

function mainPokemonDataLoaded(e) {
    // 5 - event.target is the xhr object
    let xhr = e.target;

    // 6 - xhr.responseText is the JSON file we just downloaded
    console.log(xhr.responseText);

    // 7 - turn the text into a parsable JavaScript object
    let obj = JSON.parse(xhr.responseText);

    // 8 - if there are no results, print a message and return
    if (!obj || obj.length == 0) {
        document.querySelector("#status").innerHTML = "<b>No results found for '" + displayTerm + "'</b>"; w
        return; // Bail out
    }

    if (obj.types.length > 1) {
        pokemonGuessInfo = { name: obj.name, generation: getGeneration(obj.id), type1: obj.types[0].type.name, type2: obj.types[1].type.name, weight: obj.weight, height: obj.height }
    }
    else {
        pokemonGuessInfo = { name: obj.name, generation: getGeneration(obj.id), type1: obj.types[0].type.name, type2: null, weight: obj.weight, height: obj.height }
    }
    console.log(pokemonGuessInfo);
}

function userGuessDataLoaded(e) {
    // 5 - event.target is the xhr object
    let xhr = e.target;

    // 6 - xhr.responseText is the JSON file we just downloaded
    console.log(xhr.responseText);

    // 7 - turn the text into a parsable JavaScript object
    let obj = JSON.parse(xhr.responseText);

    // 8 - if there are no results, print a message and return
    if (!obj || obj.length == 0) {
        document.querySelector("#status").innerHTML = "<b>No results found for '" + displayTerm + "'</b>"; w
        return; // Bail out
    }

    if (obj.types.length > 1) {
        userGuessInfo = { name: obj.name, generation: getGeneration(obj.id), type1: obj.types[0].type.name, type2: obj.types[1].type.name, weight: obj.weight, height: obj.height }
    }
    else {
        userGuessInfo = { name: obj.name, generation: getGeneration(obj.id), type1: obj.types[0].type.name, type2: null, weight: obj.weight, height: obj.height }
    }
    console.log(userGuessInfo);
    compareData(pokemonGuessInfo, userGuessInfo);
}

function getGeneration(id) {
    if (id > 0 && id <= 151) {
        return 1;
    }
    else if (id > 151 && id <= 251) {
        return 2;
    }
    else if (id > 251 && id <= 386) {
        return 3;
    }
    else if (id > 386 && id <= 493) {
        return 4;
    }
    else if (id > 493 && id <= 649) {
        return 5;
    }
    else if (id > 649 && id <= 721) {
        return 6;
    }
    else if (id > 721 && id <= 809) {
        return 7;
    }
    else if (id > 809 && id <= 905) {
        return 8;
    }
    else if (id > 905 && id <= 1008) {
        return 9;
    }
}

function compareData(mainPokemon, userGuess) {

    numGuessesUsed++;
    // ES6 String Templating
    let line = `<div class = 'guess'><ul>`;
    line += `<li>Guess #${numGuessesUsed}</li>`;
    line += `<li>Name: ${userGuess.name}</li>`;

    // compare generation numbers
    if (mainPokemon.generation < userGuess.generation) {
        line += `<li>Generation: ${userGuess.generation}, Lower</li>`;
    }
    else if (mainPokemon.generation > userGuess.generation) {
        line += `<li>Generation: ${userGuess.generation}, Higher</li>`;
    }
    else {
        line += `<li>Generation: ${userGuess.generation}, Same</li>`;
    }

    // compare primary types
    if (mainPokemon.type1 == userGuess.type1) {
        line += `<li>Primary Type: ${userGuess.type1}, Match</li>`;
    }
    else {
        line += `<li>Primary Type: ${userGuess.type1}, No Match</li>`;
    }

    // compare secondary types
    if (mainPokemon.type2 == userGuess.type2) {
        line += `<li>Secondary Type: ${userGuess.type2}, Match</li>`;
    }
    else {
        line += `<li>Secondary Type: ${userGuess.type2}, No Match</li>`;
    }

    // compare heights
    if (mainPokemon.height < userGuess.height) {
        line += `<li>Height: ${userGuess.height}, Lower</li>`;
    }
    else if (mainPokemon.height > userGuess.height) {
        line += `<li>Height: ${userGuess.height}, Higher</li>`;
    }
    else {
        line += `<li>Height: ${userGuess.height}, Same</li>`;
    }

    // compare weights
    if (mainPokemon.weight < userGuess.weight) {
        line += `<li>Weight: ${userGuess.weight}, Lower</li>`;
    }
    else if (mainPokemon.weight > userGuess.weight) {
        line += `<li>Weight: ${userGuess.weight}, Higher</li>`;
    }
    else {
        line += `<li>Weight: ${userGuess.weight}, Same</li>`;
    }

    line += `</ul></div>`;

    document.querySelector("#content").innerHTML += line;
}

function dataError(e) {
    console.log("An error occured");
}
