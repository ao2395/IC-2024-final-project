let canvas;
let graphics;
let scrollX;
let scrollY;
let screenAngle = 0; // screen tilt
const playerSpeed = 5;

const gridSize = 39; // map size
const pixelSize = 50;
let grid = [];
let graphicsWidth;
let graphicsHeight;
let offsetX;
let offsetY;

function preload() {

  grid = loadJSON("arena.json"); // json file with pixel data from python program
}

function setup() {
  let hViewPoint = 30 * pixelSize; // how many pixels should be viewed at spawn 
  let vViewPoint = 19 * pixelSize; // horizontally and vertically
  // the player should be able to view 30 pixels horizontally and 19 pixels vertically on most laptops (hopefully)

  // get aspect ratio
  let ratio = hViewPoint / vViewPoint;
  let canvasHeight = windowHeight * 0.98;
  let canvasWidth = canvasHeight * ratio; // create canvas accordingly but allow height to take the whole canvas and get width through ratio
  canvas = createCanvas(canvasWidth, canvasHeight);
  background(0);

  // graphics buffer
  graphicsWidth = 3000;
  graphicsHeight = 3000;
  graphics = createGraphics(graphicsWidth, graphicsHeight);
  graphics.background(0); 

  // offsets for grid to be centered in the buffer
  offsetX = (graphicsWidth - gridSize * pixelSize) / 2;
  offsetY = (graphicsHeight - gridSize * pixelSize) / 2;

  // draw colors in grid
  renderGrid();

  // player's x and y cord, centered horizontally but offset by 5.5pixels from the bottom
  scrollX = offsetX + (gridSize / 2) * pixelSize; 
  scrollY = offsetY + (gridSize - 5.5) * pixelSize; 
}

function draw() {
  
  background(0);

  // movement
  handleMovement();

  push();

  // translate center of canvas
  translate(width / 2, height / 2);
  rotate(-screenAngle); // rotate the world in the opposite direction

  // draw graphics buffer on canvas
  imageMode(CENTER);
  image(graphics,0,0,graphicsWidth,graphicsHeight,scrollX - graphicsWidth / 2,scrollY - graphicsHeight / 2,graphicsWidth,graphicsHeight);

  // draw player
  fill(255);
  noStroke();
  rectMode(CENTER);
  rect(0, 0, 40, 40); // Player rectangle

  pop(); 
  fill(255);
  textSize(16);
  text(`FPS: ${Math.floor(frameRate())}`, 10, 20);
}

// colors 
function renderGrid() {
  for (let y = 0; y < gridSize; y++) { // go through the grid
    for (let x = 0; x < gridSize; x++) {
      let pixel = grid[y][x]; // find each pixel in the JSON grid 
      graphics.fill(pixel.r, pixel.g, pixel.b); // fill using the rgb values
      graphics.rect(offsetX + x * pixelSize,offsetY + y * pixelSize,pixelSize,pixelSize);  // draw the pixel
    }
  }
}

// x movement check
function canMoveToX(newX) {
  // Convert world coordinates to grid indices
  let gridX = Math.floor((newX - offsetX) / pixelSize); // get new X pixel
  let gridY = Math.floor((scrollY - offsetY) / pixelSize); // get current Y pixel

  // check if the new position is off the grid
  if (gridX < 0 || gridY < 0 || gridX >= gridSize || gridY >= gridSize) {
    return false;
  }

  // check if the new position is a black pixel
  let newPixel = grid[gridY][gridX];
  return !(newPixel.r === 0 && newPixel.g === 0 && newPixel.b === 0); 
}

// same as above for Y
function canMoveToY(newY) {
  let gridX = Math.floor((scrollX - offsetX) / pixelSize);
  let gridY = Math.floor((newY - offsetY) / pixelSize);

  if (gridX < 0 || gridY < 0 || gridX >= gridSize || gridY >= gridSize) {
    return false;
  }

  let newPixel = grid[gridY][gridX];
  return !(newPixel.r === 0 && newPixel.g === 0 && newPixel.b === 0); 
}

function handleMovement() {
  if (keyIsDown(81)) {
    // Q 
    screenAngle -= 0.05;
  }
  if (keyIsDown(69)) {
    // E 
    screenAngle += 0.05;
  }

  // movement 
  let xComponent = 0;
  let yComponent = 0;

  if (keyIsDown(87)) {
    // W key adjusted for rotation of screen
    xComponent += sin(screenAngle);
    yComponent -= cos(screenAngle);
  }
  if (keyIsDown(83)) {
    // S key adjusted for rotation of screen
    xComponent -= sin(screenAngle);
    yComponent += cos(screenAngle);
  }
  if (keyIsDown(65)) {
    // A key adjusted for rotation of screen
    xComponent -= cos(screenAngle);
    yComponent -= sin(screenAngle);
  }
  if (keyIsDown(68)) {
    // D key adjusted for rotation of screen
    xComponent += cos(screenAngle);
    yComponent += sin(screenAngle);
  }

  // normalize vector so A and D keys arent faster than W and S
  let magnitude = Math.sqrt(xComponent * xComponent + yComponent * yComponent);
  if (magnitude > 0) {
    xComponent = (xComponent / magnitude) * playerSpeed;
    yComponent = (yComponent / magnitude) * playerSpeed;
  }

  // Z resets screen angle
  if (keyIsDown(90)) {
    screenAngle = 0;
  }

  // check for new X and new Y
  let newX = scrollX + xComponent;
  let newY = scrollY + yComponent;

  if (canMoveToX(newX)) { // move if possible
    scrollX = newX;
  }
  if (canMoveToY(newY)) { // move if possible
    scrollY = newY;
  }

}
