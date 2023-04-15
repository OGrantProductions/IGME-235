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
window.addEventListener("keypress", keyPressed);
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

let canvas;
// aliases
let stage;

let currentScene;

// game variables
let ship;
let earth;
let meteors = [];
let brokenMeteors = [];
let brokenMeteorTextures;
let bullets = [];
let explosions = [];
let explosionTextures;
let score = 0;
let earthHealth = 100;
let shipLives = 3;
let waveNum = 1;
let meteorsDestroyed = 0;
let paused = true;

//sounds
let shootSound;
let hitSound;
let blastSound;
let explosionSound;

function keysDown(e) {
    console.log(e.keyCode);
    keys[e.keyCode] = true;
}

function keysUp(e) {
    console.log(e.keyCode);
    keys[e.keyCode] = false;
}

function keyPressed(e) {
    console.log(e.keyCode);
    if (e.keyCode == "112") { // in case 'p' key is pressed
        pauseScene.visible = !pauseScene.visible;
        paused = !paused;
        console.log(paused);
    }
}

// Sets up all of the scenes, labels, and assets needed for the game
function setupGame() {
    stage = app.stage;

    // set up css for the canvas
    canvas = document.querySelector("canvas");
    canvas.style.margin = "auto";
    canvas.style.border = "5px solid white";

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
    setupStartScene();
    setupInstructionsScene();
    setupGameScene();
    setupPauseScene();
    setupUpgradesScene();
    setupGameOverScene();

    // Create ship
    ship = new Ship();
    gameScene.addChild(ship);

    // Create planet
    earth = new Planet();
    gameScene.addChild(earth);

    // Load Sounds
    shootSound = new Howl({
        src: ['sounds/151020__bubaproducer__laser-shot-big-4.wav']
    });

    hitSound = new Howl({
        src: ['sounds/330629__stormwaveaudio__sci-fi-force-field-impact-15.wav']
    });

    blastSound = new Howl({
        src: ['sounds/683179__stevenmaertens__fireball.wav']
    });

    explosionSound = new Howl({
        src: ['sounds/521105__matrixxx__retro_explosion_07.wav']
    });

    // Load sprite sheet
    explosionTextures = loadSpriteSheet();

    brokenMeteorTextures = [new PIXI.Texture.from("images/broken_meteor1.png"),
    new PIXI.Texture.from("images/broken_meteor2.png"),
    new PIXI.Texture.from("images/broken_meteor3.png")]

    // Start update loop
    app.ticker.add(gameLoop);
}

// sets everything to proper numbers and starts the game
function startGame() {
    switchScenes(gameScene);
    score = 0;
    earthHealth = 100;
    waveNum = 1;
    shipLives = 3;
    resetUpgrades();
    increaseScoreBy(0);
    decreaseEarthHealthBy(0);
    decreaseShipLivesBy(0);
    ship.x = sceneWidth / 2;
    ship.y = sceneHeight / 2;
    earth.x = sceneWidth / 2;
    earth.y = 1100;
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

    // keeps ship from going behind the planet
    preventPlanetOverlap();

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
                breakMeteor(m.x, m.y, 64, 64);
                blastSound.play();
            }

            if (b.y < -10) b.isAlive = false; // removes the bullet when off screen
        }

        // collision of ship and meteors
        if (m.isAlive && circlesIntersect(m, ship)) {
            gameScene.removeChild(m);
            m.isAlive = false;
            decreaseShipLivesBy(1);
            hitSound.play();
        }

        // collision of earth and meteors
        if (m.isAlive && circlesIntersect(m, earth)) {
            gameScene.removeChild(m);
            m.isAlive = false;
            decreaseEarthHealthBy(20);
            createExplosion(m.x, m.y, 64, 64);
            explosionSound.play();
        }
    }

    // get rid of dead bullets
    bullets = bullets.filter(b => b.isAlive);

    // get ride of dead meteors
    meteors = meteors.filter(m => m.isAlive);

    // get rid of broken meteors
    brokenMeteors = brokenMeteors.filter(b => b.isAlive);

    // check for game over
    if (earthHealth <= 0 || shipLives <= 0) {
        gameOver();
        return; // return here so we skip loading the next wave
    }

    // load upgrades scene
    if (meteors.length == 0) {
        waveNum++;
        shopPoints++;
        shopPointsLabel.text = `Points to Spend: ${shopPoints}`;
        switchScenes(upgradeScene);
    }
}

// method to handle the input for player movement
function playerMovement() {
    // 'w' or up arrow
    if (keys["87"] || keys["38"]) {
        ship.y -= 5 * movementSpeed;
    }
    // 'a' or left arrow
    if (keys["65"] || keys["37"]) {
        ship.x -= 5 * movementSpeed;
    }
    // 's' or down arrow
    if (keys["83"] || keys["40"]) {
        ship.y += 5 * movementSpeed;
    }
    // 'd' or right arrow
    if (keys["68"] || keys["39"]) {
        ship.x += 5 * movementSpeed;
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

// keeps ship from overlapping the planet
function preventPlanetOverlap() {
    if (circlesIntersect(ship, earth)) {
        // moving left
        if (keys["65"] || keys["37"]) {
            ship.y -= 5 * movementSpeed;
        }
        // moving right
        if (keys["68"] || keys["39"]) {
            ship.y -= 5 * movementSpeed;
        }
        // moving down on the left of the screen
        if ((keys["83"] || keys["40"]) && (ship.x < sceneWidth / 2)) {
            ship.y -= 5 * movementSpeed;
            ship.x -= 5 * movementSpeed;
        }
        // moving down on the right of the screen
        if ((keys["83"] || keys["40"]) && (ship.x > sceneWidth / 2)) {
            ship.y -= 5 * movementSpeed;
            ship.x += 5 * movementSpeed;
        }
        // moving down in the center of the screen
        if ((keys["83"] || keys["40"]) && (ship.x == sceneWidth / 2)) {
            ship.y -= 5 * movementSpeed;
        }
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

// when the game ends
function gameOver() {
    paused = true;
    // clear out level
    meteors.forEach(m => gameScene.removeChild(m));
    meteors = [];

    bullets.forEach(b => gameScene.removeChild(b));
    bullets = [];

    switchScenes(gameOverScene);

    gameOverText.text = `Game Over!\nYou protected the planet\nfrom ${score} meteors!`;
    gameOverScoreLabel.text = `Your final score: ${score}\nWave Reached: ${waveNum}`;
}

// fires projectiles
function fireBullet(e) {
    console.log("bullet fired")
    if (paused) return;

    for (let i = 0; i < fireRate; i++) {
        setTimeout(() => {
            let b = new Bullet(0xFFFFFF, ship.x, ship.y);
            bullets.push(b);
            gameScene.addChild(b);
            shootSound.play();
        }, i * 100); // delays the bullet so that they don't all come out at the same time
    }
}

// animates a shattering meteor
function breakMeteor(x, y, frameWidth, frameHeight) {
    let w2 = frameWidth / 2;
    let h2 = frameHeight / 2;
    let brokenMeteor = new PIXI.AnimatedSprite(brokenMeteorTextures);
    brokenMeteor.x = x - w2; // we want the explosions to appear at the center of the circle
    brokenMeteor.y = y - h2; // ditto
    brokenMeteor.animationSpeed = 1 / 7;
    brokenMeteor.loop = false;
    brokenMeteor.onComplete = e => gameScene.removeChild(brokenMeteor);
    brokenMeteors.push(brokenMeteor);
    gameScene.addChild(brokenMeteor);
    brokenMeteor.play();
}

// used same explosions as circle blast homework
function loadSpriteSheet() {
    // the 16 animation frames in each row are 64x64 pixels
    // we are using the second row
    // http://pixijs.download/release/docs/PIXI.BaseTexture.html
    let spriteSheet = PIXI.BaseTexture.from("images/explosions.png");
    let width = 64;
    let height = 64;
    let numFrames = 16;
    let textures = [];
    for (let i = 0; i < numFrames; i++) {
        // http://pixijs.download/release/docs/PIXI.Texture.html
        let frame = new PIXI.Texture(spriteSheet, new PIXI.Rectangle(i * width, 64, width, height));
        textures.push(frame);
    }
    return textures;
}

function createExplosion(x, y, frameWidth, frameHeight) {
    // http://pixijs.download/release/docs/PIXI.AnimatedSprite.html
    // the animation frames are 64x64 pixels
    let w2 = frameWidth / 2;
    let h2 = frameHeight / 2;
    let expl = new PIXI.AnimatedSprite(explosionTextures);
    expl.x = x - w2; // we want the explosions to appear at the center of the circle
    expl.y = y - h2; // ditto
    expl.animationSpeed = 1 / 7;
    expl.loop = false;
    expl.onComplete = e => gameScene.removeChild(expl);
    explosions.push(expl);
    gameScene.addChild(expl);
    expl.play();
}