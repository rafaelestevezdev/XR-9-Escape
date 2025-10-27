# XR-9 Escape - Robot Runner Game

Un juego arcade de corredor de robots desarrollado con Phaser.js 3.

## Estructura del Proyecto

```
prototipo_XR-9/
├── index.html              # Archivo HTML principal
├── .gitignore              # Archivos a ignorar en Git
├── README.md               # Este archivo
├── js/
│   ├── game.js            # Configuración de Phaser y funciones globales
│   ├── GameScene.js       # Escena principal del juego
│   ├── Player.js          # Lógica del jugador
│   ├── Obstacle.js        # Definición de obstáculos
│   └── ObstacleManager.js # Gestión de obstáculos
├── css/
│   ├── base.css           # Variables CSS y estilos base
│   ├── hud.css            # Estilos del HUD (puntuación, batería)
│   ├── screens.css        # Estilos de pantallas (inicio, game over)
│   ├── buttons.css        # Estilos de botones
│   ├── modals.css         # Estilos de modales
│   └── responsive.css     # Media queries responsivos
├── html/
│   ├── start-screen.html      # Pantalla de inicio
│   ├── game-over-screen.html  # Pantalla de fin de juego
│   ├── config-modal.html      # Modal de configuración
│   └── controls-modal.html    # Modal de controles
├── assets/
│   └── sprites/           # Sprites del juego
└── README.md              # Este archivo
```

## Arquitectura Modular

### HTML

Los componentes HTML están separados en archivos individuales para facilitar el mantenimiento:

- `start-screen.html`: Pantalla de bienvenida con título y botones
- `game-over-screen.html`: Pantalla de fin de juego con puntuación
- `config-modal.html`: Modal de configuración (placeholder)
- `controls-modal.html`: Modal con instrucciones de juego

### CSS

Los estilos están organizados por funcionalidad:

- `base.css`: Variables CSS, reset y estilos base del layout
- `hud.css`: Elementos de interfaz durante el juego
- `screens.css`: Pantallas de overlay (inicio, game over)
- `buttons.css`: Todos los estilos de botones
- `modals.css`: Estilos de ventanas modales
- `responsive.css`: Media queries para dispositivos móviles

### JavaScript

- `game.js`: Configuración de Phaser y funciones globales
- `GameScene.js`: Lógica principal del juego
- `Player.js`: Comportamiento del personaje
- `Obstacle.js`: Definición y comportamiento de obstáculos
- `ObstacleManager.js`: Sistema de spawn y gestión de obstáculos

## Características

- 🎮 Controles: Espacio, flecha arriba o toque en pantalla
- 🔋 Sistema de baterías coleccionables
- 📱 Diseño responsivo para móviles
- 🎨 Tema industrial arcade
- ⚡ Efectos visuales y animaciones

## Cómo Ejecutar

1. Abrir `index.html` en un navegador web moderno
2. Hacer clic en "INICIAR JUEGO"
3. Usar controles para saltar y evitar obstáculos

## Desarrollo

Para modificar el juego:

1. HTML: Editar archivos en `html/` y actualizar referencias en `index.html`
2. CSS: Modificar archivos en `css/` (todos se incluyen automáticamente)
3. JS: Los archivos en `js/` se incluyen en orden específico

## Escalabilidad

Esta estructura modular permite:

- ✅ Fácil localización de errores
- ✅ Mantenimiento independiente de componentes
- ✅ Reutilización de código
- ✅ Desarrollo colaborativo
- ✅ Testing por separado de cada módulo
