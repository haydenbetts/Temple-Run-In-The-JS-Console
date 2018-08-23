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
var laneTemplateInitial = "----------------------------";
var playerPos = 2;
var street = [laneTemplateInitial + obstacle(), laneTemplateInitial + obstacle(), laneTemplateEmpty, laneTemplateInitial + obstacle(), laneTemplateInitial + obstacle()];
var paused = false;
var displayScore = 0;
var highScore = 0;
var score = 0;
var newFactor;


var keypressed;
/* frameCounter has a range 0-19. It increments each time
   animation runs. We reset it when it reaches 19 (e.g. when one
   elt has reached the end of street */
var frameCounter = 0;

var drawPlayer = function(playerPos) {
  street[playerPos] = playerChar + street[playerPos].slice(2); 
}

function isHighestScore(score, highScore) {
  return score > highScore;
}

lose = function() {
  paused = true;
  return setTimeout(function() {
 
    
    if (isHighestScore(displayScore, highScore)) {
      highScore = displayScore;
    }
    alert("Your score is: " + displayScore + "\n" + "Your high score is: " + highScore);
    street = [laneTemplateInitial + obstacle(), laneTemplateInitial + obstacle(), laneTemplateEmpty, laneTemplateInitial + obstacle(), laneTemplateInitial + obstacle()];
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
  
  if (frameCounter === 14) {
    displayScore++;
    
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
    

  if(frameCounter === 30) {
     score++;
     displayScore++;
    
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
    
     obstacleArray = obstacleArray = [obstacle(), obstacle(), obstacle(), obstacle(), obstacle()];
     obstacleArray[getRandomInt()] = "--";   // ['o', 'o', '-', 'o', 'o']

     street = street.map(function(lane, i){
       return '--' +lane.slice(2, -2) + obstacleArray[i];
     })
 
    
     street.forEach(function(lane){ console.log(lane)});
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
  console.log("High Score: " + highScore);
  console.log("Score: " + displayScore);
  console.log("Current Speed: " + (301 - newFactor)); //speed = score*score? (increment rather)
  //console.log("Char under Player: " + charUnderPlayer.codePointAt(0).toString(16)); //necessary?
  street.forEach(function(lane){
    console.log(lane);
  });
  
  if(frameCounter === 30) {
    frameCounter = 0;
  } else {
    frameCounter+= 2;
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
            if (score <= 6) { 
                newFactor = factor - (score*score*5.5);
                window.setTimeout(internalCallback, newFactor);
                callback();
            } else {
                window.setTimeout(internalCallback, newFactor);
                callback();
            }
        }
    }(0);
     
    window.setTimeout(internalCallback, factor);
};
  
// updated
setAcceleratingTimeout(animate, 300)


function getRandomInt() {
  return Math.floor(Math.random() * Math.floor(5));
}