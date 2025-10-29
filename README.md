# XR-9 Escape - Robot Runner Game

Un juego arcade de corredor de robots desarrollado con Phaser.js 3.

## Estructura del Proyecto

```
prototipo_XR-9/
├── index.html              # Archivo HTML principal
├── .gitignore              # Archivos a ignorar en Git
├── README.md               # Este archivo
├── js/
│   ├── main.js            # Punto de entrada y configuración de Phaser
│   ├── Constants.js       # Constantes del juego
│   ├── GameScene.js       # Escena principal del juego
│   ├── GameState.js       # Gestión del estado del juego
│   ├── Player.js          # Lógica del jugador
│   ├── Obstacle.js        # Definición de obstáculos
│   ├── ObstacleManager.js # Gestión de obstáculos
│   ├── InputManager.js    # Gestión de controles
│   ├── HUDManager.js      # Gestión de interfaz de usuario
│   ├── PhysicsManager.js  # Gestión de física
│   ├── BackgroundManager.js # Gestión de fondos
│   └── TextureGenerator.js # Generación procedural de texturas
├── css/
│   ├── base.css           # Variables CSS y estilos base
│   ├── hud.css            # Estilos del HUD (puntuación, batería)
│   ├── screens.css        # Estilos de pantallas (inicio, game over)
│   ├── buttons.css        # Estilos de botones
│   ├── modals.css         # Estilos de modales
│   └── responsive.css     # Media queries responsivos
└── assets/
    └── icon/
        └── robot-icon.png # Icono del juego
```

## Arquitectura Modular

El proyecto está organizado de manera modular para facilitar el mantenimiento y escalabilidad:

- **HTML**: Un archivo `index.html` principal que contiene toda la estructura del juego inline (canvas de Phaser, HUD, pantallas de inicio/game over, modales de configuración y controles). Se eliminó la carpeta `html/` para simplificar la estructura.

- **CSS**: Estilos organizados por funcionalidad en `css/` (base, botones, HUD, modales, pantallas y responsivo) para un diseño industrial arcade adaptable a móviles.

- **JavaScript**: Lógica del juego en `js/` con clases especializadas usando el patrón Manager con responsabilidad única:

  - `main.js`: Punto de entrada y configuración de Phaser
  - `Constants.js`: Todas las constantes centralizadas
  - `GameScene.js`: Escena principal que coordina todos los managers
  - `GameState.js`: Gestión del estado (puntuación, velocidad, dificultad)
  - `Player.js`: Comportamiento del jugador
  - `Obstacle.js`: Definición y comportamiento individual de obstáculos
  - `ObstacleManager.js`: Sistema de spawn y gestión colectiva
  - `InputManager.js`: Gestión unificada de controles (teclado, táctil)
  - `HUDManager.js`: Gestión de elementos de interfaz
  - `PhysicsManager.js`: Gestión de física y colisiones
  - `BackgroundManager.js`: Gestión de fondos paralax
  - `TextureGenerator.js`: Generación procedural de sprites

- **Assets**: Recursos visuales en `assets/` (iconos por el momento, luego se agregarán nuevas cosas como sprites, sonidos, etc.).

## Funciones Implementadas

El prototipo incluye las características core de un corredor arcade:

- **Controles**: Salto con espacio, flecha arriba o toque táctil, con sistema de corte de salto para precisión.
- **Jugabilidad**: Jugador robot que corre automáticamente, evita obstáculos y recolecta baterías para puntuación extra.
- **Dificultad Progresiva**: Velocidad y frecuencia de obstáculos aumentan con el tiempo, con etapas marcadas.
- **Interfaz**: HUD con puntuación, contador de baterías y velocidad; pantallas de inicio, pausa y game over.
- **Física**: Sistema arcade con gravedad, colisiones y overlaps para interacciones realistas.
- **Generación Procedural**: Texturas y fondos creados dinámicamente para optimizar carga.
- **Optimizaciones**: Renderizado pixel art, soporte multitáctil y configuración responsiva.

## Cómo Ejecutar

1. Abrir `index.html` en un navegador web moderno
2. Hacer clic en "INICIAR JUEGO"
3. Usar controles para saltar y evitar obstáculos

## Desarrollo

Para modificar el juego:

1. **HTML**: Editar `index.html` directamente
2. **CSS**: Modificar archivos en `css/` según la funcionalidad deseada
3. **JS**: Los archivos se cargan en orden específico (ver `index.html`)
4. **Constantes**: Modificar valores en `Constants.js` para ajustar comportamiento

## Partes Faltantes para la Versión Beta

Para llegar a una versión beta jugable y pulida, se requieren:

- **Audio**: Efectos de sonido (saltos, colisiones, recolección) y música de fondo para inmersión.
- **Más Contenido**: Variedad de obstáculos adicionales, power-ups y fondos temáticos por etapas.
- **Sistema de Niveles**: Progresión con checkpoints, metas de puntuación y desbloqueables.
- **Guardado**: Persistencia de mejores puntuaciones y configuraciones usando localStorage.
- **Testing y Balanceo**: Ajustes de dificultad, testing en múltiples dispositivos y corrección de bugs menores.
- **UI/UX**: Animaciones de transición, tutorial interactivo y opciones de accesibilidad (contraste, tamaño de botones).

## Escalabilidad

Esta estructura modular permite:

- ✅ Fácil localización de errores
- ✅ Mantenimiento independiente de componentes
- ✅ Reutilización de código
- ✅ Desarrollo colaborativo
- ✅ Testing por separado de cada módulo
