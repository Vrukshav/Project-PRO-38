/*--------------------------------------------------------*/
var PLAY = 1;
var END = 0;
var WIN = 2;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var jungle, invisiblejungle;
var kangaroo;

var shrubsGroup;
var obstaclesGroup, obstacle1;
var invisibleGround;

var score=0;

var gameOver, restart;


function preload(){
  kangaroo_running =   loadAnimation("assets/kangaroo1.png","assets/kangaroo2.png","assets/kangaroo3.png");
  kangaroo_collided = loadAnimation("assets/kangaroo1.png");
  jungleImage = loadImage("assets/bg.png");
  shrub1 = loadImage("assets/shrub1.png");
  shrub2 = loadImage("assets/shrub2.png");
  shrub3 = loadImage("assets/shrub3.png");
  obstacle1 = loadImage("assets/stone.png");
  gameOverImg = loadImage("assets/gameOver.png");
  restartImg = loadImage("assets/restart.png");
  jumpSound = loadSound("assets/jump.wav");
  collidedSound = loadSound("assets/collided.wav");
}

function setup() {
  createCanvas(800, 400);

  jungle = createSprite(400,100,400,20);
  jungle.addImage("jungle",jungleImage);
  jungle.scale=0.3
  jungle.x = width /2;
  
  kangaroo = createSprite(500,300);
  kangaroo.addAnimation('run',kangaroo_running);
  kangaroo.addAnimation('collided',kangaroo_collided);
  kangaroo.changeAnimation('run')
  kangaroo.scale = 0.15;

  invisibleGround = createSprite(400,300,800,10);
  invisibleGround.visible = false;


  shrubsGroup = new Group();
  obstaclesGroup = new Group();

  gameOver = createSprite(400,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(400,170);
  restart.addImage(restartImg);
  restart.scale = 0.1;

  score = 0;

}

function draw() {
  background(255);
  
  
  if(gameState ===PLAY){

    gameOver.visible = false;
    restart.visible = false;
    kangaroo.x = camera.position.x-270;
    
    jungle.velocityX = -5;


    if(keyIsDown(32) && kangaroo.y>=250){
      kangaroo.velocityY = -17 ;
    }
    kangaroo.velocityY = kangaroo.velocityY + 0.8
    kangaroo.collide(invisibleGround);
    if (jungle.x < 0){
      jungle.x = width/2;
    }
    kangaroo.setCollider("circle",0,0,150);
    kangaroo.debug = false;

    if(kangaroo.collide(shrubsGroup)){
      score=score+1
      shrubsGroup.destroyEach();
    }
    if(kangaroo.collide(obstaclesGroup)){
      
      obstaclesGroup.destroyEach();
      gameState = END;
    }

  }
  else if(gameState === END){
    gameOver.visible = true;
    restart.visible = true;
    kangaroo.changeAnimation('collided');
    if(mousePressedOver(restart)) {
      reset();
       
    }

    
    jungle.velocityX = 0;
    kangaroo.velocityX = 0;
    kangaroo.velocityY = 0;
    obstaclesGroup.setLifetimeEach(-1);
    obstaclesGroup.setVelocityXEach(0);

    shrubsGroup.setLifetimeEach(-1);
    shrubsGroup.setVelocityXEach(0);
  }
  
  spawnShrubs();
  spawnObstacles();
  drawSprites();
  text("Score: "+ score, 500,50);
  

}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  obstaclesGroup.destroyEach();
  shrubsGroup.destroyEach();
  kangaroo.changeAnimation('run',kangaroo_running);
  score=0;
}
function spawnShrubs(){
  if (frameCount % 150 === 0) {
  var shrub = createSprite(camera.position.x+500,330,40,10);
  shrub.velocityX = -6;
  var rand = Math.round(random(1,3));
    switch(rand) {
      case 1: shrub.addImage(shrub1);
              break;
      case 2: shrub.addImage(shrub2);
              break;
      case 3: shrub.addImage(shrub3);
              break;
      
      default: break;
    }
    shrub.scale = 0.05;
    shrub.lifetime = 300;
  
   
   //add each obstacle to the group
   shrubsGroup.add(shrub);
  }
}
function spawnObstacles(){
  if (frameCount % 150 === 0){
    var obstacle = createSprite(600,300,10,40);
    obstacle.addImage(obstacle1);
    obstacle.velocityX = -6;
    
  
    
     //assign scale and lifetime to the obstacle           
     obstacle.scale = 0.2;
     obstacle.lifetime = 300;
    
    //add each obstacle to the group
     obstaclesGroup.add(obstacle);
  }
 }