//definimos una nueva escena de phaser, nos aseguramos de que se carga al cambiar a este modo con la impresion en consola, ponemos un texto para hacernos una idea, y definimos que si pulsamos la tecla ESC hacemos una transicion de vuelta al menu
var esc;
var offsurvive = new Phaser.Scene('offsurvive');
var mapatiles;
var tilecolision;
var cursors;
var player1;
var player2;
var capa;
var worldsize = 20;
var worldtiles;
var wkey, akey, skey, dkey;
var shift;
var muros;
var camara1;
var camara2;
var text;
var cuentatiempo;
var velocidadp2;
var powerup, powerup2, powerup3;
var usingpower = false;
var mask, mask2;
var p2;
var flag;
var flash;
var music;
var sound;
var pausa=false;
var pausaimg;
var abriendose=false;
var enter;
var log;
var log2;
var tiemposurviveoff;
var usingpowerup3;
var usingpowerup2p1, usingpowerup2p2;

offsurvive.create =function () {
	usingpowerup3 = false;
	usingpowerup2p1 = false;
	usingpowerup2p2 = false;
	var logros = function (user) {
		if(user.partidasjugadas[0] == 1){
			log=offsurvive.add.image(500,340,'survive1').setScrollFactor(0);

		} else if (user.partidasjugadas[0] == 5){

			log2=offsurvive.add.image(500,340,'survive2').setScrollFactor(0);
		}
	}
	updateMode(globalid, 'Survive Offline');
	sound = this.sound.add('spup');
	music = this.sound.add('surmusic');
	music.play();
	flag=false;
	powerup = false; powerup2 = false; powerup3 = false;
	//console.log ("Modo survive");
	esc = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
	enter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
	velocidadp2 = 150;

	worldtiles = worldsize*3;

	cursors = this.input.keyboard.createCursorKeys(); //Creamos el manejo del teclado
	wkey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
	akey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
	skey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
	dkey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
	spacekey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
	shift = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);

	mapatiles = this.make.tilemap({ tileWidth: 32, tileHeight: 32, width: worldtiles*32, heigth: worldtiles*32}); //Esto añade un mapa vacío al mundo

	var nombretileset = 'tileo' + Math.ceil(Math.random()*6);
	
	var tileset = mapatiles.addTilesetImage(nombretileset, nombretileset, 32, 32); //Cargamos el mapa de sprites de tiles

	capa = mapatiles.createBlankDynamicLayer('nivel', tileset, 0, 0, worldtiles, worldtiles, 32, 32); //Crea una capa de worldtiles, cada tile 32x32 y la llama nivel1

	createworld(worldsize); //Lanzamos el generador de laberintos con un tamaño de worldsize x worldsize

	addloops(20);

	muros = tileindex(); //Recuperamos del generador de laberintos el tileo del mapa


	for (var i = 0; i < worldtiles; i++){
		for (var j = 0; j < worldtiles; j++){
			var pos = (i*worldtiles)+j;
			mapatiles.putTileAt(muros[pos], i, j, true, capa); //Asignamos a la capa de tiles de Phaser nuestras tiles generadas
		}
	}
	mapatiles.setCollisionBetween(3, 14, true, true, capa); //Le dice que las tiles de 3 a 14 colisionan

	player1 = this.physics.add.sprite(144, 144, 'player'); //Cargamos al jugador

	var randomx;
	var randomy;
	do{
		randomx = Math.floor(Math.random() * worldsize);

		randomy = Math.floor(Math.random() * worldsize);

		randomx--;
		randomy--;

		randomx*=32*3;
		randomy*=32*3;
		randomx+= 48;
		randomy+= 48;

	} while (randomx <= 200 || randomy <= 200);

	player2 = this.physics.add.sprite(randomx, randomy, 'enemy');




	this.physics.world.enable([player1, player2]);
	//Camaras

	camara1 = this.cameras.main.setSize(600,400);
	camara2 = this.cameras.add(600, 0, 600, 400);

	camara1.setBounds(0, 0, worldtiles*32, worldtiles*32);
	camara2.setBounds(0, 0, worldtiles*32, worldtiles*32);

	camara1.startFollow(player1);
	camara2.startFollow(player2);

	/**/

	var ganasomb = function () {
		music.stop();
		this.add.image(300, 200, 'ganasombra').setScrollFactor(0);
		flag=true;
		addGame(globalid, 'Survive', "Player2", logros);
        clearInterval(intervalooffsurvive);
		var t=offsurvive.scene.transition({target:'offmenu',duration:3000});
	};

	this.physics.add.collider(player1, player2, ganasomb, null, this);

	/**/

	//cuentatiempo tarda 3 minutos, tiempo general de Survive, para dar victoria a p1

	var actualizar1 = this.time.addEvent({
		delay: 60000,
		callback: function () {
			velocidadp2 = 200;
		},
		callbackScope: this
	});

	//Actualizar1 actualiza la velocidad del p2 al finalizar el primer minuto, la equipara a la de p1

	var actualizar2 = this.time.addEvent({
		delay: 120000,
		callback: function () {
			velocidadp2 = 225;
		},
		callbackScope: this
	});


	tiemposurviveoff = 180;

	intervalooffsurvive = setInterval(function () {
    	if (tiemposurviveoff > 0 && !pausa && !usingpowerup3){
    		tiemposurviveoff--;
    	}
    	if(tiemposurviveoff <= 0 && !flag){
    		offsurvive.add.image(300, 200, 'ganahumano').setScrollFactor(0);
    		flag=true;
    		addGame(globalid, 'Survive Offline', "Player1", logros);
            music.stop();
    		var t=offsurvive.scene.transition({target:'offmenu',duration:3000});
    		clearInterval(intervalooffsurvive);
    	}
    }, 1000);


	var textureFrames = this.textures.get('powerup').getFrameNames();
	var animFrames = [];

	textureFrames.forEach(function (frameName) {

		animFrames.push({ key: 'powerup', frame: frameName });

	});
	
	var textureFrames2 = this.textures.get('powerup2').getFrameNames();
	var animFrames2 = [];
	
	textureFrames2.forEach(function (frameName) {

		animFrames2.push({ key: 'powerup2', frame: frameName });

	});
	
	var textureFrames3 = this.textures.get('powerup3').getFrameNames();
	var animFrames3 = [];
	
	textureFrames3.forEach(function (frameName) {

		animFrames3.push({ key: 'powerup3', frame: frameName });

	});

	this.anims.create({
		key:'downwards2', frames:this.anims.generateFrameNumbers('enemy',{start:1, end:3}), repeat:0, frameRate:6
	});

	this.anims.create({
		key:'upwards2', frames:this.anims.generateFrameNumbers('enemy',{start:5, end:7}), repeat:0, frameRate:6
	});

	this.anims.create({
		key:'right2', frames:this.anims.generateFrameNumbers('enemy',{start:13, end:15}), repeat:0, frameRate:6
	});

	this.anims.create({
		key:'left2', frames:this.anims.generateFrameNumbers('enemy',{start:9, end:11}), repeat:0, frameRate:6
	});

	this.anims.create({
		key:'left', frames:this.anims.generateFrameNumbers('player',{start:9, end:11}), repeat:0, frameRate:6
	});

	this.anims.create({
		key:'right', frames:this.anims.generateFrameNumbers('player',{start:13, end:15}), repeat:0, frameRate:6
	});

	this.anims.create({
		key:'up', frames:this.anims.generateFrameNumbers('player',{start:5, end:7}), repeat:0, frameRate:6
	});

	this.anims.create({
		key:'down', frames:this.anims.generateFrameNumbers('player',{start:1, end:3}), repeat:0, frameRate:6
	});
	this.anims.create({
		key:'leftpower', frames:this.anims.generateFrameNumbers('playerpower',{start:8, end:11}), repeat:0, frameRate:4
	});

	this.anims.create({
		key:'rightpower', frames:this.anims.generateFrameNumbers('playerpower',{start:12, end:15}), repeat:0, frameRate:4
	});

	this.anims.create({
		key:'uppower', frames:this.anims.generateFrameNumbers('playerpower',{start:4, end:7}), repeat:0, frameRate:4
	});

	this.anims.create({
		key:'downpower', frames:this.anims.generateFrameNumbers('playerpower',{start:0, end:3}), repeat:0, frameRate:4
	});

	this.anims.create({ key: 'powerupanimate', frames: animFrames, frameRate: 6, repeat: -1 });
	this.anims.create({ key: 'powerup2animate', frames: animFrames2, frameRate: 6, repeat: -1 });
	this.anims.create({ key: 'powerup3animate', frames: animFrames3, frameRate: 6, repeat: -1 });
	
	var posicionespoderes = [];
	
	for (var i = 0; i < 6; i+=2){
		
		do{
			randomx = Math.floor(Math.random() * worldsize);

			randomy = Math.floor(Math.random() * worldsize);

			randomx--;
			randomy--;

			randomx*=32*3;
			randomy*=32*3;
			randomx+= 48;
			randomy+= 48;

		} while (randomx <= 200 || randomy <= 200);
		
		posicionespoderes[i] = randomx;
		posicionespoderes[i+1] = randomy;
	}
	
	var aleatorio = Math.floor(Math.random()*6);
	var ordenpoderes = [1, 2, 3];
	
	if(aleatorio == 0) ordenpoderes = [1, 2, 3];
	else if (aleatorio == 1) ordenpoderes = [1, 3, 2];
	else if (aleatorio == 2) ordenpoderes = [2, 1, 3];
	else if (aleatorio == 3) ordenpoderes = [2, 3, 1];
	else if (aleatorio == 4) ordenpoderes = [3, 1, 2];
	else if (aleatorio == 5) ordenpoderes = [3, 2, 1];

	//console.log(randomx); console.log(randomy);
	if (ordenpoderes[0] == 1){
		var poder = offsurvive.physics.add.sprite(posicionespoderes[0], posicionespoderes[1], 'powerup').play('powerupanimate');

		var getpowerup = function () {
			poder.destroy();
			powerup = true;
			if(powerup2 == 1) powerup2 = 0;
		}

		offsurvive.physics.add.collider(player1, poder, getpowerup, null, offsurvive);
	} else if (ordenpoderes[0] == 2){
		var poder2 = offsurvive.physics.add.sprite(posicionespoderes[0], posicionespoderes[1], 'powerup2').play('powerup2animate');
		
		var getpowerup2a = function () {
			poder2.destroy();
			powerup2 = 1;
			if(powerup) powerup = false;
		}
		
		var getpowerup2b = function () {
			poder2.destroy();
			powerup2 = 2;
			if(powerup3) powerup3 = false;
		}
		
		offsurvive.physics.add.collider(player1, poder2, getpowerup2a, null, offsurvive);
		offsurvive.physics.add.collider(player2, poder2, getpowerup2b, null, offsurvive);
	} else {
		var poder3 = offsurvive.physics.add.sprite(posicionespoderes[0], posicionespoderes[1], 'powerup3').play('powerup3animate');

		var getpowerup3 = function () {
			poder3.destroy();
			powerup3 = true;
			if(powerup2 == 2) powerup2 = 0;
		}

		offsurvive.physics.add.collider(player2, poder3, getpowerup3, null, offsurvive);
	}

	setTimeout(function () {
		if (ordenpoderes[1] == 1){
			var poder = offsurvive.physics.add.sprite(posicionespoderes[2], posicionespoderes[3], 'powerup').play('powerupanimate');

			var getpowerup = function () {
				poder.destroy();
				powerup = true;
				if(powerup2 == 1) powerup2 = 0;
			}

			offsurvive.physics.add.collider(player1, poder, getpowerup, null, offsurvive);
		} else if (ordenpoderes[1] == 2){
			var poder2 = offsurvive.physics.add.sprite(posicionespoderes[2], posicionespoderes[3], 'powerup2').play('powerup2animate');
			
			var getpowerup2a = function () {
				poder2.destroy();
				powerup2 = 1;
				if(powerup) powerup = false;
			}
			
			var getpowerup2b = function () {
				poder2.destroy();
				powerup2 = 2;
				if(powerup3) powerup3 = false;
			}
			
			offsurvive.physics.add.collider(player1, poder2, getpowerup2a, null, offsurvive);
			offsurvive.physics.add.collider(player2, poder2, getpowerup2b, null, offsurvive);
		} else {
			var poder3 = offsurvive.physics.add.sprite(posicionespoderes[2], posicionespoderes[3], 'powerup3').play('powerup3animate');

			var getpowerup3 = function () {
				poder3.destroy();
				powerup3 = true;
				if(powerup2 == 2) powerup2 = 0;
			}

			offsurvive.physics.add.collider(player2, poder3, getpowerup3, null, offsurvive);
		}
	}, 60000);

	setTimeout(function () {
		if (ordenpoderes[2] == 1){
			var poder = offsurvive.physics.add.sprite(posicionespoderes[4], posicionespoderes[5], 'powerup').play('powerupanimate');

			var getpowerup = function () {
				poder.destroy();
				powerup = true;
				if(powerup2 == 1) powerup2 = 0;
			}

			offsurvive.physics.add.collider(player1, poder, getpowerup, null, offsurvive);
		} else if (ordenpoderes[2] == 2){
			var poder2 = offsurvive.physics.add.sprite(posicionespoderes[4], posicionespoderes[5], 'powerup2').play('powerup2animate');
			
			var getpowerup2a = function () {
				poder2.destroy();
				powerup2 = 1;
				if(powerup) powerup = false;
			}
			
			var getpowerup2b = function () {
				poder2.destroy();
				powerup2 = 2;
				if(powerup3) powerup3 = false;
			}
			
			offsurvive.physics.add.collider(player1, poder2, getpowerup2a, null, offsurvive);
			offsurvive.physics.add.collider(player2, poder2, getpowerup2b, null, offsurvive);
		} else {
			var poder3 = offsurvive.physics.add.sprite(posicionespoderes[4], posicionespoderes[5], 'powerup3').play('powerup3animate');

			var getpowerup3 = function () {
				poder3.destroy();
				powerup3 = true;
				if(powerup2 == 2) powerup2 = 0;
			}

			offsurvive.physics.add.collider(player2, poder3, getpowerup3, null, offsurvive);
		}
	}, 120000);


	this.add.image(0, 0, 'borde').setScrollFactor(0);

	text = this.add.text(32, 32).setScrollFactor(0);

	player1.setSize(10, 16).setOffset(0, 8);
	player2.setSize(10, 16).setOffset(0, 8);

	flash=this.time.addEvent({
		delay:60000,
		callback:function(){
			camara1.fadeOut(250,255);
			camara2.fadeOut(250,255);
			camara1.once('camerafadeoutcomplete',function(){
				camara1.fadeIn(250,255);
			},this);
			camara2.once('camerafadeoutcomplete',function(){
				camara2.fadeIn(250,255);
			},this)
		},
		callbackScope:this,
		repeat:1
	})

	pausaimg=offsurvive.add.image(300,200,'paused').setScrollFactor(0);
	pausaimg.alpha=0;
	pausaimg.depth=1; 

}

offsurvive.update=function () {
	if(esc.isDown&&!abriendose&&!pausa){
		abriendose=true;
		flag=true;
		setTimeout(function(){
			pausaimg.alpha=1;
			pausa=true;
			abriendose=false;
		},500);
	}
	if(esc.isDown&&pausa){
		setTimeout(function(){
			pausa=false;
			flag=false;
			pausaimg.alpha=0;
		},500);
	}
	if(enter.isDown&&pausa){
        pausa=false;
		music.stop();
        clearInterval(intervalooffsurvive);
		var t=offsurvive.scene.transition({target:'offmenu',duration:'10'});
	}

	if(!usingpower) this.physics.world.collide(player1, capa);
	//Hacemos que el personaje colisione con la capa del tile
	player1.body.velocity.x = 0;
	player1.body.velocity.y = 0;
	//El personaje por defecto aparece siempre parado excepto que se pulse una tecla

	this.physics.world.collide(player2, capa);
	//Hacemos que el personaje colisione con la capa del tile
	player2.body.velocity.x = 0;
	player2.body.velocity.y = 0;
	//El personaje por defecto aparece siempre parado excepto que se pulse una tecla

	if(!flag){
		if (cursors.up.isDown) {
			if(!usingpowerup2p2) player2.body.velocity.y = -velocidadp2;
			else player2.body.velocity.y = -velocidadp2*1.5;
			player2.play('upwards2',true);
		}
		else if (cursors.down.isDown) {
			if(!usingpowerup2p2) player2.body.velocity.y = velocidadp2;
			else player2.body.velocity.y = velocidadp2*1.5;
			player2.play('downwards2',true);
		} else
			//Manejamos las teclas arriba/abajo

			if (cursors.left.isDown)
			{
				if(!usingpowerup2p2) player2.body.velocity.x = -velocidadp2;
				else player2.body.velocity.x = -velocidadp2*1.5;
				player2.play('left2',true);
			}
			else if (cursors.right.isDown)
			{
				if(!usingpowerup2p2) player2.body.velocity.x = velocidadp2;
				else player2.body.velocity.x = velocidadp2*1.5;
				player2.play('right2',true);
			}
		//Manejamos las teclas izq/der

		if (wkey.isDown) {
			if(!usingpowerup2p1) player1.body.velocity.y = -200;
			else player1.body.velocity.y = -300;
			if(!usingpower)player1.play('up',true);
			else player1.play('uppower', true);
		}
		else if (skey.isDown) {
			if(!usingpowerup2p1) player1.body.velocity.y = 200;
			else player1.body.velocity.y = 300;
			if(!usingpower)player1.play('down', true);
			else player1.play('downpower', true);
		} else
			//Manejamos las teclas arriba/abajo

			if (akey.isDown)
			{
				if(!usingpowerup2p1) player1.body.velocity.x = -200;
				else player1.body.velocity.x = -300;
				if(!usingpower)player1.play('left',true);
				else player1.play('leftpower', true);
			}
			else if (dkey.isDown)
			{
				if(!usingpowerup2p1) player1.body.velocity.x = 200;
				else player1.body.velocity.x = 300;
				if(!usingpower)player1.play('right',true);
				else player1.play('rightpower', true);
			}
		//Manejamos las teclas izq/der

		var number = "";
		if (tiemposurviveoff == 180){
			number = "3:00";
		} else {
			var copia;
			if(tiemposurviveoff >= 120){
				number+="2:";
				copia = tiemposurviveoff-120;
			} else if (tiemposurviveoff >= 60){
				number+="1:";
				copia = tiemposurviveoff-60;
			} else {
				number+= "0:"
				copia = tiemposurviveoff;
			}
			if(copia < 10) number += "0";
			number+=copia;
		}
		//Actualizamos el tiempo que queda en pantalla
		if(usingpowerup3) number += " STOPPED";
		text.setText(number);
	}
	if(spacekey.isDown && powerup){
		powerup = false;
		usingpower = true;
		sound.play();
		this.time.addEvent({
			delay: 800,
			callback: function () {
				usingpower = false;
			},
			callbackScope: this
		});
	}
	if(spacekey.isDown && powerup2 == 1) {
		usingpowerup2p1 = true;
		powerup2 = 0;
		setTimeout(function () {
			usingpowerup2p1 = false;
		}, 5000);
	}
	
	if(shift.isDown && powerup2 == 2) {
		usingpowerup2p2 = true;
		powerup2 = 0;
		setTimeout(function () {
			usingpowerup2p2 = false;
		}, 5000);
	}
	
	if(shift.isDown && powerup3){
		usingpowerup3 = true;
		powerup3 = false;
		setTimeout(function () {
			usingpowerup3 = false;
		}, 10000);
	}
}