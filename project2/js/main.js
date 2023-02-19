const POKE_URL = "https://pokeapi.co/api/v2/pokemon";
let pokedex;
let pokemonGuessInfo; // array for the info of the pokemon to be guessed
let userGuessInfo; // array for the info of the pokemon the user guesses
let numGuessesUsed; // number of guesses used
let maxNumGuesses; // max guesses allowed
let genNumber; // generation number
let winStatus; // variable to check if you've won that the player can't keep going after
let dexStart; // the number that dex is starting with
let dexLimit; // the number of pokemon in that generation

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

    getNewGuess();
    document.querySelector("#refresh").onclick = getNewGuess;
    document.querySelector("#limit").onchange = getNewGuess;
    document.querySelector("#genNumber").onchange = getNewGuess;
};

function generatePokedex() {
    let url = POKE_URL;

    url += "?limit=" + dexLimit + "&offset=" + dexStart;

    // see what the URL looks like
    console.log(url);

    // Request data!
    getPokedexData(url);
}

function getNewGuess() {
    numGuessesUsed = 0;
    pokedex = [];
    winStatus = false;
    maxNumGuesses = document.querySelector("#limit").value;
    genNumber = document.querySelector("#genNumber").value;
    document.querySelector("#content").innerHTML = `<div class="guess">
    <div class="guessItem">Sprite</div>
    <div class="guessItem">Name:</div>
    <div class="guessItem">Type 1:</div>
    <div class="guessItem">Type 2:</div>
    <div class="guessItem">Height:</div>
    <div class="guessItem">Weight:</div></div>`;
    document.querySelector("#status").innerHTML = `<b>You have ${maxNumGuesses} guesses Left!</b>`;
    let randNum = getRandIdByGen(genNumber);
    generatePokedex();
    let url = POKE_URL;

    url += "/" + randNum + "/";

    // 9 - see what the URL looks like
    console.log(url);

    // 10 - Request data!
    getRandomPokemonData(url);

    console.log("New Pokemon found");
}

// function for checking if the user's search term is a valid entry
function checkInDex(term, pokedex) {
    let termInList = false;
    for (let i = 0; i < pokedex.length; i++) {
        if (term == pokedex[i]) {
            termInList = true;
        }
    }
    return termInList;
}

function submitButtonClicked() {
    console.log("submitButtonClicked() called");

    // build up our URL string
    let url = POKE_URL;

    // parse the user entered term we wish to search
    let term = document.querySelector("#guessterm").value;

    if (term == "") {
        document.querySelector("#status").innerHTML = `<b>No guess given. Please enter a pokemon name.</b>`;
        return;
    }
    else if (!checkInDex(term, pokedex)) {
        document.querySelector("#status").innerHTML = `<b>Entry not found in list. Please check your entry.</b>`;
        return;
    }

    // get rid of any leading and trailing spaces
    term = term.trim();

    // encode spaces and special characters
    term = encodeURIComponent(term);

    // if there's no term to search then bail out the function (return does this)
    if (term.length < 1) return;

    // append the search term to the URL
    url += "/" + term + "/";

    // see what the URL looks like
    console.log(url);

    // Request data!
    getUserGuessData(url);
}

// tried to consolodate these getData functions into one but ran into issues of the wrong one's being called sometimes and wasn't sure how to fix
function getPokedexData(url) {
    // 1 - create a new XHR object
    let xhr = new XMLHttpRequest();

    // 2 - set the onload handler
    xhr.onload = pokedexLoaded;

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

function pokedexLoaded(e) {
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

    let pokedexList = document.querySelector("#pokedex");
    pokedexList.innerHTML = "";
    for (let i = 0; i < obj.results.length; i++) {
        pokedexList.innerHTML += `<option value=\"${obj.results[i].name}\"></option>`;
        pokedex.push(obj.results[i].name);
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

    if (obj.types.length > 1) {
        pokemonGuessInfo = { name: obj.name, type1: obj.types[0].type.name, type2: obj.types[1].type.name, weight: obj.weight / 10, height: obj.height / 10 };
    }
    else {
        pokemonGuessInfo = { name: obj.name, type1: obj.types[0].type.name, type2: "----", weight: obj.weight / 10, height: obj.height / 10 };
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

    if (obj.types.length > 1) {
        userGuessInfo = { name: obj.name, artwork: obj.sprites.front_default, type1: obj.types[0].type.name, type2: obj.types[1].type.name, weight: obj.weight / 10, height: obj.height / 10 };
    }
    else {
        userGuessInfo = { name: obj.name, artwork: obj.sprites.front_default, type1: obj.types[0].type.name, type2: "----", weight: obj.weight / 10, height: obj.height / 10 };
    }
    console.log(userGuessInfo);
    compareData(pokemonGuessInfo, userGuessInfo);
}

// Determine the Id of the pokemon based on selected generation
function getRandIdByGen(gen) {
    let randNum;
    if (gen == 1) {
        randNum = Math.floor(Math.random() * (152 - 1) + 1);
        console.log(randNum);
        dexStart = 0;
        dexLimit = 151;
        return randNum;
    }
    else if (gen == 2) {
        randNum = Math.floor(Math.random() * (252 - 152) + 152);
        console.log(randNum);
        dexStart = 151;
        dexLimit = 100;
        return randNum;
    }
    else if (gen == 3) {
        randNum = Math.floor(Math.random() * (387 - 252) + 252);
        console.log(randNum);
        dexStart = 251;
        dexLimit = 135;
        return randNum;
    }
    else if (gen == 4) {
        randNum = Math.floor(Math.random() * (494 - 387) + 387);
        console.log(randNum);
        dexStart = 386;
        dexLimit = 107;
        return randNum;
    }
    else if (gen == 5) {
        randNum = Math.floor(Math.random() * (650 - 494) + 494);
        console.log(randNum);
        dexStart = 493;
        dexLimit = 156;
        return randNum;
    }
    else if (gen == 6) {
        randNum = Math.floor(Math.random() * (722 - 650) + 650);
        console.log(randNum);
        dexStart = 649;
        dexLimit = 72;
        return randNum;
    }
    else if (gen == 7) {
        randNum = Math.floor(Math.random() * (810 - 722) + 722);
        console.log(randNum);
        dexStart = 721;
        dexLimit = 88;
        return randNum;
    }
    else if (gen == 8) {
        randNum = Math.floor(Math.random() * (906 - 810) + 810);
        console.log(randNum);
        dexStart = 809;
        dexLimit = 96;
        return randNum;
    }
    else if (gen == 9) {
        randNum = Math.floor(Math.random() * (1009 - 906) + 906);
        console.log(randNum);
        dexStart = 905;
        dexLimit = 103;
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
        let line = `<div class="guess">`;
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
            line += `<div class="guessItem" style="color:green;">${userGuess.height}m</div>`;
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
