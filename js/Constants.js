/**
 * Constants.js - Archivo centralizado de constantes del juego
 * Principio de responsabilidad única: Solo contiene constantes
 */

// Dimensiones del juego
const GAME_CONFIG = {
  WIDTH: 800,
  HEIGHT: 600,
  PARENT: "game-container",
  PIXEL_ART: true,
  TRANSPARENT: false,
  SCALE_MODE: Phaser.Scale.FIT,
  AUTO_CENTER: Phaser.Scale.CENTER_BOTH,
};

// Física
const PHYSICS_CONFIG = {
  DEFAULT: "arcade",
  GRAVITY: { y: 800 },
  DEBUG: false,
};

// Estado inicial del juego
const GAME_INITIAL_STATE = {
  SCORE: 0,
  BATTERIES: 0,
  SPEED: 350,
  GAME_OVER: false,
  GAME_PAUSED: true,
  DIFFICULTY_INTERVAL: 10000, // ms
  MAX_SPEED: 650,
  SPEED_INCREMENT: 40,
};
// Cámara
const CAMERA = {
  ZOOM: 1.22, // zoom sutil para acercar la acción
  PLAYER_SCREEN_Y_RATIO: 0.82, // posición del jugador en la pantalla (0=arriba, 1=abajo)
  ROUND_PIXELS: true,
};

// Posiciones del juego
const GAME_POSITIONS = {
  // Línea base del suelo visual (y también referencia para obstáculos)
  GROUND_Y: 520,
  PLAYER_SPAWN_X: 120,
  // El jugador spawnea apoyado en el suelo (como el Dino)
  PLAYER_SPAWN_Y: 520,
  OBSTACLE_SPAWN_X: 880,
};

// Configuración del jugador
const PLAYER_CONFIG = {
  JUMP_VELOCITY: -350,
  CUT_JUMP_VELOCITY: -150,
  DISPLAY_SIZE: { width: 80, height: 80 },
  HITBOX: { width: 60, height: 70, offsetX: 10, offsetY: 10 },
  ORIGIN: { x: 0.5, y: 1 },
};

// Configuración de obstáculos
const OBSTACLE_CONFIG = {
  crate: {
    texture: "obstacle_crate",
    originY: 1,
    display: { width: 25, height: 25 },
    hitbox: { width: 20, height: 20, offsetX: 2.5, offsetY: 2.5 },
    minGap: 200,
  },
  hammer: {
    texture: "obstacle_hammer",
    originY: 1,
    display: { width: 30, height: 40 },
    hitbox: { width: 25, height: 35, offsetX: 2.5, offsetY: 2.5 },
    minGap: 190,
  },
  tank: {
    texture: "obstacle_tank",
    originY: 1,
    display: { width: 35, height: 45 },
    hitbox: { width: 30, height: 40, offsetX: 2.5, offsetY: 2.5 },
    minGap: 220,
  },
  gear: {
    texture: "obstacle_gear",
    originY: 0.5,
    display: { width: 30, height: 30 },
    hitbox: { width: 25, height: 25, offsetX: 2.5, offsetY: 2.5 },
    minGap: 210,
    rotating: true,
    rotSpeed: 120,
  },
  battery: {
    texture: "collectible_battery",
    originY: 1,
    display: { width: 20, height: 25 },
    hitbox: { width: 18, height: 22, offsetX: 1, offsetY: 1.5 },
    minGap: 180,
    collectible: true,
    yOffset: -70,
    bobAmplitude: 8,
    bobSpeed: 3.5,
    isBattery: true,
  },
  dash: {
    texture: "collectible_dash",
    originY: 1,
    display: { width: 22, height: 22 },
    hitbox: { width: 20, height: 20, offsetX: 1, offsetY: 1 },
    minGap: 220,
    collectible: true,
    yOffset: -72,
    bobAmplitude: 10,
    bobSpeed: 4.0,
    isDash: true,
  },
};

// Configuración del ObstacleManager
const OBSTACLE_MANAGER_CONFIG = {
  SPAWN_WINDOW: { min: 900, max: 1600 },
  TYPES: [
    "crate",
    "hammer",
    "tank",
    "gear",
    "battery",
    "battery",
    "battery",
    "dash", // baja frecuencia
  ],
  INITIAL_DIFFICULTY: 1,
  SPAWN_WINDOW_DECREMENT: 60,
  MIN_SPAWN_WINDOW: { min: 500, max: 900 },
};

// Colores (en formato hexadecimal para Phaser)
const COLORS = {
  SKY_BANDS: [0x080910, 0x0e1626, 0x182338, 0x24324c],
  HORIZON: 0x1a2436,
  HORIZON_DETAIL: 0x314057,
  HORIZON_LINE: 0x5c708b,
  GROUND: 0x2b2f36,
  GROUND_DETAIL: 0x3d434d,
  GROUND_LINE: 0x545b68,
  GROUND_ACCENT: 0x1d2027,
  GROUND_LIGHT: 0x4e8495,
  GROUND_SHADOW: 0x12161f,
  GROUND_EDGE: 0x2d3949,
  // Nuevos tonos metálicos y de luz para estética industrial avanzada
  METAL_DARK: 0x12181f,
  METAL_BASE: 0x1d2732,
  METAL_MID: 0x2a3642,
  METAL_LIGHT: 0x3b4c5c,
  METAL_HIGHLIGHT: 0x5a7488,
  HAZARD_YELLOW: 0xffc300,
  HAZARD_ORANGE: 0xff8c1a,
  HAZARD_BLACK: 0x0a0d10,
  LIGHT_CYAN: 0x4fa2ff,
  LIGHT_CYAN_SOFT: 0x8bc4ff,
  LIGHT_GLOW_INNER: 0xb9dcff,
  LIGHT_GLOW_OUTER: 0x2e76b3,
  ENERGY_CORE: 0x41ffd9,
  ENERGY_CORE_DARK: 0x1c8570,
  PLAYER_HEAD: 0xbdc3c7,
  PLAYER_VISOR: 0x2c3e50,
  PLAYER_BODY: 0x7f8c8d,
  PLAYER_ARMS: 0x95a5a6,
  PLAYER_LEGS: 0x7f8c8d,
  CRATE_WOOD: 0x3a2618,
  CRATE_DARK: 0x2a1a10,
  CRATE_LIGHT: 0x5a4228,
  CRATE_METAL: 0x8a6a48,
  CRATE_HANDLE: 0x1a1008,
  CRATE_RIVET: 0x4e5a62,
  HAMMER_METAL: 0x52616e,
  HAMMER_DARK: 0x3d4a56,
  HAMMER_LIGHT: 0x6a7985,
  HAMMER_BASE: 0x2a3640,
  HAMMER_SHADOW: 0x1c252e,
  HAMMER_HEAD: 0xff6b35,
  HAMMER_HEAD_DARK: 0xcc5528,
  TANK_METAL: 0x1e2e3a,
  TANK_DARK: 0x162229,
  TANK_LIGHT: 0x2d4555,
  TANK_BASE: 0x0e1419,
  TANK_LABEL: 0xffd700,
  TANK_WINDOW: 0x1a1a1a,
  TANK_OIL: 0xff8c1a,
  GEAR_METAL: 0x4a5662,
  GEAR_DARK: 0x3a4652,
  GEAR_LIGHT: 0x5a6672,
  GEAR_CENTER: 0x6a7682,
  GEAR_HOLE: 0x2a2a2a,
  BATTERY_GOLD: 0xffd700,
  BATTERY_LIGHT: 0xffed4e,
  BATTERY_DARK: 0xcc9900,
  BATTERY_TERMINAL: 0x4a9eff,
  BATTERY_TERMINAL_DARK: 0x2e7ed4,
  BATTERY_SPARK: 0xffffff,
  BATTERY_SHADOW: 0x000000,
  // Nuevos colores para batería cilíndrica
  BATTERY_BODY_DARK: 0x0f161d,
  BATTERY_BODY: 0x1e2a36,
  BATTERY_BODY_LIGHT: 0x2c3e50,
  BATTERY_RING: 0x4fa2ff,
  BATTERY_GLOW: 0x9fd6ff,
};

// Texturas
const TEXTURE_KEYS = {
  SKY: "bg_industrial_sky",
  GROUND: "ground_tile_factory",
  PLAYER: "player_robot",
  CRATE: "obstacle_crate",
  HAMMER: "obstacle_hammer",
  TANK: "obstacle_tank",
  GEAR: "obstacle_gear",
  BATTERY: "collectible_battery",
  DASH: "collectible_dash",
};

// Controles
const CONTROLS = {
  JUMP_KEYS: [
    Phaser.Input.Keyboard.KeyCodes.SPACE,
    Phaser.Input.Keyboard.KeyCodes.UP,
  ],
  PAUSE_KEY: Phaser.Input.Keyboard.KeyCodes.P,
  RESTART_KEY: Phaser.Input.Keyboard.KeyCodes.R,
};

// HUD
const HUD_ELEMENTS = {
  SCORE: "score",
  BATTERY_COUNT: "battery-count",
  ENERGY_BAR: "energy-bar",
  SPEED_INDICATOR: "speed-indicator",
  STAGE_INDICATOR: "stage-indicator",
  START_SCREEN: "start-screen",
  PAUSE_SCREEN: "pause-screen",
  GAME_OVER_SCREEN: "game-over-screen",
  FINAL_SCORE: "final-score",
  FINAL_BATTERIES: "final-batteries",
  POWERUP_INDICATOR: "powerup-indicator",
};

// Puntuación
const SCORING = {
  TIME_MULTIPLIER: 100,
  SCORE_PADDING: 5,
  SCORE_SUFFIX: "M",
};

// Efectos visuales
const VISUAL_EFFECTS = {
  GROUND_SEGMENT_WIDTH: 60,
  // Altura del collider del suelo; aumentada para mejor detección
  GROUND_SEGMENT_HEIGHT: 50,
  // Posicionar el suelo un poco más abajo para que el jugador esté correctamente sobre él
  GROUND_COLLIDER_Y: GAME_POSITIONS.GROUND_Y + 25,
  TOTAL_GROUND_WIDTH: 840,
};

// Power-ups
const POWERUPS = {
  DASH: {
    KEY: "dash",
    TEXTURE: TEXTURE_KEYS.DASH,
    DURATION_MS: 2000,
    SPEED_BOOST: 220, // incremento temporal de velocidad del mundo
    HUD_LABEL: "DASH",
  },
};

// Audio
const AUDIO = {
  BGM_MAIN: "bgm_main",
  SFX_PICKUP: "sfx_pickup",
  SFX_GAMEOVER: "sfx_gameover",
  SFX_JUMP: "sfx_jump",
  SFX_LASER_SHOOT: "sfx_laser_shoot",
};

const AUDIO_CONFIG = {
  MUSIC_VOLUME: 0.45,
  // Volumen por defecto para efectos (SFX)
  SFX_VOLUME: 0.8,
  FADE_DURATION_MS: 400,
};

// Exportar todas las constantes
const CONSTANTS = {
  GAME_CONFIG,
  PHYSICS_CONFIG,
  GAME_INITIAL_STATE,
  CAMERA,
  GAME_POSITIONS,
  PLAYER_CONFIG,
  OBSTACLE_CONFIG,
  OBSTACLE_MANAGER_CONFIG,
  COLORS,
  TEXTURE_KEYS,
  CONTROLS,
  HUD_ELEMENTS,
  SCORING,
  VISUAL_EFFECTS,
  POWERUPS,
  AUDIO,
  AUDIO_CONFIG,
  // Flag de depuración para desactivar logs en producción
  DEBUG: false,
};

// Nota: Se omiten logs por defecto para ahorrar recursos
