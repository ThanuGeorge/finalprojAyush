//variables
var BgImg , crash; 
var SpaceBg;
var Rocket;
var score ,highscore , life;
var obstaclesGroup;
var Gamestate;
var crashcounter = 0;
var doomcounter = 0;

// preloading images and sound
function preload(){
BgImg = loadImage("SpaceBg.png");

crash = loadSound("crash.mp3")
checkPointSound = loadSound("checkPointcopy.mp3")
RocketImg = loadImage("InsaneROCKET.png")
//RocketImg = loadAnimation("R1.png","R2.png", "R3.png", "R3.png");

ObstacleImg = loadImage("AsteroidImage.png")
Obstacle2Img = loadImage("Asteroid2Image.png")
Obstacle3Img = loadImage("Fireball_Image.png")
Obstacle4Img = loadImage("Asteroid3Img.png")

RestartImg = loadImage("restartcopy.png")
life5Img = loadImage("Heart1Img.png");
life4Img = loadImage("Heart2Img.png");
life3Img = loadImage("Heart3Img.png");
life2Img = loadImage("Heart4Img.png");
life1Img = loadImage("Heart5Img.png");

crashImg = loadImage("BoomImg.png");
}


function setup() {
  createCanvas(windowWidth,windowHeight);
  RocketImg.frameDelay = 10;
  // Space background
  SpaceBg = createSprite(windowWidth/2, windowHeight/2, 50, 50);
  SpaceBg.addImage("BgImg", BgImg);
  SpaceBg.scale = 3.5;
  SpaceBg.velocityX = -2;
  
// Rocket
  Rocket = createSprite(180,windowHeight/2); 
Rocket.addAnimation("rocket",RocketImg);
Rocket.scale = 0.75;
Rocket.setCollider("rectangle",0,10,290,140);
//Rocket.debug = true

  //create Obstacle group
  obstaclesGroup = createGroup();
     
  score = 0;
  highscore = 0;

  life = 5;

  Gamestate = "Start";
//add reset button
  resetButton = createSprite(windowWidth/2 , windowHeight/2+100);
   resetButton.addImage(RestartImg);
  resetButton.visible = false;
}

function draw() {
  background(0);

 
 //resetting the background
 if(SpaceBg.x<windowWidth/2-100){
  SpaceBg.x = windowWidth/2
}

 if (Gamestate === "Play"){
     
    
//move rocket up
  if(keyDown("w") || touches.length>0){
    Rocket.y -=4
    touches = [];
  }  
//move rocket down
  if(keyDown("s") || touches.length>0){
    Rocket.y +=4
    touches = [];
  }  
//move rocket forward
  if(keyDown("d") || touches.length>0){
    Rocket.x +=2
    touches = [];
  }  
  //reseting rocket if it goes too front
  if(Rocket.x>windowWidth-900){
    Rocket.x = 180;    
  }

  //reseting rocket if it goes too down 
  if(Rocket.y>windowHeight){
    Rocket.x = 180;  
    Rocket.y = windowHeight/2;
  }
  
  //reseting rocket if it goes too up
  if(Rocket.y<windowHeight/2-500){
    Rocket.x = 180;  
    Rocket.y = windowHeight/2;
  }
  //giving score
  score = score + Math.round(getFrameRate() / 60);

  if (score > 0 && score % 100 === 0) {
    checkPointSound.play()
  }
 
  //spawn obstacles 
  Obstacle();
 
// Obstacles from behind
  if(frameCount % 1400 === 0){
    doomcounter = 5;
   // warning sound
 }
if(doomcounter>0){
 ObstaclesDoom();
}

// check is touching and destroy the asteroid. Also reduce the life 
  if(life >0){
    for(var i=0; i< obstaclesGroup.length;i++){
      if(Rocket.isTouching(obstaclesGroup.get(i))){
        obstaclesGroup.get(i).destroy();
        crashcounter = 20;  
//  crash.play();
        life--
         //add code to remove life image;
    
      }
    }

  } else{
        Gamestate = "end" 
      }
    
    
  }
  
 drawSprites();
  //Life image
  heart();
  // start the game by pressing space
  if(Gamestate === "Start"){
    textSize(32)
    fill ("blue")
    text ("Press Space to Start" ,windowWidth/2-150, windowHeight/2);
    text("To move use W S D keys", windowWidth/2-170 , windowHeight/2-70);
  }
 //display boom image 
  if(crashcounter>0){
   
    image(crashImg, Rocket.x+50,Rocket.y-50,120,120);
    crashcounter--;
} 

// start game by hitting space bar
  if(Gamestate === "Start" && (keyDown("space") || touches.length>0)) {
    Gamestate = "Play";
    touches = [];
  }
 //gamestate end
  if (Gamestate === "end"){
      fill("red");
      stroke("yellow");
      textSize(40);
      obstaclesGroup.setVelocityXEach(0);
      obstaclesGroup.setLifetimeEach(-1);
      text("GAMEOVER", windowWidth/2-100 , windowHeight/2-100)
      
      resetButton.visible = true;
      
      if(mousePressedOver(resetButton) || touches.length>0){
        restart();
        touches = [];
      }
  }

  //displaying score
fill ("blue");
stroke("yellow");
textSize(32);
text("Score: " + score, windowWidth-340, 75);
//display high score
if(highscore>0){
  fill ("blue");
  stroke("yellow"); 
  text("High Score: " + highscore, windowWidth-340, 125);

}

}
//restarting the game
function restart(){

  Gamestate = "Play";
  if(highscore<score){
     highscore = score;

  }
  score = 0;
  life = 5;
  obstaclesGroup.destroyEach();
  resetButton.visible = false;
}



//asteroid creation
function Obstacle(){
   if (frameCount % 25 === 0){
    obstacle = createSprite(windowWidth,Math.round(random(2,windowHeight-2)),50,50);
    obstacle.velocityX = -(11 + score / 100);
    

    //generate random obstacles
    var rand = Math.round(random(1,4));
    switch (rand) {
      case 1:
        obstacle.addImage(ObstacleImg);
        break;
      case 2:
        obstacle.addImage(Obstacle2Img);
        break;
      case 3:
        obstacle.addImage(Obstacle3Img)  
        obstacle.scale = 0.5;
        obstacle.setCollider("rectangle",0,0,330,100);
        break;
      case 4:
        obstacle.addImage(Obstacle4Img);
        obstacle.setCollider("rectangle",0,0,60,60);
        break;  
    }  
       //Giving obstacle lifetime
       obstacle.lifetime = 159;

     // obstacle.debug = true

       //Adding into group
       obstaclesGroup.add(obstacle);
       
   }

}
// display life
function heart(){
  switch (life) {
   case 1:
      image(life1Img, 100,30,75,75);
      break;
    case 2:
      image(life1Img, 100,30,75,75)
      image(life2Img, 200,30,75,75)
      break;
    case 3:
      image(life1Img, 100,30,75,75)
      image(life2Img, 200,30,75,75)
      image(life3Img, 300,30,75,75)
      break;
      case 4:
      image(life1Img, 100,30,75,75)
      image(life2Img, 200,30,75,75)
      image(life3Img, 300,30,75,75)
      image(life4Img, 400,30,75,75)
      break;
      
      case 5:
      image(life1Img, 100,30,75,75)
      image(life2Img, 200,30,75,75)
      image(life3Img, 300,30,75,75)
      image(life4Img, 400,30,75,75)
      image(life5Img, 500,30,75,75)
      break;
  }  
}

//function for obstacles from behind
function ObstaclesDoom(){
  
  if(frameCount % 30 === 0){
 
 obstacle = createSprite(0,Math.round(random(2,windowHeight-2)),50,50);
 obstacle.velocityX = +(8 + score / 100);
 

 //generate random obstacles
 var rand = Math.round(random(1,3));
 switch (rand) {
   case 1:
     obstacle.addImage(ObstacleImg);
     break;
   case 2:
     obstacle.addImage(Obstacle2Img);
     break;
   case 3:
     obstacle.addImage(Obstacle4Img);
     obstacle.setCollider("rectangle",0,0,60,60);
     break;  
 }  
    //Giving obstacle lifetime
    obstacle.lifetime = 159;

  // obstacle.debug = true

    //Adding into group
    obstaclesGroup.add(obstacle);
    doomcounter--;
}

}
