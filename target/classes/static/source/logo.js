var logo=new Phaser.Scene('logo');
var barracarga;
logo.preload=function () {
	barracarga = logo.add.sprite(600, 200, 'carga');
	barracarga.setFrame(0);
	this.load.spritesheet('player2', 'assets/char/pc2s.png', { frameWidth: 10, frameHeight: 24 });
	this.load.spritesheet('enemy', 'assets/char/somb.png', { frameWidth: 10, frameHeight: 24 });
	this.load.spritesheet('player', 'assets/char/pcs.png', { frameWidth: 10, frameHeight: 24 });
	this.load.spritesheet('playerpower', 'assets/char/ens.png', { frameWidth: 10, frameHeight: 24 });
	this.load.spritesheet('powerup', 'assets/actors/ups.png', {frameWidth: 10, frameHeight: 10});
	this.load.spritesheet('powerup2', 'assets/Fase5/ups2.png', {frameWidth: 10, frameHeight: 10});
	this.load.spritesheet('powerup3', 'assets/Fase5/ups3.png', {frameWidth: 10, frameHeight: 10});
	this.load.spritesheet('escape','assets/menu/escs.png',{frameWidth:200,frameHeight:32});
	this.load.spritesheet('mirror','assets/menu/mirs.png',{frameWidth:200,frameHeight:32});
	this.load.spritesheet('survive','assets/menu/surs.png',{frameWidth:200,frameHeight:32});
	this.load.spritesheet('alone','assets/menu/alos.png',{frameWidth:200,frameHeight:32});
	this.load.spritesheet('cooperate','assets/menu/coos.png',{frameWidth:200,frameHeight:32});
	this.load.spritesheet('puerta1', 'assets/actors/puervs.png', {frameWidth:32,frameHeight:21});
	this.load.spritesheet('puerta2', 'assets/actors/puer2vs.png', {frameWidth:32,frameHeight:21});
	this.load.spritesheet('puerta3', 'assets/actors/puer3vs.png', {frameWidth:32,frameHeight:21});
	this.load.spritesheet('key1', 'assets/actors/nkey.png', {frameWidth:10,frameHeight:25});
	this.load.spritesheet('key2', 'assets/actors/nkey2.png', {frameWidth:10,frameHeight:25});
	this.load.spritesheet('key3', 'assets/actors/nkey3.png', {frameWidth:10,frameHeight:25});
	this.load.spritesheet('puertah1', 'assets/actors/puerhs.png', {frameWidth:5,frameHeight:48});
	this.load.spritesheet('puertah2', 'assets/actors/puer2hs.png', {frameWidth:5,frameHeight:48});
	this.load.spritesheet('puertah3', 'assets/actors/puer3hs.png', {frameWidth:5,frameHeight:48});
	this.load.spritesheet('coopb','assets/Fase5/pressure.png',{frameWidth:26,frameHeight:26});
	this.load.image('peek','assets/Fase5/arrow.png');
	this.load.image('borde', 'assets/actors/borde.png');
	this.load.image('luz','assets/menu/luz.png');
	this.load.image('ESC','assets/menu/fondo.png');
	this.load.image('arr','assets/menu/flecha1.png');
	this.load.image('arr2','assets/menu/flecha2.png');
	this.load.image('arr3','assets/menu/flecha3.png');
	this.load.image('arr4','assets/menu/flecha4.png');
	this.load.image('arr5','assets/menu/flecha5.png');
	this.load.image('LOGO','assets/menu/LOGO.png');
	this.load.image('stairs', 'assets/actors/sta.png');
	this.load.image('goldenstairs', 'assets/actors/goldsta.png');
	this.load.image('ganahumano', 'assets/ghum.png');
	this.load.image('ganasombra', 'assets/gsom.png');
	this.load.image('pierden', 'assets/gatr.png');
	this.load.audio('menumusic', ['assets/menu/menutheme.wav']);
	this.load.audio('escmusic', ['assets/escape.mp3']);
	this.load.audio('surmusic', ['assets/survive.mp3']);
	this.load.audio('coomusic', ['assets/cooperate.mp3']);
	this.load.audio('click', ['assets/click.mp3']);
	this.load.audio('spup', ['assets/powerup.mp3']);
	this.load.audio('sdoor', ['assets/door.mp3']);
	this.load.image('gana1','assets/gp1.png');
	this.load.image('gana2','assets/gp2.png');
	this.load.image('ganan','assets/gesc.png');
	this.load.image('lobby','assets/menu/fondolobby.png');
	this.load.spritesheet('onlone','assets/menu/OnlineLobby.png', {frameWidth:200,frameHeight:35});
	this.load.image('alone1','assets/menu/Achivments/achivalo1.png');
	this.load.image('alone2','assets/menu/Achivments/achivalo2.png');
	this.load.image('cooperate1','assets/menu/Achivments/achivcoop1.png');
	this.load.image('cooperate2','assets/menu/Achivments/achivcoop2.png');
	this.load.image('escape1','assets/menu/Achivments/achivesc1.png');
	this.load.image('escape2','assets/menu/Achivments/achivesc2.png');
	this.load.image('mirror1','assets/menu/Achivments/achivmir1.png');
	this.load.image('mirror2','assets/menu/Achivments/achivmir2.png');
	this.load.image('survive1','assets/menu/Achivments/achivsur1.png');
	this.load.image('survive2','assets/menu/Achivments/achivsur2.png');
	this.load.image('alone1c','assets/menu/Achivments/achivalo1c.png');
	this.load.image('alone2c','assets/menu/Achivments/achivalo2c.png');
	this.load.image('cooperate1c','assets/menu/Achivments/achivcoop1c.png');
	this.load.image('cooperate2c','assets/menu/Achivments/achivcoop2c.png');
	this.load.image('escape1c','assets/menu/Achivments/achivesc1c.png');
	this.load.image('escape2c','assets/menu/Achivments/achivesc2c.png');
	this.load.image('mirror1c','assets/menu/Achivments/achivmir1c.png');
	this.load.image('mirror2c','assets/menu/Achivments/achivmir2c.png');
	this.load.image('survive1c','assets/menu/Achivments/achivsur1c.png');
	this.load.image('survive2c','assets/menu/Achivments/achivsur2c.png');
	this.load.image('ayudaescape','assets/Fase4/esch.png');
	this.load.image('victoriadesconexion', 'assets/Fase4/disconect.png');
	this.load.spritesheet('OfflineMode','assets/Fase4/OfflineMode.png',{frameWidth:200,frameHeight:70});
	this.load.spritesheet('OnlineMode','assets/Fase4/OnlineMode.png',{frameWidth:200,frameHeight:70});
	this.load.spritesheet('light','assets/Fase4/switch.png',{frameWidth:60,frameHeight:105});
	this.load.spritesheet('barr','assets/Fase4/back.png',{frameWidth:40,frameHeight:35});
    this.load.spritesheet('barr2','assets/Fase4/back2.png',{frameWidth:80,frameHeight:70});
	this.load.spritesheet('coins','assets/Fase4/trophy.png',{frameWidth:70,frameHeight:70});
    this.load.image('warning','assets/Fase4/warning.png');
    this.load.image('errorserver', 'assets/Fase4/error.png');
    this.load.image('paused','assets/Fase4/pause.png');
    this.load.image('ayudasurvivehumano', 'assets/Fase4/surh1.png');
    this.load.image('ayudasurvivesombra', 'assets/Fase4/surh2.png');
    this.load.image('tileo', 'assets/tilemap.png');
    this.load.image('tileo1', 'assets/tilemap.png');
    this.load.image('tileo2', 'assets/tilemap2.png');
    this.load.image('tileo3', 'assets/tilemap3.png');
    this.load.image('tileo4', 'assets/tilemap4.png');
    this.load.image('tileo5', 'assets/tilemap5.png');
    this.load.image('tileo6', 'assets/tilemap6.png');

	barracarga.setFrame(1);
};
logo.create=function(){
	barracarga.setFrame(2);
	setTimeout(function () {
		barracarga.destroy();
		var l=logo.add.image(600,200,'LOGO');
		logo.add.tween({
			targets:l,
			alpha:0,
			duration:1000,
			ease:'Sine.easeInOut',
			onComplete:function(){
				var t=logo.scene.transition({target:'selection',duration:'10'});
			}
		});
	}, 1000);
};
