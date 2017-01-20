(function(app) {
	'use strict';

	app.CURRENT_LEVEL_INDEX = 0;

	// Etat actuel du jeu
	app.gameState = function Game() {}
	app.gameState.prototype = {
		preload: Preload,
		create: Create,
		update: Update,
		render: Render
	};

	// Instantiation d'un objet Phaser
	app.game = new Phaser.Game(
		app.config.GAME_WIDTH,
		app.config.GAME_HEIGHT,
		Phaser.AUTO,
		document.getElementById('game-area'),
		app.gameState,
		true // transparent bg
	);

	app.game.state.add('game', app.gameState);

	app.game.state.start('game');

	// =====
	// Fonction Phaser de chargement des assets
	// =====

	function Preload() {
		// Filters
    app.game.load.script('displacementFilter', 'node_modules/phaser/filters/pixi/DisplacementFilter.js');
    app.game.load.script('particleStorm', 'plugins/ParticleStorm.min.js');

		// Images
		var imagesPath = app.config.IMAGES_PATH;
		app.game.load.image('undersea_texture', imagesPath+'/fond_marin.jpg');
		
		// app.game.load.image('rochers_back', imagesPath+'/rochers_back.png');
		// app.game.load.image('rochers_middle', imagesPath+'/rochers_middle.png');
		// app.game.load.image('rochers_front', imagesPath+'/rochers_front.png');
		app.game.load.image('rochers_plan1', imagesPath+'/rochers_plan1.png');
		app.game.load.image('rochers_plan2', imagesPath+'/rochers_plan2.png');
		app.game.load.image('rochers_plan3', imagesPath+'/rochers_plan3.png');
		app.game.load.image('rochers_plan4', imagesPath+'/rochers_plan4.png');
		app.game.load.image('displacement_map', imagesPath+'/displacement_map.jpg');

		app.game.load.spritesheet('joueur_spritesheet', imagesPath+'/joueur_spritesheet.png', 149.6875, 139, 16);
		app.game.load.image('particle', imagesPath+'/particle.png');

		app.game.load.spritesheet('molecule_spritesheet', imagesPath+'/molecule_spritesheet.png', 111.625, 112, 8);

		// app.game.load.spritesheet('algue_spritesheet', imagesPath+'/algsheet.png', 365, 900, 3);
		// app.game.load.spritesheet('algue_retract_spritesheet', imagesPath+'/algretract.png', 502, 900, 6);
		app.game.load.spritesheet('algue_spritesheet', imagesPath+'/alge_full_spritesheet.png', 502, 900, 12);

		// Audio
		var soundsPath = app.config.SOUNDS_PATH;
		app.game.load.audio('theme', [soundsPath+'/theme.mp3']);
		app.game.load.audio('pickup', [soundsPath+'/pickup.mp3']);
		
		app.game.forceSingleUpdate = true;
	}

	// =====
	// Fonction Phaser d'initialisation du jeu
	// =====

	function Create() {
		// Création des limites du monde
		app.game.world.setBounds(0, 0, app.config.WORLD_WIDTH, app.config.WORLD_HEIGHT);

		// Démarrage de la physX
		app.game.physics.startSystem(Phaser.Physics.ARCADE);

		// Initialisation du décor du niveau
		app.decor.create();
		// Création d'un joueur
		app.player.create();
		// Initialisation du niveau
		app.level.create(app.level.maps[app.CURRENT_LEVEL_INDEX]);
		// Initialisation de l'UI
		app.UI.create();

		// Configuration de la caméra
		app.game.camera.follow(app.player.sprite);

		// Configuration des touches
		app.keys = app.game.input.keyboard.createCursorKeys();
		app.keys.enter = app.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
		app.keys.enter.onDown.add(restartGame);

		// Configuration du son
		app.sounds = {
			theme : app.game.add.audio('theme'),
			pickup : app.game.add.audio('pickup')
		};

		// Démarrage du theme
		app.sounds.theme.loop = true;
		app.sounds.theme.play();

		// Réglages divers
		app.sounds.theme.volume  = 1.2;
		app.sounds.pickup.volume = 0.3;
	}

	// =====
	// Fonction Phaser d'update de chaque frame
	// =====
	function Update() {
		app.level.update();
		app.player.update();
		app.decor.update();
	}

	// =====
	// Fonction Phaser de rendu des assets
	// =====
	function Render() {
		app.player.render();
		app.level.render();
		app.UI.render();
	}

	function restartGame() {
		app.sounds.theme.stop();
		app.game.state.restart();
	}


})(window.app);