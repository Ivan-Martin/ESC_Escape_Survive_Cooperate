//definimos una nueva escena de phaser, nos aseguramos de que se carga al cambiar a este modo con la impresion en consola, ponemos un texto para hacernos una idea, y definimos que si pulsamos la tecla ESC hacemos una transicion de vuelta al menu
var esc;
var offmirror = new Phaser.Scene('offmirror');
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
var flag;
var music;

var log;
var log2;

        offmirror.create=function() {
        	var logros = function (user) {
        		if(user.partidasjugadas[0] == 1){
        			log=offmirror.add.image(500,340,'mirror1').setScrollFactor(0);
        		       
        		} else if (user.partidasjugadas[0] == 5){
        		
        			log2=offmirror.add.image(500,340,'mirror2').setScrollFactor(0);
        		}
        	}
        	updateMode(globalid, 'Mirrored Escape');
            music = this.sound.add('escmusic');
            music.play();
            flag=false;
            
            velocidadp2 = 200;
            
            worldtiles = worldsize*6; //Tamaño de dos laberintos
            
            worldtiles += 24; //Bordes necesarios a cada lado de la sala central
            
            worldtiles += centralsize*3; //Tamaño de la sala central
            
            cursors = this.input.keyboard.createCursorKeys(); //Creamos el manejo del teclado
            wkey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
            akey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
            skey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
            dkey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
            esc = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
            
            mapatiles = this.make.tilemap({ tileWidth: 32, tileHeight: 32, width: 2*worldtiles*32+centralsize*32+24*32, heigth: 2*worldtiles*32+centralsize*32+24*32}); //Esto añade un mapa vacío al mundo
            
            var tileset = mapatiles.addTilesetImage('tileo', 'tileo', 32, 32); //Cargamos el mapa de sprites de tiles
            
            capa = mapatiles.createBlankDynamicLayer('nivel', tileset, 0, 0, worldtiles, worldtiles, 32, 32); //Crea una capa de worldtiles, cada tile 32x32 y la llama nivel1
            
            createworld(worldsize); //Lanzamos el generador de laberintos con un tamaño de worldsize x worldsize
            
            
            
            
            muros = tileindex(); //Recuperamos del generador de laberintos el tileo del mapa
            
            var posiciones = casillalejana(0, 0);
            var escalerax = posiciones[0];
            var escaleray = posiciones[1];
            escalerax*=3*32;
            escaleray*=3*32;
            escalerax+=48;
            escaleray+=48;
            var stairs1 = this.physics.add.sprite(escalerax, escaleray, 'stairs');
            
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
            
            var goldenstairs = this.physics.add.sprite(escalerax, escaleray, 'goldenstairs');
            
            
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
          
            
            
            mapatiles.setCollisionBetween(3, 14, true, true, capa); //Le dice que las tiles de 3 a 14 colisionan
            mapatiles.setCollisionBetween(18, 29, true, true, capa);
            
            player1 = this.physics.add.sprite(48, 48, 'player'); //Cargamos al jugador
            
            var randomx = (worldsize*3+24+centralsize*3+worldsize*3)*32 - 48;
            var randomy = 48;
            
            escalerax = (worldsize*3+24+centralsize*3+worldsize*3)*32-escalera2x;
            escaleray = escalera2y;
            escaleray*=32*3;
            escaleray+= 48;
            
            var stairs2 = this.physics.add.image(escalerax, escaleray, 'stairs');
            
            player2 = this.physics.add.sprite(randomx, randomy, 'player2');
            
            
            
            this.physics.world.enable([player1, player2]);
            //Camaras
            
            camara1 = this.cameras.main.setSize(600,400);
            camara2 = this.cameras.add(600, 0, 600, 400);
            
            
            camara1.startFollow(player1);
            camara2.startFollow(player2);

            /**/
            
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
            
            var transportp1 = function () {
                
                player1.body.velocity.x = 0;
                player1.body.velocity.y = 0;
                offmirror.add.tween({
                    targets:stairs1,
                    alpha:0,
                    duration:1,
                    ease:'Sine.easeInOut'
                });
                offmirror.add.tween({
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
                offmirror.add.tween({
                    targets:player1,
                    alpha:1,
                    duration: 50,
                    ease:'Sine.easeInOut'});
            }
            
            this.physics.add.collider(player1, stairs1, transportp1, null, this);
            
            var transportp2 = function () {
              
                player2.body.velocity.x = 0;
                player2.body.velocity.y = 0;
                offmirror.add.tween({
                    targets:stairs2,
                    alpha:0,
                    duration:1,
                    ease:'Sine.easeInOut'
                });
                offmirror.add.tween({
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
                offmirror.add.tween({
                    targets:player2,
                    alpha:1,
                    duration: 100,
                    ease:'Sine.easeInOut'});
            }
            
            this.physics.add.collider(player2, stairs2, transportp2, null, this);
            
            var gana1 = function () {
                this.add.image(300,200,'gana1').setScrollFactor(0);
                goldenstairs.destroy();
                flag=true;
                addGame(globalid, 'Mirrored Escape', "Player1", logros);
                var t=offmirror.scene.transition({target:'menu',duration:3000});
            }
            
            this.physics.add.collider(player1, goldenstairs, gana1, null, this);
            
            var gana2 = function () {
                this.add.image(300,200,'gana2').setScrollFactor(0);
                goldenstairs.destroy();
                flag=true;
                addGame(globalid, 'Mirrored Escape', "Player2", logros);
                var t=offmirror.scene.transition({target:'menu',duration:3000});
            }
            
            this.physics.add.collider(player2, goldenstairs, gana2, null, this);
            player1.setSize(10, 16).setOffset(0, 8);
            player2.setSize(10, 16).setOffset(0, 8);
        }
        
        offmirror.update=function () {
            if(esc.isDown){
                music.stop();
                var t=offmirror.scene.transition({target:'menu',duration:'10'});
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
    //Manejamos las teclas izq/der
    }
}
