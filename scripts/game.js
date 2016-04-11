(function(app) {
  'use strict';

  function Game() {}

  Game.prototype.init = function initGame() {
    this.stage = new PIXI.Stage(0xFFFFFF, true);
  };

  Game.prototype.update = function updateGame() {
    app.background.update();
  };

  Game.prototype.render = function renderGame() {
    app.background.render();
  };

  app.game = new Game();
})(window.app);