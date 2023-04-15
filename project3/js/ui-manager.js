// scenes and labels
let startScene;
let instructionsScene;
let gameScene, scoreLabel, waveLabel, earthHealthLabel, shipLivesLabel;
let pauseScene;
let upgradeScene, shopPointsLabel, fireRateLabel, movementSpeedLabel, damageLabel;
let gameOverScene, gameOverText, gameOverScoreLabel;

let menuButtonStyle = new PIXI.TextStyle({
    fill: 0xFFFFFF,
    fontSize: 48,
    fontFamily: "Futura"
});

// set up 'startScene'
function setupStartScene() {
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
}

// set up 'instructionsScene'
function setupInstructionsScene() {
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
    let instructions = new PIXI.Text("You are responsible for protecting the planet from an\nincoming meteor shower as long as possible.\nYou control your ship using WASD or the arrow keys.\nFire bullets using the left mouse button.\nTo pause and unpause the game, press the 'p' key.\nLast as long as possible and protect your planet!");
    instructions.style = new PIXI.TextStyle({
        fill: 0x5D3FD3,
        fontSize: 40,
        fontFamily: "Futura",
        stroke: 0xFFFFFF,
        strokeThickness: 5,
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
}

// set up 'gameScene'
function setupGameScene() {
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
}

//  set up 'pauseScene'
function setupPauseScene() {
    // make 'paused' label
    let pausedText = new PIXI.Text("PAUSED");
    pausedText.style = new PIXI.TextStyle({
        fill: 0x5D3FD3,
        fontSize: 120,
        fontFamily: "Futura",
        stroke: 0xFFFFFF,
        strokeThickness: 10
    });
    pausedText.x = sceneWidth / 2;
    pausedText.y = sceneHeight / 2;
    pausedText.anchor.set(0.5);
    pauseScene.addChild(pausedText);
}

//  set up 'upgradesScene'
function setupUpgradesScene() {
    // make upgrades title
    let upgradesTitle = new PIXI.Text("UPGRADES");
    upgradesTitle.style = new PIXI.TextStyle({
        fill: 0x5D3FD3,
        fontSize: 90,
        fontFamily: "Futura",
        stroke: 0xFFFFFF,
        strokeThickness: 10
    });
    upgradesTitle.x = sceneWidth / 2;
    upgradesTitle.y = 75;
    upgradesTitle.anchor.set(0.5);
    upgradeScene.addChild(upgradesTitle);

    shopPointsLabel = new PIXI.Text(`Points to Spend: ${shopPoints}`);
    shopPointsLabel.style = new PIXI.TextStyle({
        fill: 0x5D3FD3,
        fontSize: 50,
        fontFamily: "Futura",
        stroke: 0xFFFFFF,
        strokeThickness: 7
    });
    shopPointsLabel.x = sceneWidth / 2;
    shopPointsLabel.y = 200;
    shopPointsLabel.anchor.set(0.5);
    upgradeScene.addChild(shopPointsLabel);

    // make interactable upgrades
    let upgradeLabelStyle = new PIXI.TextStyle({
        fill: 0x5D3FD3,
        fontSize: 36,
        fontFamily: "Futura",
        stroke: 0xFFFFFF,
        strokeThickness: 4,
        align: "center"
    })

    // make fireRate labels
    fireRate = 1;
    fireRateLabel = new PIXI.Text(`Fire Rate:\n${fireRate}`);
    fireRateLabel.style = upgradeLabelStyle;
    fireRateLabel.x = sceneWidth / 4;
    fireRateLabel.y = sceneHeight / 2;
    fireRateLabel.anchor.set(0.5, 0);
    upgradeScene.addChild(fireRateLabel);

    let fireRateIncreaseButton = new PIXI.Text("+");
    fireRateIncreaseButton.style = menuButtonStyle;
    fireRateIncreaseButton.x = fireRateLabel.x + 50;
    fireRateIncreaseButton.y = fireRateLabel.y + 40;
    fireRateIncreaseButton.anchor.set(0.5, 0);
    fireRateIncreaseButton.interactive = true;
    fireRateIncreaseButton.buttonMode = true;
    fireRateIncreaseButton.on("click", () => { upgradeFireRate() });
    fireRateIncreaseButton.on('pointerover', e => e.target.alpha = 0.7);
    fireRateIncreaseButton.on('pointerout', e => e.currentTarget.alpha = 1.0);
    upgradeScene.addChild(fireRateIncreaseButton);

    let fireRateDecreaseButton = new PIXI.Text("-");
    fireRateDecreaseButton.style = menuButtonStyle;
    fireRateDecreaseButton.x = fireRateLabel.x - 50;
    fireRateDecreaseButton.y = fireRateLabel.y + 40;
    fireRateDecreaseButton.anchor.set(0.5, 0);
    fireRateDecreaseButton.interactive = true;
    fireRateDecreaseButton.buttonMode = true;
    fireRateDecreaseButton.on("click", () => { downgradeFireRate() });
    fireRateDecreaseButton.on('pointerover', e => e.target.alpha = 0.7);
    fireRateDecreaseButton.on('pointerout', e => e.currentTarget.alpha = 1.0);
    upgradeScene.addChild(fireRateDecreaseButton);

    // make movementSpeed labels
    movementSpeed = 1;
    movementSpeedLabel = new PIXI.Text(`Ship Speed:\n${movementSpeed}`);
    movementSpeedLabel.style = upgradeLabelStyle;
    movementSpeedLabel.x = sceneWidth / 2;
    movementSpeedLabel.y = sceneHeight / 2;
    movementSpeedLabel.anchor.set(0.5, 0);
    upgradeScene.addChild(movementSpeedLabel);

    let speedIncreaseButton = new PIXI.Text("+");
    speedIncreaseButton.style = menuButtonStyle;
    speedIncreaseButton.x = movementSpeedLabel.x + 50;
    speedIncreaseButton.y = movementSpeedLabel.y + 40;
    speedIncreaseButton.anchor.set(0.5, 0);
    speedIncreaseButton.interactive = true;
    speedIncreaseButton.buttonMode = true;
    speedIncreaseButton.on("click", () => { upgradeMovementSpeed() });
    speedIncreaseButton.on('pointerover', e => e.target.alpha = 0.7);
    speedIncreaseButton.on('pointerout', e => e.currentTarget.alpha = 1.0);
    upgradeScene.addChild(speedIncreaseButton);

    let speedDecreaseButton = new PIXI.Text("-");
    speedDecreaseButton.style = menuButtonStyle;
    speedDecreaseButton.x = movementSpeedLabel.x - 50;
    speedDecreaseButton.y = movementSpeedLabel.y + 40;
    speedDecreaseButton.anchor.set(0.5, 0);
    speedDecreaseButton.interactive = true;
    speedDecreaseButton.buttonMode = true;
    speedDecreaseButton.on("click", () => { downgradeMovementSpeed() });
    speedDecreaseButton.on('pointerover', e => e.target.alpha = 0.7);
    speedDecreaseButton.on('pointerout', e => e.currentTarget.alpha = 1.0);
    upgradeScene.addChild(speedDecreaseButton);

    // make damage labels
    damage = 1;
    damageLabel = new PIXI.Text(`Damage:\n${damage}`);
    damageLabel.style = upgradeLabelStyle;
    damageLabel.x = sceneWidth - (sceneWidth / 4);
    damageLabel.y = sceneHeight / 2;
    damageLabel.anchor.set(0.5, 0);
    upgradeScene.addChild(damageLabel);

    let damageIncreaseButton = new PIXI.Text("+");
    damageIncreaseButton.style = menuButtonStyle;
    damageIncreaseButton.x = damageLabel.x + 50;
    damageIncreaseButton.y = damageLabel.y + 40;
    damageIncreaseButton.anchor.set(0.5, 0);
    damageIncreaseButton.interactive = true;
    damageIncreaseButton.buttonMode = true;
    damageIncreaseButton.on("click", () => { upgradeDamage() });
    damageIncreaseButton.on('pointerover', e => e.target.alpha = 0.7);
    damageIncreaseButton.on('pointerout', e => e.currentTarget.alpha = 1.0);
    upgradeScene.addChild(damageIncreaseButton);

    let damageDecreaseButton = new PIXI.Text("-");
    damageDecreaseButton.style = menuButtonStyle;
    damageDecreaseButton.x = damageLabel.x - 50;
    damageDecreaseButton.y = damageLabel.y + 40;
    damageDecreaseButton.anchor.set(0.5, 0);
    damageDecreaseButton.interactive = true;
    damageDecreaseButton.buttonMode = true;
    damageDecreaseButton.on("click", () => { downgradeDamage() });
    damageDecreaseButton.on('pointerover', e => e.target.alpha = 0.7);
    damageDecreaseButton.on('pointerout', e => e.currentTarget.alpha = 1.0);
    upgradeScene.addChild(damageDecreaseButton);


    // make 'back to start button' from instructions
    let confirmButton = new PIXI.Text("Next Wave");
    confirmButton.style = menuButtonStyle;
    confirmButton.x = sceneWidth / 2;
    confirmButton.y = sceneHeight - 75;
    confirmButton.anchor.set(0.5);
    confirmButton.interactive = true;
    confirmButton.buttonMode = true;
    confirmButton.on("click", () => { confirmUpgrades() });
    confirmButton.on('pointerover', e => e.target.alpha = 0.7);
    confirmButton.on('pointerout', e => e.currentTarget.alpha = 1.0);
    upgradeScene.addChild(confirmButton);
}

// set up 'gameOverScene'
function setupGameOverScene() {
    // game over
    gameOverText = new PIXI.Text(`Game Over!\nYou protected the planet\nfrom ${score} meteors!`);
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
    gameOverText.y = sceneHeight / 2 - 250;
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
    gameOverScoreLabel.y = sceneHeight / 2 + 50;
    gameOverScene.addChild(gameOverScoreLabel);

    // make "play again?" button
    let playAgainButton = new PIXI.Text("Play Again?");
    playAgainButton.style = menuButtonStyle;
    playAgainButton.anchor.set(0.5, 0);
    playAgainButton.x = sceneWidth / 2;
    playAgainButton.y = sceneHeight / 2 + 200;
    playAgainButton.interactive = true;
    playAgainButton.buttonMode = true;
    playAgainButton.on("pointerup", startGame);
    playAgainButton.on('pointerover', e => e.target.alpha = 0.7);
    playAgainButton.on('pointerout', e => e.currentTarget.alpha = 1.0);
    gameOverScene.addChild(playAgainButton);
}