var elobby=new Phaser.Scene('elobby');
var text1;
var text2;
elobby.create=function(){
	updateMode(globalid, selected);
	var fondo=this.add.image(600,200,'lobby');
	text1=this.add.text(500,100,selected,{fontFamily:'monospace',fontSize:'50px',fill:'#ffffff'});
	text2=this.add.text(600,300,'Esperando a otro jugador.',{fontFamily:'monospace',fontSize:'30px',fill:'#ffffff'});
}
elobby.update=function(){
	
    var checker = function (user) {
		if(user.name == nick || user.name == null){
			console.log("esperando");
			text2=elobby.add.text(600,300,'Esperando a otro jugador.',{fontFamily:'monospace', fontSize:'30px',fill:'#ffffff'});
		}
		else{
			console.log("Encontrado");
			console.log(user);
			text2=elobby.add.text(600,300,'JUGADOR ENCONTRADO',{fontFamily:'monospace',fontSize:'30px',fill:'#ffffff'});
			var t=elobby.scene.transition({target:'escape',duration:'500'});
		}
	}
	comprobarModo(selected,checker);
    
}