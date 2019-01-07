//definimos una nueva escena de phaser, nos aseguramos de que se carga al cambiar a este modo con la impresion en consola, ponemos un texto para hacernos una idea, y definimos que si pulsamos la tecla ESC hacemos una transicion de vuelta al menu
var esc;
var cooperate = new Phaser.Scene('cooperate');
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
var nomovimiento;
var coopmusic;
var sound;
var log;
var log2;
var imhost;
var player2ready = false;
var enviarmensaje = {};
var rellenocapa = [];
var mensajedimensiones = {};
var velrivalx = 0, velrivaly = 0;
var rival;
var mivelx = 0, mively = 0;
var gameready = false;
var posrivalx, posrivaly;
var esperandopaquete = false;
var abriendose=false;
var pausa=false;
var pausaimg;
var intervalo;
var finrender = false;

function comprobarMundoListo () {
	//Función para comprobar que no se haya perdido ningún paquete al enviar el mundo al otro jugador
	var booleanodim = true;
	for (var i = 0; i < worldtiles; i++){
		booleanodim = (booleanodim && rellenocapa[i]);
		if(!rellenocapa[i]){
			var msgmapaincompleto = {};
			msgmapaincompleto.userid = globalid;
			msgmapaincompleto.id = "mundoIncompleto";
			msgmapaincompleto.dim = i;
			connection.send(msgmapaincompleto);
			esperandopaquete = true;
		}
	}
	if(booleanodim){
		esperandopaqute = false;
		var mundolisto = {}; mundolisto.userid = globalid; mundolisto.id = "comenzarPartida";
		connection.send(JSON.stringify(mundolisto));
		gameready = true;
	}
	return booleanodim;
}

cooperate.create = function () {

	//Definición de los logros para mostrar al completar suficientes partidas

	var logros = function (user) {
		if(user.partidasjugadas[0] == 1){
			log=cooperate.add.image(500,340,'cooperate1').setScrollFactor(0);

		} else if (user.partidasjugadas[0] == 5){

			log2=cooperate.add.image(500,340,'cooperate2').setScrollFactor(0);
		}
	}
	updateMode(globalid, 'Cooperate');

	sound = this.sound.add('sdoor');
	coopmusic = this.sound.add('coomusic');
	coopmusic.play();

	nomovimiento=true;

	esc = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
	cursors = this.input.keyboard.createCursorKeys(); //Creamos el manejo del teclado
	wkey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
	akey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
	skey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
	dkey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
	enter=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

	connection.onmessage = function (msg) {
		console.log("Websocket = " + msg.data);
		var datos = JSON.parse(msg.data);
		if(datos.userid != globalid){
			console.log("Recibido mensaje de otro jugador");
			console.log("Datos.user id = " + datos.userid + " globalid = " + globalid);
			if (datos.id == "setCooperate") {
				//ID: setSurvive. Recibimos del host la definición del mundo generado.
				player2pos = datos.player2pos;
				llave1pos = datos.llave1;
				llave2pos = datos.llave2;
				llave3pos = datos.llave3;
				llave4pos = datos.llave4;
				puerta1pos = datos.puerta1;
				puerta2pos = datos.puerta2;
				puerta3pos = datos.puerta3;
				puerta4pos = datos.puerta4;
				goldenstairspos = datos.goldenstairs;
				if (!imhost){
					//Este es el último paquete que tengo que enviar; Así que compruebo si tengo
					//todos los datos o se ha perdido alguno.
					if(comprobarMundoListo()){render();}
				}
			} else if (datos.id == "player2ready") {
				//ID: play
				player2ready = true;
				console.log("Recibido que el jugador 2 está listo");
			} else if (datos.id == "rellenoMapa") {
				var dimensionrelleno = datos.dim;
				rellenocapa[dimensionrelleno] = true;
				for (var i = 0; i < worldtiles; i++){
					mapatiles.putTileAt(datos.relleno[i], dimensionrelleno, i, true, capa);
				}
				if(esperandopaquete){render ();}
			} else if (datos.id == "velocidad"){
				velrivalx = datos.velocidadx;
				velrivaly = datos.velocidady;
				posrivalx = datos.x;
				posrivaly = datos.y;
				rival.setPosition(posrivalx, posrivaly);
				console.log("Rival position = " + rival.x);
			} else if (datos.id == "comenzarPartida"){
				gameready = true;
			} else if (datos.id == "mundoIncompleto"){
				var mensajemundo = {};
				mensajemundo.userid = globalid;
				mensajemundo.id = "rellenoMapa";
				mensajemundo.relleno = [];
				mensajemundo.dim = datos.dim;
				for (var j = 0; j < worldtiles; j++){
					mensajemundo.dim[j] = capa.getTileAt(datos.dim, j, true).index;
				}

			} else if (datos.id == "desconexion"){
				var ganadesconexion = escape.add.image(300, 200, 'victoriadesconexion');
				ganadesconexion.depth = 2;
				ganadesconexion.setScrollFactor(0);
				nomovimiento=true;
				if(imhost) addGame(globalid, 'Survive', "Player1", logros);
				else addGame(globalid, 'Survive', "Player2", logros);

				setTimeout(function () {
					var t=escape.scene.transition({target:'menu',duration:3000});
					clearInterval(intervalosurvive);
				}, 3000);
			}
		}

	};

	worldtiles = worldsize*3*2+3;

	mapatiles = this.make.tilemap({ tileWidth: 32, tileHeight: 32, width: worldtiles*32*2+96, heigth: worldtiles*32*2}); //Esto añade un mapa vacío al mundo

	var tileset = mapatiles.addTilesetImage('tileo', 'tileo', 32, 32); //Cargamos el mapa de sprites de tiles

	capa = mapatiles.createBlankDynamicLayer('nivel', tileset, 0, 0, worldtiles, worldtiles, 32, 32); //Crea una capa de worldtiles, cada tile 32x32 y la llama nivel1

	var llave1pos = {}, llave2pos = {}, llave3pos = {}, llave4pos = {};
	var puerta1pos = {}, puerta2pos = {}, puerta3pos = {}, puerta4pos = {};
	var player2pos = {}, goldenstairspos= {};
	
	var llave1, llave2, llave3, llave4;
	var goldenstairs;

	if(imhost){
		/*
		 * CREACION DEL MUNDO
		 */
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



		//puerta1 = this.physics.add.staticSprite(randomx, worldsize*32*3, 'puerta1');


		var enviarpuerta1 = {};
		enviarpuerta1.x = randomx;
		enviarpuerta1.y = worldsize*32*3;
		puerta1pos.x = randomx;
		puerta1pos.y = worldsize*32*3;





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




		//puerta2 = this.physics.add.staticSprite(randomx, worldsize*32*3, 'puerta2');

		//player1 = this.physics.add.sprite(48, 48, 'player'); //Cargamos al jugador
		//player2 = this.physics.add.sprite(worldsize*3*32+5*32-16, 48, 'player2');

		puerta2pos.x = randomx;
		puerta2pos.y = worldsize*32*3;
		player2pos.x = worldsize*3*32+5*32-16;
		player2pos.y = 48;
		var enviarpuerta2 = {};
		enviarpuerta2.x = randomx;
		enviarpuerta2.y = worldsize*32*3;
		var enviarplayer2 = {};
		enviarplayer2.x = worldsize*3*32+5*32-16;
		enviarplayer2.y = 48;





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




		//var llave1 = this.physics.add.sprite(randomx, randomy, 'key1').play('key1animate');
		llave1pos.x = randomx;
		llave1pos.y = randomy;
		var enviarllave1 = {};
		enviarllave1.x = randomx;
		enviarllave1.y = randomy;




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





		//var llave2 = this.physics.add.sprite(randomx, randomy, 'key2').play('key2animate');
		llave2pos.x = randomx;
		llave2pos.y = randomy;
		var enviarllave2 = {};
		enviarllave2.x = randomx;
		enviarllave2.y = randomy;





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




		//puerta3 = this.physics.add.staticSprite(worldsize*3*32+22-54, randomy, 'puertah3');
		//puerta4 = this.physics.add.staticSprite(worldsize*3*32+96+32, randomy, 'puertah3');
		puerta3pos.x = worldsize*3*32+22-54;
		puerta3pos.y = randomy;
		puerta4pos.x = worldsize*3*32+96+32;
		puerta4pos.y = randomy;
		var enviarpuerta3 = {};
		enviarpuerta3.x = worldsize*3*32+22-54;
		enviarpuerta3.y = randomy;
		var enviarpuerta4 = {};
		enviarpuerta4.x = worldsize*3*32+96+32;
		enviarpuerta4.y = randomy;





		//var goldenstairs = this.physics.add.staticImage(worldsize*3*32+22-11+32, randomy, 'goldenstairs');
		var enviargoldenstairs = {};
		enviargoldenstairs.x = worldsize*3*32+22-11+32;
		enviargoldenstairs.y = randomy;
		goldenstairspos.x = worldsize*3*32+22-11+32;
		goldenstairspos.y = randomy;






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




		//var llave3 = this.physics.add.sprite(randomx, randomy, 'key3').play('key3animate');
		llave3pos.x = randomx;
		llave3pos.y = randomy;
		var enviarllave3 = {};
		enviarllave3.x = randomx;
		enviarllave3.y = randomy;






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





		//var llave4 = this.physics.add.sprite(randomx, randomy, 'key3').play('key3animate');
		var enviarllave4 = {};
		enviarllave4.x = randomx;
		enviarllave4.y = randomy;
		llave4pos.x = randomx;
		llave4pos.y = randomy;
		
		enviarmensaje.id = 'setCooperate';
		enviarmensaje.userid = globalid;
		enviarmensaje.player2pos = enviarplayer2;
		enviarmensaje.goldenstairs = enviargoldenstairs;
		enviarmensaje.llave1 = enviarllave1;
		enviarmensaje.llave2 = enviarllave2;
		enviarmensaje.llave3 = enviarllave3;
		enviarmensaje.llave4 = enviarllave4;
		enviarmensaje.puerta1 = enviarpuerta1;
		enviarmensaje.puerta2 = enviarpuerta2;
		enviarmensaje.puerta3 = enviarpuerta3;
		enviarmensaje.puerta4 = enviarpuerta4;
		
		for (var i = 0; i < worldtiles; i++){
			mensajedimensiones[i] = [];
			for (var j = 0; j < worldtiles; j++){
				mensajedimensiones[i][j] = capa.getTileAt(i, j, true).index;
			}
		}

		render();

	} else {
		//Si no soy host, al generar la escena "Escape", le digo al host que estoy listo para recibir los datos
		var mensajelisto = {};
		mensajelisto.id = 'player2ready';
		mensajelisto.userid = globalid;
		connection.send(JSON.stringify(mensajelisto));
	}
	
	mapatiles.setCollisionBetween(3, 14, true, true, capa); //Le dice que las tiles de 3 a 14 colisionan

	function render () {
		
		puerta1 = cooperate.physics.add.staticSprite(puerta1pos.x, puerta1pos.y, 'puerta1');
		puerta2 = cooperate.physics.add.staticSprite(puerta2pos.x, puerta2pos.y, 'puerta2');
		puerta3 = cooperate.physics.add.staticSprite(puerta3pos.x, puerta3pos.y, 'puertah3');
		puerta4 = cooperate.physics.add.staticSprite(puerta4pos.x, puerta4pos.y, 'puertah3');
		
		player1 = cooperate.physics.add.sprite(48, 48, 'player'); //Cargamos al jugador
		player2 = cooperate.physics.add.sprite(player2pos.x, player2pos.y, 'player2');
		
		goldenstairs = cooperate.physics.add.staticImage(goldenstairspos.x, goldenstairspos.y, 'goldenstairs');
		
		cooperate.physics.world.enable([player1, player2]);
		//Camaras

		camara1 = cooperate.cameras.main.setSize(600,400);
		camara2 = cooperate.cameras.add(600, 0, 600, 400);

		if(imhost){
			camara1.startFollow(player1);
			camara2.startFollow(player2);
		} else {
			camara2.startFollow(player1);
			camara1.startFollow(player2);
		}
		

		cooperate.add.image(0, 0, 'borde').setScrollFactor(0);


		cooperate.anims.create({
			key:'downwards2', frames:cooperate.anims.generateFrameNumbers('player2',{start:1, end:3}), repeat:0, frameRate:6
		});

		cooperate.anims.create({
			key:'upwards2', frames:cooperate.anims.generateFrameNumbers('player2',{start:5, end:7}), repeat:0, frameRate:6
		});

		cooperate.anims.create({
			key:'right2', frames:cooperate.anims.generateFrameNumbers('player2',{start:13, end:15}), repeat:0, frameRate:6
		});

		cooperate.anims.create({
			key:'left2', frames:cooperate.anims.generateFrameNumbers('player2',{start:9, end:11}), repeat:0, frameRate:6
		});

		cooperate.anims.create({
			key:'left', frames:cooperate.anims.generateFrameNumbers('player',{start:9, end:11}), repeat:0, frameRate:6
		});

		cooperate.anims.create({
			key:'right', frames:cooperate.anims.generateFrameNumbers('player',{start:13, end:15}), repeat:0, frameRate:6
		});

		cooperate.anims.create({
			key:'up', frames:cooperate.anims.generateFrameNumbers('player',{start:5, end:7}), repeat:0, frameRate:6
		});

		cooperate.anims.create({
			key:'down', frames:cooperate.anims.generateFrameNumbers('player',{start:1, end:3}), repeat:0, frameRate:6
		});

		player1.setSize(10, 16).setOffset(0, 8);
		player2.setSize(10, 16).setOffset(0, 8);

		var textureFrames = cooperate.textures.get('key1').getFrameNames();
		var animFrames = [];

		textureFrames.forEach(function (frameName) {

			animFrames.push({ key: 'key1', frame: frameName });

		});

		cooperate.anims.create({ key: 'key1animate', frames: animFrames, frameRate: 6, repeat: -1 });
		
		llave1 = cooperate.physics.add.sprite(llave1pos.x, llave1pos.y, 'key1').play('key1animate');
		
		var getllave1 = function () {
			llave1.destroy();
			sound.play();
			puerta1abierta = true;
			puerta1.setFrame(1);
		}

		cooperate.physics.add.collider(player2, llave1, getllave1, null, cooperate);

		var textureFrames = cooperate.textures.get('key2').getFrameNames();
		var animFrames = [];

		textureFrames.forEach(function (frameName) {

			animFrames.push({ key: 'key2', frame: frameName });

		});

		
		cooperate.anims.create({ key: 'key2animate', frames: animFrames, frameRate: 6, repeat: -1 });
		
		llave2 = cooperate.physics.add.sprite(llave2pos.x, llave2pos.y, 'key2').play('key2animate');
		
		var getllave2 = function () {
			llave2.destroy();
			sound.play();
			puerta2abierta = true;
			puerta2.setFrame(1);
		}

		cooperate.physics.add.collider(player1, llave2, getllave2, null, cooperate);

		var salvado1 = function () {
			nomovimiento=true;
			cooperate.add.image(600,400,'ganan');
			addGame(globalid, 'Cooperate', "Player1", logros);
            music.stop();
			var t=cooperate.scene.transition({target:'menu',duration:3000});

		}

		cooperate.physics.add.collider(player1, goldenstairs, salvado1, null, cooperate);

		var salvado2 = function () {
			nomovimiento=true;
			cooperate.add.image(600,400,'ganan');
			addGame(globalid, 'Cooperate', "Player1", logros);
            music.stop();
			var t=cooperate.scene.transition({target:'menu',duration:3000});

		}

		cooperate.physics.add.collider(player2, goldenstairs, salvado2, null, cooperate);


		var textureFrames = cooperate.textures.get('key3').getFrameNames();
		var animFrames = [];

		textureFrames.forEach(function (frameName) {

			animFrames.push({ key: 'key3', frame: frameName });

		});

		cooperate.anims.create({ key: 'key3animate', frames: animFrames, frameRate: 6, repeat: -1 });
		
		llave3 = cooperate.physics.add.sprite(llave3pos.x, llave3pos.y, 'key3').play('key3animate');
		
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

		cooperate.physics.add.collider(player1, llave3, getllave3, null, cooperate);
		
		llave4 = cooperate.physics.add.sprite(llave4pos.x, llave4pos.y, 'key3').play('key3animate');
		
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

		cooperate.physics.add.collider(player2, llave4, getllave4, null, cooperate);

		var pierden = function () {
			cooperate.add.image(300, 200, 'pierden').setScrollFactor(0);
			nomovimiento=true;
            music.stop();
			var t=cooperate.scene.transition({target:'menu',duration:3000});
		}

		cuentatiempo = cooperate.time.addEvent({
			delay: 180000,
			callback: pierden,
			callbackScope: cooperate
		});


		text = cooperate.add.text(32, 32).setScrollFactor(0);
		
		nomovimiento=false;
		
		//Definimos el intervalo para mandar los websockets de posicion entre jugadores.
		intervalo = setInterval(function () {
			if(imhost) {
				mijugador = player1;
			} else {
				mijugador = player2;
			}
			var enviarvelocidad = {}
			enviarvelocidad.userid = globalid;
			enviarvelocidad.id = 'velocidad';
			enviarvelocidad.velocidadx = mivelx;
			enviarvelocidad.velocidady = mively;
			enviarvelocidad.x = mijugador.x;
			enviarvelocidad.y = mijugador.y;
			console.log("mi jugador position = " + mijugador.x);
			connection.send(JSON.stringify(enviarvelocidad));
		}, 50);
		
		finrender = true;
	}
	
	pausaimg=escape.add.image(300,200,'warning').setScrollFactor(0);
    pausaimg.alpha=0;
    pausaimg.depth = 1;

	
}

cooperate.update=function () {
	
	
	if(esc.isDown && !abriendose && !pausa){
		abriendose=true;
		nomovimiento=true;
		setTimeout(function(){
			pausaimg.alpha=1;
			pausa=true;
			abriendose=false;
		},500);
	}
	if(esc.isDown && pausa){
		setTimeout(function(){
			pausa=false;
			nomovimiento = false;
			pausaimg.alpha=0;
		},500);
	}
	if(enter.isDown && pausa){
		survivemusic.stop();
		var medesconecto = {};
		medesconecto.userid = globalid;
		medesconecto.id = "desconexion";
		connection.send(JSON.stringify(medesconecto));
		updateMode(globalid, "desconexion");
		var t=cooperate.scene.transition({target:'menu',duration:10});
		clearInterval(intervalo);
	}
	
	if(player2ready){
		//Si somos el host, le mandamos al jugador 2 el mundo cuando esté listo
		console.log("Enviando mundo a jugador 2");
		for (var i = 0; i < worldtiles; i++){
			var enviarmensajedim = {};
			enviarmensajedim.id = "rellenoMapa";
			enviarmensajedim.userid = globalid;
			enviarmensajedim.dim = i;
			enviarmensajedim.relleno = mensajedimensiones[i];
			connection.send(JSON.stringify(enviarmensajedim));
		}
		connection.send(JSON.stringify(enviarmensaje));
		player2ready = false;
	}
	
	
	//Hacemos que el personaje colisione con la capa del tile
	
	if(gameready && finrender){
		
		if(!puerta1abierta) cooperate.physics.world.collide(player1, puerta1);
		if(!puerta2abierta) cooperate.physics.world.collide(player2, puerta2);
		if(!puerta3abierta) cooperate.physics.world.collide(player1, puerta3);
		if(!puerta3abierta) cooperate.physics.world.collide(player2, puerta4);
		
		var number = cuentatiempo.getProgress().toString().substr(2, 2);
		number = 100-number;

		text.setText('Time: ' + number + "%");
		
		//Si podemos comenzar a jugar
		var mijugador;

		if(imhost) {
			mijugador = player1;
			rival = player2;
		} else {
			mijugador = player2;
			rival = player1;
		}
		//Miramos quien es mi jugador

		cooperate.physics.world.collide(player1, capa);

		//Hacemos que el personaje colisione con la capa del tile
		player1.body.velocity.x = 0;
		player1.body.velocity.y = 0;
		//El personaje por defecto aparece siempre parado excepto que se pulse una tecla

		cooperate.physics.world.collide(player2, capa);
		//Hacemos que el personaje colisione con la capa del tile
		player2.body.velocity.x = 0;
		player2.body.velocity.y = 0;
		//El personaje por defecto aparece siempre parado excepto que se pulse una tecla
		
		rival.body.velocity.x = velrivalx;
		rival.body.velocity.y = velrivaly;
		
		if(velrivalx > 0){
			rival.play('right2', true);
		} else if (velrivalx < 0){
			rival.play('left2', true);
		} else if (velrivaly < 0){
			rival.play('upwards2', true);
		} else if (velrivaly > 0){
			rival.play('downwards2', true);
		}
		
		if(!nomovimiento){
			var mijugador;

			if (cursors.up.isDown ||wkey.isDown) {
				mijugador.body.velocity.y = -200;
				mijugador.play('up',true);
			} else if (cursors.down.isDown || skey.isDown) {
				mijugador.body.velocity.y = 200;
				mijugador.play('down',true);
			} else if (cursors.left.isDown || akey.isDown) {
				mijugador.body.velocity.x = -200;
				mijugador.play('left',true);
			} else if (cursors.right.isDown || dkey.isDown) {
				mijugador.body.velocity.x = 200;
				mijugador.play('right',true);
			}
			//Manejamos las teclas izq/der
			//Manejamos las teclas izq/der
			mivelx = mijugador.body.velocity.x;
			mively = mijugador.body.velocity.y;

			
		}
	}
}
