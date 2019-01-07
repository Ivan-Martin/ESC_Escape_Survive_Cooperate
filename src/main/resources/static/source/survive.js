//definimos una nueva escena de phaser, nos aseguramos de que se carga al cambiar a este modo con la impresion en consola, ponemos un texto para hacernos una idea, y definimos que si pulsamos la tecla ESC hacemos una transicion de vuelta al menu
var esc;
var survive = new Phaser.Scene('survive');
var mapatiles;
var tilecolision;
var cursors;
var player1;
var player2;
var capa;
var worldsize = 20;
var worldtiles;
var wkey, akey, skey, dkey;
var muros;
var camara1;
var camara2;
var text;
var cuentatiempo;
var velocidadp2;
var powerup = false;
var usingpower = false;
var mask, mask2;
var p2;
var nomovimiento;
var flash;
var survivalmusic;
var sound;
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
var intervalosurvive;
var poder;
var finrender = false;
var poweruppos = {};

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

survive.create =function () {

	//Definición de los logros para mostrar al completar suficientes partidas
	var logros = function (user) {
		if(user.partidasjugadas[2] == 1){
			log=survive.add.image(500,340,'survive1').setScrollFactor(0);

		} else if (user.partidasjugadas[2] == 5){

			log2=survive.add.image(500,340,'survive2').setScrollFactor(0);
		}
	}

	updateMode(globalid, 'Survive');

	sound = this.sound.add('spup');
	survivalmusic = this.sound.add('surmusic');
	survivalmusic.play();

	nomovimiento=true;

	esc = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
	cursors = this.input.keyboard.createCursorKeys(); //Creamos el manejo del teclado
	wkey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
	akey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
	skey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
	dkey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
	spacekey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
	enter=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

	connection.onmessage = function (msg) {
		console.log("Websocket = " + msg.data);
		var datos = JSON.parse(msg.data);
		if(datos.userid != globalid){
			console.log("Recibido mensaje de otro jugador");
			console.log("Datos.user id = " + datos.userid + " globalid = " + globalid);
			if (datos.id == "setSurvive") {
				//ID: setSurvive. Recibimos del host la definición del mundo generado.
				poweruppos = datos.powerup;
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



	velocidadp2 = 150;

	worldtiles = worldsize*3;

	mapatiles = this.make.tilemap({ tileWidth: 32, tileHeight: 32, width: worldtiles*32, heigth: worldtiles*32}); //Esto añade un mapa vacío al mundo

	var tileset = mapatiles.addTilesetImage('tileo', 'tileo', 32, 32); //Cargamos el mapa de sprites de tiles

	capa = mapatiles.createBlankDynamicLayer('nivel', tileset, 0, 0, worldtiles, worldtiles, 32, 32); //Crea una capa de worldtiles, cada tile 32x32 y la llama nivel1

	var player2pos = {};

	if(imhost){
		/*
		 * CREACIÓN DEL MUNDO
		 */

		createworld(worldsize); //Lanzamos el generador de laberintos con un tamaño de worldsize x worldsize

		addloops(20);

		muros = tileindex(); //Recuperamos del generador de laberintos el tileo del mapa


		for (var i = 0; i < worldtiles; i++){
			for (var j = 0; j < worldtiles; j++){
				var pos = (i*worldtiles)+j;
				mapatiles.putTileAt(muros[pos], i, j, true, capa); //Asignamos a la capa de tiles de Phaser nuestras tiles generadas
			}
		}

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

		var enviarplayer2 = {};
		enviarplayer2.x = randomx;
		enviarplayer2.y = randomy;
		player2pos.x = randomx;
		player2pos.y = randomy;

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

		var enviarPowerup = {};
		enviarPowerup.x = randomx;
		enviarPowerup.y = randomy;
		poweruppos.x = randomx;
		poweruppos.y = randomy;

		enviarmensaje.id = "setSurvive";
		enviarmensaje.userid = globalid;
		enviarmensaje.powerup = enviarPowerup;
		enviarmensaje.player2pos = enviarplayer2;
		
		for (var i = 0; i < worldtiles; i++){
			mensajedimensiones[i] = [];
			for (var j = 0; j < worldtiles; j++){
				mensajedimensiones[i][j] = capa.getTileAt(i, j, true).index;
			}
		}


		render();

	} else {
		//Si no soy host, al generar la escena "Survive", le digo al host que estoy listo para recibir los datos
		var mensajelisto = {};
		mensajelisto.id = 'player2ready';
		mensajelisto.userid = globalid;
		connection.send(JSON.stringify(mensajelisto));
	}

	mapatiles.setCollisionBetween(3, 14, true, true, capa); //Le dice que las tiles de 3 a 14 colisionan

	function render () {
		camara1 = survive.cameras.main.setSize(600,400);
		camara2 = survive.cameras.add(600, 0, 600, 400);


		var frasesprite;

		var mijugador;

		if(imhost){
			frasesprite = 'player';
			frasesprite2 = 'enemy';
			mijugador = player1;
			rival = player2;
		} else {
			frasesprite = 'enemy';
			frasesprite2 = 'player';
			mijugador = player2;
			rival = player1;
		}

		player1 = survive.physics.add.sprite(48, 48, frasesprite); //Cargamos al jugador

		player2 = survive.physics.add.sprite(player2pos.x, player2pos.y, frasesprite2);

		if(imhost){
			frasesprite = 'player';
			frasesprite2 = 'enemy';
			mijugador = player1;
			rival = player2;
		} else {
			frasesprite = 'enemy';
			frasesprite2 = 'player';
			mijugador = player2;
			rival = player1;
		}

		camara1.startFollow(mijugador);
		//camara2.startFollow(rival);
		camara2.setScroll(-3000, -3000);

		var textureFrames = survive.textures.get('powerup').getFrameNames();
		var animFrames = [];

		textureFrames.forEach(function (frameName) {

			animFrames.push({ key: 'powerup', frame: frameName });

		});

		survive.anims.create({
			key:'downwards2', frames:survive.anims.generateFrameNumbers('enemy',{start:1, end:3}), repeat:0, frameRate:6
		});

		survive.anims.create({
			key:'upwards2', frames:survive.anims.generateFrameNumbers('enemy',{start:5, end:7}), repeat:0, frameRate:6
		});

		survive.anims.create({
			key:'right2', frames:survive.anims.generateFrameNumbers('enemy',{start:13, end:15}), repeat:0, frameRate:6
		});

		survive.anims.create({
			key:'left2', frames:survive.anims.generateFrameNumbers('enemy',{start:9, end:11}), repeat:0, frameRate:6
		});

		survive.anims.create({
			key:'left', frames:survive.anims.generateFrameNumbers('player',{start:9, end:11}), repeat:0, frameRate:6
		});

		survive.anims.create({
			key:'right', frames:survive.anims.generateFrameNumbers('player',{start:13, end:15}), repeat:0, frameRate:6
		});

		survive.anims.create({
			key:'up', frames:survive.anims.generateFrameNumbers('player',{start:5, end:7}), repeat:0, frameRate:6
		});

		survive.anims.create({
			key:'down', frames:survive.anims.generateFrameNumbers('player',{start:1, end:3}), repeat:0, frameRate:6
		});
		survive.anims.create({
			key:'leftpower', frames:survive.anims.generateFrameNumbers('playerpower',{start:8, end:11}), repeat:0, frameRate:4
		});

		survive.anims.create({
			key:'rightpower', frames:survive.anims.generateFrameNumbers('playerpower',{start:12, end:15}), repeat:0, frameRate:4
		});

		survive.anims.create({
			key:'uppower', frames:survive.anims.generateFrameNumbers('playerpower',{start:4, end:7}), repeat:0, frameRate:4
		});

		survive.anims.create({
			key:'downpower', frames:survive.anims.generateFrameNumbers('playerpower',{start:0, end:3}), repeat:0, frameRate:4
		});

		survive.anims.create({ key: 'powerupanimate', frames: animFrames, frameRate: 6, repeat: -1 });

		poder = survive.physics.add.sprite(poweruppos.x, poweruppos.y, 'powerup').play('powerupanimate');

		survive.physics.world.enable([player1, player2]);

		var ganasomb = function () {
			survivalmusic.stop();
			survive.add.image(300, 200, 'ganasombra').setScrollFactor(0);
			nomovimiento=true;
			addGame(globalid, 'Survive', "Player2", logros);
			var t=survive.scene.transition({target:'menu',duration:3000});
		};

		survive.physics.add.collider(player1, player2, ganasomb, null, survive);

		/**/

		var ganahuma = function () {
			survivalmusic.stop();
			survive.add.image(300, 200, 'ganahumano').setScrollFactor(0);
			nomovimiento=true;
			addGame(globalid, 'Survive', "Player1", logros);
			var t=survive.scene.transition({target:'menu',duration:3000});
		}

		cuentatiempo = survive.time.addEvent({
			delay: 180000,
			callback: ganahuma,
			callbackScope: survive
		});

		//cuentatiempo tarda 3 minutos, tiempo general de Survive, para dar victoria a p1

		var actualizar1 = survive.time.addEvent({
			delay: 60000,
			callback: function () {
				velocidadp2 = 200;
			},
			callbackScope: survive
		});

		//Actualizar1 actualiza la velocidad del p2 al finalizar el primer minuto, la equipara a la de p1

		var actualizar2 = survive.time.addEvent({
			delay: 120000,
			callback: function () {
				velocidadp2 = 225;
			},
			callbackScope: survive
		});

		var getpowerup = function () {
			poder.destroy();
			powerup = true;
		}

		survive.physics.add.collider(player1, poder, getpowerup, null, survive);

		survive.add.image(0, 0, 'borde').setScrollFactor(0);

		text = survive.add.text(32, 32).setScrollFactor(0);

		player1.setSize(10, 16).setOffset(0, 8);
		player2.setSize(10, 16).setOffset(0, 8);

		flash=survive.time.addEvent({
			delay:60000,
			callback:function(){
				camara1.fadeOut(250,255);
				camara2.fadeOut(250,255);
				camara1.once('camerafadeoutcomplete',function(){
					camara1.fadeIn(250,255);
				},survive);
				camara2.once('camerafadeoutcomplete',function(){
					camara2.fadeIn(250,255);
				},survive)
			},
			callbackScope:survive,
			repeat:1
		});

		nomovimiento=false;

		intervalosurvive = setInterval(function () {
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

	pausaimg=survive.add.image(300,200,'warning').setScrollFactor(0);
	pausaimg.alpha=0;
	pausaimg.depth = 1;

	if(imhost){
		var imagenayuda = survive.add.image(-2700, -2800, 'ayudasurvivehumano');
		imagenayuda.depth = 3;
	} else {
		var imagenayuda = survive.add.image(-2700, -2800, 'ayudasurvivesombra');
		imagenayuda.depth = 3;
	}


}

survive.update=function () {

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
		var t=survive.scene.transition({target:'menu',duration:10});
		clearInterval(intervalosurvive);
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

	if(gameready && finrender){

		var number = cuentatiempo.getProgress().toString().substr(2, 2);
		number = 100-number;

		text.setText('Tiempo: ' + number + "%");
		//Si podemos comenzar a jugar

		var mijugador;

		if(imhost) {
			mijugador = player1;
		} else {
			mijugador = player2;
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

		rival.body.velocity.x = velrivalx;
		rival.body.velocity.y = velrivaly;
        if(imhost){
		if(velrivalx > 0){
			rival.play('right2', true);
        } else if (velrivalx < 0){
			rival.play('left2', true);
          } else if (velrivaly < 0){
			rival.play('upwards2', true);
          } else if (velrivaly > 0){
			rival.play('downwards2', true);
          }
        }
        else{
           if(usingpower){
               if(velrivalx > 0){
                   rival.play('rightpower', true);
               } else if (velrivalx < 0){
                   rival.play('leftpower', true);
               } else if (velrivaly < 0){
                   rival.play('uppower', true);
               } else if (velrivaly > 0){
                   rival.play('downpower', true);
               }
              }
           else{
              if(velrivalx > 0){
                  rival.play('right', true);
               } else if (velrivalx < 0){
                   rival.play('left', true);
               } else if (velrivaly < 0){
                   rival.play('up', true);
               } else if (velrivaly > 0){
                   rival.play('down', true);
               }
          }
        }
		if(!nomovimiento){
			var mijugador;
            if(imhost){
            if(usingpower){
                if (cursors.up.isDown ||wkey.isDown) {
                     mijugador.body.velocity.y = -200;
                     mijugador.play('uppower',true);
                 } else if (cursors.down.isDown || skey.isDown) {
                     mijugador.body.velocity.y = 200;
                     mijugador.play('downpower',true);
                 } else if (cursors.left.isDown || akey.isDown) {
                     mijugador.body.velocity.x = -200;
                     mijugador.play('leftpower',true);
                 } else if (cursors.right.isDown || dkey.isDown) {
                     mijugador.body.velocity.x = 200;
                     mijugador.play('rightpower',true);
                }
            }
            else{
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
                }
            }
            else{
            if (cursors.up.isDown ||wkey.isDown) {
				mijugador.body.velocity.y = -200;
				mijugador.play('upwards2',true);
			} else if (cursors.down.isDown || skey.isDown) {
				mijugador.body.velocity.y = 200;
				mijugador.play('downwards2',true);
			} else if (cursors.left.isDown || akey.isDown) {
				mijugador.body.velocity.x = -200;
				mijugador.play('left2',true);
			} else if (cursors.right.isDown || dkey.isDown) {
				mijugador.body.velocity.x = 200;
				mijugador.play('right2',true);
			 }
            }
			//Manejamos las teclas izq/der
			//Manejamos las teclas izq/der
			mivelx = mijugador.body.velocity.x;
			mively = mijugador.body.velocity.y;

			if(imhost){
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
			}
		}
	}
}

/*
if(!nomovimiento){
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
		if(!usingpower)player1.play('up',true);
		else player1.play('uppower', true);
	}
	else if (skey.isDown) {
		player1.body.velocity.y = 200;
		if(!usingpower)player1.play('down', true);
		else player1.play('downpower', true);
	} else
		//Manejamos las teclas arriba/abajo

		if (akey.isDown)
		{
			player1.body.velocity.x = -200;
			if(!usingpower)player1.play('left',true);
			else player1.play('leftpower', true);
		}
		else if (dkey.isDown)
		{
			player1.body.velocity.x = 200;
			if(!usingpower)player1.play('right',true);
			else player1.play('rightpower', true);
		}
	//Manejamos las teclas izq/der

	var number = cuentatiempo.getProgress().toString().substr(2, 2);
	number = 100-number;

	text.setText('Tiempo: ' + number + "%");
}

}*/
