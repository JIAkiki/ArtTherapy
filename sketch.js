let currentColor = 'black';
let currentSize = 4;

function setup() {
    createCanvas(windowWidth, windowHeight - 50);
    background(255);
}

function draw() {
    if (mouseIsPressed) {
        stroke(currentColor);
        strokeWeight(currentSize);
        line(mouseX, mouseY, pmouseX, pmouseY);
    }
}

function changeColor(color) {
    currentColor = color;
}

function changeSize(size) {
    currentSize = size;
}

function clearCanvas() {
    background(255);
}
