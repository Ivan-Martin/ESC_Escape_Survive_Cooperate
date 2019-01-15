# ESC: Escape. Survive. Cooperate.

![No se pudo cargar la imagen](https://raw.githubusercontent.com/Ivan-Martin/ESC_Escape_Survive_Cooperate/master/src/main/resources/static/assets/menu/LOGO.png  "Logo de ESC")

ESC es un juego de puzzles con una estética retro, ambientado en una temática de terror, contando con tres principales modos de juego:

* **Escape**: Escapa del laberinto llegando al centro antes que tu rival
* **Survive**: Tu amigo se ha convertido en una sombra y ahora intenta atraparte ¿Sobrevivirás?
* **Cooperate**: ¡Estais juntos en esto! Encuentra las llaves y consigue salir.

Cada vez que juegues a ESC tendrás una experiencia única, ya que cada vez que entras a jugar, nuevos laberintos son generados.
¡Nunca verás dos iguales!

¡¡Ya puedes probar online nuestro juego!!

Puedes probarlo en [itchio][itchiolink], [Newgrounds][newgroundslink] y [Kongregate][kongregatelink]

[Aqui un video mostrando la funcionalidad online](https://youtu.be/J0jtra2VqR0)


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

# Navegación

La distribuición de los menús es de la siguente manera:
![No se pudo cargar la imagen](https://raw.githubusercontent.com/Ivan-Martin/ESC_Escape_Survive_Cooperate/master/src/main/resources/static/assets/dia2.png "Diagrama de Navegación")

# Diagrama del backend APIRest y Websockets
![No se pudo cargar la imagen](https://fotos.subefotos.com/fe4f9a56ae5f83bc153dd1b689cdfacdo.jpg "Diagrama de clases del backend")

# Ejecutando el servidor

Para ejecutar el servidor, se deben descargar las carpetas de github, y ejecutar el jar "ESCGame-1.5.jar" mediante el comando java -jar. Para acceder al servidor desde otro ordenador, se debe utilizar la IP Local de la red, que es donde Spring aloja el juego.

Alternativamente, se puede depurar el servidor descargandose las carpetas de Github, donde se puede ver el código fuente. En caso de existir problemas con las conexiones de servidor, pueden provenir de la IP escrita en el fichero "script.js", puesto que puede mandar las peticiones a una dirección equivocada.

# Websockets

En nuestro juego, se utilizan websockets solo una vez están emparejados dos jugadores, durante la partida. Todos los websockets llevan unidos un identificador para saber el tipo de paquete que se está enviando, y un userid para saber quién lo ha enviado. Durante la partida, a través del id del websocket se identificará qué incluye, pudiendose obtener los datos del mismo. Además, se descartarán los paquetes cuyo userid coincida con el propio, ya que serán nuestros propios paquetes.
Aun así, el servidor incluye un hashmap con todos los emparejamientos actuales, con lo que se asegura de que cada websocket enviado por un jugador solo lo recibirá su rival.
El juego incluye un sistema de detección de pérdida de websockets en la generación del mundo, pudiendo así volver a pedir un websocket si se ha perdido, ya que el mundo es muy grande y su descripción se ha de enviar en distintos paquetes, posibilitando la pérdida de alguno. Siendo estos paquetes tan importantes, se ha implementado este sistema.

Además, una vez iniciada una partida, los jugadores principalmente enviarán un tipo de websocket, aquel que incluye los datos de velocidad y posición, siendo identificado este con id "velocidad". Cuando el servidor detecta este websocket, actualiza el tiempo de desconexión de ese jugador, pudiendo detectar de esta forma si se ha perdido la conexión con algún cliente, y desconectandole en ese caso e informando a su rival de lo sucedido.

# Fase 5

En las ultimas etapas de desarrollo de este proyecto hemos realizo beta-testing e intentando implementar el feedback de este al proyecto mediante múltiples mejoras entre las cuales se incluye:

* La IA del modo alone cuenta ahora con dos estados: Inicialmente, la IA explorará de forma aleatoria los pasillos hasta llegar a un límite de proximidad con el jugador y entonces la IA comenzará a perseguir a este.

* Se han añadido al modo cooperate dos nuevas mecánicas: Se generan ahora en los laberintos sensores de presión en el suelo sobre los cuales un jugador debe mantenerse quieto para abrirle el camino a su compañero. También se ha añadido una flecha que indica la dirección general hacia el proximo objetivo para asistir a los jugadores en este modo más complejo. La flecha aparecerá dos veces; cuando queden 2 y 1 minuto.

* Dos nuevos tilesets estás disponibles en todos los modos, elevando el total de mapas de texturas a 6.

* Nuevos powerups para el modo Survive:
  
  -El Turbo Booster acelera la velocidad de movimiento de su usuario.
  
  -El Freezer congela el tiempo durante 5 segundos.
  
  
El beta testing se llevó acabo con gente externa al grupo de desarrollo, enviando un enlace con acesso al juego y un formulario para rellenar tras terminar las partidas. Este formulario buscaba recopilar opiniones sobre distintos aspectos del juego, sugerencias de mejora y bugs por arreglar.

Además, se ha publicado la versión final del proyecto en tres webs de juegos de navegador, aqui facilitamos los enlaces:

Itch.io - https://escgame.itch.io/esc

Newgrounds - https://www.newgrounds.com/portal/view/724623?updated=1547518458

Kongregate - https://www.kongregate.com/games/ESCgame/esc-escape-survive-cooperate

- - -

# Beta testing

Para llevar a cabo el beta testing, dispusimos nuestro juego en privado en itchio para irlo distribuyendo a aquellas personas que pudieran probarlo. Posteriormente, les pasamos un cuestionario para que rellenaran con sus opiniones.

Los resultados del cuestionario han sido los siguientes:

Acerca de la edad, el target del juego se cumple: Una media de edad de 20 años acerca de las personas que han probado el juego.

Sobre la satisfacción de los usuarios con el juego, se observan buenos resultados:
 * Escape tiene una media de 4 puntos sobre 5
 * Survive tiene una media de 4,13 puntos sobre 5
 * Cooperate tiene una media de 4,13 puntos sobre 5
 * El juego en global tiene una media de 4 puntos sobre 5
 * La música y estética se colocan con 3,9 puntos sobre 5
 
Algunos de los errores encontrados destacan:

- Problemas al entrar al modo Survive Alone, que no permitían mover al jugador -> SOLUCIONADO (Errata en el código)
- Problemas con la carga de archivos -> SOLUCIONADO (Inclusión de una barra de carga)

Con respecto al tamaño de los laberintos y al tiempo ofrecido para el gameplay, un 60% de los usuarios están satisfechos con el tamaño de los laberintos, y un 70% con el tiempo ofrecido. Se ha decidido dejar el gameplay sin modificaciones.

También estamos satisfechos con la inclusión de las imágenes de ayuda en la página del juego: Un 90% de las personas indican que les resultan de ayuda.

Por lo demás, también se han sugerido temas como la adición de nuevos powerups, en los que el equipo ya estaba trabajando.

![No se pudo cargar la imagen](https://fotos.subefotos.com/72e6f932bb4f08a60e66073ef1a5baafo.png "Encuesta acerca de las ayudas")
![No se pudo cargar la imagen](https://fotos.subefotos.com/91efd8bfc62711016d14d588bee9d8f3o.png "Encuesta acerca del tamaño de laberintos")
![No se pudo cargar la imagen](https://fotos.subefotos.com/01ba270dccdc2e672185d6dac8c9407eo.png "Encuesta acerca del tiempo ofrecido")
![No se pudo cargar la imagen](https://fotos.subefotos.com/afe1d4963538c1b9f5c977862db7a423o.png "Puntuación global del juego obtenida en el beta testing")
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
[itchiolink]: https://escgame.itch.io/esc
[newgroundslink]: https://www.newgrounds.com/portal/view/724623?updated=1547518458
[kongregatelink]: https://www.kongregate.com/games/ESCgame/esc-escape-survive-cooperate
