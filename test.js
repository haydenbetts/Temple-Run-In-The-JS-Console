
var laneTemplateEmpty = "-------------------";
var laneTemplateInitial = "------------------O"
var playerChar = "X";
var obstacle = "O";
var playerPos = 2;
var street = [laneTemplateInitial, laneTemplateInitial, laneTemplateEmpty, laneTemplateInitial, laneTemplateInitial];
var paused = false;
var highScore = 0;
var score = 0;
var keypressed;

var drawPlayer = function(playerPos) {
  street[playerPos] = playerChar + street[playerPos].slice(1); 
}

function isHighestScore(score, highScore) {
  return score > highScore;
}

lose = function() {
  paused = true;
  return setTimeout(function() {
    score--
    if (score === -1) {
      score = 0;
    };
    
    if (isHighestScore(score, highScore)) {
      highScore = score;
    }
    
    alert("Your score is: " + score + "\n" + "Your high score is: " + highScore);
    score = 0;
    paused = false;
    playerPos = 2;
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
    

  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some
   
  if(street.some(function(elt) { return elt.slice(0,1) === "O"})) {
     score++;
     street = Array(5).fill(laneTemplateInitial);
     street[getRandomInt()] = laneTemplateEmpty;
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
  console.log("Current Score: " + score);
  console.log("Current Speed: " + (220 - (score*score)));
  street.forEach(function(lane){
    console.log(lane);
  });

};

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