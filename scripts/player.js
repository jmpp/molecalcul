(function(app) {
  'use strict';

  var player = {};

  // ==========
  // Propriétés publiques
  // ==========

  player.rotationVelocity = 0;
  player.speeds = {
    movement : 25,
    rotation : 0.005
  };
  player.maxSpeeds = {
    movement : 750,
    rotation : 0.05
  };

  // ========
  // Méthodes publiques
  // ========

  player.create  = createPlayer;
  player.update  = updatePlayer;
  player.render  = renderPlayer;

  // ===

  var particlesManager,
      particlesEmitter;

  function createPlayer() {
    
    // ==========
    // Particules
    // ==========

    particlesManager = app.game.plugins.add(Phaser.ParticleStorm);
    particlesManager.addData('basic', {
      lifespan: 500,
      image: 'particle',
      vy: { min: 1, max: 5 },
      alpha: { initial: 0, value: 1, control: [ { x: 0, y: 1 }, { x: 1, y: 0 } ] }
    });
    // Création d'un emitter
    particlesEmitter     = particlesManager.createEmitter();
    player.particlesZone = particlesManager.createCircleZone(app.game.cache.getImage('joueur_spritesheet').height / 2.5);
    particlesEmitter.addToWorld();
    particlesEmitter.emit('basic', 0, 0, { zone: player.particlesZone, total: 1, repeat: -1, frequency: 1 });

    // ======
    // Joueur
    // ======

    player.sprite = app.game.add.sprite(
      app.game.camera.width/4,
      app.game.world.centerY,
      'joueur_spritesheet'
    );
    player.sprite.anchor.set(0.5);

    // Animation du joueur
    player.sprite.animations.add('live');
    player.sprite.animations.play('live', 18, true);

    // Liste des opérations effectuées par le joueur
    player.op     = '+';
    player.number = {
      list : [0],
      // Getter
      get : function getNumberFromList() {
        player.op = '+';
        return this.list
                    .reduce(function(total, el) {
                      if (isNaN(parseInt(el, 10))) {
                        player.op = el;
                        return total;
                      }
                      return app.utils.calculator(player.op)(total, parseInt(el, 10))
                    });
                    // .filter((el) => !isNaN(parseInt(el,10)))
                    // .map(Number)
                    // .reduce((acc, nb) => acc + nb, 0);
      }
    };

    // Texte accompagnant le joueur
    player.text = new Phaser.Text(app.game, 0, 0, '', {fill:'#000',font:'3rem "Fredoka One"',stroke:'#ccc',strokeThickness:3});
    app.game.world.add(player.text);

    // Nombre d'algues passées par le joueur
    player.algaePassed = 0;

    // Démarrage de la physX sur le joueur
    app.game.physics.arcade.enable(player.sprite);
    // Vitesse max de déplacement du joueur
    player.sprite.body.maxVelocity.set(player.maxSpeeds.movement);
    // Collision avec les bords du monde (pour ne pas sortir de la caméra)
    player.sprite.body.collideWorldBounds = true;
    // Redéfinition du body
    player.sprite.body.setSize(
      player.sprite.width * 0.5,
      player.sprite.height * 0.5
    );
  }

  function updatePlayer() {
    // Gestion du déplacement du joueur
    movePlayer();

    // Déplacement des particles en fonction de la position du joueur
    player.particlesZone.shape.x = player.sprite.x;
    player.particlesZone.shape.y = player.sprite.y;

    // Maj du texte accompagnant le joueur
    player.text.setText(player.number.get() + player.op);
    player.text.x = player.sprite.x - player.text.width * 0.5;
    player.text.y = player.sprite.y - player.text.height * 0.5;

    // Collision entre le joueur et les cellules du niveau
    app.game.physics.arcade.overlap(player.sprite, app.level.cells, collidePlayerCell, null, this);

    // Collision entre le joueur et les algues
    app.game.physics.arcade.collide(player.sprite, app.level.obstacles, collidePlayerObstacle, null, this);
  }

  function renderPlayer() {
    if (!app.config.DEBUG)
      return;

    // Debug
    app.game.debug.body(player.sprite);
  }

  function movePlayer() {

    // Application du mouvement
    if (app.keys.up.isDown) { // HAUT
      player.sprite.body.velocity.y += -1 * player.speeds.movement;
    }
    if (app.keys.down.isDown) { // BAS
      player.sprite.body.velocity.y += player.speeds.movement;
    }
    if (app.keys.left.isDown) { // GAUCHE
      player.sprite.body.velocity.x += -1 * player.speeds.movement;
      player.rotationVelocity += -1 * player.speeds.rotation; // Augmentation progressive de la rotation vers la gauche
    }
    if (app.keys.right.isDown) { // DROITE
      player.sprite.body.velocity.x += player.speeds.movement;
      player.rotationVelocity += player.speeds.rotation; // Augmentation progressive de la rotation vers la droite
    }
    // Application exponentielle de la rotation (+=)
    player.sprite.body.rotation += player.rotationVelocity;


    // Bridage de la vitesse maximale de déplacement
    /*if (player.sprite.body.velocity.x > player.maxSpeeds.movement)
      player.sprite.body.velocity.x = player.maxSpeeds.movement;
    else if (player.sprite.body.velocity.x < -1 * player.maxSpeeds.movement)
      player.sprite.body.velocity.x = -1 * player.maxSpeeds.movement;
    if (player.sprite.body.velocity.y > player.maxSpeeds.movement)
      player.sprite.body.velocity.y = player.maxSpeeds.movement;
    else if (player.sprite.body.velocity.y < -1 * player.maxSpeeds.movement)
      player.sprite.body.velocity.y = -1 * player.maxSpeeds.movement;*/
    // Bridage de la vitesse maximale de rotation
    /*if (player.rotationVelocity > player.maxSpeeds.rotation)
      player.rotationVelocity = player.maxSpeeds.rotation;
    else if (player.rotationVelocity < -1 * player.maxSpeeds.rotation)
      player.rotationVelocity = -1 * player.maxSpeeds.rotation;*/


    /*if (!app.keys.up.isDown && !app.keys.down.isDown && !app.keys.left.isDown && !app.keys.right.isDown) {
      // Ralentissement progressif de la vitesse de déplacement
      player.sprite.body.velocity.x = app.utils.slowDown(player.sprite.body.velocity.x, 1); // Ralentissement de 1 par frame
      player.sprite.body.velocity.y = app.utils.slowDown(player.sprite.body.velocity.y, 1); // Ralentissement de 1 par frame
      // Ralentissement progressif de la vitesse de rotation
      player.rotationVelocity = app.utils.slowDown(player.rotationVelocity, 0.00025); // Ralentissement de 0.00025 par frame
    }*/
  }

  // Collision Handler entre le joueur et les cellules
  function collidePlayerCell(player, cell) {
    app.sounds.pickup.play();
    var nb = parseInt(cell.children[0].text, 10);
    nb = nb || cell.children[0].text;
    app.player.number.list.push(nb);
    cell.kill();
  }

  // Collision Handler entre le joueur et les obstacles algues
  function collidePlayerObstacle(player, algue) {
    var nb = parseInt(algue.children[0].text, 10);
    nb = !isNaN(nb) ? nb : algue.children[0].text;

    if (nb === app.player.number.get() && !algue.hasBeenPassed) {
      // Passage d'une algue ! #OhYeah
      algue.animations.play('retracting', 8); // 8 fps en dur, à modifier + tard
      algue.hasBeenPassed = true;
      algue.body.setSize(402, 308);
      app.player.algaePassed++;

      if (app.player.algaePassed === app.level.pointsToWin) {
        // Passage d'un niveau !!
        app.CURRENT_LEVEL_INDEX++;
        // Relance du state, avec le level index updaté
        app.level.pointsToWin = 0;
        app.sounds.theme.stop();
        app.game.state.restart();
      }
    }
  }

  // Exports
  app.player = player;
  
})(window.app);