window.onload = function () {

	var game = new Phaser.Game(350, 300, Phaser.AUTO, 'canvas-div', {preload: preload, create: create, update: update});
	
	var rocket;
	var enemies;

	var deltaTime = 0;

	var helpStar;
	var stars = [];
	var texture1;
	var texture2;

	var exp;

	var score = 0;
	var txtScore;
	var gameOverTxt;

	function preload() {

	    game.load.atlasJSONHash('rocket', 'images/rocket/rocket.png', 'images/rocket/rocket.json');
	    game.load.atlasJSONHash('enemy', 'images/rocket/enemy.png', 'images/rocket/enemy.json');
	    game.load.atlasJSONHash('explosion', 'images/rocket/explosion.png', 'images/rocket/explosion.json');
	    game.load.image('star', 'images/rocket/star.png');
	}

	function create() {

		game.stage.backgroundColor = '#0B2161';

		texture1 = game.add.renderTexture('texture1', 350, 300);
		texture2 = game.add.renderTexture('texture2', 350, 300);
		game.add.sprite(0, 0, texture1);
		game.add.sprite(0, 0, texture2);

		helpStar = game.add.sprite(0, 0, 'star');
		helpStar.visible = false;

		var t = texture1;
		var s = 4;

		for (var i = 0; i < 60; i++) {
			if (i == 30) {
				t = texture2;
				s = 7;
			}

			stars.push( { x: game.world.randomX, y: game.world.randomY, speed: s, texture: t });
		};

		var style = {font: "17px Consolas", fill: "#FFFFFF", align: "center"};
		txtScore = game.add.text(10, 5, String(score), style);

		gameOverTxt = game.add.text(game.world.centerX, game.world.centerY, 'GAME OVER\npress space to restart', style);
		gameOverTxt.anchor.setTo(0.5, 0.5);
		gameOverTxt.visible = false;

		rocket = game.add.sprite(game.world.centerX, game.world.height - 35, 'rocket');
		rocket.anchor.setTo(0.5, 0.5);
		rocket.animations.add('up', [0, 1]);
		rocket.animations.play('up', 6, true);

		enemies = game.add.group();

		var enemy = game.add.sprite(game.world.randomX, 0, 'enemy');
		enemy.body.velocity.y = game.rnd.integerInRange(35, 150);
		enemy.anchor.setTo(0.5, 0);
		enemy.body.setSize(27, 27, 0, 21);
		enemy.animations.add('fall');
		enemy.animations.play('fall', 8, true);
		enemies.add(enemy);

		deltaTime = game.time.now;
	}

	function update() {
		rocket.body.velocity.x = 0;

		if (rocket.alive) {

			if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT) && rocket.x - rocket.width/2 > 2) {
				rocket.body.velocity.x = -250;
				rocket.loadTexture('rocket', 2);
			} else if ((game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) && 
					   rocket.x + (rocket.width/2) < game.world.width-2)) {
				rocket.body.velocity.x = 250;
				rocket.loadTexture('rocket', 3);
			}
		
			enemies.forEach(check, this, true);
			game.physics.collide(rocket, enemies, collisionHandler, null, this);
		}

		if (game.time.now - deltaTime > 300) {

			if (rocket.alive) score++;

			txtScore.content = String(score);

			var enemy = game.add.sprite(game.world.randomX, 0, 'enemy');
			enemy.body.velocity.y = game.rnd.integerInRange(35, 300);;
			enemy.body.setSize(27, 27, 0, 21);
			enemy.animations.add('fall');
			enemy.animations.play('fall', 8, true);
			enemies.add(enemy);

			deltaTime = game.time.now;
		}

		moveStars();

		if (!rocket.alive && game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
			rocket.reset(game.world.centerX, game.world.height - 35);
			score = 0;
			enemies.removeAll();	
			gameOverTxt.visible = false;		
		}
	}

	function check(enem) {
		if (enem.y > game.world.height) {
			enem.kill();
		}
	}

	function collisionHandler(obj1, obj2) {
		//WTFWTGWTG
		exp = game.add.sprite(rocket.x - rocket.width/2, rocket.y - rocket.height/2, 'explosion');
		exp.animations.add('burn');
		exp.animations.play('burn', 15, false);

		rocket.kill();

		gameOverTxt.visible = true;
	}

	function moveStars() {
		for (var i = 0; i < stars.length; i++) {
			stars[i].y += stars[i].speed;

			if (stars[i].y >= game.world.height) {
				stars[i].x = game.world.randomX;
				stars[i].y = -32;
			}

			if (i == 30 || i == 0) {
				stars[i].texture.renderXY(helpStar, stars[i].x, stars[i].y, true);
			} else {
				stars[i].texture.renderXY(helpStar, stars[i].x, stars[i].y, false);
			}
		}
	}

};