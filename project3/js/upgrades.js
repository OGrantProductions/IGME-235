// menu variables
let fireRate; // bullets fired on click
let minfireRate = 0;
const MAX_FIRE_RATE = 4;
let movementSpeed; // player movement speed
let minSpeed = 0;
const MAX_SPEED = 2;
let damage; // will be used when "stronger" enemies are added
let minDamage = 0;
const MAX_DAMAGE = 4;
let shopPoints;

function upgradeFireRate() {
    if ((shopPoints > 0) && (fireRate < MAX_FIRE_RATE)) {
        fireRate++;
        shopPoints--;
        shopPointsLabel.text = `Points to Spend: ${shopPoints}`;
        fireRateLabel.text = `Fire Rate:\n${fireRate}`;
    }
}

function downgradeFireRate() {
    if (minfireRate < fireRate) {
        fireRate--;
        shopPoints++;
        shopPointsLabel.text = `Points to Spend: ${shopPoints}`;
        fireRateLabel.text = `Fire Rate:\n${fireRate}`;
    }
}

function upgradeMovementSpeed() {
    if ((shopPoints > 0) && (movementSpeed < MAX_SPEED)) {
        movementSpeed += 0.25;
        shopPoints--;
        shopPointsLabel.text = `Points to Spend: ${shopPoints}`;
        movementSpeedLabel.text = `Ship Speed:\n${movementSpeed}`;
    }
}

function downgradeMovementSpeed() {
    if (minSpeed < movementSpeed) {
        movementSpeed -= 0.25;
        shopPoints++;
        shopPointsLabel.text = `Points to Spend: ${shopPoints}`;
        movementSpeedLabel.text = `Ship Speed:\n${movementSpeed}`;
    }
}

function upgradeDamage() {
    if ((shopPoints > 0) && (damage < MAX_DAMAGE)) {
        damage++;
        shopPoints--;
        shopPointsLabel.text = `Points to Spend: ${shopPoints}`;
        damageLabel.text = `Damage:\n${damage}`;
    }
}

function downgradeDamage() {
    if (minDamage < damage) {
        damage--;
        shopPoints++;
        shopPointsLabel.text = `Points to Spend: ${shopPoints}`;
        damageLabel.text = `Damage:\n${damage}`;
    }
}

// reset all of the stats from the upgrade menu
function resetUpgrades() {
    fireRate = 1;
    minfireRate = 1;
    movementSpeed = 1;
    minSpeed = 1;
    damage = 1;
    minDamage = 1;
    shopPoints = 0;
    shopPointsLabel.text = `Points to Spend: ${shopPoints}`;
    fireRateLabel.text = `Fire Rate:\n${fireRate}`;
    movementSpeedLabel.text = `Ship Speed:\n${movementSpeed}`;
    damageLabel.text = `Damage:\n${damage}`;
}

// confirm all of the upgrades and goes back to the game
function confirmUpgrades() {
    minfireRate = fireRate;
    minSpeed = movementSpeed;
    minDamage = damage;
    if (fireRate == MAX_FIRE_RATE) {
        fireRateLabel.text = `Fire Rate:\n${fireRate}\nMAXED`;
    }
    if (movementSpeed == MAX_SPEED) {
        movementSpeedLabel.text = `Ship Speed:\n${movementSpeed}\nMAXED`;
    }
    if (damage == MAX_DAMAGE) {
        damageLabel.text = `Damage:\n${damage}\nMAXED`;
    }
    switchScenes(gameScene);
    sendWave();
}