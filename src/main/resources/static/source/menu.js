        var menu= new Phaser.Scene('menu');
       var selected;
        menu.create=function(){
            var sound = this.sound.add('click');
            var music = this.sound.add('menumusic');
            music.play();
     
            var f=menu.add.image(350,325,'arr');
            var f2=menu.add.image(400,185,'arr4');
            var f3=menu.add.image(670,125,'arr3');
            var f5=menu.add.image(830,225,'arr2');
            
            var fs=menu.add.container();
            fs.add(f);
            fs.add(f2);
            fs.add(f3);
            fs.add(f5);
            fs.alpha=0.25;
            var fondo=this.add.image(600,200,'ESC');
            var test=menu.add.image(1140,500,'escape1');
            var botones;
            //creamos un contenedor para los botones, los creamos y los introducimos en el. 
            botones = this.add.container();
            var botonE=this.add.sprite(400,125,'escape').setInteractive({useHandCursor:true});
            var botonM=this.add.sprite(400,275,'mirror').setInteractive({useHandCursor:true});
            var botonS=this.add.sprite(770,125,'survive').setInteractive({useHandCursor:true});
            var botonC=this.add.sprite(770,275,'cooperate').setInteractive({useHandCursor:true});
            var
            botonO=this.add.sprite(1080,50,'onlone').setInteractive({useHandCursor:true});
            botones.add(botonE);
            botones.add(botonM);
            botones.add(botonS);
            botones.add(botonC);
            botones.add(botonO);
            botones.alpha = 1;
            menu.sys.backgroundColor = '#000000';
            botonE.on('pointerover',function(){this.setFrame(2);}); //cuando estemos encima cambia el frame
            botonE.on('pointerout',function(){this.setFrame(0);});  //cuando salgamos volvemos al inicial
            botonE.on('pointerdown',function(){this.setFrame(1); transition("Escape");sound.play();}); //al hacer click lo resaltamos
                //boton mirror
            botonM.on('pointerover',function(){this.setFrame(2);}); //cuando estemos encima cambia el frame
            botonM.on('pointerout',function(){this.setFrame(0);});  //cuando salgamos volvemos al inicial
            botonM.on('pointerdown',function(){this.setFrame(1); transition("Mirror");sound.play();}); //al hacer click lo resaltamos
                //boton survive
            botonS.on('pointerover',function(){this.setFrame(2);}); //cuando estemos encima cambia el frame
            botonS.on('pointerout',function(){this.setFrame(0);});  //cuando salgamos volvemos al inicial
            botonS.on('pointerdown',function(){this.setFrame(1); transition("Survive");sound.play();}); //al hacer click lo resaltamos
                //boton cooperate
            botonC.on('pointerover',function(){this.setFrame(2);}); //cuando estemos encima cambia el frame
            botonC.on('pointerout',function(){this.setFrame(0);});  //cuando salgamos volvemos al inicial
            botonC.on('pointerdown',function(){this.setFrame(1); transition("Cooperate");sound.play();}); //al hacer click lo resaltamos      
            botonO.on('pointerover',function(){this.setFrame(2);});
            botonO.on('pointerout',function(){this.setFrame(0);});
            botonO.on('pointerdown',function(){this.setFrame(1); transition("m_online");sound.play();});
            var foco=this.add.sprite(200,200,'luz');
            var escenaM=menu.add.container();
            escenaM.add(fondo);
            escenaM.add(botones);
        escenaM.mask=new Phaser.Display.Masks.BitmapMask(this,foco);
        menu.input.on('pointermove',function(pointer){
            foco.x=pointer.x;
            foco.y=pointer.y;
        });
        menu.add.tween({
           targets:foco,
            alpha:0.25,
            duration:2500,
            ease:'Sine.easeInOut',
            loop:-1,
            yoyo: true
        });
 

       //hacemos un fade out con un tween en el que el objetivo es el contenedor de los botones, cuando se completa iniciamos una escena diferente.
        function transition(str) {;
            menu.add.tween({
                targets:botones,
                alpha:0,
                duration:2000,
                ease:'Sine.easeInOut',
                onComplete:function(){
                    selected=str;
                    music.stop();
                    if(str=="m_online"){
                    var t=menu.scene.transition({target:'m_online',duration:10});
                       }
                    else{ 
                    var t=menu.scene.transition({target:'elobby',duration:10});
                    }
                }
            })
        }
   
    };
   