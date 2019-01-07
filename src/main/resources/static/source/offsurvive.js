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
    
        offsurvive.create =function () {
        	var logros = function (user) {
        		if(user.partidasjugadas[0] == 1){
        			log=offsurvive.add.image(500,340,'survive1').setScrollFactor(0);
        		       
        		} else if (user.partidasjugadas[0] == 5){
        		
        			log2=offsurvive.add.image(500,340,'survive2').setScrollFactor(0);
        		}
        	}
        	updateMode(globalid, 'Survive');
            sound = this.sound.add('spup');
            music = this.sound.add('surmusic');
            music.play();
            flag=false;
            //console.log ("Modo survive");
            esc = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
            enter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Enter);
            velocidadp2 = 150;
            
            worldtiles = worldsize*3;
            
            cursors = this.input.keyboard.createCursorKeys(); //Creamos el manejo del teclado
            wkey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
            akey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
            skey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
            dkey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
            spacekey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
            
            mapatiles = this.make.tilemap({ tileWidth: 32, tileHeight: 32, width: worldtiles*32, heigth: worldtiles*32}); //Esto añade un mapa vacío al mundo
            
            var tileset = mapatiles.addTilesetImage('tileo', 'tileo', 32, 32); //Cargamos el mapa de sprites de tiles
            
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
                var t=offsurvive.scene.transition({target:'offmenu',duration:3000});
            };
            
            this.physics.add.collider(player1, player2, ganasomb, null, this);
            
            /**/
            
            var ganahuma = function () {
                music.stop();
                this.add.image(300, 200, 'ganahumano').setScrollFactor(0);
                flag=true;
                addGame(globalid, 'Survive', "Player1", logros);
                var t=offsurvive.scene.transition({target:'offmenu',duration:3000});
            }
            
            cuentatiempo = this.time.addEvent({
                delay: 180000,
                callback: ganahuma,
                callbackScope: this
            });
            
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
            
            
            
            
            
            
            var textureFrames = this.textures.get('powerup').getFrameNames();
            var animFrames = [];
            
            textureFrames.forEach(function (frameName) {

                animFrames.push({ key: 'powerup', frame: frameName });

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
            
            //console.log(randomx); console.log(randomy);
            
            
            var poder = this.physics.add.sprite(randomx, randomy, 'powerup').play('powerupanimate');
            
            var getpowerup = function () {
                poder.destroy();
                powerup = true;
            }
            
            this.physics.add.collider(player1, poder, getpowerup, null, this);
            
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
                music.stop();
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