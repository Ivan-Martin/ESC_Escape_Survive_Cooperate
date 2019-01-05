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
            //scene:[logo,selection,offmenu,alone,offsurvive,offmirror,offescape,offcooperate,menu,elobby,survive,mirror,escape,cooperate]
     scene:[logo,selection,offmenu,alone,menu,elobby]
        };
        
        let game = new Phaser.Game(config);
        }