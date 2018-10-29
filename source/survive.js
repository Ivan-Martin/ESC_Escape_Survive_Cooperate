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
            
        survive.create =function () {
            //console.log ("Modo survive");
            var test = this.add.text(500,150,'SURVIVE',{fontSize: '50px', fill:'#0f0'});
            esc = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
            var test2 = this.add.text(400,250,'Pulsa ESC para volver',{fontSize: '30px', fill:'#0f0'});
            
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
            
            player2 = this.physics.add.sprite(randomx, randomy, 'player2');
            
            
            
            
            this.physics.world.enable([player1, player2]);
            //Camaras
            
            camara1 = this.cameras.main.setSize(600,400);
            camara2 = this.cameras.add(600, 0, 600, 400);
            
            camara1.setBounds(0, 0, worldtiles*32, worldtiles*32);
            camara2.setBounds(0, 0, worldtiles*32, worldtiles*32);
            
            camara1.startFollow(player1);
            camara2.startFollow(player2);
            
            /**/
            
            var alertar = function () { alert("Colision")};
            
            this.physics.add.collider(player1, player2, alertar, null, this);
            
            /**/
            
            var alerta2 = function () {
                alert ("Tiempo");
            }
            
            cuentatiempo = this.time.addEvent({
                delay: 180000,
                callback: alerta2,
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
            
            console.log(randomx); console.log(randomy);
            
            
            var poder = this.physics.add.sprite(randomx, randomy, 'powerup').play('powerupanimate');
            
            var getpowerup = function () {
                poder.destroy();
                powerup = true;
            }
            
            this.physics.add.collider(player1, poder, getpowerup, null, this);
            
            this.add.image(0, 0, 'borde').setScrollFactor(0);
            
            text = this.add.text(32, 32).setScrollFactor(0);
          
        }
        
        survive.update=function () {
            if(esc.isDown){
                var t=survive.scene.transition({target:'menu',duration:'10'});
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
    

    if (cursors.up.isDown) {
        player2.body.velocity.y = -velocidadp2;
    }
    else if (cursors.down.isDown) {
        player2.body.velocity.y = velocidadp2;
    } else
    //Manejamos las teclas arriba/abajo

    if (cursors.left.isDown)
    {
        player2.body.velocity.x = -velocidadp2;
    }
    else if (cursors.right.isDown)
    {
        player2.body.velocity.x = velocidadp2;
    }
    //Manejamos las teclas izq/der
    
    if (wkey.isDown) {
        player1.body.velocity.y = -200;
    }
    else if (skey.isDown) {
        player1.body.velocity.y = 200;
    } else
    //Manejamos las teclas arriba/abajo

    if (akey.isDown)
    {
        player1.body.velocity.x = -200;
    }
    else if (dkey.isDown)
    {
        player1.body.velocity.x = 200;
    }
    //Manejamos las teclas izq/der
    
    var number = cuentatiempo.getProgress().toString().substr(2, 2);
    number = 100-number;
    
    text.setText('Tiempo: ' + number + "%");
    
    if(spacekey.isDown && powerup){
        powerup = false;
        usingpower = true;
        this.time.addEvent({
                delay: 800,
                callback: function () {
                    usingpower = false;
                },
                callbackScope: this
        });
    }
        }