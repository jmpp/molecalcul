(function() {
	'use strict';

	var renderer = PIXI.autoDetectRenderer(630, 410);
	renderer.view.style.position = "absolute"
	renderer.view.style.width = window.innerWidth + "px";
	renderer.view.style.height = window.innerHeight + "px";
	renderer.view.style.display = "block";
	document.body.appendChild(renderer.view);

	// Displacement filter
	var displacementTexture = PIXI.Texture.fromImage("displacement_map.jpg");
	var displacementFilter = new PIXI.filters.DisplacementFilter(displacementTexture);

	// create an new instance of a pixi stage
	var stage = new PIXI.Stage(0xFF0000, true);

	// Ajout du fond marin bleu
	var fondMarin = new PIXI.Sprite.fromImage('fond_marin.jpg');
	fondMarin.filters = [displacementFilter];
	stage.addChild(fondMarin);


	// Ajout des vagues
	var vagues = new PIXI.Sprite.fromImage('vagues.png');
	stage.addChild(vagues);
	
	// displacementFilter.scale.x = 50;
	// displacementFilter.scale.y = 50;

	var count = 0;

	function animate() {
		requestAnimationFrame(animate);

		count += 0.1;

		// displacementFilter.uniforms.x = count * 10;
		// displacementFilter.uniforms.y = count * 10;

		renderer.render(stage);
	}

	animate();
})();