// bounding box collision detection - it compares PIXI.Rectangles
function rectsIntersect(a, b) {
    var ab = a.getBounds();
    var bb = b.getBounds();
    return ab.x + ab.width > bb.x && ab.x < bb.x + bb.width && ab.y + ab.height > bb.y && ab.y < bb.y + bb.height;
}

// circle collision
function circlesIntersect(a, b) {
    var radiA = a.width / 2;
    var radiB = b.width / 2;
    var distX = Math.abs(a.x - b.x);
    var distY = Math.abs(a.y - b.y);
    var distance = Math.sqrt(Math.pow(distX, 2) + Math.pow(distY, 2));
    return distance < radiA + radiB;
}