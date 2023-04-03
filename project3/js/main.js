// We will use `strict mode`, which helps us by having the browser catch many common JS mistakes
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
"use strict";
const app = new PIXI.Application({
    width: 1000,
    height: 600,
    backgroundImage: "images/spaceBackground.jpg"
});
document.body.appendChild(app.view);

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
let background;
let startScene;
let instructionsScene;
let gameScene, ship, planet, scoreLabel, earthHealthLabel, shipHealthLabel;
let pauseScene;
let upgradeScene;
let gameOverScene, gameOverScoreLabel;

let meteors = [];
let lasers = [];
let score = 0;
let earthHealth = 100;
let shipHealth = 100;
let waveNum = 1;
let paused = true;

function setupGame(){
    stage = app.stage;
    // create the `start` scene
    startScene = new PIXI.Container();
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

    background = new BackgroundImage();
    startScene.addChild(background);
    instructionsScene.addChild(background);
    gameScene.addChild(background);
    upgradeScene.addChild(background);
    gameOverScene.addChild(background);

    createLabelsAndButtons();
}

function createLabelsAndButtons(){
    let buttonStyle = new PIXI.TextStyle({
        fill: 0xFF0000,
        fontSize: 48,
        fontFamily: "Futura"
    });

    // set up 'startScene'
    // make title
    let title = new PIXI.Text("Protect the Planet");
    title.style = new PIXI.TextStyle({
        fill: 0xFFFFFF,
        fontSize: 120,
        fontFamily: "Futura",
        stroke: 0xFF0000,
        strokeThickness: 6
    });
    title.x = sceneWidth/2;
    title.y = 200;
    title.anchor.set(0.5);
    startScene.addChild(title);

    // make instructions button
    let instructionsButton = new PIXI.Text("How to Play");
    instructionsButton.style = buttonStyle;
    instructionsButton.x = sceneWidth/2;
    instructionsButton.y = sceneHeight - 200;
    instructionsButton.anchor.set(0.5);
    instructionsButton.interactive = true;
    instructionsButton.buttonMode = true;
    instructionsButton.on("pointerup", moveToInstructions); // startGame is a function reference
    instructionsButton.on('pointerover', e => e.target.alpha = 0.7); // concise arrow function with no brackets
    instructionsButton.on('pointerout', e => e.currentTarget.alpha = 1.0); // ditto
    startScene.addChild(instructionsButton);

    // make start game button
    let startButton = new PIXI.Text("Start Game");
    startButton.style = buttonStyle;
    startButton.x = sceneWidth/2;
    startButton.y = sceneHeight - 100;
    startButton.anchor.set(0.5);
    startButton.interactive = true;
    startButton.buttonMode = true;
    startButton.on("pointerup", startGame); // startGame is a function reference
    startButton.on('pointerover', e => e.target.alpha = 0.7); // concise arrow function with no brackets
    startButton.on('pointerout', e => e.currentTarget.alpha = 1.0); // ditto
    startScene.addChild(startButton);
}

function startGame(){

}

function increaseScoreBy(value) {
    score += value;
    scoreLabel.text = `Score ${score}`;
}

function decreaseHealthBy(value) {
    earthHealth -= value;
    earthHealth = parseInt(earthHealth);
}

function createMeteors(){

}

function moveToUpgrades(){
    paused = true;
    upgradeScene.visible = true;
    
}

function moveToInstructions(){
    paused = true;
    instructionsScene.visible = true;
}

function backToGame(){

}

function gameOver(){

}

function fireLaser(e){

}
