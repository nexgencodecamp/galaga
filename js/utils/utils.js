function displayScores(){

  // Destroy labels if created
  Crafty('OneUp').destroy();
  Crafty('HiScore').destroy();
  Crafty('PlayerScore').destroy();
  Crafty('PlayerHiScore').destroy();

  // Create the labels
  createOneUpLabel();
  createHiScoreLabel();
  createPlayerScore();
  createPlayerHiScore();
}

function createOneUpLabel(){
  Crafty.e("OneUp, 2D, Canvas, Text")
    .attr({ x: 20, y: 5, z: 20 })
    .text("1UP").textColor('#FF0000').textFont({ size: '18px', family: 'joystixmonospace' });
}

function createHiScoreLabel(){
  Crafty.e("HiScore, 2D, Canvas, Text")
    .attr({ x: 150, y: 5, z: 20 })
    .text("HIGH SCORE").textColor('#FF0000').textFont({ size: '18px', family: 'joystixmonospace' });
}

function createPlayerScore(){
  Crafty.e("PlayerScore, 2D, Canvas, Text")
    .attr({ x: 50, y: 25, z: 20 })
    .text(pad(__player.score, 2)).textColor('#FFFFFF').textFont({ size: '18px', family: 'joystixmonospace' });
}

function createPlayerHiScore(){
  Crafty.e("PlayerHiScore, 2D, Canvas, Text")
    .attr({ x: 180, y: 25, z: 20 })
    .text(pad(__hiScore, 2)).textColor('#FFFFFF').textFont({ size: '18px', family: 'joystixmonospace' });
}

function displayLives(){
  // Destroy lives
  Crafty('ShipLife_0').destroy();
  Crafty('ShipLife_1').destroy();
  Crafty('ShipLife_2').destroy();

  for(let i=0; i < __numLives-1; i++){
    Crafty.e('ShipLife_'+i+', 2D, Canvas, Image').image("../img/ship.png").attr({x:10 + (i*34), y:734, z: 20 });
  }
}

function displayReady(){
  Crafty.e("Ready, 2D, Canvas, Text")
    .attr({ x: Crafty.viewport.width/2 - 50, y: Crafty.viewport.height/2 - 10, z: 20 })
    .text("READY").textColor('#00FFFF').textFont({ size: '18px', family: 'joystixmonospace' });
}

function displayLevel(){
  Crafty.e("Level, 2D, Canvas, Text")
    .attr({ x: Crafty.viewport.width/2 - 50, y: Crafty.viewport.height/2 - 10, z: 20 })
    .text("Level "+__level.levelNumber).textColor('#00FFFF').textFont({ size: '18px', family: 'joystixmonospace' });
}

function displayGameOver(){
  Crafty.e("GameOver, 2D, Canvas, Text")
    .attr({ x: Crafty.viewport.width/2 - 75, y: Crafty.viewport.height/2 - 10, z: 20 })
    .text("GAME OVER").textColor('#FFFF00').textFont({ size: '18px', family: 'joystixmonospace' });
}

function displayPushSToStart(){
  Crafty.e("PushToStart, 2D, Canvas, Text")
    .attr({ x: Crafty.viewport.width/2 - 125, y: Crafty.viewport.height/2 + 20, z: 20 })
    .text("PUSH S TO START").textColor('#00FFFF').textFont({ size: '18px', family: 'joystixmonospace' });
}

function displayGameComplete(){
  // Destroy game complete sign then recreate it
  Crafty('GameComplete').destroy();
  Crafty.e('GameComplete, 2D, Canvas, Text')
    .attr({ x: Crafty.viewport.width/2 - 150, y: Crafty.viewport.height/2 - 10, z: 20 })
    .text("*** GAME COMPLETE ***").textColor('#FF00FF').textFont({ size: '18px', family: 'joystixmonospace' });
}


function pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}

/* Global KEY EVENTS */
Crafty.bind('KeyDown', function(event) {
    if(event.keyCode === Crafty.keys.S){
      // Start game
      startGame();
    }
});
