(function(app) {
  'use strict';

  var UI = {};

  // ==========
  // Propriétés publiques
  // ==========

  // ========
  // Méthodes publiques
  // ========

  UI.create  = createUI;
  UI.render  = renderUI;

  // ===

  // Stockera la suite de nombres ramassés par le joueur ...
  var numbers = [];
  var infoPhrase = {};

  function createUI() {
    // Phrase de récapitulatif des opérations en haut de l'écran
    // infoPhrase = app.game.add.text(0, 0, "Opération =", {fontSize:'3rem',fill:'#fff',boundsAlignH:'center'});
    // infoPhrase.setTextBounds(0, 0, app.config.GAME_WIDTH, 50);
    // infoPhrase.fixedToCamera = true;
  }

  function renderUI() {
  }

  // Exports
  app.UI = UI;

})(window.app);