        var menu= new Phaser.Scene('menu');
        menu.create=function(){
            var sound = this.sound.add('click')
            var music = this.sound.add('menumusic');
            music.play();
            
            var f=menu.add.image(350,325,'arr');
            var f2=menu.add.image(400,185,'arr4');
            var f3=menu.add.image(670,125,'arr3');
            var f4=menu.add.image(880,275,'arr5');
            var f5=menu.add.image(1140,180,'arr2');
            var fs=menu.add.container();
            fs.add(f);
            fs.add(f2);
            fs.add(f3);
            fs.add(f4);
            fs.add(f5);
            fs.alpha=0.25;
            var fondo=this.add.image(600,200,'ESC');
            var botones;
            //creamos un contenedor para los botones, los creamos y los introducimos en el. 
            botones = this.add.container();
            var botonE=this.add.sprite(400,125,'escape').setInteractive({useHandCursor:true});
            var botonM=this.add.sprite(400,275,'mirror').setInteractive({useHandCursor:true});
            var botonS=this.add.sprite(770,125,'survive').setInteractive({useHandCursor:true});      
            var botonA=this.add.sprite(770,275,'alone').setInteractive({useHandCursor:true});
            var botonC=this.add.sprite(1100,225,'cooperate').setInteractive({useHandCursor:true});
            botones.add(botonE);
            botones.add(botonM);
            botones.add(botonS);
            botones.add(botonA);
            botones.add(botonC);
            botones.alpha = 1;
            menu.sys.backgroundColor = '#000000';
            botonE.on('pointerover',function(){this.setFrame(2);}); //cuando estemos encima cambia el frame
            botonE.on('pointerout',function(){this.setFrame(0);});  //cuando salgamos volvemos al inicial
            botonE.on('pointerdown',function(){this.setFrame(1); transition("escape");sound.play();}); //al hacer click lo resaltamos
                //boton mirror
            botonM.on('pointerover',function(){this.setFrame(2);}); //cuando estemos encima cambia el frame
            botonM.on('pointerout',function(){this.setFrame(0);});  //cuando salgamos volvemos al inicial
            botonM.on('pointerdown',function(){this.setFrame(1); transition("mirror");sound.play();}); //al hacer click lo resaltamos
                //boton survive
            botonS.on('pointerover',function(){this.setFrame(2);}); //cuando estemos encima cambia el frame
            botonS.on('pointerout',function(){this.setFrame(0);});  //cuando salgamos volvemos al inicial
            botonS.on('pointerdown',function(){this.setFrame(1); transition("survive");sound.play();}); //al hacer click lo resaltamos
                //boton alone
            botonA.on('pointerover',function(){this.setFrame(2);}); //cuando estemos encima cambia el frame
            botonA.on('pointerout',function(){this.setFrame(0);});  //cuando salgamos volvemos al inicial
            botonA.on('pointerdown',function(){this.setFrame(1); transition("alone");sound.play();}); //al hacer click lo resaltamos
                //boton cooperate
            botonC.on('pointerover',function(){this.setFrame(2);}); //cuando estemos encima cambia el frame
            botonC.on('pointerout',function(){this.setFrame(0);});  //cuando salgamos volvemos al inicial
            botonC.on('pointerdown',function(){this.setFrame(1); transition("cooperate");sound.play();}); //al hacer click lo resaltamos      
            
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
        function transition(str) {
            menu.add.tween({
                targets:botones,
                alpha:0,
                duration:2000,
                ease:'Sine.easeInOut',
                onComplete:function(){
                    music.stop();
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
   