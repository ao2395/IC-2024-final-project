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
let playerHP=900;
let OryxHP=220000;
let healthBarpng;
let oryxbarpng;
let wizardpng;
let wizardinvertedpng
let wizardOffset=0;
let horizontalwalkindex=0
let horizontalwalkshootindex=0
let verticalwalkindex=0
let verticalwalkshootindex=0
let bulletpng
let bulletarr=[]
let autofire=-1;
let currentPhase=-1
let chasepng=[]
let chaseindex=0
let linearchasepng=[]
let linearchaseindex=0
let meltschase=[]
let meltschaseindex=0
let panicchase=[]
let panichchaseindex=0
let cowardicepng=[]
let cowardiceindex=0
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

let bombartifact;
let bombartifactaoe;
let cowardicebulletpng=[]
let graphics;
let graphicsWidth=3000;
let graphicsHeight=3000;

function preload() {
  oryx3png = loadImage("../images/oryx/gifs/oryxskins.png")
  grid = loadJSON("arena.json"); // json file with pixel data from python program
  crumplesbulletpng=loadImage('../images/oryx/bullets/crumplesbullet.png')
  shieldbashessidepng=loadImage('../images/oryx/bullets/shieldbashesside.png')
  shieldbashesstationarypng=loadImage('../images/oryx/bullets/shieldbashstationary.png')
  chasepng[0]=loadImage("../images/oryx/gifs/chase_animation/frame_0_delay-0.2s.png")
  chasepng[1]=loadImage("../images/oryx/gifs/chase_animation/frame_1_delay-0.2s.png")
  chasepng[2]=loadImage("../images/oryx/gifs/chase_animation/frame_2_delay-0.2s.png")
  chasepng[3]=loadImage("../images/oryx/gifs/chase_animation/frame_3_delay-0.2s.png")
  chasepng[4]=loadImage("../images/oryx/gifs/chase_animation/frame_4_delay-0.2s.png")
  linearchasepng[0]=loadImage("../images/oryx/gifs/linear_chase_animation/frame_0_delay-0.2s.png")
  linearchasepng[1]=loadImage("../images/oryx/gifs/linear_chase_animation/frame_1_delay-0.2s.png")
  linearchasepng[2]=loadImage("../images/oryx/gifs/linear_chase_animation/frame_2_delay-0.2s.png")
  meltschase[0]=loadImage("../images/oryx/gifs/melts_animation/frame_0_delay-0.2s.png")
  meltschase[1]=loadImage("../images/oryx/gifs/melts_animation/frame_1_delay-0.2s.png")
  meltschase[2]=loadImage("../images/oryx/gifs/melts_animation/frame_2_delay-0.2s.png")
  panicchase[0]=loadImage("../images/oryx/gifs/panic_animation/frame_0_delay-0.2s.png")
  panicchase[1]=loadImage("../images/oryx/gifs/panic_animation/frame_1_delay-0.2s.png")
  panicchase[2]=loadImage("../images/oryx/gifs/panic_animation/frame_2_delay-0.2s.png")
  for (let i=0;i<10;i++){
    cowardicepng[i]=loadImage(`../images/oryx/gifs/cowardice_animation/frame_0${i}_delay-0.2s.png`)
  }
  for (let i=10;i<17;i++){
    cowardicepng[i]=loadImage(`../images/oryx/gifs/cowardice_animation/frame_${i}_delay-0.2s.png`)
  }
  cowardicebulletpng[0]=loadImage("../images/oryx/bullets/cowardice1.png")
  cowardicebulletpng[1]=loadImage("../images/oryx/bullets/cowardice2.png")
  meltsbulletpng=loadImage("../images/oryx/bullets/melts.png")
  wizardpng=loadImage("../images/player/wizardsprite.png")
  wizardinvertedpng=loadImage("../images/player/wizardspriteinverted.png")
  bulletpng=loadImage("../images/player/bullet.png")
  healthBarpng=loadImage("../images/player/healthbar.png")
  oryxbarpng=loadImage("../images/oryx/oryxhp.png")
  bombartifact=loadImage("../images/oryx/bullets/bombartifact.png")
  bombartifactaoe=loadImage("../images/oryx/bullets/bombartifactaoe.png")}

function setup() {
  let hViewPoint = 30 * pixelSize; 
  let vViewPoint = 19 * pixelSize;

  // Aspect ratio
  let ratio = hViewPoint / vViewPoint;
  let canvasHeight = windowHeight * 0.98;
  let canvasWidth = canvasHeight * ratio; 
  canvas = createCanvas(canvasWidth, canvasHeight);
  background(0);

  // Define graphics dimensions as full grid size
  graphics = createGraphics(graphicsWidth, graphicsHeight);

  offsetX = (graphicsWidth - gridSize * pixelSize) / 2;
  offsetY = (graphicsHeight - gridSize * pixelSize) / 2;

  scrollX = offsetX + (gridSize / 2) * pixelSize; 
  scrollY = offsetY + (gridSize - 5.5) * pixelSize;
  oryx3 = new oryx(); 
}

function draw() {
  // Clear the graphics layer first
  graphics.background(0);
  // Draw the grid on the graphics buffer
  renderGrid();

  // Display Oryx

  // Handle phases
  if (currentPhase == 0){ 
    callCrumples() 
    oryx3.chase()
  }
  if (currentPhase == 1){ 
    oryx3.linearchase() 
    callshieldbashes() 
  }
  if (currentPhase == 2){ 
    oryx3.meltschase()
  }
  if (currentPhase == 3){ 
    oryx3.panicchase()
  }
  if (currentPhase == 4){ 
    oryx3.cowardice()
  }
  if (currentPhase == 5){ 
    oryx3.inner()
  }
  // Update bullets
  oryx3.doCrumples() 
  oryx3.doshieldbashes()
  oryx3.doMelts()
  oryx3.doPanic()
  oryx3.doCowardice()

  // Player movement
  handleMovement();
  oryx3.display();
  if ((mouseIsPressed==true || autofire==1) && frameCount % 10 == 0 ){
    bulletarr.push(new bullets)
  }
  for (let i = bulletarr.length-1;i >=0;i--){
    bulletarr[i].display()
    if (bulletarr[i].lifetime > 600){
      bulletarr.splice(i,1)
    }
    else if (dist(bulletarr[i].x,bulletarr[i].y,oryx3.x,oryx3.y)<50){
      OryxHP-=200;
      bulletarr.splice(i,1)
    }
  }
  graphicsBufferdisplay()
  playerHealthBar()
  oryxHealthBar()

  let dir = createVector(mouseX - width/2, mouseY - height/2);
  let angleDegrees = degrees(dir.heading());
  if (angleDegrees >= 45 && angleDegrees < 135) {
    if (verticalwalkindex > 2){
      verticalwalkindex=0
    }
    if ((mouseIsPressed==true || autofire==1) && (keyIsDown(87) || keyIsDown(83) || keyIsDown(65) || keyIsDown(68))){
      if (verticalwalkshootindex > 4){
        verticalwalkshootindex=0
      }
      if (verticalwalkshootindex==0 )
        image(wizardpng,0,0, gridSize*1.3,gridSize*1.3,210,67,72, 65);
        if (verticalwalkshootindex==1)
          image(wizardpng,6,0, gridSize*1.3,gridSize*1.3,205+78,67,74,65);
        if (verticalwalkshootindex==2)
          image(wizardpng,0,0, gridSize*1.3,gridSize*1.3,0,67,72,65);
          if (verticalwalkshootindex==3)
            image(wizardpng,0,0, gridSize*1.3,gridSize*1.3,72,67,66,65);
          if (verticalwalkshootindex==4)
            image(wizardpng,0,0, gridSize*1.3,gridSize*1.3,138,67,70,65);
          if (frameCount % 8==0){
            verticalwalkshootindex++
          }
    }
    else if ((mouseIsPressed==true || autofire==1)){
      if (verticalwalkindex==0 || verticalwalkindex==2)
        image(wizardpng,0,0, gridSize*1.3,gridSize*1.3,210,67,72,65);
        if (verticalwalkindex==1)
          image(wizardpng,6,0, gridSize*1.3,gridSize*1.3,205+78,67,74,65);
        if (frameCount % 12==0){
          verticalwalkindex++
        }
    }
    else if (keyIsDown(87) || keyIsDown(83) || keyIsDown(65) || keyIsDown(68)){
      if (verticalwalkindex==0)
      image(wizardpng,0,0, gridSize*1.3,gridSize*1.3,0,67,72,65);
      if (verticalwalkindex==1)
        image(wizardpng,0,0, gridSize*1.3,gridSize*1.3,72,67,66,65);
      if (verticalwalkindex==2)
        image(wizardpng,0,0, gridSize*1.3,gridSize*1.3,138,67,70,65);
      if (frameCount % 12==0){
        verticalwalkindex++
      }
    }
    else if (!mouseIsPressed || !keyIsDown(87) || !keyIsDown(83) || !keyIsDown(65) || !keyIsDown(68)){
    image(wizardpng,0,0, gridSize*1.3,gridSize*1.3,0,67,72,65);
    }
  } else if (angleDegrees >= -45 && angleDegrees < 45) {
    if (horizontalwalkindex > 1){
      horizontalwalkindex=0
    }
    if ((mouseIsPressed==true || autofire==1) && (keyIsDown(87) || keyIsDown(83) || keyIsDown(65) || keyIsDown(68))){
      if (horizontalwalkshootindex > 3){
        horizontalwalkshootindex=0
      }
      if (horizontalwalkshootindex==0)
        image(wizardpng,0,0, gridSize*1.55,gridSize*1.3,200,0,82,67);
        if (horizontalwalkshootindex==1)
          image(wizardpng,14,0, gridSize*1.65,gridSize*1.3,220+62,0,90,67);
    if (horizontalwalkshootindex==2)
      image(wizardpng,0,0, gridSize*1.3,gridSize*1.3,0,0,72,67);
      if (horizontalwalkshootindex==3)
        image(wizardpng,0,0, gridSize*1.3,gridSize*1.3,72,0,64,67);
      if (frameCount % 8==0){
        horizontalwalkshootindex++
      }
    }
    else if ((mouseIsPressed==true || autofire==1)){
      if (horizontalwalkindex==0)
        image(wizardpng,0,0, gridSize*1.55,gridSize*1.3,200,0,82,67);
        if (horizontalwalkindex==1)
          image(wizardpng,14,0, gridSize*1.65,gridSize*1.3,220+62,0,90,67);
        if (frameCount % 12==0){
          horizontalwalkindex++
        }
    }
    else if (keyIsDown(87) || keyIsDown(83) || keyIsDown(65) || keyIsDown(68)){
      if (horizontalwalkindex==0)
      image(wizardpng,0,0, gridSize*1.3,gridSize*1.3,0,0,72,67);
      if (horizontalwalkindex==1)
        image(wizardpng,0,0, gridSize*1.3,gridSize*1.3,72,0,64,67);
      if (frameCount % 12==0){
        horizontalwalkindex++
      }

    }
    else if (!mouseIsPressed || !keyIsDown(87) || !keyIsDown(83) || !keyIsDown(65) || !keyIsDown(68)){
    image(wizardpng,0,0, gridSize*1.3,gridSize*1.3,0,0,72,67);
    }
  } else if (angleDegrees >= -135 && angleDegrees < -45) {
    if (verticalwalkindex > 2){
      verticalwalkindex=0
    }
    if ((mouseIsPressed==true || autofire==1) && (keyIsDown(87) || keyIsDown(83) || keyIsDown(65) || keyIsDown(68))){
      if (verticalwalkshootindex > 4){
        verticalwalkshootindex=0
      }
      if (verticalwalkshootindex==0)
        image(wizardpng,0,0, gridSize*1.3,gridSize*1.3,210,67*2,74,67);
        if (verticalwalkshootindex==1)
          image(wizardpng,6,0, gridSize*1.3,gridSize*1.3,205+78,67*2,74,67);
        if (verticalwalkshootindex==2)
          image(wizardpng,0,0, gridSize*1.3,gridSize*1.3,0,67*2,72,67);
          if (verticalwalkshootindex==3)
            image(wizardpng,0,0, gridSize*1.3,gridSize*1.3,72,67*2,64,67);
          if (verticalwalkshootindex==4)
            image(wizardpng,0,0, gridSize*1.3,gridSize*1.3,138,67*2,68,67);
          if (frameCount % 8==0){
            verticalwalkshootindex++
          }
    }
    else if (mouseIsPressed==true || autofire==1){
      if (verticalwalkindex==0 || verticalwalkindex==2)
        image(wizardpng,0,0, gridSize*1.3,gridSize*1.3,210,67*2,74,67);
        if (verticalwalkindex==1)
          image(wizardpng,6,0, gridSize*1.3,gridSize*1.3,205+78,67*2,74,67);
        if (frameCount % 12==0){
          verticalwalkindex++
        }
    }
    else if (keyIsDown(87) || keyIsDown(83) || keyIsDown(65) || keyIsDown(68)){
      if (verticalwalkindex==0)
      image(wizardpng,0,0, gridSize*1.3,gridSize*1.3,0,67*2,72,67);
      if (verticalwalkindex==1)
        image(wizardpng,0,0, gridSize*1.3,gridSize*1.3,72,67*2,64,67);
      if (verticalwalkindex==2)
        image(wizardpng,0,0, gridSize*1.3,gridSize*1.3,138,67*2,68,67);
      if (frameCount % 8==0){
        verticalwalkindex++
      }

    }
    else if (!mouseIsPressed || !keyIsDown(87) || !keyIsDown(83) || !keyIsDown(65) || !keyIsDown(68)){
    image(wizardpng,0,0, gridSize*1.3,gridSize*1.3,0,67*2,72,67);
    }
  } else {
    if (horizontalwalkindex > 1){
      horizontalwalkindex=0
    }
    if ((mouseIsPressed==true || autofire==1) && (keyIsDown(87) || keyIsDown(83) || keyIsDown(65) || keyIsDown(68))){
      if (horizontalwalkshootindex > 3){
        horizontalwalkshootindex=0
      }
      if (horizontalwalkshootindex==0)
        image(wizardinvertedpng,0,0, gridSize*1.5,gridSize*1.3,92,0,82,67);
        if (horizontalwalkshootindex==1)
          image(wizardinvertedpng,-16,0, gridSize*1.65,gridSize*1.3,0,0,90,67);
        if (horizontalwalkshootindex==2)
          image(wizardinvertedpng,-3,0, gridSize*1.15,gridSize*1.3,305,0,65,67);
          if (horizontalwalkshootindex==3)
            image(wizardinvertedpng,-3,0, gridSize*1.15,gridSize*1.3,237,0,65,67);
          if (frameCount % 12==0){
            horizontalwalkshootindex++
          }
    }
    else if (mouseIsPressed==true || autofire==1){
      if (horizontalwalkindex==0)
        image(wizardinvertedpng,0,0, gridSize*1.5,gridSize*1.3,92,0,82,67);
        if (horizontalwalkindex==1)
          image(wizardinvertedpng,-16,0, gridSize*1.65,gridSize*1.3,0,0,90,67);
        if (frameCount % 12==0){
          horizontalwalkindex++
        }
    }
    else if (keyIsDown(87) || keyIsDown(83) || keyIsDown(65) || keyIsDown(68)){
      if (horizontalwalkindex==0)
      image(wizardinvertedpng,-3,0, gridSize*1.15,gridSize*1.3,305,0,65,67);
      if (horizontalwalkindex==1)
        image(wizardinvertedpng,-3,0, gridSize*1.15,gridSize*1.3,237,0,65,67);
      if (frameCount % 12==0){
        horizontalwalkindex++
      }
    }
    else if (!mouseIsPressed || !keyIsDown(87) || !keyIsDown(83) || !keyIsDown(65) || !keyIsDown(68)){
    image(wizardinvertedpng,0,0, gridSize*1.3,gridSize*1.3,305,0,74,67);
    }
  }
  pop(); 
  pop()

  // Debug text
  // fill(0,255,0);
  // textSize(16);
  // text(`FPS: ${Math.floor(frameRate())}`, 10, 20);
  // text(`Press 1 for Phase 1: Crumples`, 10, 40);
  // text(`Press 2 for Phase 2: ShieldBashes`, 10, 60);
}

// colors 
function renderGrid() {
  graphics.rectMode(CORNER)
  for (let y = 0; y < gridSize; y++) { 
    for (let x = 0; x < gridSize; x++) {
      let pixel = grid[y][x]; 
      graphics.fill(pixel.r, pixel.g, pixel.b); 
      graphics.rect(offsetX + x * pixelSize,offsetY + y * pixelSize,pixelSize,pixelSize);  
    }
  }
}

// Movement collision checks
function canMoveToX(newX) {
  let gridX = Math.floor((newX - offsetX) / pixelSize); 
  let gridY = Math.floor((scrollY - offsetY) / pixelSize);

  if (gridX < 0 || gridY < 0 || gridX >= gridSize || gridY >= gridSize) {
    return false;
  }

  let newPixel = grid[gridY][gridX];
  return !(newPixel.r === 0 && newPixel.g === 0 && newPixel.b === 0); 
}

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
    screenAngle -= 0.035;
  }
  if (keyIsDown(69)) {
    screenAngle += 0.035;
  }

  let xComponent = 0;
  let yComponent = 0;

  if (keyIsDown(87)) {
    xComponent += sin(screenAngle);
    yComponent -= cos(screenAngle);
  }
  if (keyIsDown(83)) {
    xComponent -= sin(screenAngle);
    yComponent += cos(screenAngle);
  }
  if (keyIsDown(65)) {
    xComponent -= cos(screenAngle);
    yComponent -= sin(screenAngle);
  }
  if (keyIsDown(68)) {
    xComponent += cos(screenAngle);
    yComponent += sin(screenAngle);
  }

  let magnitude = Math.sqrt(xComponent * xComponent + yComponent * yComponent);
  if (magnitude > 0) {
    xComponent = (xComponent / magnitude) * playerSpeed;
    yComponent = (yComponent / magnitude) * playerSpeed;
  }

  if (keyIsDown(90)) {
    screenAngle = 0;
  }

  let newX = scrollX + xComponent;
  let newY = scrollY + yComponent;

  if (canMoveToX(newX)) {
    scrollX = newX;
  }
  if (canMoveToY(newY)) {
    scrollY = newY;
  }
}

class oryx {
  constructor(){
    this.x=1500 
    this.y=1500
    this.phase=random([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14])
    this.crumplesArr=[] 
    this.shieldbashesArr=[]
    this.linearchaseticks=0 
    this.linearchasethreshold=240
    this.linearchaseVector; 
    this.stationaryticker=0 
    this.stationarythreshold=20
    this.hasStationarybullet=false
    this.meltschaseVector;
    this.meltschaseticks = 0;
    this.meltschasethreshold = 120; 
    this.meltscooldown = 0;      
    this.meltsIsShooting = false;     
    this.meltsArr = [];  
    this.meltswaveCount = 0;  
    this.meltswaveDelay = 60; 
    this.panicchaseVector;
    this.panicchaseticks = 0;
    this.panicchasethreshold = 90; 
    this.paniccooldown = 0;      
    this.panicIsShooting = false;     
    this.panicArr = [];  
    this.panicwaveCount = 0;  
    this.panicwaveDelay = 45; 
    this.cowardicechaseVector;
    this.cowardicechaseticks = 0;
    this.cowardicecooldown = 0;      
    this.cowardiceIsShooting = false;     
    this.cowardiceArr = [];  
    this.cowardicewaveCount = 0;  
    this.cowardicewaveDelay = 20; 
    this.circleRadius = 350; 
    this.circleAngle = 0;    
    this.circleSpeed = 0.012;
    this.centerX=1500
    this.centerY=1500
    this.radiusflag=false
  }

  display(){
    graphics.imageMode(CENTER)
    graphics.push()
    graphics.translate(this.x,this.y)
    if (currentPhase==-1){
      graphics.rotate(screenAngle)
    graphics.image(oryx3png,0,0,gridSize*3,gridSize*3,0,0,174,174)
  }
  else if (currentPhase==0){
    graphics.rotate(screenAngle)
    graphics.image(chasepng[chaseindex],0,0,gridSize*3,gridSize*3,0,0,222,222)
    if (frameCount % 10 ==0){
      chaseindex++
    }
    if (chaseindex > 4){
      chaseindex=0;
    }
  }
  else if (currentPhase==1){
    graphics.rotate(screenAngle)
    graphics.image(linearchasepng[linearchaseindex],0,0,gridSize*3,gridSize*3,444,0,222,222)
    if (frameCount % 10 ==0){
      linearchaseindex++
    }
    if (linearchaseindex > 2){
      linearchaseindex=0;
    }
  }
  else if (currentPhase==2){
      graphics.rotate(screenAngle)
      graphics.image(meltschase[meltschaseindex],0,0,gridSize*3,gridSize*3,222,0,222,444)
      if (frameCount % 10 == 0){
        meltschaseindex++
      }
      if (meltschaseindex > 2){
        meltschaseindex=0;
      }
    }
    else if (currentPhase==3){
      graphics.rotate(screenAngle)
      graphics.image(panicchase[panichchaseindex],0,0,gridSize*3,gridSize*3,0,0,222,444)
      if (frameCount % 10 == 0){
        panichchaseindex++
      }
      if (panichchaseindex > 1){
        panichchaseindex=0;
      }
    }
    else if (currentPhase==4 || currentPhase==5){
      graphics.rotate(screenAngle)
      graphics.image(cowardicepng[cowardiceindex],0,0,gridSize*3,gridSize*3,0,0,222,444)
      if (frameCount % 10 == 0){
        cowardiceindex++
      }
      if (cowardiceindex > 16){
        cowardiceindex=5;
      }
    }
    if (currentPhase!=5){
      this.circleAngle = 0;  
      this.radiusflag=false;
    }
    if (currentPhase!=4 && currentPhase!=5){
      cowardiceindex=0;
      this.cowardicechaseticks=0;
      this.cowardiceIsShooting=false;
    }
    graphics.pop()
  }
  chase(){
    let playerVector=createVector(scrollX, scrollY)
    let oryxVector=createVector(this.x,this.y)
    let chaseVector = p5.Vector.sub(playerVector, oryxVector); 
    chaseVector.normalize(); 
    chaseVector.setMag(3.5);
    oryxVector.add(chaseVector) 
    this.x=oryxVector.x 
    this.y=oryxVector.y
  }

  linearchase() {
    if (!this.linearchaseVector || this.linearchasethreshold < this.linearchaseticks || !this.canMoveInDirection(this.linearchaseVector)) {
      let playerVector = createVector(scrollX, scrollY); 
      let oryxVector = createVector(this.x, this.y); 
      this.linearchaseVector = p5.Vector.sub(playerVector, oryxVector).normalize(); 
      this.linearchaseticks = 0; 
    }

    this.x += this.linearchaseVector.x * 6;
    this.y += this.linearchaseVector.y * 6;
    this.linearchaseticks++; 
  }
  meltschase() {
    if (!this.meltsIsShooting) {
      // Chase the player linearly
      if (!this.meltschaseVector || this.meltschaseticks >= this.meltschasethreshold) {
        let playerVector = createVector(scrollX, scrollY);
        let oryxVector = createVector(this.x, this.y);
        this.meltschaseVector = p5.Vector.sub(playerVector, oryxVector).normalize();
        this.meltschaseticks = 0;
      }
      if (!this.canMoveInDirection(this.meltschaseVector)){
        this.meltschaseVector=createVector(0,0)
      }
      // Move towards the player
      this.x += this.meltschaseVector.x * 7;
      this.y += this.meltschaseVector.y * 7;
      this.meltschaseticks++;

      // After chasing for a threshold, switch to shooting state
      if (this.meltschaseticks >= this.meltschasethreshold) {
        this.meltsIsShooting = true;
        this.meltscooldown = 0;
        this.meltswaveCount = 0;
        this.shootMeltsBullets();
      }
    } else {
      // Shooting cooldown with multiple waves
      this.meltscooldown++;
      if (this.meltscooldown >= this.meltswaveDelay && this.meltswaveCount < 2) {
        this.meltswaveCount++;
        this.shootMeltsBullets();
        this.meltscooldown = 0;
      }

      // After three waves, reset to chase state
      if (this.meltswaveCount >= 2) {
        this.meltsIsShooting = false;
      }
    }
  }

  shootMeltsBullets() {
    let angleOffset = 0; 
    if (this.meltswaveCount === 1) {
      angleOffset = PI / 32; 
    }

    for (let angle = angleOffset; angle < TWO_PI + angleOffset; angle += PI / 16) {
      this.meltsArr.push(new meltsBullet(this.x, this.y, angle));
    }
  }
  panicchase() {
    if (!this.panicIsShooting) {
      // Chase the player linearly
      if (!this.panicchaseVector || this.panicchaseticks >= this.panicchasethreshold) {
        let playerVector = createVector(scrollX, scrollY);
        let oryxVector = createVector(this.x, this.y);
        this.panicchaseVector = p5.Vector.sub(playerVector, oryxVector).normalize();
        this.panicchaseticks = 0;
      }
      if (!this.canMoveInDirection(this.panicchaseVector)){
        this.panicchaseVector=createVector(0,0)
      }
      // Move towards the player
      this.x += this.panicchaseVector.x * 5;
      this.y += this.panicchaseVector.y * 5;
      this.panicchaseticks++;

      // After chasing for a threshold, switch to shooting state
      if (this.panicchaseticks >= this.panicchasethreshold) {
        this.panicIsShooting = true;
        this.paniccooldown = 0;
        this.panicwaveCount = 0;
        this.shootpanicsBullets();
      }
    } else {
      // Shooting cooldown with multiple waves
      this.paniccooldown++;
      if (this.paniccooldown >= this.panicwaveDelay && this.panicwaveCount < 2) {
        this.panicwaveCount++;
        this.shootpanicsBullets();
        this.paniccooldown = 0;
      }

      // After three waves, reset to chase state
      if (this.panicwaveCount >= 2) {
        this.panicIsShooting = false;
      }
    }
  }
  shootpanicsBullets(){
    let angleOffset = 0; 
    if (this.panicwaveCount === 1) {
      angleOffset = PI / 4; 
    }
    for (let angle = angleOffset; angle < TWO_PI + angleOffset; angle += HALF_PI) {
      this.panicArr.push(new panicBullet(this.x, this.y, angle));
    }
  }
  cowardice() {
    if (!this.cowardiceIsShooting) {

      this.cowardicechaseticks++;

      // After chasing for a threshold, switch to shooting state
      if (this.cowardicechaseticks >= 50) {
        this.cowardiceIsShooting = true;
        this.cowardicecooldown = 0;
        this.cowardicewaveCount = 0;
        this.shootcowardiceBullets();
      }
    } else {
      // Shooting cooldown with multiple waves
      this.cowardicecooldown++;
      if (this.cowardicecooldown >= this.cowardicewaveDelay && this.cowardicewaveCount < 5) {
        this.cowardicewaveCount++;
        this.shootcowardiceBullets();
        this.cowardicecooldown = 0;
      }

      if (this.cowardicewaveCount >= 5) {
        this.cowardiceIsShooting = false;
      }
    }
  }
  shootcowardiceBullets(){

    for (let i=0;i<TWO_PI+PI/4;i+=HALF_PI){
      if (this.cowardicewaveCount==0 ){
        this.cowardiceArr.push(new cowardiceBullet2(this.x,this.y,i+PI/4-PI/6-PI/12,5))
        this.cowardiceArr.push(new cowardiceBullet2(this.x,this.y,i+PI/4-PI/12-PI/12,7))
        this.cowardiceArr.push(new cowardiceBullet2(this.x,this.y,i+PI/4-PI/12,5))
      }
      if (this.cowardicewaveCount==1 ){
        this.cowardiceArr.push(new cowardiceBullet2(this.x,this.y,i+PI/4-PI/6-PI/6,5))
        this.cowardiceArr.push(new cowardiceBullet2(this.x,this.y,i+PI/4-PI/12-PI/6,7))
        this.cowardiceArr.push(new cowardiceBullet2(this.x,this.y,i+PI/4-PI/6,5))
      }
      if (this.cowardicewaveCount==2 ){
        this.cowardiceArr.push(new cowardiceBullet2(this.x,this.y,i+PI/4-PI/12,5))
        this.cowardiceArr.push(new cowardiceBullet2(this.x,this.y,i+PI/4,7))
        this.cowardiceArr.push(new cowardiceBullet2(this.x,this.y,i+PI/4+PI/12,5))
      }
      if (this.cowardicewaveCount==3 ){
        this.cowardiceArr.push(new cowardiceBullet2(this.x,this.y,i+PI/4-PI/12+PI/12,5))
        this.cowardiceArr.push(new cowardiceBullet2(this.x,this.y,i+PI/4+PI/12,7))
        this.cowardiceArr.push(new cowardiceBullet2(this.x,this.y,i+PI/4+PI/12+PI/12,5))
      }
      if (this.cowardicewaveCount==4 ){
        this.cowardiceArr.push(new cowardiceBullet2(this.x,this.y,i+PI/4+PI/6,5))
        this.cowardiceArr.push(new cowardiceBullet2(this.x,this.y,i+PI/4+PI/12+PI/6,7))
        this.cowardiceArr.push(new cowardiceBullet2(this.x,this.y,i+PI/4+PI/6+PI/6,5))
      }
        if (this.cowardicewaveCount==0){
          this.cowardiceArr.push(new cowardiceBullet1(this.x,this.y,i-PI/12))
        }
        if (this.cowardicewaveCount==1){
          this.cowardiceArr.push(new cowardiceBullet1(this.x,this.y,i))
        }
        if (this.cowardicewaveCount==2){
          this.cowardiceArr.push(new cowardiceBullet1(this.x,this.y,i+PI/12))
        }
        if (this.cowardicewaveCount==3){
          this.cowardiceArr.push(new cowardiceBullet1(this.x,this.y,i))
        }
        if (this.cowardicewaveCount==4){
          this.cowardiceArr.push(new cowardiceBullet1(this.x,this.y,i-PI/12))
        }
    }
  }
  inner(){
    if (!this.radiusflag){
      let oryxVector=createVector(this.x,this.y)
      let cornerVector=createVector(1500+350,1500)
      let dirVector=cornerVector.sub(oryxVector)
      if (dirVector.mag()<3.5){
        this.radiusflag=true;
      }
      else{
        this.x+=dirVector.normalize().x *7
        this.y+=dirVector.normalize().y *7
      }
    }
    else{
    this.circleAngle += this.circleSpeed;
    this.x = this.centerX + cos(this.circleAngle) * this.circleRadius;
    this.y = this.centerY + sin(this.circleAngle) * this.circleRadius;
    this.cowardice()
    }
  }
    canMoveInDirection(vector) {
    if (!vector) return false; 
    let newX = this.x + vector.x * pixelSize; 
    let newY = this.y + vector.y * pixelSize;

    let gridX = Math.floor((newX - offsetX) / pixelSize);
    let gridY = Math.floor((newY - offsetY) / pixelSize);

    if (gridX < 0 || gridY < 0 || gridX >= gridSize || gridY >= gridSize) {
      return false;
    }

    let newPixel = grid[gridY][gridX];
    return !(newPixel.r === 0 && newPixel.g === 0 && newPixel.b === 0);
  }

  shieldbashes(){
    if (this.stationaryticker > this.stationarythreshold){
      this.hasStationarybullet=true;
      this.stationaryticker=0
    }

    let baseVector = this.linearchaseVector ? this.linearchaseVector.copy().normalize() : createVector(1,0);
    let baseAngle = baseVector.heading(); 

    let bulletAngle1 = baseAngle + HALF_PI;
    let bulletAngle2 = baseAngle - HALF_PI;

    // Create side bullets
    this.shieldbashesArr.push(new ShieldBashSideBullet(this.x, this.y, bulletAngle1));
    this.shieldbashesArr.push(new ShieldBashSideBullet(this.x, this.y, bulletAngle2));

    // Create stationary bullet if needed
    if (this.hasStationarybullet) {
      this.shieldbashesArr.push(new ShieldBashStationaryBullet(this.x, this.y));
      this.hasStationarybullet=false;
    }
  }

  doshieldbashes() {
    for (let i = this.shieldbashesArr.length - 1; i >= 0; i--) {
      if (this.shieldbashesArr[i].timer > this.shieldbashesArr[i].threshold) {
        this.shieldbashesArr.splice(i, 1);
      } 
      else if (dist(this.shieldbashesArr[i].x,this.shieldbashesArr[i].y,scrollX,scrollY)<30){ 
        if (this.shieldbashesArr[i] instanceof ShieldBashSideBullet){
        this.shieldbashesArr.splice(i, 1);
        playerHP-=50
        }
        else{
          this.shieldbashesArr.splice(i, 1); 
          playerHP-=100
        }
      
      } else {
        this.shieldbashesArr[i].update();
        this.shieldbashesArr[i].display();
      }
    }
    this.stationaryticker++;
  }

  crumples(){
    let playerVector=createVector(scrollX, scrollY)
    let oryxVector=createVector(this.x,this.y)
    let baseChaseVector = p5.Vector.sub(playerVector, oryxVector);  
    let bulletAngle1 = baseChaseVector.heading();  
    let bulletAngle2 = baseChaseVector.heading() + PI/12; 
    let bulletAngle3 = baseChaseVector.heading() - PI/12; 

    this.crumplesArr.push(new CrumpleBullet(this.x, this.y, bulletAngle1));
    this.crumplesArr.push(new CrumpleBullet(this.x, this.y, bulletAngle2));
    this.crumplesArr.push(new CrumpleBullet(this.x, this.y, bulletAngle3));
  }

  doCrumples(){
    for (let i = this.crumplesArr.length - 1; i >= 0; i--) {
      if (this.crumplesArr[i].timer > this.crumplesArr[i].threshold) {
        this.crumplesArr.splice(i, 1); 
      }
      else if (dist(this.crumplesArr[i].x,this.crumplesArr[i].y,scrollX,scrollY)<30){ 
        this.crumplesArr.splice(i, 1); 
        playerHP-=50
      
      } 
      else {
        this.crumplesArr[i].update(); 
        this.crumplesArr[i].display();
      }
    }
  }
  doMelts(){
    for (let i = this.meltsArr.length - 1; i >= 0; i--) {
      let bullet = this.meltsArr[i];
      bullet.update();
      bullet.display();
      if (bullet.timer > bullet.threshold) {
        this.meltsArr.splice(i, 1);
      }
      else if (dist(bullet.x,bullet.y,scrollX,scrollY)<30){
        this.meltsArr.splice(i, 1);
        playerHP-=100;
      }
    }
  }
  doPanic(){
    for (let i = this.panicArr.length - 1; i >= 0; i--) {
      let bullet = this.panicArr[i];
      bullet.update();
      bullet.display();
      if (bullet.timer > bullet.threshold) {
        this.panicArr.splice(i, 1);
      }
      else if (dist(bullet.x,bullet.y,scrollX,scrollY)<80 && frameCount%30<2){
        playerHP-=70;
      }
    }
  }
  doCowardice(){
    for (let i = this.cowardiceArr.length - 1; i >= 0; i--) {
      let bullet = this.cowardiceArr[i];
      bullet.update();
      bullet.display();
      if (bullet.timer > bullet.threshold) {
        this.cowardiceArr.splice(i, 1);
      }
      else if (dist(bullet.x,bullet.y,scrollX,scrollY)<30){
        this.cowardiceArr.splice(i, 1);
        playerHP-=70;
      }
    }
  }
}

// Individual Crumple Bullet Class
class CrumpleBullet {
  constructor(x, y, angle) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.timer = 0;
    this.threshold = 600;
    this.speed = 8;
  }

  update() {
    this.x += cos(this.angle) * this.speed;
    this.y += sin(this.angle) * this.speed;
    this.timer++;
  }

  display() {
    graphics.push();
    graphics.translate(this.x, this.y);
    graphics.rotate(this.angle);
    graphics.image(crumplesbulletpng, 0, 0, 30, 30);
    graphics.pop();
  }
}

// Individual Shield Bash Side Bullet
class ShieldBashSideBullet {
  constructor(x, y, angle) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.timer = 0;
    this.threshold = 600;
    this.speed = 8;
  }

  update() {
    this.x += cos(this.angle) * this.speed;
    this.y += sin(this.angle) * this.speed;
    this.timer++;
  }

  display() {
    graphics.push();
    graphics.translate(this.x, this.y);
    graphics.rotate(this.angle);
    graphics.image(shieldbashessidepng, 0, 0, 60, 60);
    graphics.pop();
  }
}

// Individual Shield Bash Stationary Bullet
class ShieldBashStationaryBullet {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.timer = 0;
    this.threshold = 600;
  }

  update() {
    this.timer++;
  }

  display() {
    graphics.push();
    graphics.image(shieldbashesstationarypng, this.x, this.y, 50, 50);
    graphics.pop();
  }
}
class meltsBullet{
  constructor(x,y,angle){
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.timer = 0;
    this.threshold = 600;
    this.speed = 8;
  }
  update() {
    this.x += cos(this.angle) * this.speed;
    this.y += sin(this.angle) * this.speed;
    this.timer++;
  }

  display() {
    graphics.push();
    graphics.translate(this.x, this.y);
    graphics.rotate(this.angle);
    graphics.image(meltsbulletpng, 0, 0, 50,50);
    graphics.pop();
  }
}
class panicBullet{
  constructor(x,y,angle){
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.timer = 0;
    this.threshold = 180;
    this.speed = 7;
    this.totaldist=0;
  }
  update() {
    if (this.timer<60){
    this.x += cos(this.angle) * this.speed;
    this.y += sin(this.angle) * this.speed;
    }
    this.timer++;
  }
    display() {
      graphics.push();
      graphics.translate(this.x, this.y);
      graphics.rotate(screenAngle);
      if (frameCount%30<5){
      graphics.image(bombartifactaoe, 0,0, 100,100);
      }
      graphics.image(bombartifact, 0, 0, 50,50);
      graphics.pop();
    }
  }
    class cowardiceBullet1{
      constructor(x,y,angle){
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.timer = 0;
        this.threshold = 180;
        this.speed = 7;
        this.totaldist=0;
      }
      update() {
        this.x += cos(this.angle) * this.speed;
        this.y += sin(this.angle) * this.speed;
        this.timer++;
      }
        display() {
          graphics.push();
          graphics.translate(this.x, this.y);
          graphics.rotate(this.angle);
          graphics.image(cowardicebulletpng[0], 0, 0, 50,50);
          graphics.pop();
        }
      }
        class cowardiceBullet2{
    constructor(x,y,angle,speed){
      this.x = x;
      this.y = y;
      this.angle = angle;
      this.timer = 0;
      this.threshold = 180;
      this.speed = speed;
      this.totaldist=0;
    }
    update() {
      this.x += cos(this.angle) * this.speed;
      this.y += sin(this.angle) * this.speed;
      this.timer++;
    }
      display() {
        graphics.push();
        graphics.translate(this.x, this.y);
        graphics.rotate(this.angle);
        graphics.image(cowardicebulletpng[1], 0, 0, 50,25);
        graphics.pop();
      }
    }

function callCrumples(){
  const currentTime = millis();
  if (crumplesisPaused) { 
    if (currentTime - crumpleslastWaveTime > crumplespauseDuration) { 
      crumplesisPaused = false; 
      crumpleswaveCount = 0; 
      crumpleslastWaveTime = currentTime; 
    }
  } else {
    if (crumpleswaveCount < crumplesmaxWaves && currentTime - crumpleslastWaveTime > crumpleswaveDelay) {
      oryx3.crumples(); 
      crumpleswaveCount++
      crumpleslastWaveTime=currentTime 
    } else if (crumpleswaveCount >= crumplesmaxWaves) {
      crumplesisPaused = true;
      crumpleslastWaveTime = currentTime; 
    }
  }
}

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


function graphicsBufferdisplay(){
  push();
  translate(width / 2, height / 2);
  rotate(-screenAngle);

  // Draw the entire graphics buffer onto the main canvas
  imageMode(CENTER);
  image(graphics, 0, 0, graphicsWidth, graphicsHeight, 
        scrollX - graphicsWidth / 2, scrollY - graphicsHeight / 2, 
        graphicsWidth, graphicsHeight);

  // Draw the player
  push()
  translate(0,0)
  rotate(screenAngle)
}

class bullets {
  constructor() {
    this.x = scrollX;
    this.y = scrollY;
    let playerVector = createVector(width / 2, height / 2);
    let mouseVector = createVector(mouseX, mouseY);
    this.shootVector = p5.Vector.sub(mouseVector, playerVector).normalize();
    this.speed = 7;
    this.lifetime=0;
    this.xDir=cos(this.shootVector.heading()+screenAngle)
    this.yDir=sin(this.shootVector.heading()+screenAngle)
  }

  display() {
    this.x += this.xDir * this.speed;
    this.y += this.yDir  * this.speed;
      graphics.push();
      graphics.translate(this.x, this.y);
      graphics.rotate(this.shootVector.heading()+screenAngle);
      graphics.imageMode(CENTER);
      graphics.image(bulletpng, 0, 0, 30, 30);
      graphics.pop();
      this.lifetime++
  }
}
function keyPressed(){
  if (key=='i' || key == 'I'){
    autofire*=-1
  }
  if (key == '1'){
    currentPhase=0
  }
  if (key == '2'){
    currentPhase=1
  }
  if (key == '3'){
    currentPhase=2
  }
  if (key == '4'){
    currentPhase=3
  }
  if (key == '5'){
    currentPhase=4
  }
  if (key == '6'){
    currentPhase=5
  }
}

function playerHealthBar(){
  imageMode(CORNER)
  fill(255,0,0)
  let healthX=map(playerHP,0,900,0,210)
  rect(-width/2+40,+height/2-60,healthX,54.5*0.6,7)
  image(healthBarpng,-width/2+5,+height/2-80,215*1.2,54.5*1.2)
  fill(255)
  textSize(15)
  text(round(playerHP)+"/"+"900",-width/2+115,+height/2-40)
  imageMode(CENTER)
  playerHP+=0.1
  playerHP=constrain(playerHP,0,900)
}
function oryxHealthBar(){
  fill(255,220,61)
  let healthX=map(OryxHP,0,220000,0,1080*0.59)
  rect(-width/2+350,-height/2+22,healthX,54.5*0.6,7)
  image(oryxbarpng,0,-height/2+40,1080*0.7,124*0.7)
  fill(255)
  textSize(15)
  rectMode(CORNER)

}