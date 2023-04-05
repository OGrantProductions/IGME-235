// We will use `strict mode`, which helps us by having the browser catch many common JS mistakes
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
"use strict";
const app = new PIXI.Application({
    width: 950,
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
let startScene;
let instructionsScene;
let gameScene, ship, earth, scoreLabel, earthHealthLabel, shipHealthLabel;
let pauseScene;
let upgradeScene;
let gameOverScene, gameOverScoreLabel;

let currentScene;

let meteors = [];
let lasers = [];
let score = 0;
let earthHealth = 100;
let shipHealth = 100;
let waveNum = 1;
let paused = true;

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

    // // create all the other scenes
    // createScene(instructionsScene);
    // createScene(gameScene);
    // createScene(pauseScene);
    // createScene(upgradeScene);
    // createScene(gameOverScene);

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
}

// function createScene(scene) {
//     scene = new PIXI.Container();
//     scene.visible = false;
//     scene.name = `${scene}`;
//     stage.addChild(scene);
// }

function createLabelsAndButtons() {
    let menuButtonStyle = new PIXI.TextStyle({
        fill: 0xFFFFFF,
        fontSize: 48,
        fontFamily: "Futura"
    });

    // set up 'startScene'
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

    // make 'back to start button' from instructions
    let instructBack = new PIXI.Text("Back to Start");
    instructBack.style = menuButtonStyle;
    instructBack.x = sceneWidth / 2;
    instructBack.y = sceneHeight - 200;
    instructBack.anchor.set(0.5);
    instructBack.interactive = true;
    instructBack.buttonMode = true;
    instructBack.on("click", () => { switchScenes(startScene) });
    instructBack.on('pointerover', e => e.target.alpha = 0.7);
    instructBack.on('pointerout', e => e.currentTarget.alpha = 1.0);
    instructionsScene.addChild(instructBack);

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

    // game scene
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

    // make life label
    earthHealthLabel = new PIXI.Text();
    earthHealthLabel.style = gameLabelStyle;
    earthHealthLabel.anchor.set(1, 0);
    earthHealthLabel.x = 945;
    earthHealthLabel.y = 5;
    gameScene.addChild(earthHealthLabel);
    decreaseHealthBy(0);
}

function startGame() {
    switchScenes(gameScene);
    score = 0;
    earthHealth = 100;
    waveNum = 1;
    increaseScoreBy(0);
    decreaseHealthBy(0);
    ship.x = sceneWidth/2;
    ship.y = sceneHeight/2;
    earth.x = sceneWidth/2;
    earth.y = 400;
}

function switchScenes(scene) {
    currentScene.visible = false;
    paused = true;
    scene.visible = true;
    currentScene = scene;
}

function increaseScoreBy(value) {
    score += value;
    scoreLabel.text = `Score ${score}`;
}

function decreaseHealthBy(value) {
    earthHealth -= value;
    earthHealth = parseInt(earthHealth);
    earthHealthLabel.text = `Earth Health  ${earthHealth}`;
}

function createMeteors(numMeteors) {

}

function sendWave(){
    createMeteors(waveNum * 5);
    paused = true;
}

function backToGame() {

}

function gameOver() {

}

function fireLaser(e) {

}
