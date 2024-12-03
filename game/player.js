let canvas;
let scrollX;
let scrollY;
let screenAngle = 0; // screen tilt
const playerSpeed = 5;
const gridSize = 39; // map size
const pixelSize = 50;
let grid = [];
let offsetX;
let offsetY;
let oryx3;
let oryx3png;
let currentPhase

// crumples
let crumplesbulletpng;
let crumpleslastWaveTime = 0; 
let crumpleswaveCount = 0; 
let crumplesisPaused = false;
const crumpleswaveDelay = 650; 
const crumplespauseDuration = 1000;
const crumplesmaxWaves = 3; 

//shieldbashes
let shieldbashessidepng;
let shieldbashesstationarypng
let shieldbasheslastWaveTime = 0; 
let shieldbasheswaveCount = 0; 
let shieldbashesisPaused = false;
const shieldbasheswaveDelay = 200; 
const shieldbashespauseDuration = 0;
const shieldbashesmaxWaves = 5; 
function preload() {
  oryx3png = loadImage("../images/oryx/gifs/e4skt31x5yn31.png")
  grid = loadJSON("arena.json"); // json file with pixel data from python program
  crumplesbulletpng=loadImage('../images/oryx/bullets/crumplesbullet.png')
  shieldbashessidepng=loadImage('../images/oryx/bullets/shieldbashesside.png')
  shieldbashesstationarypng=loadImage('../images/oryx/bullets/shieldbashstationary.png')
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
  graphics=createGraphics(graphicsWidth,graphicsHeight)

  // offsets for grid to be centered in the buffer
  offsetX = (graphicsWidth - gridSize * pixelSize) / 2;
  offsetY = (graphicsHeight - gridSize * pixelSize) / 2;

  // draw colors in grid

  // player's x and y cord, centered horizontally but offset by 5.5pixels from the bottom
  scrollX = offsetX + (gridSize / 2) * pixelSize; 
  scrollY = offsetY + (gridSize - 5.5) * pixelSize;
  oryx3=new oryx() 
  renderGrid();
}


function draw() {
  oryx3.display() // display oryx
  if (currentPhase==0){ // temporary phase selection
    callCrumples() // start crumples
    oryx3.chase() // start direct chasing
  }
  if (currentPhase==1){ 
    oryx3.linearchase() // start linear chasing
    callshieldbashes() // start shield bashes
  }

  oryx3.doCrumples() // always running (checking for bullets first)
  oryx3.doshieldbashes()

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
  fill(0,255,0);
  textSize(16);
  text(`FPS: ${Math.floor(frameRate())}`, 10, 20);
  text(`Press 1 for Phase 1: Crumples`, 10, 40);
  text(`Press 2 for Phase 2: ShieldBashes`, 10, 60);
  graphics.background(0)
}

// colors 
function renderGrid() {
  graphics.rectMode(CORNER)
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
    screenAngle -= 0.035;
  }
  if (keyIsDown(69)) {
    // E 
    screenAngle += 0.035;
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


// oryx
class oryx {
    constructor(){
        this.x=1500 // oryx start positio
        this.y=1500
        this.phase=random([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14]) // choose a random phase (not working now)
        this.crumplebullet1x // cords for 3 bullets of crumple
        this.crumplebullet1y
        this.crumplebullet2x
        this.crumplebullet2y
        this.crumplebullet3x
        this.crumplebullet3y
        this.crumplesChaseVector // chase vector for direction of shots
        this.isCrumplesHappening=0 // check if phase is ongoing
        this.crumplesArr=[] // bullet array
        this.shieldbashesbullet1x // same but for shield bashes
        this.shieldbashesbullet1y
        this.shieldbashesbullet2x
        this.shieldbashesbullet2y
        this.shieldbashesbullet3x
        this.shieldbashesbullet3y
        this.shieldbashesChaseVector
        this.isshieldbashesHappening=0
        this.shieldbashesArr=[]
        this.linearchaseticks=0 // linear chase change direction
        this.linearchasethreshold=240
        this.linearchaseVector; // linear chase direction
        this.stationaryticker=0 // stationary shot in shield bashes ticker
        this.stationarythreshold=20
        this.hasStationarybullet=false // checking if that instance of shield bashes has a stationary shot
    }

    display(){
        renderGrid()
        graphics.imageMode(CENTER) // display oryx rotated with the screen 
        graphics.push()
        graphics.translate(this.x,this.y)
        graphics.rotate(screenAngle)
        graphics.image(oryx3png,0,0,gridSize*3,gridSize*3)
        graphics.pop()

    }
    chase(){
      let playerVector=createVector(scrollX, scrollY) // create vector to player and oryx
      let oryxVector=createVector(this.x,this.y)
      let chaseVector = p5.Vector.sub(playerVector, oryxVector); // find direction
      chaseVector.normalize(); // normalize and set magnitude
      chaseVector.setMag(3.5);
      oryxVector.add(chaseVector) // change oryx direction accordingly
      this.x=oryxVector.x // update oryx's position
      this.y=oryxVector.y
    }
    linearchase() {
      // recalculate direction if wall is hit or more than 240 ticks have passed
      if (!this.linearchaseVector || this.linearchasethreshold < this.linearchaseticks || !this.canMoveInDirection(this.linearchaseVector)) {
        let playerVector = createVector(scrollX, scrollY); // player pos
        let oryxVector = createVector(this.x, this.y); // oryx pos
        this.linearchaseVector = p5.Vector.sub(playerVector, oryxVector).normalize(); // get normalized direction vector
    
        this.linearchaseticks = 0; // reset ticker
      }
    
      // move oryx in the correct direction
      this.x += this.linearchaseVector.x * 7;
      this.y += this.linearchaseVector.y * 7;
    
      this.linearchaseticks++; // increment ticks
    }
    canMoveInDirection(vector) {
      if (!vector) return false; // check if vector exists
    
      let newX = this.x + vector.x * pixelSize; // check next tile
      let newY = this.y + vector.y * pixelSize;
    
      // get grid position
      let gridX = Math.floor((newX - offsetX) / pixelSize);
      let gridY = Math.floor((newY - offsetY) / pixelSize);
    
      // check if off the grid (should never happen)
      if (gridX < 0 || gridY < 0 || gridX >= gridSize || gridY >= gridSize) {
        return false;
      }
    
      // check if the new position is a black pixel
      let newPixel = grid[gridY][gridX];
      return !(newPixel.r === 0 && newPixel.g === 0 && newPixel.b === 0);
    }
    
    
    shieldbashes(){ // creates shield bashes shots (some with stationary shots)
      if (this.stationaryticker > this.stationarythreshold){
        this.hasStationarybullet=true;
        this.stationaryticker=0
      }
        this.shieldbashesArr.push(new shieldbashesBullets(this.hasStationarybullet)) // push to bullets array
        this.hasStationarybullet=false
    }
    // the above function is what is actually called which adds bullets to the array, the below function is always called
    // but if the array is empty it skips
    doshieldbashes() {
      if (this.shieldbashesArr.length > 0) { // check if array is empty
        for (let i = this.shieldbashesArr.length - 1; i >= 0; i--) {  // traverse array backwards
          if (this.shieldbashesArr[i].timer > this.shieldbashesArr[i].threshold) {
            this.shieldbashesArr.splice(i, 1); // remove bullet if its expired
          } else {
            this.shieldbashesArr[i].doPhase(); // otherwise call doPhase on the shield bashes bullet class
          }
        }
      }
      this.stationaryticker++; // tick the stationary bullet ticks
    }
    crumples(){ // push to crumple bullets array 
          this.crumplesArr.push(new crumpleBullets())
    }
    doCrumples(){ // same as above
        if (this.crumplesArr.length > 0) {
          for (let i = this.crumplesArr.length - 1; i >= 0; i--) {
            if (this.crumplesArr[i].timer > this.crumplesArr[i].threshold) {
              this.crumplesArr.splice(i, 1); 
            } else {
              this.crumplesArr[i].doPhase(); 
            }
          }
        }
    }
  }
  // class which controls shield bash bullet mechanics
  class shieldbashesBullets {
    constructor(hasStationarybullet) {
      this.timer=0
      this.threshold=600 
      this.shieldbashesbullet1x = oryx3.x; // start positions
      this.shieldbashesbullet1y = oryx3.y;
      this.shieldbashesbullet2x = oryx3.x;
      this.shieldbashesbullet2y = oryx3.y;
  
      // copy oryx's vector in linear chases
      let baseVector = oryx3.linearchaseVector.copy().normalize();
      let baseAngle = baseVector.heading(); // get direction
  
      // get angle for both side way shots
      this.bulletAngle1 = baseAngle + HALF_PI; 
      this.bulletAngle2 = baseAngle - HALF_PI; 
  
      this.bulletSpeed = 8; // side bullet speed
      this.hasStationarybullet = hasStationarybullet; // stationary bullet boolean
      this.stationaryBulletX = oryx3.x; //  stationary bullet boolean
      this.stationaryBulletY = oryx3.y;
    }
  
    doPhase() {
      // side bullets position movement
      this.shieldbashesbullet1x += cos(this.bulletAngle1) * this.bulletSpeed;
      this.shieldbashesbullet1y += sin(this.bulletAngle1) * this.bulletSpeed;
      this.shieldbashesbullet2x += cos(this.bulletAngle2) * this.bulletSpeed;
      this.shieldbashesbullet2y += sin(this.bulletAngle2) * this.bulletSpeed;
  
      // draw side bullets in correct orientation
      graphics.push();
      graphics.translate(this.shieldbashesbullet1x, this.shieldbashesbullet1y);
      graphics.rotate(this.bulletAngle1);
      graphics.image(shieldbashessidepng, 0, 0, 60, 60);
      graphics.pop();
  
      graphics.push();
      graphics.translate(this.shieldbashesbullet2x, this.shieldbashesbullet2y);
      graphics.rotate(this.bulletAngle2);
      graphics.image(shieldbashessidepng, 0, 0, 60, 60);
      graphics.pop();
  
      // draw stationary bullet if exists
      if (this.hasStationarybullet) {
        graphics.push();
        graphics.image(shieldbashesstationarypng, this.stationaryBulletX, this.stationaryBulletY, 50, 50);
        graphics.pop();
      }
      //life time timer
      this.timer++;
    }
  }
  
class crumpleBullets{
  constructor(){
    this.timer=0
    this.threshold=600
    this.crumplebullet1x=oryx3.x // crumple bullet positions
    this.crumplebullet1y=oryx3.y
    this.crumplebullet2x=oryx3.x
    this.crumplebullet2y=oryx3.y
    this.crumplebullet3x=oryx3.x
    this.crumplebullet3y=oryx3.y
    let playerVector=createVector(scrollX, scrollY)
    let oryxVector=createVector(oryx3.x,oryx3.y)
    this.crumplesChaseVector = p5.Vector.sub(playerVector, oryxVector)  // direction of oryx to player
  }
  doPhase(){
    let bulletAngle1 = this.crumplesChaseVector.heading();  // angle for bullets 
        let bulletAngle2 = this.crumplesChaseVector.heading()+PI/12; 
        let bulletAngle3 = this.crumplesChaseVector.heading()-PI/12; 

        let bulletSpeed = 8; // bullet speed
        this.crumplebullet1x += cos(bulletAngle1) * bulletSpeed; // move all bullets accordingly
        this.crumplebullet1y += sin(bulletAngle1) * bulletSpeed;
        this.crumplebullet2x += cos(bulletAngle2) * bulletSpeed;
        this.crumplebullet2y += sin(bulletAngle2) * bulletSpeed;
        this.crumplebullet3x += cos(bulletAngle3) * bulletSpeed;
        this.crumplebullet3y += sin(bulletAngle3) * bulletSpeed;
      
        graphics.push(); // image all bullets in correct orientation
        graphics.translate(this.crumplebullet1x, this.crumplebullet1y);
        graphics.rotate(bulletAngle1);
        graphics.image(crumplesbulletpng, 0, 0, 30, 30);
        graphics.pop();
        graphics.push();
        graphics.translate(this.crumplebullet2x, this.crumplebullet2y);
        graphics.rotate(bulletAngle2);
        graphics.image(crumplesbulletpng, 0, 0, 30, 30);
        graphics.pop();
        graphics.push();
        graphics.translate(this.crumplebullet3x, this.crumplebullet3y);
        graphics.rotate(bulletAngle3);
        graphics.image(crumplesbulletpng, 0, 0, 30, 30);
        graphics.pop();
    
        this.isCrumplesHappening = 1; // set phase happening to true
  }
}

function callCrumples(){
const currentTime = millis();
if (crumplesisPaused) { // check if phase is paused between shooting waves
  if (currentTime - crumpleslastWaveTime > crumplespauseDuration) { // check if it should be unpaused
    crumplesisPaused = false; // end pause
    crumpleswaveCount = 0; // reset wave count
    crumpleslastWaveTime = currentTime; // reset timer
  }
} else {
  // if unpaused
  if (crumpleswaveCount < crumplesmaxWaves && currentTime - crumpleslastWaveTime > crumpleswaveDelay) {
    oryx3.crumples(); // shoot a wave
    crumpleswaveCount++ // increment wave
    crumpleslastWaveTime=currentTime // set last wave shot to current time
  } else if (crumpleswaveCount >= crumplesmaxWaves) {
    // once all waves are shot pause
    crumplesisPaused = true;
    crumpleslastWaveTime = currentTime; // last wave as current time
  }
}
}
// same as above
function callshieldbashes(){
  const currentTime = millis();
  if (shieldbashesisPaused) {
    if (currentTime - shieldbasheslastWaveTime > shieldbashespauseDuration) {
      shieldbashesisPaused = false; 
      shieldbasheswaveCount = 0; 
      shieldbasheslastWaveTime = currentTime; 
    }
  } else {
    if (shieldbasheswaveCount < shieldbashesmaxWaves && currentTime - shieldbasheslastWaveTime > shieldbasheswaveDelay) {
      oryx3.shieldbashes();
      shieldbasheswaveCount++
      shieldbasheslastWaveTime=currentTime
    } else if (shieldbasheswaveCount >= shieldbashesmaxWaves) {
      shieldbashesisPaused = true;
      shieldbasheslastWaveTime = currentTime; 
    }
  }
  }
  // temporary phase switching
function keyPressed(){
  if (key==1){
  currentPhase=0
}
if (key==2){
  currentPhase=1
}
}