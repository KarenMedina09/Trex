//alta de variables
 var PLAY = 1;
 var END = 0;
 var gameState = PLAY;

 var trex, trex_running, trex_collided;
 var ground, invisibleGround, groundImage;

 var cloudsGroup, cloudImage;
 var obstaclesGroup, obstacle1, obstacle2, obstacle3,  obstacle4, obstacle5, obstacle6;
 var score;
 var gameOverImg;
 var restartImg;
 var jumpSound,dieSound,checkPointSound;



function preload(){

//Cargado de imagenes
  trex_running =        loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided=loadAnimation("trex_collided.png");  
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  gameOverImg= loadImage("gameOver.png");
  restartImg=loadImage("restart.png");
  
  jumpSound=loadSound("jump.mp3");
  dieSound=loadSound("die.mp3");
  checkPointSound=loadSound("checkPoint.mp3");
  
}

function setup() {
  createCanvas(600, 200);
  
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided",trex_collided);
  trex.scale = 0.7;
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
//imagen de game over
  gameOver=createSprite(300,90,300,100);
  gameOver.addImage(gameOverImg);
  
//imagen de restart
  restart=createSprite(300,150,150,140);
  restart.addImage(restartImg);
  restart.scale=0.7;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
//Crear grupo de Obstacle y Cloud
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();

//radio de circunferencia
  trex.setCollider("circle",0,0,40);
//trex.debug = true
  
  score = 0
}

function draw() {
  background("green");
 
//despliega score
  fill("blue")
  text("puntuación:"+ score, 480,50);
  
  console.log("this is ",gameState)
  
//if el estado de juego en PLAY
  if(gameState === PLAY){
  gameOver.visible=false;
  restart.visible=false;
    
//mueve el suelo
  ground.velocityX = -(6+score/1000);
//score
  score = score + Math.round(frameCount/60);
  
  if(score>0 && score%1000===0){
    checkPointSound.play();
  }
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
//salta el trex con space
  if(keyDown("space")&& trex.y >=100) {
        trex.velocityY = -13;
        jumpSound.play();
    }
    
//gravedad al trex
  trex.velocityY = trex.velocityY + 0.8
  
//aparece nubes
  spawnClouds();
  
//aparece obstaculos en el suelo
  spawnObstacles();
    
//si un obstaculo toca el trex  END
  if(obstaclesGroup.isTouching(trex)){
        gameState = END;
      dieSound.play();
    }
  }
  
//en caso de End  detener piso 
  else if (gameState === END) {
  gameOver.visible=true;
  restart.visible=true;
    
       
  ground.velocityX = 0;
  trex.velocityY=0;
    
    
//cambia la animación del trex
  trex.changeAnimation("collided",trex_collided);
//funcion de reiniciar juego
  if(mousePressedOver(restart)){
    reset();
  }
    
    
//ciclo de obstaculos y nubes
  obstaclesGroup.setLifetimeEach(-1);
   cloudsGroup.setLifetimeEach(-1);
    
//detener grupo de obstaculos y nubes
  obstaclesGroup.setVelocityXEach(0);
  cloudsGroup.setVelocityXEach(0);
   }
  
 
//crear suelo invisible para el trex
  trex.collide(invisibleGround);
  
  
  drawSprites();
}

//función aparicion de obstáculos
  function spawnObstacles(){
  if (frameCount % 60 === 0){
  var obstacle = createSprite(400,165,10,40);
  obstacle.velocityX = -(6+score/1000);
   
//generate random obstacles
  var rand = Math.round(random(1,6));
  switch(rand) {
  case 1: obstacle.addImage(obstacle1);
              break;
  case 2: obstacle.addImage(obstacle2);
              break;
  case 3: obstacle.addImage(obstacle3);
              break;
  case 4: obstacle.addImage(obstacle4);
              break;
  case 5: obstacle.addImage(obstacle5);
              break;
  case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
//asignar scale y lifetime a los obstacle           
  obstacle.scale = 0.6;
  obstacle.lifetime = 300;
   
//añadir cada obstaculo al grupo
  obstaclesGroup.add(obstacle);
 }
}

//función aparición de nubes
  function spawnClouds() {
//write code here to spawn the clouds
   if (frameCount % 60 === 0) {
  cloud = createSprite(600,100,40,10);
  cloud.y = Math.round(random(10,60));
  cloud.addImage(cloudImage);
  cloud.scale = 0.6;
  cloud.velocityX = -3;
    
//assign lifetime to the variable
  cloud.lifetime = 195;
    
//adjust the depth
  cloud.depth = trex.depth;
  trex.depth = trex.depth + 1;
    
//adding cloud to the group
  cloudsGroup.add(cloud);
    }
}

//funcion de resetear
function reset(){
  gameState=PLAY;
  gameOver.visible=false;
  restart.visible=false;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  score=0;
  trex.changeAnimation("running",trex_running);
}
