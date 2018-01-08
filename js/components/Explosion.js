// Create Explosion Component
Crafty.c("Explosion", {
  required: "2D, Canvas, Color, SpriteAnimation, Collision",
  /* This function will be called when the component is added to an entity */
  init: function() {
    this.EXPLOSION_TYPE_ENEMY = 0;
    this.EXPLOSION_TYPE_PLAYER = 1;
    this.attr({w: 60, h: 60})
    this.bindEvents(this);

    // Animate the explosion
    this.reel('EnemyExplosion', 1000, [[0, 0],[1, 0],[2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0]]);
    this.reel('PlayerExplosion', 1000, [[0, 0],[1, 0],[2, 0], [3, 0], [4, 0]]);
  },

  bindEvents: function(that) {
    that.bind('AnimationEnd', function(n) {
      that.destroy();
    })
  },

  play: function(pos){
    this.removeComponent('player_explosion')
    this.addComponent('enemy_explosion')
    this.x = pos.x;
    this.y = pos.y;
    this.animate('EnemyExplosion', 0);
  },

  playPlayerExplosion: function(pos){
    this.removeComponent('enemy_explosion')
    this.addComponent('player_explosion')
    this.x = pos.x;
    this.y = pos.y;
    this.attr({w: 60, h: 64})
    this.animate('PlayerExplosion', 0);
  },

  talk: function() {
    console.log("Bullet ready!")
  }
})
