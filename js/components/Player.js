// Create Player Component
Crafty.c("Player", {
  required: "2D, Canvas, Twoway, SpriteAnimation, Collision, ship",
  /* This function will be called when the component is added to an entity */
  init: function() {
    this.score = 0;
    //this.numLives = 3;
    this.x = 254 - 32 / 2;
    this.y = 768 - (34*2);
    this.twoway(100);
    this.bindEvents(this);
  },

  bindEvents: function(that) {
    that.bind("KeyDown", function(e) {
      if (e.key == Crafty.keys["SPACE"]) {
        Crafty.trigger('player_fired', that);
      }
    }).bind("EnterFrame", function(e) {
      // do something !
    }).bind('EnemyHit', function(data){
      Crafty.log('EnemyHit:',data)
      this.score += data.points;

      // Check if we need to update the hi-score
      if(this.score > __hiScore){
          __hiScore = this.score;
      }

      // Tell the Game that an enemy has been enemy_destroyed
      Crafty.trigger('enemy_destroyed');
    }).onHit('Bullet', function(o) {
      for (var i = 0; i < o.length; i++) {
        o[i].obj.trigger("explode_bullet");
      }
      // Explosion
      Crafty.e('Explosion').playPlayerExplosion({x: this.x-10, y: this.y-10});
      this.destroy();
      Crafty.trigger('player_killed');
    });
  },

  fire: function() {
    if(__gameState != STATE.PLAY)
      return;

    Crafty.e("Bullet").fire(0, {
      x: this.x + this.w / 2 - 3, // 3 is the bullet width divided by 2
      y: this.y - 20
    });
  },

  talk: function() {
    Crafty.log("Player 1 Ready!")
  }
})
