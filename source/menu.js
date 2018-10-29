        var menu= new Phaser.Scene('menu');
        menu.init=function(){};
        menu.preload=function () {
            
            this.load.spritesheet('player2', 'assets/char/pc2s.png', { frameWidth: 10, frameHeight: 24 });
            this.load.spritesheet('player', 'assets/char/pcs.png', { frameWidth: 10, frameHeight: 24 });
            this.load.image('tileo', 'assets/tilemap.png');
            this.load.spritesheet('powerup', 'assets/actors/ups.png', {frameWidth: 10, frameHeight: 10});
            this.load.spritesheet('escape','assets/menu/escs.png',{frameWidth:96,frameHeight:32});
            this.load.spritesheet('mirror','assets/menu/mirs.png',{frameWidth:120,frameHeight:32});
            this.load.spritesheet('survive','assets/menu/surs.png',{frameWidth:96,frameHeight:32});
            this.load.spritesheet('alone','assets/menu/alos.png',{frameWidth:72,frameHeight:32});
            this.load.spritesheet('cooperate','assets/menu/coos.png',{frameWidth:136,frameHeight:32});
            this.load.image('borde', 'assets/actors/borde.png');
        };
        
        menu.create=function(){
            var botones;
            //creamos un contenedor para los botones, los creamos y los introducimos en el. 
            botones = this.add.container();
            var botonE=this.add.sprite(100,150,'escape').setInteractive({useHandCursor:true});
            var botonM=this.add.sprite(330,250,'mirror').setInteractive({useHandCursor:true});
            var botonS=this.add.sprite(570,150,'survive').setInteractive({useHandCursor:true});      
            var botonA=this.add.sprite(830,250,'alone').setInteractive({useHandCursor:true});
            var botonC=this.add.sprite(1080,150,'cooperate').setInteractive({useHandCursor:true});
            botones.add(botonE);
            botones.add(botonM);
            botones.add(botonS);
            botones.add(botonA);
            botones.add(botonC);
            botones.alpha = 1;
            menu.sys.backgroundColor = '#000000';
            botonE.on('pointerover',function(){this.setFrame(2);}); //cuando estemos encima cambia el frame
            botonE.on('pointerout',function(){this.setFrame(0);});  //cuando salgamos volvemos al inicial
            botonE.on('pointerdown',function(){this.setFrame(1); transition("escape");}); //al hacer click lo resaltamos
                //boton mirror
            botonM.on('pointerover',function(){this.setFrame(2);}); //cuando estemos encima cambia el frame
            botonM.on('pointerout',function(){this.setFrame(0);});  //cuando salgamos volvemos al inicial
            botonM.on('pointerdown',function(){this.setFrame(1); transition("mirror");}); //al hacer click lo resaltamos
                //boton survive
            botonS.on('pointerover',function(){this.setFrame(2);}); //cuando estemos encima cambia el frame
            botonS.on('pointerout',function(){this.setFrame(0);});  //cuando salgamos volvemos al inicial
            botonS.on('pointerdown',function(){this.setFrame(1); transition("survive");}); //al hacer click lo resaltamos
                //boton alone
            botonA.on('pointerover',function(){this.setFrame(2);}); //cuando estemos encima cambia el frame
            botonA.on('pointerout',function(){this.setFrame(0);});  //cuando salgamos volvemos al inicial
            botonA.on('pointerdown',function(){this.setFrame(1); transition("alone");}); //al hacer click lo resaltamos
                //boton cooperate
            botonC.on('pointerover',function(){this.setFrame(2);}); //cuando estemos encima cambia el frame
            botonC.on('pointerout',function(){this.setFrame(0);});  //cuando salgamos volvemos al inicial
            botonC.on('pointerdown',function(){this.setFrame(1); transition("cooperate");}); //al hacer click lo resaltamos      
            
       //hacemos un fade out con un tween en el que el objetivo es el contenedor de los botones, cuando se completa iniciamos una escena diferente.
        function transition(str) {
            menu.add.tween({
                targets:botones,
                alpha:0,
                duration:1000,
                ease:'Sine.easeInOut',
                onComplete:function(){
                    if(str==="escape"){
                        var t=menu.scene.transition({target:'escape',duration:'10'});
                    }
                    else if(str==="alone"){
                        var t=menu.scene.transition({target:'alone',duration:'10'});   
                    }
                    else if(str==="survive"){
                        var t=menu.scene.transition({target:'survive',duration:'10'});
                    }
                    else if(str==="mirror"){
                        var t=menu.scene.transition({target:'mirror',duration:'10'});     
                    }
                    else if(str==="cooperate"){
                        var t=menu.scene.transition({target:'cooperate',duration:'10'}); 
                    }
                }
            })
        }
    };
   