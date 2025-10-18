# Prototipo XR-9 Runner

Este proyecto es un prototipo de videojuego tipo runner arcade desarrollado en JavaScript y HTML5 Canvas.

## Funcionamiento

- El personaje principal es un robot que corre automáticamente por una industria abandonada.
- El fondo se desplaza simulando una cámara lateral, manteniendo al personaje centrado.
- El jugador puede hacer saltar al robot presionando la barra espaciadora para evitar obstáculos industriales (barriles, cajas, tuberías).
- A medida que avanza, la velocidad del juego aumenta progresivamente.
- El jugador puede recolectar piezas tecnológicas (baterías) para sumar puntos extra, que se muestran en pantalla.
- Si el personaje choca con un obstáculo, aparece un modal de "Perdiste" y se puede reiniciar el juego.

## Estructura

- `index.html`: Contenedor principal y estructura del juego.
- `style.css`: Estilos básicos.
- `js/Player.js`: Lógica y renderizado del personaje.
- `js/Obstacle.js`: Lógica y renderizado de obstáculos industriales.
- `js/Piece.js`: Lógica y renderizado de piezas tecnológicas recolectables.
- `js/InputHandler.js`: Control de entrada del teclado.
- `js/Score.js`: Sistema de puntuación y contador de piezas.
- `js/main.js`: Lógica principal del juego y ciclo de animación.

## Cómo jugar

1. Abre `index.html` en tu navegador.
2. Presiona la barra espaciadora para saltar y esquivar obstáculos.
3. Recolecta piezas tecnológicas para aumentar tu puntuación.
4. Si pierdes, puedes reiniciar el juego desde el modal.

---

Desarrollado como prototipo educativo y de práctica para juegos arcade en JavaScript.
