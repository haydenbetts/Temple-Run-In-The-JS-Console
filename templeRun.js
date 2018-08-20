/*
 TODO: 
 1) When obstacles are inserted, they seem to start one frame
 to the left of where they should be
 2) emojis
 3) closures (less global vars!!!!)
*/

var laneTemplateEmpty = "--------------------";
var laneTemplateInitial = "-------------------O"
var playerChar = "X";
var obstacle = "O";
var playerPos = 2;
var street = [laneTemplateInitial, laneTemplateInitial, laneTemplateEmpty, laneTemplateInitial, laneTemplateInitial];
var paused = false;
var highScore = 0;
var score = 0;

/* TODO we are having some trouble actually displaying the raw score.
   This is a hacky workaround.
*/
var displayScore = function() {
  if (score === 0 || score === -1) {
    return 0;
  } else {
    return score - 1;
  }
}

var keypressed;
/* frameCounter has a range 0-19. It increments each time
   animation runs. We reset it when it reaches 19 (e.g. when one
   elt has reached the end of street */
var frameCounter = 0;
var obstacleArray = [];

var drawPlayer = function(playerPos) {
  street[playerPos] = playerChar + street[playerPos].slice(1); 
}

function isHighestScore(score, highScore) {
  return score > highScore;
}

lose = function() {
  paused = true;
  return setTimeout(function() {
 
    
    if (isHighestScore(displayScore(), highScore)) {
      highScore = displayScore();
    }
    
    alert("Your score is: " + displayScore() + "\n" + "Your high score is: " + highScore);
    street = [laneTemplateInitial, laneTemplateInitial, laneTemplateEmpty, laneTemplateInitial, laneTemplateInitial];
    score = 0;
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
    clearInterval(animate);
    return;
  }
  
  if (frameCounter === 9) {
    
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
   
    
      obstacleArray = Array(5).fill(obstacle);
      obstacleArray[getRandomInt()] = "-";   // ['o', 'o', '-', 'o', 'o']

     street = street.map(function(lane, i){
       return lane.slice(0, length - 1) + obstacleArray[i];
     })
    
  }
    

  if(frameCounter === 19) {
     score++;
    
    /*
    this statement takes the first graphic below and turns it into the second
    "O---------O---------"
    "O---------O---------"
    "O-------------------"
    "X---------O---------"
    "O---------O---------"
    
    "----------O--------O"
    "----------O--------O"
    "X------------------O"
    "----------O---------"
    "----------O--------O"
    */
    
     obstacleArray = Array(5).fill(obstacle);
     obstacleArray[getRandomInt()] = "-";   // ['o', 'o', '-', 'o', 'o']

     street = street.map(function(lane, i){
       return '-' + lane.slice(1, length - 1) + obstacleArray[i];
     })
 
    
     street.forEach(function(lane){ console.log(lane)});
  }

    
                    
  // currently obstacles never appear at the far right end of the lane.
   street = street.map(function(lane) {
     return lane.slice(1) + '-';
   })
  
  var charUnderPlayer = street[playerPos].slice(0,1);
 
  if (charUnderPlayer === "O") {
    lose();
  }
      
  drawPlayer(playerPos);
  
   
  console.clear();
  console.log("Frame Count: " + frameCounter);
  console.log("Current Score: " + displayScore());
  console.log("Current Speed: " + (220 - (score*score)));
  street.forEach(function(lane){
    console.log(lane);
  });
  
  if(frameCounter === 19) {
    frameCounter = 0;
  } else {
    frameCounter++;
  }

};

/* this code calls animate after shorter and shorter time steps
   we could not use setInterval to achieve this because setInterval
   requires a static interval. So, the effect is achieved using setTimeout
   https://stackoverflow.com/questions/1280263/changing-the-interval-of-setinterval-while-its-running
*/

function setAcceleratingTimeout(callback, factor)
{
    var internalCallback = function(tick) {
        return function() {
            if (factor >= 50) {            
                window.setTimeout(internalCallback, factor - (score*score));
                callback();
            }
        }
    }(0);
     
    window.setTimeout(internalCallback, factor);
};
  

setAcceleratingTimeout(animate, 220)


function getRandomInt() {
  return Math.floor(Math.random() * Math.floor(5));
}