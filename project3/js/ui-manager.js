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
}

//  set up 'pauseScene'
function setupPauseScene() {
    //  to do
}

//  set up 'upgradesScene'
function setupUpgradesScene() {
    //  to do
}

// set up 'gameOverScene'
function setupGameOverScene() {
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