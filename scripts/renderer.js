(function(app) {
  'use strict';

  var renderer = PIXI.autoDetectRenderer(app.config.GAME_WIDTH, app.config.GAME_HEIGHT);
  renderer.view.style.width    = app.config.GAME_WIDTH + "px";
  renderer.view.style.height   = app.config.GAME_HEIGHT + "px";
  renderer.view.style.display  = "block";
  renderer.view.style.position = "absolute"
  renderer.view.style.left     = 0;
  renderer.view.style.right    = 0;
  renderer.view.style.top      = 0;
  renderer.view.style.bottom   = 0;
  document.body.appendChild(renderer.view);

  app.renderer = renderer;
})(window.app);