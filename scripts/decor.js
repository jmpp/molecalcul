(function(app) {
  'use strict';

  var decor = {};

  // ==========
  // Propriétés publiques
  // ==========

  // ========
  // Méthodes publiques
  // ========

  decor.create  = createDecor;
  decor.update  = updateDecor;

  // ===

  var reflets,
      plage,
      fond_marin,
      rochers_group,
      rochers_plan4,
      rochers_plan3,
      rochers_plan2,
      rochers_plan1,
      displacementFilter,
      count = 0;

  function createDecor() {

    // ====================
    // Fond bleu de l'ocean
    // ====================

    fond_marin = app.game.add.tileSprite(
      0,
      0,//app.game.cache.getImage('plage').height - 27,
      app.game.world.width,
      app.game.world.height,
      'undersea_texture'
    );

    // =======
    // Rochers
    // =======

    // Arrière plan
    rochers_plan4 = app.game.add.tileSprite(
      0,
      app.game.world.height - app.game.cache.getImage('rochers_plan4').height - 20,
      app.game.world.width,
      app.game.world.height,
      'rochers_plan4'
    );
    // rochers_plan4.tilePosition.x = -0.5 * app.game.cache.getImage('rochers_plan4').width;

    // Avant-dernier plan
    rochers_plan3 = app.game.add.tileSprite(
      0,
      app.game.world.height - app.game.cache.getImage('rochers_plan3').height - 20,
      app.game.world.width,
      app.game.world.height,
      'rochers_plan3'
    );

    // Second plan
    rochers_plan2 = app.game.add.tileSprite(
      0,
      app.game.world.height - app.game.cache.getImage('rochers_plan2').height - 20,
      app.game.world.width,
      app.game.world.height,
      'rochers_plan2'
    );

    // Premier plan
    rochers_plan1 = app.game.add.tileSprite(
      0,
      app.game.world.height - app.game.cache.getImage('rochers_plan1').height + 12,
      app.game.world.width,
      app.game.world.height,
      'rochers_plan1'
    );

    // Groupe de rochers
    rochers_group = app.game.add.group();
    rochers_group.addMultiple([rochers_plan4, rochers_plan3, rochers_plan2, rochers_plan1]);
    
    var displacementTexture = new Phaser.Sprite(app.game, 0, 0, 'displacement_map');
    displacementFilter = new PIXI.DisplacementFilter(displacementTexture.texture);

    rochers_group.filters = [ displacementFilter ];

    // ================
    // Reflets de l'eau
    // ================

    reflets = _initReflets(
      0,
      0,
      app.config.GAME_WIDTH,
      app.game.world.height
    );
  }

  function updateDecor() {
    reflets.filters[0].update(app.game.input.activePointer); // Maj du reflet
    // Maj du filtre de distorsion
    count += 1;
    displacementFilter.offset.x = count;
    displacementFilter.offset.y = count;

    // Effet de parallaxe sur le fond marin
    fond_marin.x = app.game.camera.x * 0.8;

    // Effet de parallaxe sur les fonds marins
    rochers_plan4.x = app.game.camera.x * 0.7;
    rochers_plan3.x = app.game.camera.x * 0.6;
    rochers_plan2.x = app.game.camera.x * 0.4;
    rochers_plan1.x = app.game.camera.x * 0.2;
  }

  /**
   * Reflets à la surface de l'eau
   */
  function _initReflets(x, y, width, height) {
    // Shaders
    var fragmentSrc = [
        "precision mediump float;",

        "uniform float     time;",
        "uniform vec2      resolution;",
        "uniform vec2      mouse;",

        "#define MAX_ITER 4",

        "void main( void )",
        "{",
            "vec2 v_texCoord = gl_FragCoord.xy / resolution;",

            "vec2 p =  v_texCoord * 8.0 - vec2(30.0);",
            "vec2 i = p;",
            "float c = 1.0;",
            "float inten = .01;",

            "for (int n = 0; n < MAX_ITER; n++)",
            "{",
                "float t = time * (1.0 - (3.0 / float(n+1)));",

                "i = p + vec2(cos(t - i.x) + sin(t + i.y),",
                "sin(t - i.y) + cos(t + i.x));",

                "c += 1.0/length(vec2(p.x / (sin(i.x+t)/inten),",
                "p.y / (cos(i.y+t)/inten)));",
            "}",

            "c /= float(MAX_ITER);",
            "c = 1.5 - sqrt(c);",

            "vec4 texColor = vec4(0.0, 0.07, 0.1, 0.5);",

            "texColor.rgb *= (1.0 / (1.0 - (c + 0.01)));",

            "vec4 blankColor = vec4(0.0, 0.0, 0.0, 0.0);",

            "gl_FragColor = mix(texColor, blankColor, 0.5);",
        "}"
    ];

    // Création du filtre
    var refletsFilter = new Phaser.Filter(app.game, null, fragmentSrc);
    refletsFilter.setResolution(app.config.GAME_WIDTH, app.game.world.height);

    // Création du sprite cible
    var reflets = app.game.add.sprite();
    reflets.position.set(x, y);
    reflets.width = width;
    reflets.height = height;
    reflets.filters = [ refletsFilter ];

    return reflets;
  }

  // Exports
  app.decor = decor;

})(window.app);