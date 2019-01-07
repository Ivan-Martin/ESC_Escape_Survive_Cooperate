//definimos una nueva escena de phaser, nos aseguramos de que se carga al cambiar a este modo con la impresion en consola, ponemos un texto para hacernos una idea, y definimos que si pulsamos la tecla ESC hacemos una transicion de vuelta al menu
var esc;
var mirror = new Phaser.Scene('mirror');
var mapatiles;
var tilecolision;
var cursors;
var player1;
var player2;
var capa;
var worldsize = 20;
var centralsize = 12;
var worldtiles;
var wkey, akey, skey, dkey;
var muros;
var camara1;
var camara2;
var velocidadp2;
var nomovimiento;
var mirrormusic;
var log;
var log2;
var enter;
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

mirror.create=function() {

	//Definición de los logros para mostrar al completar suficientes partidas
	var logros = function (user) {
		if(user.partidasjugadas[1] == 1){
			log=mirror.add.image(500,340,'mirror1').setScrollFactor(0);

		} else if (user.partidasjugadas[1] == 5){

			log2=mirror.add.image(500,340,'mirror2').setScrollFactor(0);
		}
	}

	updateMode(globalid, 'Mirrored Escape');

	mirrormusic = this.sound.add('escmusic');
	mirrormusic.play();

	nomovimiento=true;

	//Creación de controles y teclado.
	esc = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
	enter=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
	cursors = this.input.keyboard.createCursorKeys();
	wkey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
	akey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
	skey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
	dkey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

	//Definición del mensaje de conexión de websockets
	connection.onmessage = function (msg) {
		console.log("Websocket = " + msg.data);
		var datos = JSON.parse(msg.data);
		if(datos.userid != globalid){
			console.log("Recibido mensaje de otro jugador");
			console.log("Datos.user id = " + datos.userid + " globalid = " + globalid);
			if (datos.id == "setMirror") {
				//ID: setEscape. Recibimos del host la definición del mundo generado.
				stairs1pos = datos.stairs1;
				stairs2pos = datos.stairs2;
				goldenstairspos = datos.goldenstairs;
				player2pos = datos.player2pos;
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
				var ganadesconexion = mirror.add.image(300, 200, 'victoriadesconexion');
				ganadesconexion.depth = 2;
				ganadesconexion.setScrollFactor(0);
				nomovimiento=true;
				if(imhost) addGame(globalid, 'Mirrored Escape', "Player1", logros);
				else addGame(globalid, 'Mirrored Escape', "Player2", logros);

				setTimeout(function () {
					var t=mirror.scene.transition({target:'menu',duration:3000});
					clearInterval(intervalo);
				}, 3000);
			}
		}

	};

	worldtiles = worldsize*6; //Tamaño de dos laberintos

	worldtiles += 24; //Bordes necesarios a cada lado de la sala central

	worldtiles += centralsize*3; //Tamaño de la sala central

	mapatiles = this.make.tilemap({ tileWidth: 32, tileHeight: 32, width: 2*worldtiles*32+centralsize*32+24*32, heigth: 2*worldtiles*32+centralsize*32+24*32}); //Esto añade un mapa vacío al mundo

	var tileset = mapatiles.addTilesetImage('tileo', 'tileo', 32, 32); //Cargamos el mapa de sprites de tiles

	capa = mapatiles.createBlankDynamicLayer('nivel', tileset, 0, 0, worldtiles, worldtiles, 32, 32); //Crea una capa de worldtiles, cada tile 32x32 y la llama nivel1
	
	var stairs1pos = {}, stairs2pos = {}, goldenstairspos = {}, player2pos = {};
	var stairs1 = {}, stairs2 = {}, goldenstairs = {};

	
	if(imhost){
		/*
		 * CREACIÓN DEL MUNDO: Llama 3 veces al generador de laberintos e incluye las tiles necesarias
		 * para el tilemap.
		 * La 1º vez se crea el mundo izquierdo (Jugador 1)
		 * La 2º vez se crea el mundo central (Donde están las escaleras doradas)
		 * La 3º vez se copia el mundo izquierdo en el mundo derecho (Jugador 2)
		 * También se genera la posición del jugador 2 y las escaleras.
		 */


		createworld(worldsize); //Lanzamos el generador de laberintos con un tamaño de worldsize x worldsize

		muros = tileindex(); //Recuperamos del generador de laberintos el tileo del mapa

		var posiciones = casillalejana(0, 0);
		var escalerax = posiciones[0];
		var escaleray = posiciones[1];
		escalerax*=3*32;
		escaleray*=3*32;
		escalerax+=48;
		escaleray+=48;

		var enviarstairs1 = {};
		enviarstairs1.x = escalerax;
		enviarstairs1.y = escaleray;
		stairs1pos.x = escalerax;
		stairs1pos.y = escaleray;

		var tiletotales = 24+centralsize*3+worldsize*2*3;
		var escalera2x = escalerax;
		var escalera2y = posiciones[1];

		for (var i = 0; i < worldsize*3; i++){
			for (var j = 0; j < worldsize*3; j++){
				var pos = (i*worldsize*3)+j;
				mapatiles.putTileAt(muros[pos], i, j, true, capa); //Asignamos a la capa de tiles de Phaser nuestras tiles generadas
			}
		}

		for (var i = worldsize*3; i < worldsize*3+12; i++){
			for (var j = 0; j < worldsize*3+12; j++){
				mapatiles.putTileAt(30, i, j, true, capa); //Asignamos a la capa de tiles de Phaser nuestro borde
			}
		}

		for (var i = worldsize*3+24+centralsize*3+worldsize*3-1, k = 0; i >= worldsize*3+24+centralsize*3; i--, k++){
			for (var j = worldsize*3-1; j >= 0; j--){
				var pos = (k*worldsize*3)+j;
				mapatiles.putTileAt(muros[pos]+15, i, j, true, capa); //Asignamos a la capa de tiles de Phaser nuestras tiles generadas
			}
		}




		createworld(centralsize); //Lanzamos el generador de laberintos con un tamaño de worldsize x worldsize

		muros = tileindex(); //Recuperamos del generador de laberintos el tileo del mapa

		var posiciones = casillalejana(0, 0);
		console.log(posiciones);
		var escalerax = posiciones[0];
		var escaleray = posiciones[1];
		escalerax*=3*32;
		escaleray*=3*32;
		escalerax+= worldsize*3*32 + 12*32;
		escalerax+=48;
		escaleray+=48;

		var enviargoldenstairs = {};
		enviargoldenstairs.x = escalerax;
		enviargoldenstairs.y = escaleray;
		goldenstairspos.x = escalerax;
		goldenstairspos.y = escaleray;

		for (var i = worldsize*3+12, k = 0; i < worldsize*3+12+centralsize*3; i++, k++){
			for (var l = 0; l < centralsize*3; l++){
				var pos = (k*centralsize*3)+l;
				mapatiles.putTileAt(muros[pos], i, l, true, capa); //Asignamos a la capa de tiles de Phaser nuestras tiles generadas
			}
		}

		for (var i = worldsize*3+12+centralsize*3; i < worldsize*3+24+centralsize*3; i++){
			for (var j = 0; j < worldsize*3+12; j++){
				mapatiles.putTileAt(30, i, j, true, capa); //Asignamos a la capa de tiles de Phaser nuestro borde
			}
		}

		var randomx = (worldsize*3+24+centralsize*3+worldsize*3)*32 - 48;
		var randomy = 48;

		escalerax = (worldsize*3+24+centralsize*3+worldsize*3)*32-escalera2x;
		escaleray = escalera2y;
		escaleray*=32*3;
		escaleray+= 48;

		var enviarplayer2 = {};
		enviarplayer2.x = randomx;
		enviarplayer2.y = randomy;
		stairs2pos.x = escalerax;
		stairs2pos.y = escaleray;
		var enviarstairs2 = {};
		enviarstairs2.x = stairs2pos.x;
		enviarstairs2.y = stairs2pos.y;
		player2pos.x = randomx;
		player2pos.y = randomy;
		enviarmensaje.id = 'setMirror';
		enviarmensaje.userid = globalid;
		enviarmensaje.stairs1 = enviarstairs1;
		enviarmensaje.goldenstairs = enviargoldenstairs;
		enviarmensaje.player2pos = enviarplayer2;
		enviarmensaje.stairs2 = enviarstairs2;

		for (var i = 0; i < worldtiles; i++){
			mensajedimensiones[i] = [];
			for (var j = 0; j < worldtiles; j++){
				mensajedimensiones[i][j] = capa.getTileAt(i, j, true).index;
			}
		}

		//Cuando he finalizado de generar el mundo, como host, lo renderizo
		render();

	} else {
		//Si no soy host, al generar la escena "Escape", le digo al host que estoy listo para recibir los datos
		var mensajelisto = {};
		mensajelisto.id = 'player2ready';
		mensajelisto.userid = globalid;
		connection.send(JSON.stringify(mensajelisto));
	}

	
	function render() {

		//Camaras
		
		mapatiles.setCollisionBetween(3, 14, true, true, capa); //Le dice que las tiles de 3 a 14 colisionan
		mapatiles.setCollisionBetween(18, 29, true, true, capa); //Le dice que las tiles de 3 a 14 colisionan
		

		camara1 = mirror.cameras.main.setSize(600,400);
		camara2 = mirror.cameras.add(600, 0, 600, 400);

		stairs1 = mirror.physics.add.sprite(stairs1pos.x, stairs1pos.y, 'stairs');

		goldenstairs = mirror.physics.add.sprite(goldenstairspos.x, goldenstairspos.y, 'goldenstairs');

		stairs2 = mirror.physics.add.image(stairs2pos.x, stairs2pos.y, 'stairs');

		var frasesprite;

		if(imhost){
			frasesprite = 'player';
			frasesprite2 = 'player2';
		} else {
			frasesprite = 'player2';
			frasesprite2 = 'player';
		}

		player1 = mirror.physics.add.sprite(48, 48, frasesprite); //Cargamos al jugador

		player2 = mirror.physics.add.sprite(player2pos.x, player2pos.y, frasesprite2);

		//Definimos quién es el jugador y quién el rival según seamos host o no
		if(imhost){
			mijugador = player1;
			rival = player2;
		}
		else{
			mijugador = player2;
			rival = player1;

		}

		mirror.physics.world.enable([player1, player2]);

		camara1.startFollow(mijugador);
		//camara2.startFollow(rival);
		camara2.setScroll(-3000, -3000);

		mirror.add.image(0, 0, 'borde').setScrollFactor(0);

		/*
		 * Creamos las animaciones de los personajes andando
		 */

		mirror.add.image(0, 0, 'borde').setScrollFactor(0);

		mirror.anims.create({
			key:'downwards2', frames:mirror.anims.generateFrameNumbers('player2',{start:1, end:3}), repeat:0, frameRate:6
		});

		mirror.anims.create({
			key:'upwards2', frames:mirror.anims.generateFrameNumbers('player2',{start:5, end:7}), repeat:0, frameRate:6
		});

		mirror.anims.create({
			key:'right2', frames:mirror.anims.generateFrameNumbers('player2',{start:13, end:15}), repeat:0, frameRate:6
		});

		mirror.anims.create({
			key:'left2', frames:mirror.anims.generateFrameNumbers('player2',{start:9, end:11}), repeat:0, frameRate:6
		});

		mirror.anims.create({
			key:'left', frames:mirror.anims.generateFrameNumbers('player',{start:9, end:11}), repeat:0, frameRate:6
		});

		mirror.anims.create({
			key:'right', frames:mirror.anims.generateFrameNumbers('player',{start:13, end:15}), repeat:0, frameRate:6
		});

		mirror.anims.create({
			key:'up', frames:mirror.anims.generateFrameNumbers('player',{start:5, end:7}), repeat:0, frameRate:6
		});

		mirror.anims.create({
			key:'down', frames:mirror.anims.generateFrameNumbers('player',{start:1, end:3}), repeat:0, frameRate:6
		});

		var transportp1 = function () {
			if(imhost) nomovimiento = true;
			player1.body.velocity.x = 0;
			player1.body.velocity.y = 0;
			mirror.add.tween({
				targets:stairs1,
				alpha:0,
				duration:1,
				ease:'Sine.easeInOut'
			});
			mirror.add.tween({
				targets:player1,
				alpha:0,
				duration: 1000,
				ease:'Sine.easeInOut',
				onComplete:function(){
					tAux();
					camara1.fadeOut(250,255);
					camara2.fadeOut(250,255);
					camara1.once('camerafadeoutcomplete',function(){
						camara1.fadeIn(250,255);
					})
					camara2.once('camerafadeoutcomplete',function(){
						camara2.fadeIn(250,255);
					})
				}});
		};
		function tAux(){
			stairs1.destroy();
			player1.x=(worldsize*3*32)+48+(12*32);
			player1.y=48;
			if(imhost) nomovimiento = false;
			mirror.add.tween({
				targets:player1,
				alpha:1,
				duration: 50,
				ease:'Sine.easeInOut'});
		}

		mirror.physics.add.collider(player1, stairs1, transportp1, null, mirror);

		var transportp2 = function () {

			player2.body.velocity.x = 0;
			player2.body.velocity.y = 0;
			if(!imhost) nomovimiento = true;
			mirror.add.tween({
				targets:stairs2,
				alpha:0,
				duration:1,
				ease:'Sine.easeInOut'
			});
			mirror.add.tween({
				targets:player2,
				alpha:0,
				duration: 1000,
				ease:'Sine.easeInOut',
				onComplete:function(){
					tAux2();
					camara1.fadeOut(250,255);
					camara2.fadeOut(250,255);
					camara1.once('camerafadeoutcomplete',function(){
						camara1.fadeIn(250,255);
					})
					camara2.once('camerafadeoutcomplete',function(){
						camara2.fadeIn(250,255);
					})
				}});
		}
		function tAux2(){
			stairs2.destroy();
			player2.x=(worldsize*3*32)+48+(12*32);
			player2.y=48;
			if(!imhost) nomovimiento = false;
			mirror.add.tween({
				targets:player2,
				alpha:1,
				duration: 100,
				ease:'Sine.easeInOut'});
		}

		mirror.physics.add.collider(player2, stairs2, transportp2, null, mirror);

		var gana1 = function () {
			mirror.add.image(300,200,'gana1').setScrollFactor(0);
			goldenstairs.destroy();
			nomovimiento=true;
			addGame(globalid, 'Mirrored Escape', "Player1", logros);
			var t=mirror.scene.transition({target:'menu',duration:3000});
		}

		mirror.physics.add.collider(player1, goldenstairs, gana1, null, mirror);

		var gana2 = function () {
			mirror.add.image(300,200,'gana2').setScrollFactor(0);
			goldenstairs.destroy();
			nomovimiento=true;
			addGame(globalid, 'Mirrored Escape', "Player2", logros);
			var t=mirror.scene.transition({target:'menu',duration:3000});
		}

		mirror.physics.add.collider(player2, goldenstairs, gana2, null, mirror);
		player1.setSize(10, 16).setOffset(0, 8);
		player2.setSize(10, 16).setOffset(0, 8);
		nomovimiento = false;
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
	};
	pausaimg=mirror.add.image(300,200,'warning').setScrollFactor(0);
	pausaimg.alpha=0;
	pausaimg.depth = 1;

	var imagenayuda = mirror.add.image(-2700, -2800, 'ayudaescape');
	imagenayuda.depth = 3;
}

mirror.update=function () {

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
		mirrormusic.stop();
		var medesconecto = {};
		medesconecto.userid = globalid;
		medesconecto.id = "desconexion";
		connection.send(JSON.stringify(medesconecto));
		var t=mirror.scene.transition({target:'menu',duration:10});
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
	if(gameready){
		//Si podemos comenzar a jugar
		var mijugador;

		if(imhost) {
			mijugador = player1;
		} else {
			mijugador = player2;
		}
		this.physics.world.collide(player1, capa);

		//Hacemos que el personaje colisione con la capa del tile
		player1.body.velocity.x = 0;
		player1.body.velocity.y = 0;
		//El personaje por defecto aparece siempre parado excepto que se pulse una tecla

		this.physics.world.collide(player2, capa);
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
