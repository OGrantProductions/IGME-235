const POKE_URL = "https://pokeapi.co/api/v2/pokemon";
let nationalDex;
let pokemonGuessInfo; // array for the info of the pokemon to be guessed
let userGuessInfo; // array for the info of the pokemon the user guesses
let numGuessesUsed;
let maxNumGuesses;
let genNumber;
let winStatus;

// 1
window.onload = (e) => {
    document.querySelector("#submit").onclick = submitButtonClicked;
    // Saves the previous search term to redisplay when the user comes back to the page on the same browser
    const guessField = document.querySelector("#guessterm");
    const guessKey = "oeg5370-search";
    // grab the stored data, will return `null` if the user has never been to this page
    const storedSearch = localStorage.getItem(guessKey);
    // if we find a previously set search, display it
    if (storedSearch) {
        guessField.value = storedSearch;
    } else {
        guessField.value = ""; // null by default if there isn't a previous search
    }
    guessField.onchange = e => { localStorage.setItem(guessKey, e.target.value); };

    generateNationalDex();
    getNewGuess();
    document.querySelector("#refresh").onclick = getNewGuess;
    document.querySelector("#limit").onchange = getNewGuess;
    document.querySelector("#genNumber").onchange = getNewGuess;
};

function generateNationalDex() {
    let url = POKE_URL;

    url += "?limit=1008&offset=0";

    // 9 - see what the URL looks like
    console.log(url);

    // 10 - Request data!
    getNationalDexData(url);
}

function getNewGuess() {
    numGuessesUsed = 0;
    winStatus = false;
    maxNumGuesses = document.querySelector("#limit").value;
    genNum = document.querySelector("#genNumber").value;
    document.querySelector("#content").innerHTML = `<div class="guess">
    <div class="guessItem">Sprite</div>
    <div class="guessItem">Name:</div>
    <div class="guessItem">Type 1:</div>
    <div class="guessItem">Type 2:</div>
    <div class="guessItem">Height:</div>
    <div class="guessItem">Weight:</div></div>`;
    document.querySelector("#status").innerHTML = `<b>You have ${maxNumGuesses} guesses Left!</b>`;
    let randNum = getRandIdByGen(genNum);

    let url = POKE_URL;

    url += "/" + randNum + "/";

    // 9 - see what the URL looks like
    console.log(url);

    // 10 - Request data!
    getRandomPokemonData(url);

    console.log("New Pokemon found");
}

function submitButtonClicked() {
    console.log("submitButtonClicked() called");

    // 2 - build up our URL string
    let url = POKE_URL;

    // 3 - parse the user entered term we wish to search
    let term = document.querySelector("#guessterm").value;

    // 4 - get rid of any leading and trailing spaces
    term = term.trim();

    // 5 - encode spaces and special characters
    term = encodeURIComponent(term);

    // 6 - if there's no term to search then bail out the function (return does this)
    if (term.length < 1) return;

    // 7 - append the search term to the URL
    url += "/" + term + "/";

    // 9 - see what the URL looks like
    console.log(url);

    // 10 - Request data!
    getUserGuessData(url);
}

function getNationalDexData(url) {
    // 1 - create a new XHR object
    let xhr = new XMLHttpRequest();

    // 2 - set the onload handler
    xhr.onload = nationalDexLoaded;

    // 3 - set the onerror handler
    xhr.onerror = dataError;

    // 4 - open connection and send the request
    xhr.open("GET", url);
    xhr.send();
}

function getRandomPokemonData(url) {
    // 1 - create a new XHR object
    let xhr = new XMLHttpRequest();

    // 2 - set the onload handler
    xhr.onload = mainPokemonDataLoaded;

    // 3 - set the onerror handler
    xhr.onerror = dataError;

    // 4 - open connection and send the request
    xhr.open("GET", url);
    xhr.send();
}

function getUserGuessData(url) {
    // 1 - create a new XHR object
    let xhr = new XMLHttpRequest();

    // 2 - set the onload handler
    xhr.onload = userGuessDataLoaded;

    // 3 - set the onerror handler
    xhr.onerror = dataError;

    // 4 - open connection and send the request
    xhr.open("GET", url);
    xhr.send();
}

function nationalDexLoaded(e) {
    // 5 - event.target is the xhr object
    let xhr = e.target;

    // 6 - xhr.responseText is the JSON file we just downloaded
    console.log(xhr.responseText);

    // 7 - turn the text into a parsable JavaScript object
    let obj = JSON.parse(xhr.responseText);

    // 8 - if there are no results, print a message and return
    if (!obj.results || obj.results.length == 0) {
        console.log("Full dex could not be loaded");
        return; // Bail out
    }

    let pokedex = document.querySelector("#pokedex");
    pokedex.innerHTML = "";
    for (let i = 0; i < obj.results.length; i++) {
        pokedex.innerHTML += `<option value=\"${obj.results[i].name}\"></option>`;
    }

    console.log("National Dex loaded");
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
        pokemonGuessInfo = { name: obj.name, type1: obj.types[0].type.name, type2: obj.types[1].type.name, weight: obj.weight / 10, height: obj.height / 10 }
    }
    else {
        pokemonGuessInfo = { name: obj.name, type1: obj.types[0].type.name, type2: null, weight: obj.weight / 10, height: obj.height / 10 }
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
        userGuessInfo = { name: obj.name, artwork: obj.sprites.front_default, type1: obj.types[0].type.name, type2: obj.types[1].type.name, weight: obj.weight / 10, height: obj.height / 10 }
    }
    else {
        userGuessInfo = { name: obj.name, artwork: obj.sprites.front_default, type1: obj.types[0].type.name, type2: "----", weight: obj.weight / 10, height: obj.height / 10 }
    }
    console.log(userGuessInfo);
    compareData(pokemonGuessInfo, userGuessInfo);
}

// Determine the generation of the pokemon based on their ID
function getRandIdByGen(gen) {
    let randNum;
    if (gen == 1) {
        randNum = Math.floor(Math.random() * (152 - 1) + 1);
        console.log(randNum);
        return randNum;
    }
    else if (gen == 2) {
        randNum = Math.floor(Math.random() * (252 - 152) + 152);
        console.log(randNum);
        return randNum;
    }
    else if (gen == 3) {
        randNum = Math.floor(Math.random() * (387 - 252) + 252);
        console.log(randNum);
        return randNum;
    }
    else if (gen == 4) {
        randNum = Math.floor(Math.random() * (494 - 387) + 387);
        console.log(randNum);
        return randNum;
    }
    else if (gen == 5) {
        randNum = Math.floor(Math.random() * (650 - 494) + 494);
        console.log(randNum);
        return randNum;
    }
    else if (gen == 6) {
        randNum = Math.floor(Math.random() * (722 - 650) + 650);
        console.log(randNum);
        return randNum;
    }
    else if (gen == 7) {
        randNum = Math.floor(Math.random() * (810 - 722) + 722);
        console.log(randNum);
        return randNum;
    }
    else if (gen == 8) {
        randNum = Math.floor(Math.random() * (906 - 810) + 810);
        console.log(randNum);
        return randNum;
    }
    else if (gen == 9) {
        randNum = Math.floor(Math.random() * (1009 - 906) + 906);
        console.log(randNum);
        return randNum;
    }
}

// Compares the data between the user's guesses and the pokemon to be guessed
function compareData(mainPokemon, userGuess) {
    if (maxNumGuesses - numGuessesUsed == 0 && winStatus == false) { // ensures the user doesn't keep making guesses once they run out
        document.querySelector("#status").innerHTML = `<b>Game Over! The Pokemon was ${mainPokemon.name}.</b>`;
    }
    else if (winStatus == true) {
        document.querySelector("#status").innerHTML = `<b>You got it in ${numGuessesUsed} guesses! The Pokemon was ${mainPokemon.name}!</b>`;
    }
    else {
        numGuessesUsed++;
        let numGuessesLeft = maxNumGuesses - numGuessesUsed;
        let line = `<div class="guess">`
        line += `<div class="guessItem"><img src="${userGuess.artwork}" alt="${userGuess.name} artwork"></div>`;
        line += `<div class="guessItem">${userGuess.name}</div>`;

        // sees if the first typing of the main pokemon matches with either of the user guess's types
        if (mainPokemon.type1 == userGuess.type1 || mainPokemon.type1 == userGuess.type2) {
            line += `<div class="guessItem" style="color:green;">${userGuess.type1}</div>`;
        }
        else {
            line += `<div class="guessItem" style="color:red;">${userGuess.type1}</div>`;
        }

        // sees if the second typing of the main pokemon matches with either of the user guess's types
        if (mainPokemon.type2 == userGuess.type2 || mainPokemon.type2 == userGuess.type1) {
            line += `<div class="guessItem" style="color:green;">${userGuess.type2}</div>`;
        }
        else {
            line += `<div class="guessItem" style="color:red;">${userGuess.type2}</div>`;
        }

        // compare heights
        if (mainPokemon.height < userGuess.height) {
            line += `<div class="guessItem" style="color:red;">${userGuess.height}m <br> Lower</div>`;
        }
        else if (mainPokemon.height > userGuess.height) {
            line += `<div class="guessItem" style="color:red;">${userGuess.height}m <br> Higher</div>`;
        }
        else {
            line += `<div class="guessItem" style="color:green;">${userGuess.height}</div>`;
        }

        // compare weights
        if (mainPokemon.weight < userGuess.weight) {
            line += `<div class="guessItem" style="color:red;">${userGuess.weight}kg <br> Lower</div>`;
        }
        else if (mainPokemon.weight > userGuess.weight) {
            line += `<div class="guessItem" style="color:red;">${userGuess.weight}kg <br> Higher</div>`;
        }
        else {
            line += `<div class="guessItem" style="color:green;">${userGuess.weight}kg</div>`;
        }

        line += `</div>`;
        console.log(line);

        document.querySelector("#content").innerHTML += line;

        // checks to see if the user guess matches the desired pokemon
        // mainPokemon.generation == userGuess.generation &&
        // mainPokemon.type1 == userGuess.type1 &&
        // mainPokemon.type2 == userGuess.type2 &&
        // mainPokemon.height == userGuess.height &&
        // mainPokemon.weight == userGuess.weight
        if (mainPokemon.name == userGuess.name) {

            document.querySelector("#status").innerHTML = `<b>You got it in ${numGuessesUsed} guesses! The Pokemon was ${mainPokemon.name}!</b>`;
            winStatus = true;
        }
        else { // if doesn't match the desired pokemon
            if (numGuessesLeft == 0) {
                document.querySelector("#status").innerHTML = `<b>Game Over! The Pokemon was ${mainPokemon.name}.</b>`;
            }
            else {
                document.querySelector("#status").innerHTML = `<b>You have ${numGuessesLeft} guesses Left!</b>`;
            }
        }
    }
}

function dataError(e) {
    console.log("An error occured");
}
