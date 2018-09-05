/*
 TODO: 
 1) When obstacles are inserted, they seem to start one frame
 to the left of where they should be
 2) emojis
 3) currently the speed increases proportionate the the
 square of the score. THis means that the game gets VERY hard
 very fast. We could come up with a different algo for this 
 that makes it more fun. 
 4) closures (less global vars!!!!)
*/

var playerChar = '😆'; //"X";
var obstacleDefaults = ['🚋', '🚗', '🚎', '🚒', '🚜'];
var obstacle = () => obstacleDefaults[getRandomInt()];// "O";
var obstacleArray = [];
var laneTemplateEmpty = "------------------------------";
var laneTemplateObstacle = "----------------------------" + obstacle();
var playerPos = 2;
var street = [laneTemplateObstacle, laneTemplateObstacle, laneTemplateEmpty, laneTemplateObstacle, laneTemplateObstacle];
var paused = false;
var displayScore = 0;
var speed = 0;
var newFactor;
var highScore = 0;


var keypressed;
/* frameCounter has a range 0-19. It increments each time
   animation runs. We reset it when it reaches 19 (e.g. when one
   elt has reached the end of street */
var frameCounter = 0;

var drawPlayer = function(playerPos) {
  street[playerPos] = playerChar + street[playerPos].slice(2); 
}

function isHighestScore(displayScore, highScore) {
  return displayScore > highScore;
}

lose = function() {
  paused = true;
  return setTimeout(function() {
    
    
    if (isHighestScore(displayScore, highScore)) {
      highScore = displayScore;
    }
    alert("Your score is: " + displayScore + "\n" + "Your high score is: " + highScore);
    street = [laneTemplateObstacle, laneTemplateObstacle, laneTemplateEmpty, laneTemplateObstacle, laneTemplateObstacle];
    speed = 0;
    displayScore = 0;
    paused = false;
    playerPos = 2;
    frameCounter = 0;
  }, 60);
};


keypressed = null;

movements = {
  40: function() {
    if (playerPos < street.length - 1) {
      return playerPos++;
    }
  },
  38: function() {
    if (playerPos > 0) {
      return playerPos--;
    }
  }
};

document.onkeydown = function(arg) {
  var keyCode = arg.keyCode;
  keypressed = keyCode;
};

var animate = function(){
    
  if(paused){
    return;
  }
  
  if (movements[keypressed]) {
    movements[keypressed]();
    keypressed = null;
  }
  
  if (keypressed === 27) {
    return;
  }
  
  if(street.some((lane) => obstacleDefaults.includes(lane.slice(0,2)))) {
     displayScore++
     street = street.map(function(lane, i){
       return '--' +lane.slice(2);
     })
     
  }

  if ((frameCounter === 14 || frameCounter === 30) && speed < 4) {
    speed++;
 
    
    /* this statement takes the first graphic like the below 
    and turns it into the second
    "----------O---------"
    "----------O---------"
    "X-------------------"
    "----------O---------"
    "----------O---------"
    
    "----------O--------O"
    "----------O--------O"
    "X------------------O"
    "----------O---------"
    "----------O--------O" */
   
    
      obstacleArray = [obstacle(), obstacle(), obstacle(), obstacle(), obstacle()];
      obstacleArray[getRandomInt()] = "--";   // ['o', 'o', '-', 'o', 'o']

     street = street.map(function(lane, i){
       return lane.slice(0, -2) + obstacleArray[i];
     })
  }
  
    if ((frameCounter === 10 || frameCounter === 20 || frameCounter === 30) && speed >= 4) {
    speed++;
 
    
    /* this statement takes the first graphic below 
    and turns it into the second
    "----------O---------"
    "----------O---------"
    "X-------------------"
    "----------O---------"
    "----------O---------"
    
    "----------O--------O"
    "----------O--------O"
    "X------------------O"
    "----------O---------"
    "----------O--------O" */
   
    
      obstacleArray = [obstacle(), obstacle(), obstacle(), obstacle(), obstacle()];
      obstacleArray[getRandomInt()] = "--";   // ['o', 'o', '-', 'o', 'o']

     street = street.map(function(lane, i){
       return lane.slice(0, -2) + obstacleArray[i];
     })
  }
    
                    
  // currently obstacles never appear at the far right end of the lane.
   street = street.map(function(lane) {
     return lane.slice(2) + '--';
   })
  
  var charUnderPlayer = street[playerPos].slice(0,2);
 // String.fromCodePoint(parseInt('1F4A3', 16))
 
      
  drawPlayer(playerPos);

  if (obstacleDefaults.indexOf(charUnderPlayer) > -1) {
    street[playerPos] = '🔥' + street[playerPos].slice(2);
    lose();
  }
   
  console.clear();
  displayHeader(highScore, displayScore, newFactor);
  street.forEach(function(lane){
    console.log(lane);
  });
  
  if(frameCounter === 30) {
    frameCounter = 0;
  } else {
    frameCounter+= 2;
  }

};

function displayHeader(highScore, displayScore, newFactor) {
  console.log("High Score: " + highScore);
  console.log("Score: " + displayScore);
  console.log("Current Speed: " + (301 - newFactor)); 
}

/* this code calls animate after shorter and shorter time steps
   we could not use setInterval to achieve this because setInterval
   requires a static interval. So, the effect is achieved using setTimeout
   https://stackoverflow.com/questions/1280263/changing-the-interval-of-setinterval-while-its-running
*/

function setAcceleratingTimeout(animationFrame, factor)
{
    var internalCallback = function() {
        return function() {
            if (speed <= 6) { 
                newFactor = factor - (speed*speed*5);
                setTimeout(internalCallback, newFactor);
                animationFrame();
            } else {
                setTimeout(internalCallback, newFactor);
                animationFrame();
            }
        }
    }();
     
    window.setTimeout(internalCallback, factor);
};
  

setAcceleratingTimeout(animate, 300)


function getRandomInt() {
  return Math.floor(Math.random() * Math.floor(5));
}
