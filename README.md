# ESC: Escape. Survive. Cooperate.

![No se pudo cargar la imagen](https://raw.githubusercontent.com/Ivan-Martin/ESC_Escape_Survive_Cooperate/master/src/main/resources/static/assets/menu/LOGO.png  "Logo de ESC")

ESC es un juego de puzzles con una estética retro, ambientado en una temática de terror, contando con tres principales modos de juego:

* **Escape**: Escapa del laberinto llegando al centro antes que tu rival
* **Survive**: Tu amigo se ha convertido en una sombra y ahora intenta atraparte ¿Sobrevivirás?
* **Cooperate**: ¡Estais juntos en esto! Encuentra las llaves y consigue salir.

Cada vez que juegues a ESC tendrás una experiencia única, ya que cada vez que entras a jugar, nuevos laberintos son generados.
¡Nunca verás dos iguales!

## Escape

El modo de juego Escape consiste en una carrera entre dos jugadores para llegar antes que el rival al centro. Se generarán aleatoriamente dos laberintos, uno para cada jugador, dotando de un toque de azar al juego. Se generarán de forma que se asegure una misma dificultad entre los dos laberintos. La salida estará un laberinto como sala central, es decir, al que se podrá acceder a través de las escaleras que tiene cada jugador en su laberinto. El primero en salir encontrando las escaleras doradas en la sala central será el ganador. El otro jugador se enfrentará a un fin oscuro...

En Escape, los jugadores no sabrán la posición exacta de su rival, pero podrán deducirla, ya que cuando uno de los dos jugadores llegue a la zona central (Las casillas que rodean a la casilla de salida general), en la pantalla de su rival se activarán efectos específicos que indicarán que estás a punto de perder y debes darte prisa. Dado que esta zona central es común, aquí se pueden producir encontronazos por sorpresa que provocarán a los jugadores un pequeño susto.

![No se pudo cargar la imagen](https://i.imgur.com/Ih3Q0ms.png "Captura de pantalla del modo Escape")

### Mirrored Escape

Este modo de juego secundario presenta una variante donde el mismo laberinto es generado para los dos jugadores, estando dispuestos en forma de espejo. De igual forma, el jugador que primero llegue al centro será el ganador. Este modo está planteado para un juego más justo: Al tener los dos jugadores el mismo laberinto, se elimina el factor aleatorio del modo principal.

![No se pudo cargar la imagen](https://i.imgur.com/cmO9GVH.png "Captura de pantalla del modo Mirrored Escape")

## Survive

En Survive, encontramos un modo de competición más directo, donde uno de los jugadores actuará de *sombra* e intentará atrapar a su rival en un tiempo determinado. Si el tiempo finaliza sin que *sombra* caze al otro jugador, habrá sobrevivido al ataque. Si *sombra* consigue atraparle, habrá ganado y su rival no habrá sobrevivido.

No obstante, el jugador humano podrá encontrar a lo largo de su travesía un objeto especial, que le permitirá utilizar un poder para poder atravesar paredes durante un breve lapso de tiempo y aprovechar este hueco para huir de *sombra*

El poder de *sombra* por el contrario, es que comenzará el juego con una velocidad más lenta que el personaje humano, pero conforme vaya pasando el tiempo, alcanzará la velocidad del jugador y en los últimos segundos de la partida, será más rápido que el jugador. Gracias a este poder, la mayoría de las veces que gane sombra se producirán al final de la partida, cuando hay una mayor tensión acumulada y por tanto una experiencia más intensa. Cada vez que sombra se haga más veloz, un flash rojo lo indicará en la pantalla.

![No se pudo cargar la imagen](https://i.imgur.com/2DMF4pQ.png "Captura de pantalla del modo Survive")

### Survive alone

Para aquellos jugadores que no tengan con quién jugar, este modo secundario presenta un enemigo que se va moviendo aleatoriamente, controlado por el ordenador.

## Cooperate

Ayuda a tu compañero a escapar del laberinto consiguiendo las llaves que abren las puertas de su parte, venciendo al tiempo y consiguiendo escapar antes de que acabe.

En este modo, existen varias llaves que abrirán puertas (Quedandose estas abiertas) en el lado contrario del laberinto, dejando pasar a tu compañero, además de una puerta final donde hacen falta las dos llaves para salir.

![No se pudo cargar la imagen](https://i.imgur.com/M8SaKDZ.png "Captura de pantalla del modo Cooperate")


- - -

# Temática

El juego está caracterizado por su estilo retro y su arte visual en pixel art; remarcando el gameplay en una perspectiva top-down del juego, donde el jugador ve desde arriba como controla a su personaje por el laberinto. La visión está reducida con el objetivo de dificultar el juego, así como de darle un toque más asustadizo.

Gracias a los distintos efectos audiovisuales que tiene el juego, se crea un aura y una ambientación terrorífica. Existen distintos paquetes de texturas que se seleccionan aleatoriamente en cada partida para otorgar variedad al juego.

Cada jugador tiene una vista reducida, a través de un foco de luz que ilumina desde arriba. De esta forma, el jugador solo puede visualizar la parte del laberinto más cercana a él, desorientandole por el laberinto, para hacerlo más difícil.

# Música

Toda la música de ESC es original, producida por Álvaro García con [soundation][linksoundation]

Cada uno de los temas está especialmente pensado para el modo para el que se diseña, con sonidos extra para los elementos interactuables.

# Motor de juego

Todo el juego está desarrollado en javascript con el motor de juego [Phaser 3][phaserlink]
- - -

Equipo de desarrollo de ESC:

* Iván Martín de San Lázaro (i.martinde.2016@alumnos.urjc.es / [Ivan-Martin][gitivan])
* Ángel Noguero Salgado (a.noguero.2016@alumnos.urjc.es / [aaangell][gitangel])
* Álvaro García Bardón (a.garciaba.2016@alumnos.urjc.es / [digifireEX][gitalvaro])


[gitivan]: https://github.com/Ivan-Martin
[gitangel]: https://github.com/aaangell
[gitalvaro]: https://github.com/digifireEX
[linksoundation]: https://soundation.com/
[phaserlink]: https://phaser.io/