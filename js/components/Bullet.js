// Create Bullet Component
Crafty.c("Bullet", {
  required: "2D, Canvas, Color, SpriteAnimation, Collision, Tween, bullet",
  /* This function will be called when the component is added to an entity */
  init: function() {
    this.BULLET_TYPE_SHIP = 0;
    this.BULLET_TYPE_ENEMY = 1;
    this.reel('PlayerBullet', 100, [[0, 0]]);
    this.reel('EnemyBullet', 100, [[1, 0]]);
    this.bindEvents(this);
    this.attr({w: 6, h: 16})
  },

  bindEvents: function(that) {
    that.bind("EnterFrame", function(e) {
      if (that.y < -16) {
        that.destroy();
        Crafty.trigger('enemy_bullet_destroyed');
      }
    }).bind('explode_bullet', function() {
      that.destroy();
    })
  },

  fire: function(type, pos) {
    if (type === this.BULLET_TYPE_SHIP) {
      // Fire player bullet
      this.animate('PlayerBullet', -1);
      this.attr({x: pos.x, y: pos.y}).tween({
        y: -20
      }, 3750)
    }
    if (type === this.BULLET_TYPE_ENEMY) {
      // Fire enemy bullet
      this.animate('EnemyBullet', -1);
      this.attr({x: pos.x, y: pos.y}).tween({
        y: 788
      }, 3750)
    }
  },

  talk: function() {
    console.log("Bullet ready!")
  }
})
