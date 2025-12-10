# XR-9: ESCAPE 🤖⚡

**Un juego arcade de runner infinito futurista** - Desarrollado como actividad final de desarrollo de videojuegos.

![Versión](https://img.shields.io/badge/versión-1.0-blue) ![Estado](https://img.shields.io/badge/estado-completo-brightgreen)

## 🎮 Descripción del Juego

XR-9 es un robot industrial que debe escapar de una fábrica plagada de obstáculos y peligros. El jugador debe mantener al robot saltando y esquivando obstáculos mientras recolecta baterías para mantener la energía. Cuanto más tiempo sobrevivas, mayor será tu puntuación y más difícil se vuelve el juego.

**Tema:** Estética arcade retro futurista con tema industrial  
**Género:** Runner infinito / Esquiva obstáculos  
**Plataformas:** Navegador web (PC, Tablet, Móvil)

---

## 🕹️ Cómo Jugar

### Controles

| Acción        | Tecla                                       |
| ------------- | ------------------------------------------- |
| **Saltar**    | `ESPACIO` / `FLECHA ARRIBA` / TOQUE (móvil) |
| **Pausar**    | `P` o `ESC`                                 |
| **Reiniciar** | `R` (en Game Over)                          |

### Objetivo

1. ✅ **Evita obstáculos** - Salta sobre cajas, martillos, tanques y engranajes
2. ⚡ **Recolecta baterías** - Recoge energía para mantener vivo el robot
3. 🏃 **Sobrevive el máximo tiempo** - Tu puntuación aumenta cada segundo
4. 📈 **Vence las dificultades** - El juego se vuelve más difícil progresivamente

### Mecánicas de Juego

- **Energía:** Comienza con 100%, se drena con el tiempo. Las baterías la recargan (+30%).
- **Velocidad:** El juego acelera gradualmente (comienza en 350 px/s, máximo 650 px/s)
- **Dificultad:** Aumenta cada 10 segundos, generando obstáculos más frecuentes
- **Scoring:** +150 puntos por segundo sobrevivido

---

## 🚀 Instalación y Ejecución

### Requisitos

- ✅ Navegador moderno (Chrome, Firefox, Safari, Edge)
- ✅ Conexión a internet (para Phaser CDN)
- ✅ JavaScript habilitado

### Pasos Rápidos

1. **Abre `index.html` en tu navegador** - No requiere servidor
2. **Haz clic en "CLICK TO INITIALIZE SYSTEM"** - Inicia el contexto de audio
3. **Presiona "INICIAR JUEGO"** - ¡A jugar!

### Con Servidor Local (Opcional)

```bash
# Python 3
python3 -m http.server 8000

# Node.js (si tienes http-server)
npx http-server

# Luego abre http://localhost:8000
```

---

## 🎨 Características Técnicas

### ✅ Implementado

- 🏗️ **Arquitectura limpia:** Separación de responsabilidades con managers especializados
- ⚡ **Optimización de rendimiento:** Object pooling para obstáculos, caché de DOM
- 🔊 **Sistema de audio completo:** Música, efectos de sonido, control de volumen independiente
- 📱 **Responsive design:** Soporta desktop, tablet y móvil con detección de orientación
- 💾 **Persistencia:** Guarda top 5 puntuaciones en localStorage
- 🎬 **Animaciones fluidas:** Robot con animaciones de correr y saltar
- 🎮 **Control versátil:** Teclado, flecha arriba y entrada táctil (móvil)
- 📊 **Indicadores visuales:** Energía, velocidad, dificultad y estadísticas en tiempo real

### 🔧 Stack Tecnológico

| Componente          | Tecnología                     |
| ------------------- | ------------------------------ |
| **Motor de juegos** | Phaser 3.55                    |
| **Lenguaje**        | JavaScript ES6+                |
| **Estilos**         | CSS3                           |
| **Física**          | Arcade Physics Engine (Phaser) |
| **Audio**           | Web Audio API                  |
| **Persistencia**    | localStorage                   |

---

## 📂 Estructura del Proyecto

```
prototipo_XR-9/
├── index.html                 # Página principal con interfaz completa
├── css/
│   ├── base.css              # Estilos generales y tema arcade
│   ├── buttons.css           # Estilos de botones interactivos
│   ├── hud.css               # HUD (puntuación, energía, dificultad)
│   ├── modals.css            # Modales de configuración
│   ├── screens.css           # Pantallas (inicio, pausa, Game Over)
│   └── responsive.css        # Estilos responsivos y móviles
├── js/
│   ├── main.js               # Punto de entrada y configuración
│   ├── Constants.js          # Constantes centralizadas
│   ├── GameState.js          # Lógica de estado del juego
│   ├── GameScene.js          # Escena principal (Phaser)
│   ├── Player.js             # Lógica del jugador
│   ├── Obstacle.js           # Clase de obstáculos
│   ├── ObstacleManager.js    # Gestión de obstáculos (con pooling)
│   ├── LaserDrone.js         # Enemigo láser
│   ├── LaserDroneManager.js  # Gestión de drones
│   ├── InputManager.js       # Control de entrada (teclado + touch)
│   ├── HUDManager.js         # Interfaz visual en tiempo real
│   ├── PhysicsManager.js     # Física y colisiones
│   ├── BackgroundManager.js  # Gestión del fondo
│   ├── TextureGenerator.js   # Generación procedural de texturas
│   ├── EscenaIndustrial.js   # Fondo industrial procedural
│   └── PreloadScene.js       # Escena de precarga
└── assets/
    ├── sprites-robot/        # Animaciones del robot (correr/saltar)
    ├── music/               # Música de fondo
    ├── sound/               # Efectos de sonido
    ├── cursor/              # Cursores personalizados
    └── icon/                # Iconos de la aplicación
```

---

## 🎯 Mejoras de Rendimiento

### Optimización de Rendimiento

- **Object Pooling:** Los obstáculos se reutilizan en lugar de destruirse, reduciendo presión del Garbage Collector
- **Caché de elementos DOM:** Se cachean referencias de elementos de UI para evitar búsquedas repetidas
- **Renderizado optimizado:** 60 FPS objetivo, anti-aliasing deshabilitado para pixel art
- **Event Throttling:** Actualización del HUD solo cuando cambian valores

### Accesibilidad

- ♿ **Atributos ARIA:** Etiquetas semánticas para lectores de pantalla
- 🎮 **Controles intuitivos:** Múltiples opciones de entrada (teclado, flecha, touch)
- 📊 **Feedback visual claro:** Indicadores de energía, velocidad y dificultad en tiempo real
- 📱 **Orientación optimizada:** Detección automática de orientación en móviles

---

## 📊 Estadísticas de la Partida

El juego mantiene registro de:

- **Puntuación final** - Puntos obtenidos en la partida actual
- **Baterías recolectadas** - Total de power-ups conseguidos
- **Top 5 puntuaciones** - Mejores partidas (guardadas en localStorage)
- **Velocidad actual** - Velocidad de generación de obstáculos
- **Nivel de dificultad** - Dificultad actual (Stage 1-5+)

---

## ⚙️ Configuración en Juego

Accede al menú **CONFIGURACIÓN** para:

- 🔊 **Música** - Ajustar volumen 0-100%
- 🎵 **Efectos de sonido** - Ajustar volumen 0-100%
- ❓ **¿Cómo jugar?** - Guía rápida de controles

---

## 🎓 Propósito Educativo

Este proyecto demuestra:

- Arquitectura escalable con patrón Manager para videojuegos
- Gestión de estado en aplicaciones interactivas
- Optimización de rendimiento (object pooling, event throttling)
- Integración de física arcade y detección de colisiones
- Gestión de entrada múltiple (teclado y touch)
- Diseño UI/UX arcade retro profesional
- Desarrollo responsivo multiplataforma
- Persistencia de datos con localStorage

---

## 🤝 Créditos

- **Desarrollo:** Rafael Estévez ([@rafaelestevezdev](https://github.com/rafaelestevezdev))
- **Motor:** Phaser 3.55 (phaser.io)
- **Fuente:** Press Start 2P (Google Fonts)
- **Actividad:** Desarrollo de Videojuegos - Actividad Final

---

## 📞 Contacto

- **GitHub:** [@rafaelestevezdev](https://github.com/rafaelestevezdev)
- **Proyecto:** XR-9 Escape

---

## 📄 Licencia

Proyecto educativo de desarrollo de videojuegos.

---

**¡Gracias por jugar XR-9: ESCAPE!** 🚀

_Intenta conseguir la máxima puntuación y desafía a tus amigos._
