let colorPicker;
let brushSizeSlider;

function setup() {
    createCanvas(windowWidth, windowHeight - 50);
    background(255);

    const toolbar = select('#toolbar');

    colorPicker = createColorPicker('black');
    colorPicker.parent(toolbar);

    createElement('br').parent(toolbar);
    createElement('br').parent(toolbar);

    createSpan('Brush size: ').parent(toolbar);
    brushSizeSlider = createSlider(1, 20, 4);
    brushSizeSlider.parent(toolbar);

    createElement('br').parent(toolbar);
    createElement('br').parent(toolbar);

    const clearButton = createButton('Clear');
    clearButton.mousePressed(clearCanvas);
    clearButton.parent(toolbar);
}

function draw() {
    if (mouseIsPressed) {
        stroke(colorPicker.color());
        strokeWeight(brushSizeSlider.value());
        line(mouseX, mouseY, pmouseX, pmouseY);
    }
}

function clearCanvas() {
    background(255);
}
