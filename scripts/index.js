(function(app) {
	'use strict';

	var frame;

	function gameloop() {
		frame = requestAnimationFrame(gameloop);

		app.game.update();
		app.game.render();
		app.renderer.render(app.game.stage);
	}

	// Loading des assets
	var images = [
		'displacement_map.jpg',
		'montagnes.png',
		'fond_marin.png',
		'vagues.png'
	].map((img) => app.config.IMAGES_PATH + '/' + img);
	var loader = new PIXI.AssetLoader(images);
	loader.onComplete = function onAssetsLoaded() {

		// Assets chargés.. le jeu peut commencer!

		app.game.init(); // Création du stage de jeu
		app.background.init(); // Création des éléments de fond de jeu (eau, ciel, ...)

		// Lancement boucle de jeu
		gameloop();

	}
	loader.load();

})(window.app);