(function(app) {
  'use strict';

  app.config = {
    GAME_WIDTH  : (window.innerHeight*16)/9,
    GAME_HEIGHT : window.innerHeight,
    IMAGES_PATH : './images',
    SOUNDS_PATH : './sounds',
    DEBUG       : false,
  };

  app.config.WORLD_WIDTH  = app.config.GAME_WIDTH * 5;
  app.config.WORLD_HEIGHT = app.config.GAME_HEIGHT;
  
})(window.app);