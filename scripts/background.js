(function(app) {
  'use strict';

  function Background() {}

  Background.prototype.init = function initBackground() {

    // Montagnes
    this.montagnes = new PIXI.Sprite.fromFrame(app.config.IMAGES_PATH + '/montagnes.png');
    this.montagnes.width /= 1.5;
    this.montagnes.height /= 1.5;
    this.montagnes.position.x = app.renderer.view.width - this.montagnes.width;
    this.montagnes.position.y = app.renderer.view.height / 2 - this.montagnes.height + 50;
    app.game.stage.addChild(this.montagnes);

    // Displacement filter
    this.displacementTexture = PIXI.Texture.fromFrame(app.config.IMAGES_PATH + '/displacement_map.jpg');
    this.displacementFilter = new PIXI.DisplacementFilter(this.displacementTexture);

    // Conteneur pour les éléments dans l'eau
    this.eauContainer = new PIXI.DisplayObjectContainer();
    this.eauContainer.position.set(0, app.renderer.view.height / 2);
    this.eauContainer.width = app.renderer.view.width;
    this.eauContainer.height = app.renderer.view.height / 2;
    this.eauContainer.filters = [this.displacementFilter];
    app.game.stage.addChild(this.eauContainer);

    // Fond marin bleu
    this.fondMarin = new PIXI.Sprite.fromFrame(app.config.IMAGES_PATH + '/fond_marin.png');
    this.fondMarin.width = app.renderer.view.width;
    this.fondMarin.height = app.renderer.view.height / 2;
    this.eauContainer.addChild(this.fondMarin);

    // Pattern de vagues
    this.vagues = new PIXI.TilingSprite(
      PIXI.Texture.fromFrame(app.config.IMAGES_PATH + '/vagues.png'),
      this.eauContainer.width,
      this.eauContainer.height
    );
    this.vagues.alpha = 0.1;
    this.eauContainer.addChild(this.vagues);

    // Gère l'offset des vagues & du filter
    this._count = 0;
  }

  Background.prototype.update = function updateBackground() {
    this._count += 0.1;

    this.displacementFilter.offset.x = this._count * 20;
    this.displacementFilter.offset.y = this._count * 25;

    // Déplacement des tuiles
    this.vagues.tilePosition.x = this._count * 10;
  };

  Background.prototype.render = function renderBackground() {
    
  };

  app.background = new Background();
})(window.app);