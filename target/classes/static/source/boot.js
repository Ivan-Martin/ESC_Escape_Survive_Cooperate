//creamos un objeto game y definimos su configuracion inicial, en scene definimos las escenas que tendra. 

function start(){
	var config = {
			type: Phaser.AUTO,
			width: 1200,
			height: 400,
			title: 'ESC',
			version: '1.2',
			physics: {
			default: 'arcade'
			},
			scene:[escenacarga,logo,selection,offmenu,alone,offsurvive,offmirror,offescape,offcooperate,menu,elobby,survive,mirror,escape,cooperate,achievs,m_online]
	};


	let game = new Phaser.Game(config);

/*
	var intervaloServidor = setInterval(function (){
		comprobarServidor(game);
	}, 1000);
*/
}