// We will use `strict mode`, which helps us by having the browser catch many common JS mistakes
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
"use strict";
const app = new PIXI.Application({
    width: 1000,
    height: 600
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
let gameScene, ship, scoreLabel, lifeLabel;
let upgradeScene;
let gameOverScene, gameOverScoreLabel;

let meteors = [];
let bullets = [];
let score = 0;
let earthHealth = 100;
let waveNum = 1;
let paused = true;