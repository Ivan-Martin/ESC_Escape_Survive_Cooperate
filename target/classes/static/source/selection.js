var selection= new Phaser.Scene('selection');
selection.create=function(){
  var sound = this.sound.add('click');
  var fondo= this.add.image(600,200,'ESC');
  var botones=this.add.container();
  var botonOn=this.add.sprite(900,200,'OnlineMode').setInteractive({useHandCursor:true});
  var botonOff=this.add.sprite(300,200,'OfflineMode').setInteractive({useHandCursor:true});
  botones.add(botonOn);
  botones.add(botonOff);
  botonOn.on('pointerout',function(){this.setFrame(0)});
  botonOn.on('pointerdown',function(){this.setFrame(1);transition("online");sound.play()});
  botonOn.on('pointerover',function(){this.setFrame(2)});
  botonOff.on('pointerout',function(){this.setFrame(0)});
  botonOff.on('pointerdown',function(){this.setFrame(1);transition("offline");sound.play()});
  botonOff.on('pointerover',function(){this.setFrame(2)});
  function transition(str){
      selection.add.tween({
      targets:botones,
      alpha:0,
      duration:2000,
      ease:'Sine.easeInOut',
      onComplete:function(){
        if(str=="offline"){
             var t=selection.scene.transition({target:'offmenu',duration:10});
        }
        else if(str=="online"){
              var t=selection.scene.transition({target:'menu',duration:10});   
        }
      }
    })
  }
};