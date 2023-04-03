// We will use `strict mode`, which helps us by having the browser catch many common JS mistakes
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
"use strict";
const app = new PIXI.Application({
    width: 1000,
    height: 1000
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
        "images/spaceship.png"
    ]);
app.loader.onProgress.add(e => { console.log(`progress=${e.progress}`) });
app.loader.onComplete.add(setup);
app.loader.load();

// aliases
let stage;

// game variables
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

    createLabelsAndButtons();
}

function createLabelsAndButtons(){
    let buttonStyle = new PIXI.TextStyle({
        fill: 0xFF0000,
        fontSize: 48,
        fontFamily: "Futura"
    });

    // 1 - set up 'startScene'
    // 1A - make top start label
    let startLabel1 = new PIXI.Text("Circle Blast!");
    startLabel1.style = new PIXI.TextStyle({
        fill: 0xFFFFFF,
        fontSize: 96,
        fontFamily: "Futura",
        stroke: 0xFF0000,
        strokeThickness: 6
    });
    startLabel1.x = 50;
    startLabel1.y = 120;
    startScene.addChild(startLabel1);

    // 1B - make middle start label
    let startLabel2 = new PIXI.Text("R U Worthy..?");
    startLabel2.style = new PIXI.TextStyle({
        fill: 0xFFFFFF,
        fontSize: 32,
        fontFamily: "Futura",
        fontStyle: "italic",
        stroke: 0xFF0000,
        strokeThickness: 6
    });
    startLabel2.x = 185;
    startLabel2.y = 300;
    startScene.addChild(startLabel2);

    // 1C - make start game button
    let startButton = new PIXI.Text("Enter, ... if you dare!");
    startButton.style = buttonStyle;
    startButton.x = 80;
    startButton.y = sceneHeight - 100;
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

}

function backToGame(){

}

function gameOver(){

}

function fireLaser(e){

}
