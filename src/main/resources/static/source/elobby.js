var elobby=new Phaser.Scene('elobby');
var text1;
var text2;
var rivalencontrado = false;
var getrespuesta = false;
var globalidrival;
var comenzado = false;
var efade;
var esc;
elobby.create=function(){
	updateMode(globalid, selected);
    esc=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
	var fondo=this.add.image(600,200,'lobby');
	text1=this.add.text(500,100,selected,{fontFamily:'monospace',fontSize:'50px',fill:'#ffffff'});
	text2=this.add.text(600,300,'Esperando a otro jugador.',{fontFamily:'monospace',fontSize:'30px',fill:'#ffffff'});
    var back=elobby.add.sprite(50,60,'barr').setInteractive({useHandCursor:true});
    back.on('pointerover',function(){this.setFrame(2)});
    back.on('pointerout',function(){this.setFrame(0)});
    back.on('pointerdown',function(){this.setFrame(1);transition();});
    efade=this.add.container();
    efade.add(back);
    efade.add(text1);
    efade.add(text2);
    function transition(){
    	if(selected=="Escape"){
            updateMode(globalid, "exitEscape");
        }
        else if(selected=="Survive"){
        	updateMode(globalid, "exitSurvive");
        }
        else if(selected=="Mirror"){
        	updateMode(globalid, "exitMirror");
        }
        else if(selected=="Cooperate"){
        	updateMode(globalid, "exitCooperate");
        }
        elobby.add.tween({
            targets:efade,
            alpha:0,
            duration:2000,
            ease:'Sine.easeInOut',
            onComplete:function(){
            var t=elobby.scene.transition({target:'menu',duration:10});
        }
        });
    }
	connection.onmessage = function (msg){
		if(!comenzado){
			var datos = JSON.parse(msg.data);
			if(datos.comenzar){
				comenzado = true;
				if(selected=="Escape"){
	                var t=elobby.scene.transition({target:'escape',duration:'500'});
	            }
	            else if(selected=="Survive"){
	                var t=elobby.scene.transition({target:'survive',duration:'500'});
	            }
	            else if(selected=="Mirror"){
	                var t=elobby.scene.transition({target:'mirror',duration:'500'});
	            }
	            else if(selected=="Cooperate"){
	                var t=elobby.scene.transition({target:'cooperate',duration:'500'});
	            }
			}
		}
		
	}

}
elobby.update=function(){
	if(esc.isDown){
		if(selected=="Escape"){
            updateMode(globalid, "exitEscape");
        }
        else if(selected=="Survive"){
        	updateMode(globalid, "exitSurvive");
        }
        else if(selected=="Mirror"){
        	updateMode(globalid, "exitMirror");
        }
        else if(selected=="Cooperate"){
        	updateMode(globalid, "exitCooperate");
        }
       elobby.add.tween({
            targets:efade,
            alpha:0,
            duration:2000,
            ease:'Sine.easeInOut',
            onComplete:function(){
            var t=elobby.scene.transition({target:'menu',duration:10});
        }
        });
       }
	if(!rivalencontrado && !getrespuesta){
		var checker = function (user) {
			getrespuesta = false;
			if(user.name == null || user.name == undefined){
				//Si no hemos encontrado rival, esperamos
				console.log("esperando");
				//text2=elobby.add.text(600,300,'Esperando a otro jugador.',{fontFamily:'monospace', fontSize:'30px',fill:'#ffffff'});
				text2.setText("Esperando a otro jugador");
                efade.add(text2);
			}
			else{
				//Si hemos encontrado rival, transicionamos a escape
				rivalencontrado = true;
				console.log("Encontrado");
				console.log(user);
				globalidrival = user.id;
				imhost = !(user.ishost);

				text2.setText("Tu rival es: " + user.name);
                efade.add(text2);
			}
		}
		//Definimos funcion a llamar despues del GET de jugadores
		
		comprobarModo(selected,checker);
		getrespuesta = true;
		//Llamamos al get de jugadores
	}
	
	
	
	if(rivalencontrado && !comenzado){
		var rivalListo = {}
		rivalListo.id = 'conectarServidor';
		rivalListo.userid = globalid;
		rivalListo.rivalid = globalidrival;
		connection.send(JSON.stringify(rivalListo));
		
	}
    
    
}