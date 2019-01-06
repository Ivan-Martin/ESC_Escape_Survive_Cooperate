var elobby=new Phaser.Scene('elobby');
var text1;
var text2;
var rivalencontrado = false;
var getrespuesta = false;
var globalidrival;
var comenzado = false;
elobby.create=function(){
	updateMode(globalid, selected);
	var fondo=this.add.image(600,200,'lobby');
	text1=this.add.text(500,100,selected,{fontFamily:'monospace',fontSize:'50px',fill:'#ffffff'});
	text2=this.add.text(600,300,'Esperando a otro jugador.',{fontFamily:'monospace',fontSize:'30px',fill:'#ffffff'});

	connection.onmessage = function (msg){
		if(!comenzado){
			var datos = JSON.parse(msg.data);
			if(datos.comenzar){
				comenzado = true;
				if(selected=="Escape"){
	                var t=elobby.scene.transition({target:'escape',duration:'500'});
	            }
	            else if(selected=="Survival"){
	                var t=elobby.scene.transition({target:'survival',duration:'500'});
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
	
	if(!rivalencontrado && !getrespuesta){
		var checker = function (user) {
			getrespuesta = false;
			if(user.name == null || user.name == undefined){
				//Si no hemos encontrado rival, esperamos
				console.log("esperando");
				//text2=elobby.add.text(600,300,'Esperando a otro jugador.',{fontFamily:'monospace', fontSize:'30px',fill:'#ffffff'});
				text2.setText("Esperando a otro jugador");
			}
			else{
				//Si hemos encontrado rival, transicionamos a escape
				rivalencontrado = true;
				console.log("Encontrado");
				console.log(user);
				globalidrival = user.id;
				imhost = !(user.ishost);

				text2.setText("JUGADOR ENCONTRADO");
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