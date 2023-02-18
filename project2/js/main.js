const POKE_URL = "https://pokeapi.co/api/v2/pokemon";
let nationalDex;
let pokemonGuessInfo; // array for the info of the pokemon to be guessed
let userGuessInfo; // array for the info of the pokemon the user guesses
let numGuessesUsed;
let maxNumGuesses;
let winStatus;

// 1
window.onload = (e) => {
    document.querySelector("#submit").onclick = submitButtonClicked;
    generateNationalDex();
    getNewGuess();
    document.querySelector("#refresh").onclick = getNewGuess;
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
    document.querySelector("#content").innerHTML = "";
    document.querySelector("#status").innerHTML = `<b>You have ${maxNumGuesses} guesses Left!</b>`;
    const MAX_POKE = 1008;
    let randNum = Math.floor(Math.random() * MAX_POKE);

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

// function getData(url, pokemonInfo) {
//     // 1 - create a new XHR object
//     let xhr = new XMLHttpRequest();

//     // 2 - set the onload handler
//     if (pokemonInfo == nationalDex) {
//         xhr.onload = nationalDexLoaded;
//     }
//     else if (pokemonInfo == pokemonGuessInfo) {
//         xhr.onload = mainPokemonDataLoaded;
//     }
//     else if (pokemonInfo == userGuessInfo) {
//         xhr.onload = userGuessDataLoaded;
//     }

//     // 3 - set the onerror handler
//     xhr.onerror = dataError;

//     // 4 - open connection and send the request
//     xhr.open("GET", url);
//     xhr.send();
// }

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
        pokemonGuessInfo = { name: obj.name, generation: getGeneration(obj.id), type1: obj.types[0].type.name, type2: obj.types[1].type.name, weight: obj.weight / 10, height: obj.height / 10 }
    }
    else {
        pokemonGuessInfo = { name: obj.name, generation: getGeneration(obj.id), type1: obj.types[0].type.name, type2: null, weight: obj.weight / 10, height: obj.height / 10 }
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
        userGuessInfo = { name: obj.name, generation: getGeneration(obj.id), type1: obj.types[0].type.name, type2: obj.types[1].type.name, weight: obj.weight / 10, height: obj.height / 10 }
    }
    else {
        userGuessInfo = { name: obj.name, generation: getGeneration(obj.id), type1: obj.types[0].type.name, type2: null, weight: obj.weight / 10, height: obj.height / 10 }
    }
    console.log(userGuessInfo);
    compareData(pokemonGuessInfo, userGuessInfo);
}

// Determine the generation of the pokemon based on their ID
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
        let line = `<div class = 'guess'>`;
        line += `<h3>Guess #${numGuessesUsed}</h3><ul>`;
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

        // sees if the first typing of the main pokemon matches with either of the user guess's types
        if (mainPokemon.type1 == userGuess.type1 || mainPokemon.type1 == userGuess.type2) {
            line += `<li>Type 1: ${userGuess.type1}, Match</li>`;
        }
        else {
            line += `<li>Type 1: ${userGuess.type1}, No Match</li>`;
        }

        // sees if the second typing of the main pokemon matches with either of the user guess's types
        if (mainPokemon.type2 == userGuess.type2 || mainPokemon.type2 == userGuess.type1) {
            line += `<li>Type 2: ${userGuess.type2}, Match</li>`;
        }
        else {
            line += `<li>Type 2: ${userGuess.type2}, No Match</li>`;
        }

        // compare heights
        if (mainPokemon.height < userGuess.height) {
            line += `<li>Height: ${userGuess.height}m, Lower</li>`;
        }
        else if (mainPokemon.height > userGuess.height) {
            line += `<li>Height: ${userGuess.height}m, Higher</li>`;
        }
        else {
            line += `<li>Height: ${userGuess.height}m, Same</li>`;
        }

        // compare weights
        if (mainPokemon.weight < userGuess.weight) {
            line += `<li>Weight: ${userGuess.weight}kg, Lower</li>`;
        }
        else if (mainPokemon.weight > userGuess.weight) {
            line += `<li>Weight: ${userGuess.weight}kg, Higher</li>`;
        }
        else {
            line += `<li>Weight: ${userGuess.weight}kg, Same</li>`;
        }

        line += `</ul></div>`;

        document.querySelector("#content").innerHTML += line;

        // checks to see if the user guess matches the desired pokemon
        if (mainPokemon.generation == userGuess.generation &&
            mainPokemon.type1 == userGuess.type1 &&
            mainPokemon.type2 == userGuess.type2 &&
            mainPokemon.height == userGuess.height &&
            mainPokemon.weight == userGuess.weight) {

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
