class Ship extends PIXI.Sprite {
    constructor(x = 0, y = 0) {
        super(app.loader.resources["images/spaceship.png"].texture);
        this.anchor.set(.5, .5); // position, scaling, rotating etc are now from center of sprite
        this.scale.set(0.5);
        this.x = x;
        this.y = y;
    }
}

class Planet extends PIXI.Sprite {
    constructor(x = 0, y = 0) {
        super(app.loader.resources["images/earth.png"].texture);
        this.anchor.set(.5, 0);
        this.scale.set(1.4);
        this.x = x;
        this.y = y;
    }
}

class Meteor extends PIXI.Sprite {
    constructor(x = 0, y = 0) {
        super(app.loader.resources["images/meteor.png"].texture);
        this.anchor.set(.5, .5);
        this.scale.set(1);
        this.x = x;
        this.y = y;
    }
}

class Laser extends PIXI.Graphics {
    constructor(color = 0xFFFFFF, x = 0, y = 0) {
        super();
        this.beginFill(color);
        this.drawRect(-2, -3, 4, 6);
        this.endFill();
        this.x = x;
        this.y = y;
        // variables
        this.fwd = { x: 0, y: -1 };
        this.speed = 400;
        this.isAlive = true;
        Object.seal(this);
    }

    move(dt = 1 / 60) {
        this.x += this.fwd.x * this.speed * dt;
        this.y += this.fwd.y * this.speed * dt;
    }
}