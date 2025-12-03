# Actividad Práctica - XR-9 Escape

Este repositorio contiene los entregables para la actividad final de desarrollo de videojuegos.

## Contenido

1.  **[BUG_LIST.md](./BUG_LIST.md)**: Lista de errores identificados y plan de corrección.
2.  **[PROJECT_CLOSURE.md](./PROJECT_CLOSURE.md)**: Documento de cierre y resumen del proyecto.
3.  **[DISTRIBUTION_PLAN.md](./DISTRIBUTION_PLAN.md)**: Estrategia de lanzamiento y marketing.

## Optimización Realizada

Como parte de la actividad, se ha realizado una optimización técnica en el **Rendimiento**:

- **Implementación de Object Pooling**: Se modificó el `ObstacleManager` para reutilizar las instancias de los obstáculos en lugar de destruirlas y crearlas constantemente. Esto reduce drásticamente la presión sobre el Garbage Collector y mejora la estabilidad de los FPS en sesiones largas.

## Instrucciones de Ejecución

1.  Abrir `index.html` en un navegador web moderno.
2.  Hacer clic en la pantalla para inicializar el sistema de audio.
3.  Jugar usando ESPACIO o ARRIBA para saltar.
