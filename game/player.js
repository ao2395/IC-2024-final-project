// variables 
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
let MaxPlayerHP=900
let playerDmg=200;
let oryxMaxHP=220000
let OryxHP=oryxMaxHP;
let regenRate=0.1
let hardModedmg=70;
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
let phaseStartTime = 0;       
let phaseDuration = 20000;    
let nextPhaseTime = 0;         
let spawnBeamTime = 0;         
let beamTraversalTime = 0; 
let celestialTriggered = false;
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
let deathflag=false
// outer
let outerpng=[]
let outerpng1;
let outerpng2;
let outerindex=0;

// fleeing 
let fleeingpng1;
let fleeingpng2;

let beamarr=[]
let beampng;
let beamTraversalActive = false;
let beamTraversalDirection; // 'row' or 'column'
let beamTraversalStartEdge; // 0 or gridSize-1 depending on direction
let beamTraversalCurrentLine = 0;
let beamTraversalLastSpawnTime = 0;
let beamTraversalDelay = 700; // 1 second delay between lines


let portalpng=[]
let portalindex=0
let spiralBullets = [];
let spawnAngle = 0; // Controls the rotation of the spawn points
let spiralSpeed = 0.01;
let celestialportalshotpng
let celestialpng1
let celestialpng2
let celestialpng3
let previousPlayerHP=playerHP;
let playerHit=false;
let playerHitalpha=0;
let apostasy;
let celestialmp3
let cowardicemp3
let crumplesmp3
let deathmp3
let heavensmp3
let innermp3
let meltsmp3
let outermp3
let panicmp3
let shieldbashesmp3
let fleeingmp3
let difficulty = localStorage.getItem("selectedDifficulty") // retrieve difficulty
let arena = localStorage.getItem("selectedArena") // retrieve arena
let cosmospng
function preload() { // load all images 
  oryx3png = loadImage("../images/oryx/gifs/oryxskins.png")
  grid = loadJSON(`${arena}.json`); // json file with pixel data from python program
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
  bombartifactaoe=loadImage("../images/oryx/bullets/bombartifactaoe.png")
  beampng=loadImage("../images/oryx/bullets/beams.png");
  outerpng[0]=loadImage("../images/oryx/gifs/outer_animation/frame_0_delay-0.2s.png")
  outerpng[1]=loadImage("../images/oryx/gifs/outer_animation/frame_1_delay-0.2s.png")
  outerpng[2]=loadImage("../images/oryx/gifs/outer_animation/frame_2_delay-0.2s.png")
  outerpng1=loadImage("../images/oryx/bullets/outerRot1.png")
  outerpng2=loadImage("../images/oryx/bullets/outerRot2.png")
  fleeingpng1=loadImage("../images/oryx/bullets/fleeing1.png")
  fleeingpng2=loadImage("../images/oryx/bullets/fleeing2.png")
  celestialportalshotpng=loadImage("../images/oryx/bullets/celestialportals.png")
  portalpng[0]=loadImage("../images/oryx/bullets/portal_animation/frame_0_delay-0.1s.png")
  portalpng[1]=loadImage("../images/oryx/bullets/portal_animation/frame_1_delay-0.1s.png")
  portalpng[2]=loadImage("../images/oryx/bullets/portal_animation/frame_2_delay-0.1s.png")
  portalpng[3]=loadImage("../images/oryx/bullets/portal_animation/frame_3_delay-0.1s.png")
  portalpng[4]=loadImage("../images/oryx/bullets/portal_animation/frame_4_delay-0.1s.png")
  celestialpng1=loadImage("../images/oryx/bullets/celestial1.png")
  celestialpng2=loadImage("../images/oryx/bullets/celestial2.png")
  celestialpng3=loadImage("../images/oryx/bullets/celestial3.png")
  apostasy=loadSound("../sound/apostasy.mp3")
  cowardicemp3=loadSound("../sound/cowardice.mp3")
  crumplesmp3=loadSound("../sound/crumples.mp3")
  deathmp3=loadSound("../sound/death.mp3")
  heavensmp3=loadSound("../sound/heavens.mp3")
  innermp3=loadSound("../sound/inner.mp3")
  outermp3=loadSound("../sound/outer.mp3")
  panicmp3=loadSound("../sound/panic.mp3")
  shieldbashesmp3=loadSound("../sound/shieldbashes.mp3")
  fleeingmp3=loadSound("../sound/fleeing.mp3")
  celestialmp3=loadSound("../sound/celestial.mp3")
  meltsmp3=loadSound("../sound/melts.mp3")
  cosmospng=loadImage("../images/oryx/bullets/cosmos.png")
}

function setup() {
  if (difficulty=='easy'){ // if difficulty is set to easy change key variables
    oryxMaxHP=100000
    oryxHP=oryxMaxHP
    playerDmg=300;
    hardModedmg=0;
    regenRate=0.2;
    playerHP=1200;
    MaxPlayerHP=1200;
    playerHP=MaxPlayerHP
  }
  let hViewPoint = 30 * pixelSize; 
  let vViewPoint = 19 * pixelSize;

  // Aspect ratio
  let ratio = hViewPoint / vViewPoint;
  let canvasHeight = windowHeight * 0.99;
  let canvasWidth = canvasHeight * ratio; 
  canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent('canvas-container');
  background(0);

  // create graphics according to size
  graphics = createGraphics(graphicsWidth, graphicsHeight);

  offsetX = (graphicsWidth - gridSize * pixelSize) / 2;
  offsetY = (graphicsHeight - gridSize * pixelSize) / 2;

  scrollX = offsetX + (gridSize / 2) * pixelSize; 
  scrollY = offsetY + (gridSize - 5.5) * pixelSize; // player pos
  oryx3 = new oryx(); 
  phaseStartTime = millis();   // phase timer
  nextPhaseTime = millis() + 5000; // idle time
}

function draw() {
  graphics.background(0);
  // render the arena
  renderGrid();


  // depending on phase call the correct function
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
  if (currentPhase == 6){ 
    oryx3.outer()
  }
  if (currentPhase == 7){ 
    oryx3.fleeing()
  }
  if (currentPhase == 8){ 
    oryx3.celestial()
  }
if (currentPhase == 9) {
  oryx3.cosmosPhase();
}

  // updates all bullet arrays 
  oryx3.doCrumples() 
  oryx3.doshieldbashes()
  oryx3.doMelts()
  oryx3.doPanic()
  oryx3.doCowardice() // inner and cowardice use same bullet array
  oryx3.doOuter()
  oryx3.doFleeing()
  oryx3.docelestial()
  oryx3.doCosmos();
  updateSpiralBullets()


  // movement
  handleMovement();
  oryx3.display();
  if ((mouseIsPressed==true || autofire==1) && frameCount % 10 == 0 ){ // shoot bullets when mouse is pressed or auto fire is true
    bulletarr.push(new bullets)
  }
  for (let i = bulletarr.length-1;i >=0;i--){ // delete bullets after 10s
    bulletarr[i].display()
    if (bulletarr[i].lifetime > 600){
      bulletarr.splice(i,1)
    }
    else if (dist(bulletarr[i].x,bulletarr[i].y,oryx3.x,oryx3.y)<50){ // or if bullet hits oryx
      OryxHP-=playerDmg;
      bulletarr.splice(i,1)
    }
  }
  for (let i =beamarr.length-1;i>=0;i--){ // if beam is expired remove it
    beamarr[i].display();
    if (beamarr[i].expired){
      beamarr.splice(i,1);
    }
  }
  graphicsBufferdisplay() // display graphics
  playerHealthBar() // display playerhp
  phaseController() // call phase controller
  oryxHealthBar() // display oryx hp
  updateBeamTraversal(); // move beams along
  if (playerHP < previousPlayerHP || playerHit){ // if player has been hit set alpha to 100
    if (playerHP < previousPlayerHP){
      playerHit=true;
      playerHitalpha=100;
      playerHP-=hardModedmg 
    }
    if (playerHP <= 0){
      playerHitalpha=0; // if player dies remove hit indicator
    }
    playerHitalpha-=2; // slowly fade out hit indicator
    noFill()
    stroke(255,0,0,playerHitalpha)
    strokeWeight(400)
    ellipse(0,0,1500,1500) // draw hit indicator
  }
  // all animations for the player down here includes all combination of walking, not walking, shooting, not shooting, looking left, looking right, looking up, looking down
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


  // fill(0,255,0);
  // textSize(16);
  // text(`FPS: ${Math.floor(frameRate())}`, 10, 20);
  // text(`Press 1 for Phase 1: Crumples`, 10, 40);
  // text(`Press 2 for Phase 2: ShieldBashes`, 10, 60);
  previousPlayerHP=playerHP;
}

// colors 
function renderGrid() {
  graphics.rectMode(CORNER) // go through grid
  for (let y = 0; y < gridSize; y++) { 
    for (let x = 0; x < gridSize; x++) {
      let pixel = grid[y][x]; 
      graphics.fill(pixel.r, pixel.g, pixel.b); 
      graphics.rect(offsetX + x * pixelSize,offsetY + y * pixelSize,pixelSize,pixelSize);  // draw a rectangle depending on pixel color  
    }
  }
}

// movement collisions
function canMoveToX(newX) {
  let gridX = Math.floor((newX - offsetX) / pixelSize);  // get grid x and y
  let gridY = Math.floor((scrollY - offsetY) / pixelSize);

  if (gridX < 0 || gridY < 0 || gridX >= gridSize || gridY >= gridSize) {
    return false; // check if within grid
  }

  let newPixel = grid[gridY][gridX];
  return !(newPixel.r === 0 && newPixel.g === 0 && newPixel.b === 0);  // check if pixel is black
}

function canMoveToY(newY) { // separate Y collision detection so you can slide against walls
  let gridX = Math.floor((scrollX - offsetX) / pixelSize);
  let gridY = Math.floor((newY - offsetY) / pixelSize);

  if (gridX < 0 || gridY < 0 || gridX >= gridSize || gridY >= gridSize) {
    return false;
  }

  let newPixel = grid[gridY][gridX];
  return !(newPixel.r === 0 && newPixel.g === 0 && newPixel.b === 0); 
}

function handleMovement() {
  if (keyIsDown(81)) { // Q
    screenAngle -= 0.035;
  }
  if (keyIsDown(69)) {// E
    screenAngle += 0.035;
  }

  let xComponent = 0;
  let yComponent = 0;

  if (keyIsDown(87)) {// W
    xComponent += sin(screenAngle);
    yComponent -= cos(screenAngle);
  }
  if (keyIsDown(83)) {// s
    xComponent -= sin(screenAngle);
    yComponent += cos(screenAngle);
  }
  if (keyIsDown(65)) { // A
    xComponent -= cos(screenAngle);
    yComponent -= sin(screenAngle);
  }
  if (keyIsDown(68)) { // D
    xComponent += cos(screenAngle);
    yComponent += sin(screenAngle);
  }

  let magnitude = Math.sqrt(xComponent * xComponent + yComponent * yComponent);
  if (magnitude > 0) {
    xComponent = (xComponent / magnitude) * playerSpeed; // normalize and multiply by player speed
    yComponent = (yComponent / magnitude) * playerSpeed;
  }

  if (keyIsDown(90)) { // E
    screenAngle = 0;
  }

  let newX = scrollX + xComponent; // get new pos and check if its a valid position
  let newY = scrollY + yComponent;

  if (canMoveToX(newX)) {
    scrollX = newX;
  }
  if (canMoveToY(newY)) {
    scrollY = newY;
  }
}

class oryx { // oryx controls all bullets and calls them as needed
  constructor(){
    this.x=1500 
    this.y=1500
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
    this.circleAngleinner = 0;  
    this.circleAngleouter = 0;  
    this.circleAnglecelestial=0;  
    this.circleSpeed = 0.012;
    this.centerX=1500
    this.centerY=1500
    this.radiusflaginner=false
    this.radiusflagouter=false
    this.radiusflagcelestial=false;
    this.outerchaseVector;
    this.outerchaseticks = 0;
    this.outercooldown = 0;      
    this.outerIsShooting = false;     
    this.outerArr = [];  
    this.outerwaveCount = 0;  
    this.outerwaveDelay = 40; 
    this.angleOffset = 0;
    this.springAmplitude = 9; 
    this.springFrequency = 0.1;
    this.fleeingchaseVector;
    this.fleeingchaseticks = 0;
    this.fleeingcooldown = 0;      
    this.fleeingIsShooting = false;     
    this.fleeingArr = [];  
    this.fleeingwaveCount = 0;  
    this.fleeingwaveDelay = 20; 
    this.celestialchaseVector;
    this.celestialchaseticks = 0;
    this.celestialcooldown = 0;      
    this.celestialIsShooting = false;     
    this.celestialArr = [];  
    this.celestialwaveCount = 0;  
    this.celestialwaveDelay = 10; 
    this.cosmosArr = [];
    this.cosmosOngoing = false; 
    this.lastCosmosSpawnTime = 0;
    this.cosmosSpawnInterval = 1000; 
    this.numCosmosToSpawn = 10; 
  }

  display(){
    // draw all animations for each phase
    graphics.imageMode(CENTER) 
    graphics.push()
    graphics.translate(this.x,this.y)
    if (currentPhase==-2 || currentPhase==9){ // if oryx is dead or doing cosmos make him kneel
      graphics.rotate(screenAngle)
      graphics.image(oryx3png,0,0,gridSize*3,gridSize*3,0,174,174,174)

    }
    else if (currentPhase==-1){ // if idle
      graphics.rotate(screenAngle)
    graphics.image(oryx3png,0,0,gridSize*3,gridSize*3,0,0,174,174)
  }
  else if (currentPhase==0){ // if crumples
    graphics.rotate(screenAngle)
    graphics.image(chasepng[chaseindex],0,0,gridSize*3,gridSize*3,0,0,222,222)
    if (frameCount % 10 ==0){
      chaseindex++
    }
    if (chaseindex > 4){
      chaseindex=0;
    }
  }
  else if (currentPhase==1){ // if shield bashes
    graphics.rotate(screenAngle)
    graphics.image(linearchasepng[linearchaseindex],0,0,gridSize*3,gridSize*3,444,0,222,222)
    if (frameCount % 10 ==0){
      linearchaseindex++
    }
    if (linearchaseindex > 2){
      linearchaseindex=0;
    }
  }
  else if (currentPhase==2){ // if melts
      graphics.rotate(screenAngle)
      graphics.image(meltschase[meltschaseindex],0,0,gridSize*3,gridSize*3,222,0,222,444)
      if (frameCount % 10 == 0){
        meltschaseindex++
      }
      if (meltschaseindex > 2){
        meltschaseindex=0;
      }
    }
    else if (currentPhase==3){ // if panic and scream
      graphics.rotate(screenAngle)
      graphics.image(panicchase[panichchaseindex],0,0,gridSize*3,gridSize*3,0,0,222,444)
      if (frameCount % 10 == 0){
        panichchaseindex++
      }
      if (panichchaseindex > 1){
        panichchaseindex=0;
      }
    }
    else if (currentPhase==4 || currentPhase==5 || currentPhase==7 || currentPhase==8){ // if doing a spinning phase (inner, cowardice, celestial,fleeing)
      graphics.rotate(screenAngle)
      if (currentPhase==4){
      graphics.image(cowardicepng[cowardiceindex],0,0,gridSize*3,gridSize*3,0,0,222,444)
      }
      if (currentPhase==5){
        graphics.image(cowardicepng[cowardiceindex],0,0,gridSize*3,gridSize*3,222,0,222,444)
        }
      if (currentPhase==7){
          graphics.image(cowardicepng[cowardiceindex],0,0,gridSize*3,gridSize*3,444,0,222,444)
          }
      if (currentPhase==8){
            graphics.image(cowardicepng[cowardiceindex],0,0,gridSize*3,gridSize*3,666,0,222,444)
            }
      if (frameCount % 10 == 0){
        cowardiceindex++
      }
      if (cowardiceindex > 16){
        cowardiceindex=5;
      }
    }
    else if (currentPhase==6){ // outer 
      graphics.rotate(screenAngle)
      graphics.image(outerpng[outerindex],0,0,gridSize*3,gridSize*3,0,0,222,444)
      if (frameCount % 10 == 0){
        outerindex++
      }
      if (outerindex > 2){
        outerindex=0;
      }
    }
    if (currentPhase!=5 ){ // reset if he is not doing that phase
      this.circleAngleinner = 0;  
      this.radiusflaginner=false;
    }
    if (currentPhase!=6){// reset if he is not doing that phase
      this.circleAngleouter=0;
      this.radiusflagouter=false;
    }
    if (currentPhase!=8){// reset if he is not doing that phase
      this.circleAnglecelestial=0;
      this.radiusflagcelestial=false;
    }
    if (currentPhase!=4 && currentPhase!=5 && currentPhase!=7 && currentPhase!=8){ // dont reset if he is doing a related spinning phase
      cowardiceindex=0;
      this.cowardicechaseticks=0;
      this.cowardiceIsShooting=false;
    }
    graphics.pop()
  }
  chase(){ // direct chase
    let playerVector=createVector(scrollX, scrollY) 
    let oryxVector=createVector(this.x,this.y)
    let chaseVector = p5.Vector.sub(playerVector, oryxVector);  // calculate vector from oryx to player
    chaseVector.normalize(); 
    chaseVector.setMag(3.5);
    oryxVector.add(chaseVector) 
    this.x=oryxVector.x // move oryx in that direction
    this.y=oryxVector.y
  }

  linearchase() {  // linear chases
    if (!this.linearchaseVector || this.linearchasethreshold < this.linearchaseticks || !this.canMoveInDirection(this.linearchaseVector)) { // only recalculate vector if necessary
      let playerVector = createVector(scrollX, scrollY); 
      let oryxVector = createVector(this.x, this.y); 
      this.linearchaseVector = p5.Vector.sub(playerVector, oryxVector).normalize(); 
      this.linearchaseticks = 0; 
    }

    this.x += this.linearchaseVector.x * 6;
    this.y += this.linearchaseVector.y * 6;
    this.linearchaseticks++; 
  }
  meltschase() { // melt chase
    if (!this.meltsIsShooting) {
      if (!this.meltschaseVector || this.meltschaseticks >= this.meltschasethreshold) { // only recalculate if  necessary
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

      // after chasing for a while, switch to shooting state
      if (this.meltschaseticks >= this.meltschasethreshold) { // 
        this.meltsIsShooting = true;
        this.meltscooldown = 0;
        this.meltswaveCount = 0;
        this.shootMeltsBullets(); // call shoot melt bullets
      }
    } else {
      // shoot in waves
      this.meltscooldown++;
      if (this.meltscooldown >= this.meltswaveDelay && this.meltswaveCount < 2) {
        this.meltswaveCount++;
        this.shootMeltsBullets(); // call shoot melt bullets
        this.meltscooldown = 0;
      }

      // after 3 waves chase again 
      if (this.meltswaveCount >= 2) {
        this.meltsIsShooting = false;
      }
    }
  }

  shootMeltsBullets() { // push melt bullets into the array
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
      // linear chase
      if (!this.panicchaseVector || this.panicchaseticks >= this.panicchasethreshold) { // only recalculate when neccessary
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

      // after chasing for a while, switch to shooting state
      if (this.panicchaseticks >= this.panicchasethreshold) {
        this.panicIsShooting = true;
        this.paniccooldown = 0;
        this.panicwaveCount = 0;
        this.shootpanicsBullets(); // call shoot panic bullets
      }
    } else {
      // shoot in waves
      this.paniccooldown++;
      if (this.paniccooldown >= this.panicwaveDelay && this.panicwaveCount < 2) {
        this.panicwaveCount++;
        this.shootpanicsBullets(); // call shoot panic bullets
        this.paniccooldown = 0;
      }

      // go back to chasing after 3 waves
      if (this.panicwaveCount >= 2) {
        this.panicIsShooting = false;
      }
    }
  }
  shootpanicsBullets(){
    let angleOffset = 0; 
    if (this.panicwaveCount === 1) { // switch angle for middle wave
      angleOffset = PI / 4; 
    }
    for (let angle = angleOffset; angle < TWO_PI + angleOffset; angle += HALF_PI) {
      this.panicArr.push(new panicBullet(this.x, this.y, angle)); // push bullets to panic bullet
    }
  }
  cowardice() {
    if (!this.cowardiceIsShooting) {

      this.cowardicechaseticks++;

      // chase for a bit
      if (this.cowardicechaseticks >= 50) {
        this.cowardiceIsShooting = true;
        this.cowardicecooldown = 0;
        this.cowardicewaveCount = 0;
        this.shootcowardiceBullets();
      }
    } else {
      // shoot when not chasing
      this.cowardicecooldown++;
      if (this.cowardicecooldown >= this.cowardicewaveDelay && this.cowardicewaveCount < 5) {
        this.cowardicewaveCount++;
        this.shootcowardiceBullets(); // call shoot cowardice bullets
        this.cowardicecooldown = 0;
      }

      if (this.cowardicewaveCount >= 5) { // return to chasing after 5 waves
        this.cowardiceIsShooting = false;
      }
    }
  }
  shootcowardiceBullets(){ 

    for (let i=0;i<TWO_PI+PI/4;i+=HALF_PI){ // shoot all around and for each wave choose a different pattern
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
  inner(){ // inner movement
    if (!this.radiusflaginner){ // first reach the right side of the radius of the circle
      let oryxVector=createVector(this.x,this.y)
      let cornerVector=createVector(1500+350,1500) // 350 is radius
      let dirVector=cornerVector.sub(oryxVector)
      if (dirVector.mag()<3.5){ // if right side has been reached oryx can start rotating
        this.radiusflaginner=true;
      }
      else{
        this.x+=dirVector.normalize().x *7 // if not reached keep moving towards this
        this.y+=dirVector.normalize().y *7
      }
    }
    else{ // if reached started circuling
    this.circleAngleinner += this.circleSpeed; // move in circular rotation
    this.x = this.centerX + cos(this.circleAngleinner) * this.circleRadius;
    this.y = this.centerY + sin(this.circleAngleinner) * this.circleRadius;
    this.cowardice() // call cowardice because these 2 phases shoot the same shots
    }
  }
  outer(){ // same as above but bigger radius
    if (!this.radiusflagouter){
      let oryxVector=createVector(this.x,this.y)
      let cornerVector=createVector(1500+800,1500)
      let dirVector=cornerVector.sub(oryxVector)
      console.log(dirVector.mag())
      console.log(this.radiusflag)
      if (dirVector.mag()<4){
        this.radiusflagouter=true;
      }
      else{
        this.x+=dirVector.normalize().x *7
        this.y+=dirVector.normalize().y *7
      }
    }
    else{
    this.circleAngleouter += this.circleSpeed-0.005;
    this.x = this.centerX + cos(this.circleAngleouter) * 800;
    this.y = this.centerY + sin(this.circleAngleouter) * 800;
    this.outershots(); // call outer shots
    }
  }
  outershots() { // alot of these wave mechanics are useless since some phases constantly shoot but its easier to reuse code
    if (!this.outerIsShooting) {

      this.outerchaseticks++;

      // after circuling for 50 ticks
      if (this.outerchaseticks >= 50) {
        this.outerIsShooting = true;
        this.outercooldown = 0;
        this.outerwaveCount = 0;
        this.shootouterBullets();
      }
    } else {
      this.outercooldown++;
      if (this.outercooldown >= this.outerwaveDelay && this.outerwaveCount < 5) {
        this.outerwaveCount++;
        this.shootouterBullets();
        this.outercooldown = 0;
      }

      if (this.outerwaveCount >= 5) {
        this.outerIsShooting = false;
      }
    }
  }
  shootouterBullets(){ // push the requided bullets for outer rotates
    this.outerArr.push(new outerBullet2(this.x,this.y,PI/4));
    this.outerArr.push(new outerBullet2(this.x,this.y,-PI/4));
    this.outerArr.push(new outerBullet1(this.x,this.y,-PI/6));
    this.outerArr.push(new outerBullet1(this.x,this.y,-PI/3));
    this.outerArr.push(new outerBullet1(this.x,this.y,0));
    this.outerArr.push(new outerBullet1(this.x,this.y,PI/3));
     this.outerArr.push(new outerBullet1(this.x,this.y,PI/6));
    this.outerArr.push(new outerBullet1(this.x,this.y,PI));

  }
  fleeing(){
    // direct chase
    let playerVector = createVector(scrollX, scrollY);
    let oryxVector = createVector(this.x, this.y);
    let chaseVector = p5.Vector.sub(playerVector, oryxVector);

    chaseVector.normalize();

    // oscillate while chasing
    this.angleOffset += this.springFrequency;
    let oscillationX = cos(this.angleOffset) * this.springAmplitude;
    let oscillationY = sin(this.angleOffset) * this.springAmplitude;

    let randomX = random(-2, 2); // add a bit of randomness 
    let randomY = random(-2, 2);

    this.x += chaseVector.x*2 + oscillationX + randomX; // add all up together with emphasis on moving towards the player
    this.y += chaseVector.y*2 + oscillationY + randomY;

    if (!this.fleeingIsShooting) { // same as above

      this.fleeingchaseticks++;


      if (this.fleeingchaseticks >= 50) {
        this.fleeingIsShooting = true;
        this.fleeingcooldown = 0;
        this.fleeingwaveCount = 0;
        this.shootfleeingBullets();
      }
    } else {
      this.fleeingcooldown++;
      if (this.fleeingcooldown >= this.fleeingwaveDelay && this.fleeingwaveCount < 3) {
        this.fleeingwaveCount++;
        this.shootfleeingBullets();
        this.fleeingcooldown = 0;
      }

      if (this.fleeingwaveCount >= 3) {
        this.fleeingIsShooting = false;
      }
    }
  }
  shootfleeingBullets(){
    // shoot fleeing bullets depending on wave
    if (this.fleeingwaveCount==0){
      this.fleeingArr.push(new fleeingBullet1(this.x,this.y))
      this.fleeingArr.push(new fleeingBullet1(this.x,this.y))
      this.fleeingArr.push(new fleeingBullet2(this.x,this.y))
      this.fleeingArr.push(new fleeingBullet1(this.x,this.y))
    }
    if (this.fleeingwaveCount==1){
      this.fleeingArr.push(new fleeingBullet1(this.x,this.y))
      this.fleeingArr.push(new fleeingBullet2(this.x,this.y))
      this.fleeingArr.push(new fleeingBullet1(this.x,this.y))
      this.fleeingArr.push(new fleeingBullet1(this.x,this.y))
    }
    if (this.fleeingwaveCount==2){
      this.fleeingArr.push(new fleeingBullet1(this.x,this.y))
      this.fleeingArr.push(new fleeingBullet2(this.x,this.y))
      this.fleeingArr.push(new fleeingBullet2(this.x,this.y))
      this.fleeingArr.push(new fleeingBullet1(this.x,this.y))
      
    }
    if (this.fleeingwaveCount==3){
      this.fleeingArr.push(new fleeingBullet1(this.x,this.y))
      this.fleeingArr.push(new fleeingBullet1(this.x,this.y))
      this.fleeingArr.push(new fleeingBullet2(this.x,this.y))
      this.fleeingArr.push(new fleeingBullet2(this.x,this.y))
    }

  }
  doFleeing(){ // update fleeing array
    for (let i = this.fleeingArr.length - 1; i >= 0; i--) {
      let bullet = this.fleeingArr[i];
      bullet.update();
      bullet.display();
      if (bullet.timer > bullet.threshold) { // if expired bullet
        this.fleeingArr.splice(i, 1);
        continue;
      }
      else if (dist(bullet.x,bullet.y,scrollX,scrollY)<30){ // if bullet hits
        this.fleeingArr.splice(i, 1);
        playerHP-=70;
      }
    }
  }
  celestial(){
    graphics.fill(70,70,70,150) // make the screen darker
    graphics.rect(0,0,3000,3000)
    if (!this.radiusflagcelestial){ // same movement as above
      let oryxVector=createVector(this.x,this.y)
      let cornerVector=createVector(1500+400,1500)
      let dirVector=cornerVector.sub(oryxVector)
      if (dirVector.mag()<4){
        this.radiusflagcelestial=true;
      }
      else{
        this.x+=dirVector.normalize().x *7
        this.y+=dirVector.normalize().y *7
      }
    }
    else{
      shootSpiralShots() // once he gets into position start shooting portal shots
    this.circleAnglecelestial += this.circleSpeed+0.015;
    this.x = this.centerX + cos(this.circleAnglecelestial) * 400;
    this.y = this.centerY + sin(this.circleAnglecelestial) * 400;
    if (!this.celestialIsShooting) {

      this.celestialchaseticks++;

  
      if (this.celestialchaseticks >= 50) {
        this.celestialIsShooting = true;
        this.celestialcooldown = 0;
        this.celestialwaveCount = 0;
        this.shootcelestialBullets();
      }
    } else {

      this.celestialcooldown++;
      if (this.celestialcooldown >= this.celestialwaveDelay && this.celestialwaveCount < 3) {
        this.celestialwaveCount++;
        this.shootcelestialBullets();
        this.celestialcooldown = 0;
      }

      if (this.celestialwaveCount >= 3) {
        this.celestialIsShooting = false;
      }
    }
    }
  }
  shootcelestialBullets(){ // shoot celestial bullets randomly around oryx
    if (this.celestialwaveCount==0){
      this.celestialArr.push(new celestialBullet1(this.x,this.y,random(0,TWO_PI)))
      this.celestialArr.push(new celestialBullet1(this.x,this.y,random(0,TWO_PI)))
      this.celestialArr.push(new celestialBullet1(this.x,this.y,random(0,TWO_PI)))
      this.celestialArr.push(new celestialBullet1(this.x,this.y,random(0,TWO_PI)))
      this.celestialArr.push(new celestialBullet1(this.x,this.y,random(0,TWO_PI)))
    }
    if (this.celestialwaveCount==1){
      this.celestialArr.push(new celestialBullet2(this.x,this.y,random(0,TWO_PI)))
      this.celestialArr.push(new celestialBullet2(this.x,this.y,random(0,TWO_PI)))
      this.celestialArr.push(new celestialBullet2(this.x,this.y,random(0,TWO_PI)))
      this.celestialArr.push(new celestialBullet2(this.x,this.y,random(0,TWO_PI)))
      this.celestialArr.push(new celestialBullet2(this.x,this.y,random(0,TWO_PI)))

    }
    if (this.celestialwaveCount==2){
      this.celestialArr.push(new celestialBullet3(this.x,this.y,random(0,TWO_PI)))
      this.celestialArr.push(new celestialBullet3(this.x,this.y,random(0,TWO_PI)))
      this.celestialArr.push(new celestialBullet3(this.x,this.y,random(0,TWO_PI)))
      this.celestialArr.push(new celestialBullet3(this.x,this.y,random(0,TWO_PI)))
      this.celestialArr.push(new celestialBullet3(this.x,this.y,random(0,TWO_PI)))

    }
  }
  cosmosPhase() {
    // set cosmos as ongoing
    this.cosmosOngoing = true;

    // spawn new telegraphs if enough time has passed
    let currentTime = millis();
    if (currentTime - this.lastCosmosSpawnTime > this.cosmosSpawnInterval) {
      this.spawnCosmosTelegraphs(this.numCosmosToSpawn);
      this.lastCosmosSpawnTime = currentTime;
    }
  }

  doCosmos() { // update cosmos array
    for (let i = this.cosmosArr.length - 1; i >= 0; i--) {
      let bullet = this.cosmosArr[i];
      bullet.update();
      bullet.display();

      // some are bullets
      if (bullet instanceof CosmosShotBullet) {
        if (bullet.timer > bullet.threshold) {
          this.cosmosArr.splice(i, 1);
        } else if (dist(bullet.x, bullet.y, scrollX, scrollY) < 30) {
          this.cosmosArr.splice(i, 1);
          playerHP -= 50; 
        }
      }
      // some are telegraphed markers, only remove when done
      else if (bullet instanceof CosmosTelegraphBullet && bullet.done) {
        // create bullets when telegraph markers are done
        for (let a = 0; a < 6; a++) {
          let angle = (TWO_PI / 6) * a;
          this.cosmosArr.push(new CosmosShotBullet(bullet.x, bullet.y, angle));
        }
        // remove telegraph 
        this.cosmosArr.splice(i, 1);
      }
    }
  }
  // spawn the telegraphs
  spawnCosmosTelegraphs(count) {
    let nonBlackSpots = [];
    for (let row = 0; row < gridSize; row++) { // look for non black spot
      for (let col = 0; col < gridSize; col++) {
        let c = grid[row][col];
        if (c.r !== 0 || c.g !== 0 || c.b !== 0) {
          nonBlackSpots.push({ x: col, y: row }); // inser into row and col
        }
      }
    }

    shuffle(nonBlackSpots, true); // shuffle the array
    let maxCount = min(count, nonBlackSpots.length); 
    for (let i = 0; i < maxCount; i++) {
      let pos = nonBlackSpots[i];
      let spawnX = offsetX + pos.x * pixelSize + pixelSize / 2;
      let spawnY = offsetY + pos.y * pixelSize + pixelSize / 2;
      this.cosmosArr.push(new CosmosTelegraphBullet(spawnX, spawnY)); // spawn cosmos telegraphs
    }
  }

    canMoveInDirection(vector) { // check if oryx can move in a certain direction, same as player detection
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

  shieldbashes(){ // create bullets for shield bashes (shield bashes and crumples work different to all other phases)
    if (this.stationaryticker > this.stationarythreshold){ // include a stationary bullet sometimes
      this.hasStationarybullet=true;
      this.stationaryticker=0
    }

    let baseVector = this.linearchaseVector ? this.linearchaseVector.copy().normalize() : createVector(1,0); // if vector exists normalize it otherwise make it
    let baseAngle = baseVector.heading(); 

    let bulletAngle1 = baseAngle + HALF_PI; // bullets to the side
    let bulletAngle2 = baseAngle - HALF_PI;

      // create side bullets
    this.shieldbashesArr.push(new ShieldBashSideBullet(this.x, this.y, bulletAngle1));
    this.shieldbashesArr.push(new ShieldBashSideBullet(this.x, this.y, bulletAngle2));

    // only create stationary bullet if needed
    if (this.hasStationarybullet) {
      this.shieldbashesArr.push(new ShieldBashStationaryBullet(this.x, this.y));
      this.hasStationarybullet=false;
    }
  }

  doshieldbashes() { //unload array 
    for (let i = this.shieldbashesArr.length - 1; i >= 0; i--) {
      if (this.shieldbashesArr[i].timer > this.shieldbashesArr[i].threshold) { // if expired remove it
        this.shieldbashesArr.splice(i, 1);
      } 
      else if (dist(this.shieldbashesArr[i].x,this.shieldbashesArr[i].y,scrollX,scrollY)<30){ 
        if (this.shieldbashesArr[i] instanceof ShieldBashSideBullet){ // if a sidebullet, do 50 dmg
        this.shieldbashesArr.splice(i, 1);
        playerHP-=50
        }
        else{
          this.shieldbashesArr.splice(i, 1);  // if stationary do 100 dmg
          playerHP-=100
        }
      
      } else {
        this.shieldbashesArr[i].update();
        this.shieldbashesArr[i].display();
      }
    }
    this.stationaryticker++;
  }

  crumples(){ // direct vector
    let playerVector=createVector(scrollX, scrollY)
    let oryxVector=createVector(this.x,this.y)
    let baseChaseVector = p5.Vector.sub(playerVector, oryxVector);  
    let bulletAngle1 = baseChaseVector.heading();  
    let bulletAngle2 = baseChaseVector.heading() + PI/12; 
    let bulletAngle3 = baseChaseVector.heading() - PI/12; 

    this.crumplesArr.push(new CrumpleBullet(this.x, this.y, bulletAngle1)); // spawn required bullets
    this.crumplesArr.push(new CrumpleBullet(this.x, this.y, bulletAngle2));
    this.crumplesArr.push(new CrumpleBullet(this.x, this.y, bulletAngle3));
    this.crumplesArr.push(new outerBullet1(this.x, this.y, bulletAngle1+PI/2-PI/12));
    this.crumplesArr.push(new outerBullet1(this.x, this.y, bulletAngle1+PI/2+PI/12));
    this.crumplesArr.push(new outerBullet1(this.x, this.y, bulletAngle1-PI/2-PI/12));
    this.crumplesArr.push(new outerBullet1(this.x, this.y, bulletAngle1-PI/2+PI/12));
    this.crumplesArr.push(new cowardiceBullet2(this.x, this.y, bulletAngle1+PI/24,6));
    this.crumplesArr.push(new cowardiceBullet2(this.x, this.y, bulletAngle1-PI/24,6));
  }

  doCrumples(){ // unload array bullets
    for (let i = this.crumplesArr.length - 1; i >= 0; i--) {
      if (this.crumplesArr[i].timer > this.crumplesArr[i].threshold) { // if expired splice it
        this.crumplesArr.splice(i, 1); 
      }
      else if (dist(this.crumplesArr[i].x,this.crumplesArr[i].y,scrollX,scrollY)<30){  // if player hit 
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
    for (let i = this.meltsArr.length - 1; i >= 0; i--) { // melts array
      let bullet = this.meltsArr[i];
      bullet.update();
      bullet.display();
      if (bullet.timer > bullet.threshold) { // remove if expired
        this.meltsArr.splice(i, 1);
      }
      else if (dist(bullet.x,bullet.y,scrollX,scrollY)<30){
        this.meltsArr.splice(i, 1); // remove and adjust player hp if hit
        playerHP-=100;
      }
    }
  }
  doPanic(){
    for (let i = this.panicArr.length - 1; i >= 0; i--) { // panic array
      let bullet = this.panicArr[i];
      bullet.update();
      bullet.display();
      if (bullet.timer > bullet.threshold) { // remove if expired
        this.panicArr.splice(i, 1);
      }
      else if (dist(bullet.x,bullet.y,scrollX,scrollY)<80 && frameCount%30<2){ // remvoe and adjust player hp if hit
        playerHP-=70;
      }
    }
  }
  doCowardice(){
    for (let i = this.cowardiceArr.length - 1; i >= 0; i--) { // cowardice array
      let bullet = this.cowardiceArr[i];
      bullet.update();
      bullet.display();
      if (bullet.timer > bullet.threshold) {// remove if expired
        this.cowardiceArr.splice(i, 1);
      }
      else if (dist(bullet.x,bullet.y,scrollX,scrollY)<30){// remvoe and adjust player hp if hit
        this.cowardiceArr.splice(i, 1);
        playerHP-=70;
      }
    }
  }
  doOuter(){ // outer array
    for (let i = this.outerArr.length - 1; i >= 0; i--) {
      let bullet = this.outerArr[i];
      bullet.update();
      bullet.display();
      if (bullet.timer > bullet.threshold) { // remove if expired
        this.outerArr.splice(i, 1);
      }
      else if (dist(bullet.x,bullet.y,scrollX,scrollY)<30){// remvoe and adjust player hp if hit
        this.outerArr.splice(i, 1);
        playerHP-=70;
      }
    }
  }
docelestial(){
  for (let i = this.celestialArr.length - 1; i >= 0; i--) {
    let bullet = this.celestialArr[i];
    bullet.update();
    bullet.display();
    if (bullet.timer > bullet.threshold) {// remove if expired
      this.celestialArr.splice(i, 1);
    }
    else if (dist(bullet.x,bullet.y,scrollX,scrollY)<30){// remvoe and adjust player hp if hit
      this.celestialArr.splice(i, 1);
      playerHP-=70;
    }
}
}
}

// the bullet classes all follow the same format
// crumple bullets 
class CrumpleBullet {
  constructor(x, y, angle) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.timer = 0;
    this.threshold = 600;
    this.speed = 8;
  }

  update() {  // move according to provided angle
    this.x += cos(this.angle) * this.speed;
    this.y += sin(this.angle) * this.speed;
    this.timer++;
  }

  display() { // draw rotated to its angle
    graphics.push();
    graphics.translate(this.x, this.y);
    graphics.rotate(this.angle);
    graphics.image(crumplesbulletpng, 0, 0, 30, 30);
    graphics.pop();
  }
}

class ShieldBashSideBullet { // shield bash side bullets
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

// shield bash stationary bullets
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
// panic and scream bullets
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
      graphics.image(bombartifactaoe, 0,0, 100,100); // draw aoe indicator
      }
      graphics.image(bombartifact, 0, 0, 50,50); // draw bomb
      graphics.pop();
    }
  }
    class cowardiceBullet1{ // cowardice bullet type 1
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
        class cowardiceBullet2{  // cowardice bullet type 2
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
    class outerBullet1{ // outerbullet type 1
      constructor(x,y,angle){
        this.x = x;
        this.y = y;
        this.timer = 0;
        this.threshold = 300;
        this.speed=7
        this.totaldist=0;
        this.angle=angle;
        this.dirVector = createVector(1500 - this.x, 1500 - this.y).normalize()
      }
      update() {
        this.x += cos(this.dirVector.heading()+this.angle) * this.speed;
        this.y += sin(this.dirVector.heading()+this.angle) * this.speed;
        this.timer++;
      }
        display() {
          graphics.push();
          graphics.translate(this.x, this.y);
          graphics.rotate(this.dirVector.heading()+this.angle);
          graphics.image(outerpng1, 0, 0, 50,50);
          graphics.pop();
        }
      }
        class outerBullet2{ // outer bullet type 2
    constructor(x,y,angle){
      this.x = x;
      this.y = y;
      this.timer = 0;
      this.threshold = 300;
      this.speed=7
      this.totaldist=0;
      this.angle=angle;
      this.dirVector = createVector(1500 - this.x, 1500 - this.y).normalize()
    }
    update() {
      this.x += cos(this.dirVector.heading()+this.angle) * this.speed;
      this.y += sin(this.dirVector.heading()+this.angle) * this.speed;
      this.timer++;
    }
      display() {
        graphics.push();
        graphics.translate(this.x, this.y);
        graphics.rotate(this.dirVector.heading()+this.angle);
        graphics.image(outerpng2, 0, 0, 50,50);
        graphics.pop();
      }
    }
    class fleeingBullet1{ // fleeing bullet type1
      constructor(x,y){
        this.x = x;
        this.y = y;
        this.timer = 0;
        this.threshold = 300;
        this.speed=7
        this.angle=random(0,TWO_PI);
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
          graphics.image(fleeingpng1, 0, 0, 50,50);
          graphics.pop();
        }
      }
        class fleeingBullet2{ // fleeing bullet type 2
          constructor(x,y){
            this.x = x;
            this.y = y;
            this.timer = 0;
            this.threshold = 300;
            this.speed=7
            this.angle=random(0,TWO_PI);
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
              graphics.image(fleeingpng2, 0, 0, 50,50);
              graphics.pop();
            }
    }

    class celestialBullet1{ // celestial bullet type 1
      constructor(x,y,angle){
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.timer = 0;
        this.threshold = 180;
        this.speed = 6;
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
          graphics.image(celestialpng1, 0, 0, 50,50);
          graphics.pop();
        }
      }
        class celestialBullet2{ // celestial bullet type 2
    constructor(x,y,angle){
      this.x = x;
      this.y = y;
      this.angle = angle;
      this.timer = 0;
      this.threshold = 180;
      this.speed = 5;
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
        graphics.image(celestialpng2, 0, 0, 50,25);
        graphics.pop();
      }
    }
    class celestialBullet3{ // celestial bullet type 2
      constructor(x,y,angle){
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.timer = 0;
        this.threshold = 180;
        this.speed = 4;
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
          graphics.image(celestialpng3, 0, 0, 50,25);
          graphics.pop();
        }
      }
      class CosmosTelegraphBullet { // telegraphed cosmos indicator
        constructor(x, y) {
          this.x = x;
          this.y = y;
          this.done = false;
          this.angle = 0; // arc angle
          this.angleIncrement = 0.10; // how fast telegraph is
      
          // beam animation variables
          this.beamAnimStarted = false;
          this.beamFrameCount = 0; 
          this.xframe = 0;
          this.yframe = 0;
        }
      
        update() {
          if (!this.done) {
            // if not done keep filling up arc
            this.angle += this.angleIncrement;
            if (this.angle >= TWO_PI) {
              this.done = true; // arc done, bullets will be spat out
            }
          } 
            if (this.angle > PI/2){
            // once halfway through telegraph show beam aswell
            this.beamFrameCount++;
            if (this.beamFrameCount % 5 === 0) {
              this.xframe += 96;
              if (this.xframe >= beampng.width-76*2) {
                this.xframe = 0;
              }
            }
          }
        }
      
        display() {
          graphics.push();
          graphics.translate(this.x, this.y);
          graphics.rotate(screenAngle);
      
          if (!this.done) {
            // draw telegraph
            graphics.noFill();
            graphics.stroke(255, 0, 0, 100);
            graphics.strokeWeight(4);
            graphics.ellipse(0, 0, pixelSize);
      
            graphics.noStroke();
            graphics.fill(255, 0, 0, 100);
            graphics.arc(0, 0, pixelSize, pixelSize, -HALF_PI, this.angle - HALF_PI, PIE);
          } 
          if (this.angle> PI/2){
            // draw beam
            let beamOffsetY = -pixelSize; 
            graphics.imageMode(CENTER);
            graphics.image(
              beampng, 
              0, 
              beamOffsetY, 
              50, 
              100, 
              this.xframe, 
              this.yframe, 
              96, 
              176
            );
          }
    
      
          graphics.pop();
        }
      }
      
      
      class CosmosShotBullet { // cosmos bullets
        constructor(x, y, angle) {
          this.x = x;
          this.y = y;
          this.angle = angle;
          this.speed = 7;
          this.timer = 0;
          this.threshold = 120;
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
          graphics.imageMode(CENTER);
          graphics.image(cosmospng, 0, 0, 50, 30);
          graphics.pop();
        }
      }
      
function callCrumples(){ // crumples wave management
  const currentTime = millis();
  if (crumplesisPaused) { 
    if (currentTime - crumpleslastWaveTime > crumplespauseDuration) {  // if enough time has passed un pause
      crumplesisPaused = false; 
      crumpleswaveCount = 0; 
      crumpleslastWaveTime = currentTime; 
    }
  } else {
    if (crumpleswaveCount < crumplesmaxWaves && currentTime - crumpleslastWaveTime > crumpleswaveDelay) { // call crumples and increment wave count
      oryx3.crumples(); 
      crumpleswaveCount++
      crumpleslastWaveTime=currentTime 
    } else if (crumpleswaveCount >= crumplesmaxWaves) {
      crumplesisPaused = true;
      crumpleslastWaveTime = currentTime; 
    }
  }
}

function callshieldbashes(){ // same as above
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


function graphicsBufferdisplay(){ // display graphics buffer
  push();
  translate(width / 2, height / 2);
  rotate(-screenAngle); // rotate the opposite way

  // draw graphics buffer rotated and with the right scroll to mimic player moving
  imageMode(CENTER);
  image(graphics, 0, 0, graphicsWidth, graphicsHeight, 
        scrollX - graphicsWidth / 2, scrollY - graphicsHeight / 2, 
        graphicsWidth, graphicsHeight);

  // Draw the player
  push()
  translate(0,0)
  rotate(screenAngle)
}

class bullets { // plauyer bullets
  constructor() {
    this.x = scrollX;
    this.y = scrollY;
    let playerVector = createVector(width / 2, height / 2);
    let mouseVector = createVector(mouseX, mouseY);
    this.shootVector = p5.Vector.sub(mouseVector, playerVector).normalize(); // draw vector from player to mouse
    this.speed = 7;
    this.lifetime=0;
    this.xDir=cos(this.shootVector.heading()+screenAngle)
    this.yDir=sin(this.shootVector.heading()+screenAngle)
    this.currentScreenAngle=screenAngle;
  }

  display() {
    this.x += this.xDir * this.speed;
    this.y += this.yDir  * this.speed;
      graphics.push();
      graphics.translate(this.x, this.y);
      graphics.rotate(this.shootVector.heading()+this.currentScreenAngle); // shoot bullet according to direction and inital screen angle when bullet is fired
      graphics.imageMode(CENTER);
      graphics.image(bulletpng, 0, 0, 35, 35);
      graphics.pop();
      this.lifetime++
  }
}
function keyPressed(){
  if (key=='i' || key == 'I'){ // if i is pressed toggle autofire
    autofire*=-1
  }
  // if (key == '1'){
  //   currentPhase=0
  // }
  // if (key == '2'){
  //   currentPhase=1
  // }
  // if (key == '3'){
  //   currentPhase=2
  // }
  // if (key == '4'){
  //   currentPhase=3
  // }
  // if (key == '5'){
  //   currentPhase=4
  // }
  // if (key == '6'){
  //   currentPhase=5
  // }
  // if (key == '7'){
  //   currentPhase=6
  // }
  // if (key == '8'){
  //   currentPhase=7
  // }
  // if (key == '9'){
  //   currentPhase=8
  // }
  // if (key == '0'){
  //       currentPhase=9
  // }
}
class beam{ // beam class
  constructor(x,y){
    this.x=offsetX + x * pixelSize+pixelSize/2; // offset beam to make it appear as if its coming from above
    this.y=offsetY + y * pixelSize+pixelSize/2;
    this.angle=0
    this.frame=0;
    this.xframe=0;
    this.yframe=0;
    this.expired=false;
  }
  display() {
    graphics.push();
    graphics.translate(this.x, this.y); 
    graphics.rotate(screenAngle);      
  
    if (this.angle < TWO_PI) {// fill up circle to telegraph where beam will drop

      graphics.noFill(); // empty circle
      graphics.stroke(255, 0, 0, 100);
      graphics.strokeWeight(4);
      graphics.ellipse(0, 0, pixelSize);
  
      graphics.noStroke(); // draw arc
      graphics.fill(255, 0, 0, 100);
      graphics.arc(0, 0, pixelSize, pixelSize, -90, (this.angle) - 90, PIE);

      this.angle += 0.15; // increment angle
      if (this.angle > TWO_PI) {// keep as full circle
        this.angle = TWO_PI;
      }
    } else {
      if (frameCount % 5 === 0) { // once angle is past 2pi
        this.xframe += 96; // draw beam animation
      }
 
      if (this.xframe >= beampng.width) { // move to next line
        this.xframe = 0;
        this.yframe += 176;
      }
      if (this.yframe >= beampng.height - 176) { // once we reached the end beam is expired
        this.yframe = 0;
        this.expired=true;
      }
      if (dist(scrollX,scrollY,this.x,this.y)< 40 && this.yframe==0 && this.xframe==beampng.width-96){
        playerHP-=30;
      }
  
      // offset the beam to appear as if its coming from above
      let beamOffsetY = -pixelSize; 
      graphics.imageMode(CENTER);
      graphics.image(beampng, 0, beamOffsetY, pixelSize*1.1, pixelSize * 2.2, this.xframe, this.yframe, 96, 176);
      graphics.imageMode(CORNER);
    }
  
    graphics.pop();
  }
  }


  class SpiralBullet { // spiral bullet class same as above
    constructor(x, y, angle, speed = 6) {
      this.x = x;
      this.y = y;
      this.angle = angle;
      this.speed = speed;
      this.timer = 0;
      this.threshold = 400;
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
      graphics.imageMode(CENTER);
      graphics.image(celestialportalshotpng, 0, 0, 50, 50);
      graphics.pop();
    }
  
    isExpired() {
      return this.timer > this.threshold;
    }
  }
  
  // Function to shoot spiral shots with rotating spawn points
  function shootSpiralShots(centerX=1500, centerY=1500, numBullets = 10, radius = 900) {
    let spawnPoints = 8; // 8 portals 
  
    for (let i = 0; i < spawnPoints; i++) {
      let angleOffset = spawnAngle + (TWO_PI / spawnPoints) * i; // space out portals
  
      // skip some bullets (this was through trial and error) to create gaps
      if (frameCount%30<15){
        let spawnX = centerX + cos(angleOffset) * radius; // get cords to all portals
        let spawnY = centerY + sin(angleOffset) * radius;
        if (frameCount%5==0){
          portalindex+=1; // portal animation
        }
        if (portalindex > 4){ // repeat portal animation
          portalindex=0;
        }
        graphics.image(portalpng[portalindex],spawnX,spawnY,100,100) // animation portals
        continue;
      }
      let spawnX = centerX + cos(angleOffset) * radius; // if bullets need to be shot
      let spawnY = centerY + sin(angleOffset) * radius;
      if (frameCount%5==0){
        portalindex+=1;
      }
      if (portalindex > 4){
        portalindex=0;
      }
      graphics.image(portalpng[portalindex],spawnX,spawnY,100,100)
   // animation portals
      // shoots bullets towards the center
      for (let j = 0; j < numBullets; j++) {
        let bulletVec=createVector(centerX-spawnX,centerY-spawnY)
        let bulletAngle =bulletVec.heading() ;
        if (frameCount%8==0){ // add bullets every 8 frames (trial and error once again)
        spiralBullets.push(new SpiralBullet(spawnX, spawnY, bulletAngle));
        }
      }
    }
  
    // rotate portals around arena
    spawnAngle -= spiralSpeed;
  }
  
  // update and display spiral bullets
  function updateSpiralBullets() {
    for (let i = spiralBullets.length - 1; i >= 0; i--) {
      spiralBullets[i].update();
      spiralBullets[i].display();
  
      if (spiralBullets[i].isExpired()) { // if expired remove it
        spiralBullets.splice(i, 1);
        continue;
      }
      if (dist(scrollX,scrollY,spiralBullets[i].x,spiralBullets[i].y)<30){ // if player is hit decrement health
        playerHP-=7;
        spiralBullets.splice(i, 1);
      }
    }
  }


  function spawnRandomBeams() {
    let nonBlackSpots = [];
  
    // find all non block spots
    for (let i = 0; i < 39; i++) {
      for (let j = 0; j < 39; j++) {
        let c = grid[i][j];
        if (c.r !== 0 || c.g !== 0 || c.b !== 0) {
          nonBlackSpots.push({ x:i, y: j  });
        }
      }
    }
  

    shuffle(nonBlackSpots, true); // shuffle black spots
    let count = constrain(nonBlackSpots.length, 30, 40); // ensure we have atleast 30 beams but not more than 40 (should always have 40)
    for (let i = 0; i < count; i++) {  // create new beams
      let pos = nonBlackSpots[i];
      beamarr.push(new beam(pos.x, pos.y));
    }
  }
  function startBeamTraversal() {
    // randomly choose a direciton
    let directions = ['row', 'column'];
    beamTraversalDirection = random(directions);
  
    // randomly choose whihc side to start from

      beamTraversalStartEdge = random([0, gridSize - 1]);
      beamTraversalCurrentLine = beamTraversalStartEdge;
  
    beamTraversalActive = true;
    beamTraversalLastSpawnTime = millis();
  }
  function updateBeamTraversal() {
    if (!beamTraversalActive) return;
  
    let currentTime = millis();
    // Check if enough time has passed since last spawn
    if (currentTime - beamTraversalLastSpawnTime >= beamTraversalDelay) {
      spawnBeamLine(beamTraversalDirection, beamTraversalCurrentLine);
  
      // Move to next line based on direction and starting edge
      if (beamTraversalDirection === 'row') {
        if (beamTraversalStartEdge === 0) {
          beamTraversalCurrentLine++;
          if (beamTraversalCurrentLine >= gridSize) {
            beamTraversalActive = false; // Done traversing
          }
        } else {
          beamTraversalCurrentLine--;
          if (beamTraversalCurrentLine < 0) {
            beamTraversalActive = false; // Done traversing
          }
        }
      } else {
        // Direction is column
        if (beamTraversalStartEdge === 0) {
          beamTraversalCurrentLine++;
          if (beamTraversalCurrentLine >= gridSize) {
            beamTraversalActive = false; // Done traversing
          }
        } else {
          beamTraversalCurrentLine--;
          if (beamTraversalCurrentLine < 0) {
            beamTraversalActive = false; // Done traversing
          }
        }
      }
  
      // Update last spawn time
      beamTraversalLastSpawnTime = currentTime;
    }
  }
  function spawnBeamLine(direction, lineIndex) {
    if (direction === 'row') {
      // Spawning beams along a row
      if (lineIndex < 0 || lineIndex >= gridSize) return;
      for (let col = 0; col < gridSize; col++) {
        let c = grid[lineIndex][col];
        if (c.r !== 0 && c.g !== 0 && c.b !== 0) {
          // Spawn a beam at this black spot
          beamarr.push(new beam(col, lineIndex)); 
        }
      }
    } else {
      // Spawning beams along a column
      if (lineIndex < 0 || lineIndex >= gridSize) return;
      for (let row = 0; row < gridSize; row++) {
        let c = grid[row][lineIndex];
        if (c.r !== 0 && c.g !== 0 && c.b !== 0) {
          // Spawn a beam at this black spot
          beamarr.push(new beam(lineIndex, row));
        }
      }
    }
  }
  function phaseController() {
    let currentTime = millis();
  
    if (OryxHP<=0){
      currentPhase=-2;

      if (!deathflag) {
        deathmp3.play();
        deathflag=true;
      }
textAlign(CENTER, CENTER);
rectMode(CORNER);
fill(128, 128, 128, 200);
rect(-width/2, -height/2, width,height); // Full-screen overlay

// Display the winning message
fill(255, 255, 0);
textSize(40);
text("You have vanquished Mad God Oryx!!", 0,-50);
// Create the Back Button
let backButton = createButton('Back to Main Menu');
backButton.position(windowWidth / 2 - backButton.width / 2, windowHeight / 2 + 50);
backButton.mousePressed(() => {
  window.history.back();
});
  }
    // Idle phase (-1) lasts 10 seconds
    if (currentPhase === -1 && currentTime >= nextPhaseTime) {
      switchToRandomPhase();
    }
  
    // Handle Phase 8: ensure it lasts only 20 seconds
    if (currentPhase === 8 && currentTime - phaseStartTime >= phaseDuration) {
      console.log("Phase 8 ended. Switching to random phase.");
      switchToRandomPhase();
      return; // Ensures no overlap with other logic
    }
  
    // Normal phase duration (20 seconds)
    if (currentPhase !== -1 && currentTime - phaseStartTime >= phaseDuration) {
      switchToRandomPhase();
      return;
    }
  
    // Special conditions based on OryxHP
    if (OryxHP <= 0.6 * oryxMaxHP && currentTime - spawnBeamTime >= 7000) {
      spawnRandomBeams();
      spawnBeamTime = currentTime;
    }
  
    if (OryxHP <= 0.5 * oryxMaxHP && !celestialTriggered) {
      celestialTriggered=true;
      celestialmp3.play()
      currentPhase = 8; // Switch to Phase 8
      phaseStartTime = millis(); // Reset timer for Phase 8
      console.log("Phase switched to 8 at 50% HP.");
    }
  
    if (OryxHP <= 0.4 * oryxMaxHP && currentTime - beamTraversalTime >= 27000) {
      startBeamTraversal();
      heavensmp3.play()
      beamTraversalTime = currentTime;
      console.log("Beam traversal triggered at 40% HP.");
    }
  }
  
  function switchToRandomPhase() {
    let previousPhase = currentPhase;
    let availablePhases = [0, 1, 2, 3, 4, 5, 6, 7,9]; // Exclude Phase 8 from random selection
  
    // Remove previous phase to avoid repetition
    availablePhases = availablePhases.filter(phase => phase !== previousPhase);
  
    // Randomly select a new phase
    currentPhase = random(availablePhases);
    phaseStartTime = millis(); // Reset phase timer
    console.log("Switching to Phase:", currentPhase);
    if (currentPhase==0){
      crumplesmp3.play()
    }
    if (currentPhase==1){
      shieldbashesmp3.play()
    }
    if (currentPhase==2){
      meltsmp3.play()
    }
    if (currentPhase==3){
      panicmp3.play()
    }
    if (currentPhase==4){
      cowardicemp3.play()
    }
    if (currentPhase==5){
      innermp3.play()
    }
    if (currentPhase==6){
      outermp3.play()
    }
    if (currentPhase==7){
      fleeingmp3.play()
    }
    if (currentPhase == 9) {
      // For example, play a unique sound for cosmos phase
      // cosmosSound.play();
    }
  }
  
  
function playerHealthBar(){
  imageMode(CORNER)
  fill(255,0,0)
  let healthX=map(playerHP,0,MaxPlayerHP,0,210)
  rect(-width/2+40,+height/2-60,healthX,54.5*0.6,7)
  image(healthBarpng,-width/2+5,+height/2-80,215*1.2,54.5*1.2)
  fill(255)
  textSize(15)
  text(round(playerHP)+"/"+MaxPlayerHP,-width/2+115,+height/2-40)
  imageMode(CENTER)
  if (playerHP<=0){
    noLoop()
    fill(128,128,128,200)
    rectMode(CORNER)
    rect(-width/2,-height/2,width,height)
    fill(255,0,0)
    textSize(40);
    textAlign(CENTER)
    text("You have Been slain by Oryx The Mad God!!",0,-100)
    let backButton = createButton('Back to Main Menu');
    backButton.position(windowWidth / 2 - backButton.width / 2, windowHeight / 2 + 50);
    backButton.mousePressed(() => {
      window.history.back();
    });
}
  playerHP+=regenRate;
  playerHP=constrain(playerHP,0,MaxPlayerHP)
}
function oryxHealthBar(){
  fill(255,220,61)
  let healthX=map(OryxHP,0,oryxMaxHP,0,1080*0.6)
  rect(-windowWidth/2+((windowWidth-1080*0.7)/2)+55,-height/2+22,healthX,54.5*0.6,7)
  image(oryxbarpng,0,-height/2+40,1080*0.7,124*0.7)
  fill(255)
  textSize(15)
  rectMode(CORNER)
  OryxHP=constrain(OryxHP,0,oryxMaxHP)
}

function mousePressed(){
  if (!apostasy.isPlaying()){
    apostasy.setVolume(0.5)
    apostasy.play()
  }
}