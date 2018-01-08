/**** CONSTANTS ****/
const STATE = {
  ASSETS_LOADED: 0,
  INIT: 1,
  PLAY: 2,
  LOST_LIFE: 3,
  GAME_OVER: 4,
  LEVEL_COMPLETE: 5,
  GAME_COMPLETED: 6
}

const LEVEL_OPTIONS = {
  ONE: {
    levelNumber: 1,
    totalNumEnemies: 2, // MUST equal the sum of all enemies
    nextLevel: "TWO",
    enemies: [
      {
        type: "bee",
        numInRow: 2
      }
    ]
  },
  TWO: {
    levelNumber: 2,
    totalNumEnemies: 3, // MUST equal the sum of all enemies
    nextLevel: "THREE",
    enemies: [
      {
        type: "butterfly",
        numInRow: 3
      }
    ]
  },
  THREE: {
    levelNumber: 3,
    totalNumEnemies: 5, // MUST equal the sum of all enemies
    nextLevel: "END",
    enemies: [
      {
        type: "bee",
        numInRow: 5
      }
    ]
  }
}

/**** GLOBAL VARIABLES ****/
let __starField, __level, __numBulletsInPlay, __hiScore, __player, __numLives, __enemies, __gameState;

/**** SPRITES ****/
Crafty.sprite("../img/ship.png", {
  ship: [0, 0, 32, 34]
});
Crafty.sprite(26, 20, "../img/enemy-1-sprite-T20x26.png", {
  bee: [0, 0]
});
Crafty.sprite(26, 20, "../img/enemy-2-sprite-T26x20.png", {
  butterfly: [0, 0]
});
Crafty.sprite(6, 16, "../img/ship-bullet-T6x16.png", {
  bullet: [0, 0]
});
Crafty.sprite(60, 60, "../img/enemy-explosion-T60x60.png", {
  enemy_explosion: [0, 0]
});
Crafty.sprite(60, 64, "../img/player-explosion-T60x64.png", {
  player_explosion: [0, 0]
});

/**** SOUNDS ****/

// Kick the game off!
initialiseGame();

/**** EVENTS ****/
Crafty.bind('player_fired', function(player) {
  if (__numBulletsInPlay < 3 && __gameState === STATE.PLAY) {
    player.fire();
    __numBulletsInPlay++
    Crafty.log('Player fired. Num bullets in play=', __numBulletsInPlay)
  }
})
Crafty.bind('enemy_bullet_destroyed', function() {
  __numBulletsInPlay--
  Crafty.log('Num bullets in play=', __numBulletsInPlay)
})
Crafty.bind('enemy_destroyed', function() {
  Crafty.log('Enemy destroyed')

  // Update level
  __level.totalNumEnemies--
  if(__level.totalNumEnemies === 0){
    __gameState = STATE.LEVEL_COMPLETE;
    Crafty.log('Level Complete, State=', __gameState)

    // If there is another level, reset and move on!
    if(__level.nextLevel === "END"){
      // Game Complete
      __gameState = STATE.GAME_COMPLETED;
      Crafty.log('Game Complete, State=', __gameState)
    }
    else {
      Crafty.log('Moving to next level...');
      initialiseLevel(__level.nextLevel)
    }
  }
})
Crafty.bind('player_killed', function() {
  __gameState = STATE.LOST_LIFE;
  Crafty.log('Player Killed...')
  __numLives--;
  displayLives();
  if(__numLives > 0){
    Crafty.e('Delay').delay(displayReady, 2000, 0);
    Crafty.e('Delay').delay(function(){
      Crafty('Ready').destroy();
      __player = Crafty.e("Player");
      //enemy_1 = Crafty.e("Enemy");
      __gameState = STATE.PLAY;
      Crafty.trigger('play_started');
    }, 4000, 0);
  }
  else{
    __gameState = STATE.GAME_OVER;
    displayGameOver();
    Crafty.e('Delay').delay(displayPushSToStart, 2000, 0);
  }
})
Crafty.bind('EnterFrame', function() {
  if(__gameState === STATE.INIT)
    return;

  if(__gameState === STATE.LEVEL_COMPLETE){
    return;
  }

  if(__gameState === STATE.GAME_COMPLETED){
    displayGameComplete()
    return;
  }

  displayScores()
  displayLives()

  if(__gameState === STATE.PLAY){
    if(Crafty.frame() % 50 === 1){
      createOneUpLabel();
    }
    if(Crafty.frame() % 50 < 25){
      Crafty('OneUp').destroy();
    }
  }
  if( __gameState === STATE.ASSETS_LOADED || __gameState === STATE.GAME_OVER){
    if(Crafty.frame() % 50 < 25){
      Crafty('PushToStart').destroy();
    }
    else if(Crafty('PushToStart').length === 0){
      displayPushSToStart();
    }
  }
})

function reset() {
  __level = LEVEL_OPTIONS.ONE;
  __numBulletsInPlay = 0;
  __hiScore = 0;
  __player = null;
  __numLives = 3;
  __gameState = STATE.INIT;
  __enemies = [];

  // Kill entities
  __starField = null;
  Crafty('Player').destroy();
  Crafty('Enemy').destroy();
}

function resetLevel(level){
  __level = LEVEL_OPTIONS[level];
  __numBulletsInPlay = 0;
}

function initialiseGame(){
  // Reset all the global variables
  reset();

  // Draw screen after all assets load
  Crafty.init(508, 768, document.getElementById('game'));

  // Add black Background with no image
  Crafty.background('#000000');

  // Create the Starfield
  __starField = new Starfield(game);
  __starField.start();

  // Add a Player
  __player = Crafty.e("Player")

  // Add enemies
  for(var i=0; i < __level.enemies.length; i++){
    let enemy = __level.enemies[i];
    for(var j=0; j <  enemy.numInRow; j++){
      // Create an Enemy
      let en = Crafty.e("Enemy")
      en.afterInit({
        id: en.getId(),
        type: enemy.type,
        x_offset: (j*40),
        attackFrom: 1000 + (j*1000),
        attackTo: (j+1)*2000
      });
      __enemies.push(en);
    }
  }

  displayPushSToStart();
  __gameState = STATE.ASSETS_LOADED;
}

function initialiseLevel(level){
  // Reset all the global variables
  resetLevel(level);

  // Add enemies
  for(var i=0; i < __level.enemies.length; i++){
    let enemy = __level.enemies[i];
    for(var j=0; j <  enemy.numInRow; j++){
      // Create an Enemy
      let en = Crafty.e("Enemy")
      en.afterInit({
        id: en.getId(),
        type: enemy.type,
        x_offset: (j*40),
        attackFrom: 1000 + (j*1000),
        attackTo: (j+1)*2000
      });
      __enemies.push(en);
    }
  }

  Crafty.e('Delay').delay(displayLevel, 800, 0);
  Crafty.e('Delay').delay(function(){
    Crafty('Level').destroy();
    __gameState = STATE.PLAY;
    Crafty.trigger('play_started');
  }, 3000, 0);
}

function startGame(){
  // If we are starting from a GAME_OVER state we need to initialise
  if(__gameState === STATE.GAME_OVER){
    Crafty('GameOver').destroy();
    initialiseGame();
  }

  Crafty('PushToStart').destroy();
  __gameState = STATE.PLAY;
  // Let's inform the components that play has started
  Crafty.trigger('play_started');
}
