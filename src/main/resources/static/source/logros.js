var achesc;
var achievs=new Phaser.Scene('achievs');
achievs.create=function(){
    var fondo=this.add.image(600,200,'lobby');
    var alone1=this.add.image(120,120,'alone1c');
    var alone2=this.add.image(120,280,'alone2c');
    var cooperate1=this.add.image(360,120,'cooperate1c');
    var cooperate2=this.add.image(360,280,'cooperate2c');
    var escape1=this.add.image(600,120,'escape1c');
    var escape2=this.add.image(600,280,'escape2c');
    var mirror1=this.add.image(840,120,'mirror1c');
    var mirror2=this.add.image(840,280,'mirror2c');
    var survive1=this.add.image(1080,120,'survive1c');
    var survive2=this.add.image(1080,280,'survive2c');
    var select=this.add.sprite(90,100,'barr').setInteractive({useHandCursor:true});
    achesc=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
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
            if(user.partidasjugadas[i]==1){
                switch(i){
                    case 0:
                        escape1=this.add.image(600,120,'escape1');
                        break;
                    case 1:
                        mirror1=this.add.image(840,120,'mirror1');
                        break;
                    case 2:
                        survive1=this.add.image(1080,120,'survive1');
                        break;
                    case 3:
                        alone1=this.add.image(120,120,'alone1');
                        break;
                    case 4:
                        cooperate1=this.add.image(360,120,'cooperate1');
                        break;
                }
            }
            else if(user.partidasjugadas[i]==5){
                switch(i){
                    case 0:
                        escape2=this.add.image(600,280,'escape2');
                        break;
                    case 1:
                        mirror2=this.add.image(840,280,'mirror2');
                        break;
                    case 2:
                        survive2=this.add.image(1080,280,'survive2');
                        break;
                    case 3:
                        alone2=this.add.image(120,120,'alone2');
                        break;
                    case 4:
                        cooperate2=this.add.image(360,120,'cooperate2');
                        break;
                }
        }
    }
    });
    function transition(){
        logros.add.tween(){
            targets:botones,
            alpha:0,
            duration:2000,
            ease:'Sine.easeInOut',
            onComplete:function(){
                var t=transition.scene.transition({targets:'selection',duration:10});
            }
        }
    } 
}
achievs.update=function(){
    if(achesc.isDown){
        transition();
    }
}