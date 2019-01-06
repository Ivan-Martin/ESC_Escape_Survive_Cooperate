var escenacarga = new Phaser.Scene("escenacarga");

escenacarga.preload = function () {
	this.load.spritesheet('carga', 'assets/Fase4/Loading.png', { frameWidth: 600, frameHeight: 35 });
}

escenacarga.create = function () {
	this.scene.start('logo');
}