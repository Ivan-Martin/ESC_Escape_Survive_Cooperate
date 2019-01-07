var m_online= new Phaser.Scene('m_online');
var esc;
var ontext;
var on;
var on2;
var ontext2;
var back;
var usersconnected = 0;
m_online.create = function () {
	var fondo=this.add.image(600,200,'lobby');
    on = this.add.text(30, 40, 'ONLINE', {fontFamily:'courier', fontSize: '20px', fill: '#ffffff' });
    on2 = this.add.text(650, 80, ' ', {fontFamily:'courier', fontSize: '20px', fill: '#ffffff' });
    esc = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    back=m_online.add.sprite(90,100,'barr').setInteractive({useHandCursor:true});
    back.on('pointerover',function(){this.setFrame(2);});
    back.on('pointerout',function(){this.setFrame(0);});
    back.on('pointerdown',function(){this.setFrame(1);transicion();});
    function transicion(){
    	m_online.add.tween({
    		targets:"back",
    		alpha:0,
    		duration:2000,
    		ease:'Sine.easeInOut',
    		onComplete:function(){
    			var t= m_online.scene.transition({targets:'menu',duration:10});
    		}
    	});

    }
}
m_online.update=function(){
    if(esc.isDown){
        m_online.add.tween({
               targets:back,
                alpha:0,
                duration:2000,
                ease:'Sine.easeInOut',
                onComplete:function(){
                var t=m_online.scene.transition({targets:'menu',duration:10});
                }
                })
    }
    loadUsers(function (users) {
            usersconnected = users.length;
            ontext = "Jugadores conectados:\n";
            ontext2 = "";
            if(users.length <= 14){
            	for (var i = 0; i < users.length; i++) {
                    var usuario = users[i];
                    if (usuario.modo != null)
                        ontext += "\n" + usuario.name + " está jugando a " + usuario.modo;
                    else ontext += "\n" + usuario.name + " está conectado en el lobby";
                }
            } else {
            	for (var i = 0; i < users.length; i++) {
            		var usuario = users[i];
            		if(i < 14){
                        if (usuario.modo != null)
                            ontext += usuario.name + " está jugando a " + usuario.modo;
                        else ontext += usuario.name + " está conectado en el lobby";
                        ontext+="\n";
            		} else {
            			if (usuario.modo != null)
                            ontext2 += usuario.name + " está jugando a " + usuario.modo;
                        else ontext2 += usuario.name + " está conectado en el lobby";
                        ontext2+="\n";
            		}
                    
                }
            }
            
            on.setText(ontext);
            on2.setText(ontext2);
    });
}