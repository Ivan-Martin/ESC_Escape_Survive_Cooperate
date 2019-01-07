var achesc;
var botones;
var achievs=new Phaser.Scene('achievs');
achievs.create=function(){
    var fondo=this.add.image(600,200,'lobby');
    var alone1=this.add.image(120,140,'alone1c');
    var alone2=this.add.image(120,260,'alone2c');
    var cooperate1=this.add.image(360,140,'cooperate1c');
    var cooperate2=this.add.image(360,260,'cooperate2c');
    var escape1=this.add.image(600,140,'escape1c');
    var escape2=this.add.image(600,260,'escape2c');
    var mirror1=this.add.image(840,140,'mirror1c');
    var mirror2=this.add.image(840,260,'mirror2c');
    var survive1=this.add.image(1080,140,'survive1c');
    var survive2=this.add.image(1080,260,'survive2c');
    var select=this.add.sprite(50,60,'barr').setInteractive({useHandCursor:true});
    achesc=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    botones = this.add.container();
    botones.add(alone1);
    botones.add(alone2);
    botones.add(cooperate1);
    botones.add(cooperate2);
    botones.add(escape1);
    botones.add(escape2);
    botones.add(mirror1);
    botones.add(mirror2);
    botones.add(survive1);
    botones.add(survive2);
    botones.add(select);
    select.on('pointerover',function(){this.setFrame(2)});
    select.on('pointerout',function(){this.setFrame(0)});
    select.on('pointerdown',function(){this.setFrame(1);transition();}); 
    cargarUsuario(function(user){       
        for(var i=0;i<5;i++){
            if(user.partidasjugadas[i]>=1){
                switch(i){
                    case 0:
                        escape1=achievs.add.image(600,140,'escape1');
                        break;
                    case 1:
                        mirror1=achievs.add.image(840,140,'mirror1');
                        break;
                    case 2:
                        survive1=achievs.add.image(1080,140,'survive1');
                        break;
                    case 3:
                        alone1=achievs.add.image(120,140,'alone1');
                        break;
                    case 4:
                        cooperate1=achievs.add.image(360,140,'cooperate1');
                        break;
                }
            }
            if(user.partidasjugadas[i]>=5){
                switch(i){
                    case 0:
                        escape2=achievs.add.image(600,260,'escape2');
                        break;
                    case 1:
                        mirror2=achievs.add.image(840,260,'mirror2');
                        break;
                    case 2:
                        survive2=achievs.add.image(1080,260,'survive2');
                        break;
                    case 3:
                        alone2=achievs.add.image(120,260,'alone2');
                        break;
                    case 4:
                        cooperate2=achievs.add.image(360,260,'cooperate2');
                        break;
                }
        }
    }
    });
    function transition(){
        achievs.add.tween({
            targets:botones,
            alpha:0,
            duration:2000,
            ease:'Sine.easeInOut',
            onComplete:function(){
                var t=achievs.scene.transition({target:'selection',duration:10});
            }
        });
    } 
}
achievs.update=function(){
    if(achesc.isDown){
            achievs.add.tween({
            targets:botones,
            alpha:0,
            duration:2000,
            ease:'Sine.easeInOut',
            onComplete:function(){
                var t=achievs.scene.transition({target:'selection',duration:10});
            }
        });
    }
}