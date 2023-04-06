// Resources
// https://github.com/kittykatattack/learningPixi
// Keyboard Movement Tutorial by Dower Chin - https://www.youtube.com/watch?v=cP-_beFbz_Q

// We will use `strict mode`, which helps us by having the browser catch many common JS mistakes
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
"use strict";
const app = new PIXI.Application({
    width: 950,
    height: 600
});
document.body.appendChild(app.view);

// keyboard event handlers
window.addEventListener("keydown", keysDown);
window.addEventListener("keyup", keysUp);
let keys = {};
let keysDiv;



// constants
const sceneWidth = app.view.width;
const sceneHeight = app.view.height;

// pre-load the images
app.loader.
    add([
        "images/earth.png",
        "images/meteor.png",
        "images/spaceship.png",
        "images/spaceBackground.jpg"
    ]);
app.loader.onProgress.add(e => { console.log(`progress=${e.progress}`) });
app.loader.onComplete.add(setupGame);
app.loader.load();


// aliases
let stage;

// game variables
let startScene;
let instructionsScene;
let gameScene, ship, earth, scoreLabel, waveLabel, earthHealthLabel, shipLivesLabel;
let pauseScene;
let upgradeScene;
let gameOverScene, gameOverScoreLabel;

let currentScene;

let meteors = [];
let bullets = [];
let score = 0;
let earthHealth = 100;
let shipLives = 3;
let waveNum = 1;
let paused = true;

function keysDown(e) {
    console.log(e.keyCode);
    keys[e.keyCode] = true;
}

function keysUp(e) {
    console.log(e.keyCode);
    keys[e.keyCode] = false;
}

// Sets up all of the scenes, labels, and assets needed for the game
function setupGame() {
    stage = app.stage;

    // create background for every scene
    const background = new PIXI.Sprite(app.loader.resources["images/spaceBackground.jpg"].texture);
    background.width = sceneWidth;
    background.height = sceneHeight;
    stage.addChild(background);

    // create the `start` scene
    startScene = new PIXI.Container();
    currentScene = startScene;
    startScene.name = "start scene"
    stage.addChild(startScene);

    // Create the `instructions` scene and make it invisible
    instructionsScene = new PIXI.Container();
    instructionsScene.visible = false;
    stage.addChild(instructionsScene);

    // Create the main `game` scene and make it invisible
    gameScene = new PIXI.Container();
    gameScene.visible = false;
    stage.addChild(gameScene);

    // Create the `pause` scene and make it invisible
    pauseScene = new PIXI.Container();
    pauseScene.visible = false;
    stage.addChild(pauseScene);

    // Create the `upgrades` scene and make it invisible
    upgradeScene = new PIXI.Container();
    upgradeScene.visible = false;
    stage.addChild(upgradeScene);

    // Create the `gameOver` scene and make it invisible
    gameOverScene = new PIXI.Container();
    gameOverScene.visible = false;
    stage.addChild(gameOverScene);

    // Create the labels and buttons for all of the scenes
    createLabelsAndButtons();

    // Create ship
    ship = new Ship();
    gameScene.addChild(ship);

    // Create planet
    earth = new Planet();
    gameScene.addChild(earth);

    // Start update loop
    app.ticker.add(gameLoop);
}

// Makes all of the labels and buttons for every scene so they're already available when needed
function createLabelsAndButtons() {
    let menuButtonStyle = new PIXI.TextStyle({
        fill: 0xFFFFFF,
        fontSize: 48,
        fontFamily: "Futura"
    });

    //
    // set up 'startScene'
    //

    // make title
    let title = new PIXI.Text("Protect the Planet");
    title.style = new PIXI.TextStyle({
        fill: 0x5D3FD3,
        fontSize: 120,
        fontFamily: "Futura",
        stroke: 0xFFFFFF,
        strokeThickness: 10
    });
    title.x = sceneWidth / 2;
    title.y = 200;
    title.anchor.set(0.5);
    startScene.addChild(title);

    // make instructions button
    let instructionsButton = new PIXI.Text("How to Play");
    instructionsButton.style = menuButtonStyle;
    instructionsButton.x = sceneWidth / 2;
    instructionsButton.y = sceneHeight - 200;
    instructionsButton.anchor.set(0.5);
    instructionsButton.interactive = true;
    instructionsButton.buttonMode = true;
    instructionsButton.on("click", () => { switchScenes(instructionsScene) }); // when button is clicked
    instructionsButton.on('pointerover', e => e.target.alpha = 0.7); // when button is hovered over
    instructionsButton.on('pointerout', e => e.currentTarget.alpha = 1.0); // when button isn't hovered over
    startScene.addChild(instructionsButton);

    // make start game button
    let startButton = new PIXI.Text("Start Game");
    startButton.style = menuButtonStyle;
    startButton.x = sceneWidth / 2;
    startButton.y = sceneHeight - 100;
    startButton.anchor.set(0.5);
    startButton.interactive = true;
    startButton.buttonMode = true;
    startButton.on("click", startGame);
    startButton.on('pointerover', e => e.target.alpha = 0.7);
    startButton.on('pointerout', e => e.currentTarget.alpha = 1.0);
    startScene.addChild(startButton);

    //
    // set up 'instructionsScene'
    //

    // make instructions title
    let instructionsTitle = new PIXI.Text("How to Play");
    instructionsTitle.style = new PIXI.TextStyle({
        fill: 0x5D3FD3,
        fontSize: 90,
        fontFamily: "Futura",
        stroke: 0xFFFFFF,
        strokeThickness: 10
    });
    instructionsTitle.x = sceneWidth / 2;
    instructionsTitle.y = 75;
    instructionsTitle.anchor.set(0.5);
    instructionsScene.addChild(instructionsTitle);

    // make instructions
    let instructions = new PIXI.Text("You are responsible for protecting the planet from an\nincoming meteor shower as long as possible.\nYou control your ship using WASD or the arrow keys.\nFire bullets using the left mouse button.\nLast as long as possible and protect your planet!");
    instructions.style = new PIXI.TextStyle({
        fill: 0x5D3FD3,
        fontSize: 40,
        fontFamily: "Futura",
        stroke: 0x000000,
        strokeThickness: 15,
        align: "center"
    });
    instructions.x = sceneWidth / 2;
    instructions.y = sceneHeight / 2;
    instructions.anchor.set(0.5);
    instructionsScene.addChild(instructions);

    // make 'back to start button' from instructions
    let instructBack = new PIXI.Text("Back to Start");
    instructBack.style = menuButtonStyle;
    instructBack.x = sceneWidth / 2;
    instructBack.y = sceneHeight - 75;
    instructBack.anchor.set(0.5);
    instructBack.interactive = true;
    instructBack.buttonMode = true;
    instructBack.on("click", () => { switchScenes(startScene) });
    instructBack.on('pointerover', e => e.target.alpha = 0.7);
    instructBack.on('pointerout', e => e.currentTarget.alpha = 1.0);
    instructionsScene.addChild(instructBack);

    //
    // set up 'gameScene'
    //

    let gameLabelStyle = new PIXI.TextStyle({
        fill: 0x5D3FD3,
        fontSize: 36,
        fontFamily: "Futura",
        stroke: 0xFFFFFF,
        strokeThickness: 4
    })

    // make score label
    scoreLabel = new PIXI.Text();
    scoreLabel.style = gameLabelStyle;
    scoreLabel.x = 5;
    scoreLabel.y = 5;
    gameScene.addChild(scoreLabel);
    increaseScoreBy(0);

    // make wave label
    waveLabel = new PIXI.Text();
    waveLabel.style = gameLabelStyle;
    waveLabel.anchor.set(0.5, 0);
    waveLabel.x = sceneWidth / 2;
    waveLabel.y = 5;
    gameScene.addChild(waveLabel);
    waveLabel.text = `Wave ${waveNum}`;

    // make earth health label
    earthHealthLabel = new PIXI.Text();
    earthHealthLabel.style = gameLabelStyle;
    earthHealthLabel.anchor.set(1, 0);
    earthHealthLabel.x = 945;
    earthHealthLabel.y = 5;
    gameScene.addChild(earthHealthLabel);
    decreaseEarthHealthBy(0);

    // make ship lives label
    shipLivesLabel = new PIXI.Text();
    shipLivesLabel.style = gameLabelStyle;
    shipLivesLabel.anchor.set(1, 0);
    shipLivesLabel.x = 945;
    shipLivesLabel.y = 45;
    gameScene.addChild(shipLivesLabel);
    decreaseEarthHealthBy(0);

    //
    //  set up 'pauseScene'
    //  to do

    //
    //  set up 'upgradesScene'
    //  to do


    //
    // set up 'gameOverScene'
    //

    // game over
    let gameOverText = new PIXI.Text("Game Over!\nYou failed to save the planet :(");
    gameOverText.style = new PIXI.TextStyle({
        fill: 0xFFFFFF,
        fontSize: 64,
        fontFamily: "Futura",
        stroke: 0x5D3FD3,
        strokeThickness: 6,
        align: "center"
    });
    gameOverText.anchor.set(0.5, 0);
    gameOverText.x = sceneWidth / 2;
    gameOverText.y = sceneHeight / 2 - 160;
    gameOverScene.addChild(gameOverText);

    // display final score and wave reached
    gameOverScoreLabel = new PIXI.Text(`Your final score: ${score}\nWave Reached: ${waveNum}`);
    let scoreTextStyle = new PIXI.TextStyle({
        fill: 0xFFFFFF,
        fontSize: 36,
        fontFamily: "Futura",
        fontStyle: "italic",
        stroke: 0x5D3FD3,
        strokeThickness: 6,
        align: "center"
    });
    gameOverScoreLabel.style = scoreTextStyle;
    gameOverScoreLabel.anchor.set(0.5, 0);
    gameOverScoreLabel.x = sceneWidth / 2;
    gameOverScoreLabel.y = sceneHeight / 2;
    gameOverScene.addChild(gameOverScoreLabel);

    // make "play again?" button
    let playAgainButton = new PIXI.Text("Play Again?");
    playAgainButton.style = menuButtonStyle;
    playAgainButton.anchor.set(0.5, 0);
    playAgainButton.x = sceneWidth / 2;
    playAgainButton.y = sceneHeight - 100;
    playAgainButton.interactive = true;
    playAgainButton.buttonMode = true;
    playAgainButton.on("pointerup", startGame);
    playAgainButton.on('pointerover', e => e.target.alpha = 0.7);
    playAgainButton.on('pointerout', e => e.currentTarget.alpha = 1.0);
    gameOverScene.addChild(playAgainButton);
}

// sets everything to proper numbers and starts the game
function startGame() {
    switchScenes(gameScene);
    score = 0;
    earthHealth = 100;
    waveNum = 1;
    shipLives = 3;
    increaseScoreBy(0);
    decreaseEarthHealthBy(0);
    decreaseShipLivesBy(0);
    ship.x = sceneWidth / 2;
    ship.y = sceneHeight / 2;
    earth.x = sceneWidth / 2;
    earth.y = 400;
    app.view.onmousedown = fireBullet; // for the ship for fire bullets
    sendWave();
}

// loops through the game to keep everything moving and being tracked properly
function gameLoop() {
    if (paused) return; // nothing happens if the scene is paused

    // Calculate "delta time"
    let dt = 1 / app.ticker.FPS;
    if (dt > 1 / 12) dt = 1 / 12;

    // Moving the ship
    playerMovement();

    // keep the ship on the screen
    keepShipInBounds();

    // move meteors
    for (let m of meteors) {
        m.move(dt);
    }

    // move bullets
    for (let b of bullets) {
        b.move(dt);
    }


    // check for collisions
    for (let m of meteors) {
        for (let b of bullets) {
            // collision of bullets and meteors
            if (rectsIntersect(m, b)) {
                gameScene.removeChild(m);
                m.isAlive = false;
                gameScene.removeChild(b);
                b.isAlive = false;
                increaseScoreBy(1);
            }

            if (b.y < -10) b.isAlive = false; // removes the bullet when off screen
        }

        // collision of ship and meteors
        if (m.isAlive && rectsIntersect(m, ship)) {
            gameScene.removeChild(m);
            m.isAlive = false;
            decreaseShipLivesBy(1);
        }

        // collision of earth and meteors
        if (m.isAlive && rectsIntersect(m, earth)) {
            gameScene.removeChild(m);
            m.isAlive = false;
            decreaseEarthHealthBy(20);
        }
    }

    // get rid of dead bullets
    bullets = bullets.filter(b => b.isAlive);

    // get ride of dead meteors
    meteors = meteors.filter(m => m.isAlive);

    // check for game over
    if (earthHealth <= 0 || shipLives <= 0) {
        gameOver();
        return; // return here so we skip loading the next wave
    }

    // load next wave
    if (meteors.length == 0) {
        waveNum++;
        sendWave();
    }
}

// method to handle the input for player movement
function playerMovement() {
    // 'w' or up arrow
    if (keys["87"] || keys["38"]) {
        ship.y -= 5;
    }
    // 'a' or left arrow
    if (keys["65"] || keys["37"]) {
        ship.x -= 5;
    }
    // 's' or down arrow
    if (keys["83"] || keys["40"]) {
        ship.y += 5;
    }
    // 'd' or right arrow
    if (keys["68"] || keys["39"]) {
        ship.x += 5;
    }
}

// makes the current scene invisible and the desired scene visible, and sets the desired scene as the current scene
function switchScenes(desiredScene) {
    currentScene.visible = false;
    paused = true;
    desiredScene.visible = true;
    currentScene = desiredScene;
}

// increase score and changes the label's text
function increaseScoreBy(value) {
    score += value;
    scoreLabel.text = `Score ${score}`;
}

// decreases the earth's health and changes the label's text
function decreaseEarthHealthBy(value) {
    earthHealth -= value;
    earthHealth = parseInt(earthHealth);
    earthHealthLabel.text = `Earth Health  ${earthHealth}`;
}

// decreases the number of ships left and changes the label's text
function decreaseShipLivesBy(value) {
    shipLives -= value;
    shipLives = parseInt(shipLives);
    shipLivesLabel.text = `Ships Left  ${shipLives}`;
}

// keeps the ship on screen
function keepShipInBounds() {
    if (ship.x < 0) {
        ship.x = 0;
    }
    if (ship.x > sceneWidth) {
        ship.x = sceneWidth;
    }
    if (ship.y < 0) {
        ship.y = 0;
    }
    if (ship.y > sceneHeight) {
        ship.y = sceneHeight;
    }
}

// creates meteors
function createMeteors(numMeteors) {
    for (let i = 0; i < numMeteors; i++) {
        let m = new Meteor();
        m.x = Math.random() * (sceneWidth - 50) + 25;
        m.y = Math.random() * (-200 * waveNum) - 50;
        meteors.push(m);
        gameScene.addChild(m);
    }
}

// sends waves of increasing amounts of meteors
function sendWave() {
    createMeteors(5 + ((waveNum - 1) * 3));
    paused = false;
    waveLabel.text = `Wave ${waveNum}`;
}

// return to the game from the pause screen
function backToGame() {
    // to do
}

// when the game ends
function gameOver() {
    paused = true;
    // clear out level
    meteors.forEach(m => gameScene.removeChild(m));
    meteors = [];

    bullets.forEach(b => gameScene.removeChild(b));
    bullets = [];

    switchScenes(gameOverScene);

    gameOverScoreLabel.text = `Your final score: ${score}\nWave Reached: ${waveNum}`;
}

// fires projectiles
function fireBullet(e) {
    console.log("bullet fired")
    if (paused) return;

    let b = new Bullet(0xFFFFFF, ship.x, ship.y);
    bullets.push(b);
    gameScene.addChild(b);
}
