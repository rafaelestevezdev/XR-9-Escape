# XR-9 Escape

Un juego arcade de corredor infinito desarrollado con **Phaser.js 3**.

## ¿De qué trata?

Controlas un robot que corre automáticamente en una fábrica industrial. Tu objetivo es:

- **Saltar** obstáculos (cajas, martillos, tanques, engranajes) usando **ESPACIO**, **ARRIBA** o **TAP**
- **Recolectar baterías** ⚡ para mantener tu energía (el juego termina si llega a 0)
- **Esquivar láseres** disparados por drones que aparecen periódicamente
- **Sobrevivir el máximo tiempo** mientras la dificultad aumenta

## Controles

- **SALTAR**: Espacio / Flecha Arriba / Tocar pantalla
- **PAUSA**: P / ESC
- **REINICIAR**: R

## Cómo Ejecutar

1. Abre `index.html` en tu navegador
2. Haz clic en "INICIAR JUEGO"
3. ¡A sobrevivir!

## Arquitectura

Proyecto modular basado en **Managers** con separación de responsabilidades:

- `GameScene.js` - Coordina el flujo del juego
- `Player.js` - Comportamiento del robot
- `ObstacleManager.js` - Generación de obstáculos
- `LaserDroneManager.js` - Drones que disparan láseres
- `GameState.js` - Estado global (puntuación, energía, velocidad)
- `PhysicsManager.js` - Colisiones y física
- `HUDManager.js` - Interfaz (puntuación, energía, barra de progreso)
- `InputManager.js` - Controles (teclado y táctil)

## Características Implementadas

✅ Jugabilidad fluida con saltos y corte de salto  
✅ Sistema de energía con drenaje continuo  
✅ Drones láser que aparecen periódicamente  
✅ Dificultad progresiva  
✅ HUD completo (puntuación, baterías, energía, nivel)  
✅ Soporte táctil y responsivo  
✅ Texturas procedurales optimizadas

## Próximos Pasos

- Más variedad de obstáculos y power-ups

