(function(app) {
  'use strict';

  var level = {};

  // ==========
  // Propriétés publiques
  // ==========



  // ========
  // Méthodes publiques
  // ========

  level.create = createLevel;
  level.update = updateLevel;
  level.render = renderLevel;

  // ===

  /*
    '+' => Addition
    '–' => Soustraction
    '×' => Multiplication
    '÷' => Division
  */

  /*level.levelTest = [
    '1 2 3 4 5 6 7 8 9 10 11 12 13',
    '2 + ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~',
    '3 ~ – ~ ~ ~ ~ ~ ~ ~ ~ ~ ~',
    '4 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~',
    '5 ~ ~ ~ ÷ ~ ~ ~ ~ ~ ~ ~ ~',
    '6 ~ ~ ~ ~ + ~ ~ ~ ~ ~ ~ ~',
    '7 ~ ~ ~ ~ ~ × ~ ~ ~ ~ ~ ~',
  ];*/

  level.maps = [
    // Level 1
    [
      '~ ~  ~ ~ ~ ~ ~ ~ ~ ~   ~   ~ ~          ~ ~ ~ ~ ~ ~ ~ 2 ~ ~   ~   ~ ~          ~ ~ ~ ~ ~ ~ ~  ~ ~ ~   ~   ~ ~          ~ ~ ~ ~ ~ 4 ~ ~ ~ ~   ~   ~ ~          ~ ~ ~   ~ ~ ~ ~ ~ ~ ~  ~  ~ ~',
      '~ ~  ~ ~ ~ ~ ~ 4 ~ ~   ~   ~ ~          ~ ~ ~ ~ ~ ~ ~ ~ ~ ~   ~   ~ ~          ~ ~ ~ ~ ~ ~ ~ 10 ~ ~   ~   ~ ~          ~ ~ 5 5 5 5 5 ~ ~ ~   ~   ~ ~          ~ ~ ~   ~ ~ ~ ~ ~ ~ ~  ~  ~ ~',
      '~ ~  ~ ~ ~ ~ ~ ~ ~ ~   ~   ~ ~          ~ ~ ~ ~ ~ ~ ~ ~ ~ ~   ~   ~ ~          ~ ~ ~ ~ ~ ~ ~  ~ ~ ~   ~   ~ ~          ~ ~ ~ ~ ~ ~ ~ ~ ~ ~   ~   ~ ~          ~ ~ ~   ~ ~ ~ ~ ~ ~ ~  ~  ~ ~',
      '~ P0 ~ ~ ~ ~ ~ ~ ~ ~   ~   ~ ~          ~ ~ ~ ~ ~ ~ ~ ~ ~ ~   ~   ~ ~          ~ ~ ~ ~ ~ ~ ~  ~ ~ ~   ~   ~ ~          ~ ~ ~ ~ ~ ~ ~ ~ ~ ~   ~   ~ ~          ~ ~ ~   ~ ~ ~ ~ ~ ~ ~  ~  ~ ~',
      '~ ~  ~ ~ ~ ~ ~ ~ ~ ~   ~   ~ ~          ~ ~ ~ ~ ~ ~ ~ ~ ~ ~   ~   ~ ~          ~ ~ ~ ~ ~ ~ ~  ~ ~ ~   ~   ~ ~          ~ ~ ~ ~ ~ ~ ~ ~ ~ ~   ~   ~ ~          ~ ~ ~   ~ ~ ~ × 0 ~ ~  ~  ~ ~',
      '~ ~  ~ ~ ~ ~ 6 ~ ~ ~   ~   ~ ~          ~ ~ ~ ~ ~ ~ ~ ~ ~ ~   ~   ~ ~          ~ ~ ~ ~ ~ ~ ~  ~ ~ ~   ~   ~ ~          ~ ~ ~ ~ ~ ~ ~ ~ ~ ~   ~   ~ ~          ~ ~ ~   ~ ~ ~ ~ ~ ~ ~  ~  ~ ~',
      '~ ~  ~ ~ ~ ~ ~ ~ ~ ~ (10)  ~ ~          ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ (12)  ~ ~          ~ ~ ~ ~ ~ ~ 9  ~ ~ ~ (21)  ~ ~          ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ (25)  ~ ~          ~ ~ ~   ~ ~ ~ ~ ~ ~ ~ (0) ~ ~',
    ],

    // Level 2
    [
      '~ ~  ~ ~ 5 ~ ~ ~  ~  ~ ~ ~    ~          ~ ~ ~ ~ ~ ~ ~ 2 ~ ~   ~   ~ ~',
      '~ ~  ~ ~ ~ ~ ~ ~  ~  ~ ~ ~    ~          ~ ~ ~ ~ ÷ ~ ~ 2 ~ ~   ~   ~ ~',
      '~ ~  ~ ~ ~ ~ ~ ~  ~  ~ ~ ~    ~          ~ ~ ~ ~ ~ ~ ~ 2 ~ ~   ~   ~ ~',
      '~ P2 ~ 3 ~ 2 ~ ~  ~  ~ ~ ~    ~          ~ ~ ~ ~ ~ ~ ~ 2 ~ ~   ~   ~ ~',
      '~ ~  ~ ~ ~ ~ ~ ~  ~  ~ ~ ~    ~          ~ ~ ~ ~ ~ ~ ~ 2 ~ ~   ~   ~ ~',
      '~ ~  ~ ~ ~ ~ ~ ~  ~  ~ ~ ~    ~          ~ ~ ~ ~ ~ ~ ~ 2 ~ ~   ~   ~ ~',
      '~ ~  ~ ~ ~ ~ ~ ~ (7) ~ ~ ~ (10)          ~ ~ ~ ~ ~ ~ ~ 2 ~ ~   (5)   ~ ~',
    ]
  ];

  function createLevel(level_map) {

    // Groupe qui contient les cellules à ramasser pour faire des opérations
    level.cells                 = app.game.add.group();
    level.cells.enableBody      = true;
    level.cells.physicsBodyType = Phaser.Physics.ARCADE;

    // Groupe qui contient les algues obstacles à passer
    level.obstacles                 = app.game.add.group();
    level.obstacles.enableBody      = true;
    level.obstacles.physicsBodyType = Phaser.Physics.ARCADE;

    // Nombre d'algues à passer pour finir ce niveau (sera calculé dans le initLevel() plus bas)
    level.pointsToWin = 0;

    // Lecture du level
    initLevel(level_map);

    // Tous les obstacles sont immovable (sinon on pourra les pousser tavu, et même pas ce sera drôle !)
    level.obstacles.setAll('body.immovable', true);
    // Redéfinition du body
    level.obstacles.setAll('body.width', app.game.cache.getImage('algue_spritesheet').width/12 * 0.6);

  }

  function updateLevel() {

    // Mise à jour du texte du joueur
    level.cells.forEach(function(item) {
      if (item instanceof Phaser.Sprite) {
        if (item.children[0] instanceof Phaser.Text) {
          item.children[0].x = -1 * item.children[0].width * 0.5;
          item.children[0].y = -1 * item.children[0].height * 0.5;
          item.children[0].setText(item.children[0].text);
        }
      }
    });

    // Mise à jour du texte des algues
    level.obstacles.forEach(function(item) {
      if (item instanceof Phaser.Sprite) {
        if (item.children[0] instanceof Phaser.Text) {
          item.children[0].setText(item.children[0].text);
        }
      }
    });

  }

  function renderLevel() {
    if (!app.config.DEBUG)
      return;

    // Debug
    level.cells.forEach(function(item) {
      app.game.debug.body(item);
    });

    level.obstacles.forEach(function(item) {
      app.game.debug.body(item);
    });
  }


  function initLevel(level_map) {
    var items;
    level_map = level_map.map((line) => line.replace(/\s+/g, ' '));
    for (var i = 0; i < level_map.length; i++) {
      items = level_map[i].split(' ');
      for (var j = 0, cell, algue; j < items.length; j++) {
        if (items[j] !== '~') {

          // Est-ce que c'est une algue ?
          if (items[j].charAt(0) === '(') {
            
            // Augmentation du nombre de points à atteindre
            level.pointsToWin++;

            algue = _createSprite(
              'algue_spritesheet',
              (0.5 * app.game.cache.getImage('molecule_spritesheet').width/8) + j * app.game.cache.getImage('molecule_spritesheet').width/8,
              app.game.world.height,
              items[j].slice(1, -1),
              -85,
              -200,
              {fill:'#000', 'stroke':'#fff', font:'5rem "Fredoka One"'},
              8
            );
            algue.anchor.set(0.5, 1);

            // Ajout au groupe d'obstacles (les algues)
            level.obstacles.add(algue);
          }
          // Sinon, c'est peut-être la position du joueur dans la map ?
          else if (items[j].charAt(0) === 'P') {
            var playerNb = parseInt(items[j].slice(1), 10);
            app.player.sprite.x = (0.5 * app.game.cache.getImage('molecule_spritesheet').width/8) + j * app.game.cache.getImage('molecule_spritesheet').width/8;
            app.player.sprite.y = (0.5 * app.game.cache.getImage('molecule_spritesheet').height) + i * app.game.cache.getImage('molecule_spritesheet').height;
            app.player.number.list = [playerNb];
          }
          // Sinon, c'est une cellule
          else {
            cell = _createSprite(
              'molecule_spritesheet',
              (0.5 * app.game.cache.getImage('molecule_spritesheet').width/8) + j * app.game.cache.getImage('molecule_spritesheet').width/8,
              (0.5 * app.game.cache.getImage('molecule_spritesheet').height) + i * app.game.cache.getImage('molecule_spritesheet').height,
              items[j],
              0,
              0,
              {},
              18
            );

            // Ajout au groupe de cellules
            level.cells.add(cell);
          }

        }
      }
    }
  }

  function _createSprite(key, x, y, text, tX, tY, style, animFps) {
    style = style || {};

    // Création du sprite
    var sprite = new Phaser.Sprite( app.game, x, y, key );

    // Ajout d'un enfant à ce sprite, qui sera le texte contenant le chiffre de la cellule
    sprite.addChild(new Phaser.Text(app.game, tX, tY, text, Phaser.Utils.extend({fill:'#000',font:'3rem "Fredoka One"',stroke:'#eee',strokeThickness:3}, style)));

    // Ajout dans le tableau de sprites
    sprite.anchor.set(0.5, 0.5);
    sprite.animations.add('live', [0, 1, 2]);
    sprite.animations.add('retracting', [3, 4, 5, 6, 7, 8]);
    sprite.animations.add('dead', [7, 8]);
    sprite.animations.play('live', animFps, true);

    return sprite;
  }

  // Exports
  app.level = level;
  
})(window.app);