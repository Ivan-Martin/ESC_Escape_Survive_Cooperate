var m_online= new Phaser.Scene('m_online');
var esc;
var ontext;
var on;
var usersconnected = 0;
m_online.create = function () {
    on = this.add.text(30, 30, 'ONLINE', {fontFamily:'monospace', fontSize: '20px', fill: '#666699' });
        
    esc = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
}
m_online.update=function(){
    if(esc.isDown){
        var t=alone.scene.transition({target:'menu',duration:'10'});
    }
    loadUsers(function (users) {
            usersconnected = users.length;
            ontext = "Jugadores conectados:\n";
            
            for (var i = 0; i < users.length; i++) {
                var usuario = users[i];
                if (usuario.modo != null)
                    ontext += "\n" + usuario.name + " está jugando a " + usuario.modo;
                else ontext += "\n" + usuario.name + " está conectado en el lobby";
            }
            on.setText(ontext);        
    });
}