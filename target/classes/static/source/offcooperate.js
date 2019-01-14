//definimos una nueva escena de phaser, nos aseguramos de que se carga al cambiar a este modo con la impresion en consola, ponemos un texto para hacernos una idea, y definimos que si pulsamos la tecla ESC hacemos una transicion de vuelta al menu
var esc;
var offcooperate = new Phaser.Scene('offcooperate');
var worldtiles;
var worldsize = 12;
var puerta1;
var puerta2;
var puerta3;
var puerta4;
var puerta1abierta = false;
var puerta2abierta = false;
var puerta3abierta = false;
var llave3cogida = false;
var llave4cogida = false;
var velocidadp2 = 200;
var text;
var capa;
var mapatiles;
var player1;
var player2;
var flag;
var music;
var sound;
var pausa=false;
var pausaimg;
var enter;
var log;
var log2;
var abriendose=false;
var llave2;

offcooperate.create=function () {
	var logros = function (user) {
		if(user.partidasjugadas[0] == 1){
			log=offcooperate.add.image(500,340,'cooperate1').setScrollFactor(0);

		} else if (user.partidasjugadas[0] == 5){

			log2=offcooperate.add.image(500,340,'cooperate2').setScrollFactor(0);
		}
	}
	updateMode(globalid, 'Cooperate Offline');
	/*
            console.log ("Modo cooperate");
            var test = this.add.text(500,150,'COOPERATE',{fontSize: '50px', fill:'#0f0'});
            esc = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
            var test2 = this.add.text(400,250,'Pulsa ESC para volver',{fontSize: '30px', fill:'#0f0'});
	 */
	sound = this.sound.add('sdoor');
	music = this.sound.add('coomusic');
	music.play();

	flag=false;
	esc = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
	cursors = this.input.keyboard.createCursorKeys(); //Creamos el manejo del teclado
	wkey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
	akey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
	skey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
	dkey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
	enter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
	worldtiles = worldsize*3*2+3;

	mapatiles = this.make.tilemap({ tileWidth: 32, tileHeight: 32, width: worldtiles*32*2+96, heigth: worldtiles*32*2}); //Esto añade un mapa vacío al mundo

	var nombretileset = 'tileo' + Math.ceil(Math.random()*6);

	var tileset = mapatiles.addTilesetImage(nombretileset, nombretileset, 32, 32); //Cargamos el mapa de sprites de tiles            

	capa = mapatiles.createBlankDynamicLayer('nivel', tileset, 0, 0, worldtiles, worldtiles, 32, 32); //Crea una capa de worldtiles, cada tile 32x32 y la llama nivel1

	createworld(worldsize); //Lanzamos el generador de laberintos con un tamaño de worldsize x worldsize

	muros = tileindex(); //Recuperamos del generador de laberintos el tileo del mapa

	for (var i = 0; i < worldsize*3; i++){
		for (var j = 0; j < worldsize*3; j++){
			var pos = (i*worldsize*3)+j;
			mapatiles.putTileAt(muros[pos], i, j, true, capa); //Asignamos a la capa de tiles de Phaser nuestras tiles generadas
		}
	}
	createworld(worldsize); //Lanzamos el generador de laberintos con un tamaño de worldsize x worldsize

	muros = tileindex(); //Recuperamos del generador de laberintos el tileo del mapa

	for (var i = worldsize*3+3, k = 0; i < worldsize*6+3; i++, k++){
		for (var j = 0; j < worldsize*3; j++){
			var pos = (k*worldsize*3)+j;
			mapatiles.putTileAt(muros[pos], i, j, true, capa); //Asignamos a la capa de tiles de Phaser nuestras tiles generadas
		}
	}
	createworld(worldsize); //Lanzamos el generador de laberintos con un tamaño de worldsize x worldsize

	muros = tileindex(); //Recuperamos del generador de laberintos el tileo del mapa

	for (var i = 0; i < worldsize*3; i++){
		for (var j = worldsize*3, k = 0; j < worldsize*6; j++, k++){
			var pos = (i*worldsize*3)+k;
			mapatiles.putTileAt(muros[pos], i, j, true, capa); //Asignamos a la capa de tiles de Phaser nuestras tiles generadas
		}
	}
	createworld(worldsize); //Lanzamos el generador de laberintos con un tamaño de worldsize x worldsize

	muros = tileindex(); //Recuperamos del generador de laberintos el tileo del mapa

	for (var i = worldsize*3+3, k = 0; i < worldsize*6+3; i++, k++){
		for (var j = worldsize*3, l = 0; j < worldsize*6; j++, l++){
			var pos = (k*worldsize*3)+l;
			mapatiles.putTileAt(muros[pos], i, j, true, capa); //Asignamos a la capa de tiles de Phaser nuestras tiles generadas
		}
	}

	mapatiles.setCollisionBetween(3, 14, true, true, capa); //Le dice que las tiles de 3 a 14 colisionan

	var randomx = Math.floor(Math.random()*worldsize)+1;

	/*
	 * Colocamos las tiles correspondientes al pasillo que conectará la puerta.
	 */

	mapatiles.putTileAt(2, randomx*3+1, worldsize*3, true, capa);
	mapatiles.putTileAt(2, randomx*3+1, worldsize*3-1, true, capa);

	mapatiles.putTileAt(0, randomx*3+1,worldsize*3-2, true, capa);

	mapatiles.putTileAt(0, randomx*3+1,worldsize*3+1, true, capa);


	//Abajo izquierda

	var numtile = mapatiles.getTileAt(randomx*3, worldsize*3);

	var nuevatile = 0;

	if (numtile.index == 7) nuevatile = 11;
	if (numtile.index == 14) nuevatile = 6;

	mapatiles.putTileAt(nuevatile, randomx*3, worldsize*3, true, capa);



	//Abajo derecha

	numtile = mapatiles.getTileAt(randomx*3+2, worldsize*3);

	nuevatile = 0;
	if (numtile.index == 10) nuevatile = 13;
	if (numtile.index == 14) nuevatile = 5;

	mapatiles.putTileAt(nuevatile, randomx*3+2, worldsize*3, true, capa);

	//Arriba izquierda

	numtile = mapatiles.getTileAt(randomx*3, worldsize*3-1);

	nuevatile = 0;
	if (numtile.index == 8) nuevatile = 11;
	if (numtile.index == 12) nuevatile = 4;

	mapatiles.putTileAt(nuevatile, randomx*3, worldsize*3-1, true, capa);

	//Arriba derecha

	numtile = mapatiles.getTileAt(randomx*3+2, worldsize*3-1);

	nuevatile = 0;
	if (numtile.index == 9) nuevatile = 13;
	if (numtile.index == 12) nuevatile = 3;

	mapatiles.putTileAt(nuevatile, randomx*3+2, worldsize*3-1, true, capa);


	randomx*=32*3;

	randomx+=48;

	puerta1 = this.physics.add.staticSprite(randomx, worldsize*32*3, 'puerta1');

	randomx = Math.floor(Math.random()*worldsize);

	mapatiles.putTileAt(2, randomx*3+4+worldsize*3, worldsize*3, true, capa);
	mapatiles.putTileAt(2, randomx*3+4+worldsize*3, worldsize*3-1, true, capa);

	//Abajo izquierda

	numtile = mapatiles.getTileAt(randomx*3+4+worldsize*3-1, worldsize*3);

	nuevatile = 0;

	if (numtile.index == 7) nuevatile = 11;
	if (numtile.index == 14) nuevatile = 6;

	mapatiles.putTileAt(nuevatile, randomx*3+4+worldsize*3-1, worldsize*3, true, capa);



	//Abajo derecha

	numtile = mapatiles.getTileAt(randomx*3+4+worldsize*3+1, worldsize*3);

	nuevatile = 0;
	if (numtile.index == 10) nuevatile = 13;
	if (numtile.index == 14) nuevatile = 5;

	mapatiles.putTileAt(nuevatile, randomx*3+4+worldsize*3+1, worldsize*3, true, capa);

	//Arriba izquierda

	numtile = mapatiles.getTileAt(randomx*3+4+worldsize*3-1, worldsize*3-1);

	nuevatile = 0;
	if (numtile.index == 8) nuevatile = 11;
	if (numtile.index == 12) nuevatile = 4;

	mapatiles.putTileAt(nuevatile, randomx*3+4+worldsize*3-1, worldsize*3-1, true, capa);

	//Arriba derecha

	numtile = mapatiles.getTileAt(randomx*3+4+worldsize*3+1, worldsize*3-1);

	nuevatile = 0;
	if (numtile.index == 9) nuevatile = 13;
	if (numtile.index == 12) nuevatile = 3;

	mapatiles.putTileAt(nuevatile, randomx*3+4+worldsize*3+1, worldsize*3-1, true, capa);

	randomx*=32*3;

	randomx+=48;

	randomx+= worldsize*32*3 + 32*3;

    
 
    
	puerta2 = this.physics.add.staticSprite(randomx, worldsize*32*3, 'puerta2');


	player1 = this.physics.add.sprite(48, 48, 'player'); //Cargamos al jugador
	player2 = this.physics.add.sprite(worldsize*3*32+5*32-16, 48, 'player2');

	this.physics.world.enable([player1, player2]);
	//Camaras

	camara1 = this.cameras.main.setSize(600,400);
	camara2 = this.cameras.add(600, 0, 600, 400);


	camara1.startFollow(player1);
	camara2.startFollow(player2);

	this.add.image(0, 0, 'borde').setScrollFactor(0);


	this.anims.create({
		key:'downwards2', frames:this.anims.generateFrameNumbers('player2',{start:1, end:3}), repeat:0, frameRate:6
	});

	this.anims.create({
		key:'upwards2', frames:this.anims.generateFrameNumbers('player2',{start:5, end:7}), repeat:0, frameRate:6
	});

	this.anims.create({
		key:'right2', frames:this.anims.generateFrameNumbers('player2',{start:13, end:15}), repeat:0, frameRate:6
	});

	this.anims.create({
		key:'left2', frames:this.anims.generateFrameNumbers('player2',{start:9, end:11}), repeat:0, frameRate:6
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

	player1.setSize(10, 16).setOffset(0, 8);
	player2.setSize(10, 16).setOffset(0, 8);

	var textureFrames = this.textures.get('key1').getFrameNames();
	var animFrames = [];

	textureFrames.forEach(function (frameName) {

		animFrames.push({ key: 'key1', frame: frameName });

	});

	this.anims.create({ key: 'key1animate', frames: animFrames, frameRate: 6, repeat: -1 });

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

	randomx+= worldsize*3*32 + 3*32;

	var llave1 = this.physics.add.sprite(randomx, randomy, 'key1').play('key1animate');

	var getllave1 = function () {
		llave1.destroy();
		sound.play();
		puerta1abierta = true;
		puerta1.setFrame(1);
	}

	this.physics.add.collider(player2, llave1, getllave1, null, this);

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

        llave2 = this.physics.add.sprite(randomx, randomy, 'coopb');
	do{
		randomy = Math.floor(Math.random()*worldsize); 
	} while (randomy == 0);
    


	mapatiles.putTileAt(1, worldsize*3-1, randomy*3+1+worldsize*3, true, capa);
	mapatiles.putTileAt(1, worldsize*3, randomy*3+1+worldsize*3, true, capa);
	mapatiles.putTileAt(1, worldsize*3+1, randomy*3+1+worldsize*3, true, capa);
	mapatiles.putTileAt(1, worldsize*3+2, randomy*3+1+worldsize*3, true, capa);
	mapatiles.putTileAt(1, worldsize*3+3, randomy*3+1+worldsize*3, true, capa);


	randomy *= 32*3;
	randomy += worldsize*3*32;

	randomy += 48;

	puerta3 = this.physics.add.staticSprite(worldsize*3*32+22-54, randomy, 'puertah3');
	puerta4 = this.physics.add.staticSprite(worldsize*3*32+96+32, randomy, 'puertah3');

	var goldenstairs = this.physics.add.staticImage(worldsize*3*32+22-11+32, randomy, 'goldenstairs');

	var salvado1 = function () {
		flag=true;
		offcooperate.add.image(600,400,'ganan');
		addGame(globalid, 'Cooperate', "Player1", logros);
		music.stop();
		var t=offcooperate.scene.transition({target:'offmenu',duration:3000});

	}

	this.physics.add.collider(player1, goldenstairs, salvado1, null, this);

	var salvado2 = function () {
		flag=true;
		offcooperate.add.image(600,400,'ganan');
		addGame(globalid, 'Cooperate', "Player1", logros);
		music.stop();
		var t=offcooperate.scene.transition({target:'offmenu',duration:3000});

	}

	this.physics.add.collider(player2, goldenstairs, salvado2, null, this);


	var textureFrames = this.textures.get('key3').getFrameNames();
	var animFrames = [];

	textureFrames.forEach(function (frameName) {

		animFrames.push({ key: 'key3', frame: frameName });

	});

	this.anims.create({ key: 'key3animate', frames: animFrames, frameRate: 6, repeat: -1 });


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

	randomy+= worldsize*3*32 + 3*32;

	var llave3 = this.physics.add.sprite(randomx, randomy, 'key3').play('key3animate');

	var getllave3 = function () {
		llave3.destroy();
		sound.play();
		llave3cogida = true;
		if(llave4cogida) {
			puerta3abierta = true;
			puerta3.setFrame(1);
			puerta4.setFrame(1);
		}
	}

	this.physics.add.collider(player1, llave3, getllave3, null, this);

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

	randomx+= worldsize*3*32 + 3*32;
	randomy+= worldsize*3*32 + 3*32;

	var llave4 = this.physics.add.sprite(randomx, randomy, 'key3').play('key3animate');

	var getllave4 = function () {
		llave4.destroy();
		sound.play();
		llave4cogida = true;
		if(llave3cogida) {
			puerta3.setFrame(1);
			puerta4.setFrame(1);
			puerta3abierta = true;
		}
	}

	this.physics.add.collider(player2, llave4, getllave4, null, this);

	var pierden = function () {
		this.add.image(300, 200, 'pierden').setScrollFactor(0);
		flag=true;
		music.stop();
		var t=offcooperate.scene.transition({target:'menu',duration:3000});
	}

	/*cuentatiempo = this.time.addEvent({
		delay: 180000,
		callback: pierden,
		callbackScope: this
	});*/


	text = this.add.text(32, 32).setScrollFactor(0);

	pausaimg=offcooperate.add.image(300,200,'paused').setScrollFactor(0);
	pausaimg.alpha=0;
	pausaimg.depth=1;


}

offcooperate.update=function () {
    	if (offcooperate.physics.overlap(player1, llave2)){
       		puerta2abierta = true;
		    llave2.setFrame(1);
            puerta2.setFrame(1);
        }
        else{
            puerta2abierta=false;
            llave2.setFrame(0);
            puerta2.setFrame(0);
        }

	//var number = cuentatiempo.getProgress().toString().substr(2, 2);
	//number = 100-number;
    
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
        puerta2abierta=false;
        pausa=false;
		music.stop();
		var t=offcooperate.scene.transition({target:'offmenu',duration:'10'});
	}


	//text.setText('Tiempo: ' + number + "%");
	this.physics.world.collide(player1, capa);
	if(!puerta1abierta) this.physics.world.collide(player1, puerta1);
	if(!puerta2abierta) this.physics.world.collide(player2, puerta2);
	if(!puerta3abierta) this.physics.world.collide(player1, puerta3);
	if(!puerta3abierta) this.physics.world.collide(player2, puerta4);
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
			player2.body.velocity.y = -velocidadp2;
			player2.play('upwards2',true);
		}
		else if (cursors.down.isDown) {
			player2.body.velocity.y = velocidadp2;
			player2.play('downwards2',true);
		} else
			//Manejamos las teclas arriba/abajo

			if (cursors.left.isDown)
			{
				player2.body.velocity.x = -velocidadp2;
				player2.play('left2',true);
			}
			else if (cursors.right.isDown)
			{
				player2.body.velocity.x = velocidadp2;
				player2.play('right2',true);
			}
		//Manejamos las teclas izq/der
		if (wkey.isDown) {
			player1.body.velocity.y = -200;
			player1.play('up',true);
		}
		else if (skey.isDown) {
			player1.body.velocity.y = 200;
			player1.play('down',true);
		} else
			//Manejamos las teclas arriba/abajo

			if (akey.isDown)
			{
				player1.body.velocity.x = -200;
				player1.play('left',true);
			}
			else if (dkey.isDown)
			{
				player1.body.velocity.x = 200;
				player1.play('right',true);
			}
	}
}
