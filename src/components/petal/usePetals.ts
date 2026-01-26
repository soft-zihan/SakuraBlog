import { ref } from 'vue';

export interface Petal {
  id: number;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  size: number;
  opacity: number;

  baseSpeedY: number;
  baseSpeedX: number;
  swayAmp: number;
  swayFreq: number;
  timeOffset: number;

  // State
  isDragging: boolean;
  isLanded: boolean;
  dragOffsetX: number;
  dragOffsetY: number;
  
  // Vortex state
  isInVortex: boolean;
  vortexAngle: number;
}

// Vortex (long press) state
export const vortexState = ref({
  active: false,
  x: 0,
  y: 0,
  strength: 0,
  maxStrength: 220,
  radius: 280
});

let nextId = 0;

// Pile grid for bottom stacking
const pileBaselineY = ref<number>(typeof window !== 'undefined' ? window.innerHeight : 1080);
const colWidth = ref<number>(36);
let pileHeights: number[] = [];

const ensureGrid = () => {
  const w = typeof window !== 'undefined' ? window.innerWidth : 1920;
  const cols = Math.max(1, Math.floor(w / colWidth.value));
  if (pileHeights.length !== cols) {
    const old = pileHeights.slice();
    pileHeights = new Array(cols).fill(0);
    for (let i = 0; i < Math.min(old.length, cols); i++) pileHeights[i] = old[i];
  }
};

const smoothColumnHeight = (idx: number) => {
  const left = pileHeights[Math.max(0, idx - 1)] || 0;
  const right = pileHeights[Math.min(pileHeights.length - 1, idx + 1)] || 0;
  pileHeights[idx] = (pileHeights[idx] * 0.7) + ((left + right) * 0.15);
};

export const createPetal = (yStart = -50): Petal => {
  const size = Math.random() * 10 + 12;
  return {
    id: nextId++,
    x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920),
    y: yStart,
    rotation: Math.random() * 360,
    scale: Math.random() * 0.5 + 0.8,
    size,
    opacity: Math.random() * 0.4 + 0.6,

    baseSpeedY: (Math.random() * 1 + 1),
    baseSpeedX: (Math.random() - 0.5) * 1,
    swayAmp: Math.random() * 2,
    swayFreq: Math.random() * 0.02 + 0.01,
    timeOffset: Math.random() * 1000,

    isDragging: false,
    isLanded: false,
    dragOffsetX: 0,
    dragOffsetY: 0,
    
    isInVortex: false,
    vortexAngle: Math.random() * Math.PI * 2
  };
};

// Long press detection helpers
export let longPressTimer: ReturnType<typeof setTimeout> | null = null;
let longPressStartX = 0;
let longPressStartY = 0;

export const startLongPress = (x: number, y: number) => {
  // Clear any existing timer
  if (longPressTimer) {
    clearTimeout(longPressTimer);
  }
  
  longPressStartX = x;
  longPressStartY = y;
  
  // Faster trigger for snappy vortex start
  longPressTimer = setTimeout(() => {
    vortexState.value = {
      active: true,
      x,
      y,
      strength: 50, // Higher initial strength for faster start
      maxStrength: 220, // Stronger maximum for dramatic effect
      radius: 280 // Larger vortex range for visible spiral trajectory
    };
  }, 200);  // Faster trigger time - more responsive
};

export const updateLongPress = (x: number, y: number) => {
  // If moved too far, cancel long press
  const dx = x - longPressStartX;
  const dy = y - longPressStartY;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  // Standard movement threshold for long press
  if (distance > 20 && longPressTimer) {
    clearTimeout(longPressTimer);
    longPressTimer = null;
    if (vortexState.value.active) {
      vortexState.value.active = false;
    }
  }
  
  // Update vortex position if active
  if (vortexState.value.active && distance <= 60) {
    vortexState.value.x = x;
    vortexState.value.y = y;
    // Faster strength increase for natural acceleration
    vortexState.value.strength = Math.min(
      vortexState.value.strength + 3.5,  // Faster ramp-up speed
      vortexState.value.maxStrength
    );
  }
};

export const endLongPress = () => {
  if (longPressTimer) {
    clearTimeout(longPressTimer);
    longPressTimer = null;
  }
  
  // Deactivate vortex
  vortexState.value.active = false;
  vortexState.value.strength = 0;
};

export function updatePetals(petals: Petal[], opts: { speedMultiplier: number; isDark: boolean; }) {
  const h = typeof window !== 'undefined' ? window.innerHeight : 1080;
  const w = typeof window !== 'undefined' ? window.innerWidth : 1920;
  pileBaselineY.value = h;
  ensureGrid();

  // Spawn
  const MAX_PETALS = 50;
  const MAX_LANDED = 300;
  const activeCount = petals.filter(p => !p.isLanded).length;
  if (activeCount < MAX_PETALS && Math.random() < 0.05) petals.push(createPetal());

  // Physics
  for (const p of petals) {
    if (p.isDragging) continue;

    if (p.isLanded && !vortexState.value.active) continue;

    // Vortex physics - natural spiral motion
    if (vortexState.value.active) {
      const dx = vortexState.value.x - p.x;
      const dy = vortexState.value.y - p.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < vortexState.value.radius && distance > 5) {
        p.isInVortex = true;
        
        // Wake up landed petals
        if (p.isLanded) {
          p.isLanded = false;
          p.opacity = 1;
        }
        
        // Distance-based influence: closer petals feel stronger pull (remote slow, close fast)
        // Use non-linear falloff (quadratic) to enhance the near/far difference
        const normalizedDistance = distance / vortexState.value.radius;
        const influence = (1 - normalizedDistance) * (1 - normalizedDistance); // Quadratic for more dramatic effect
        const strength = vortexState.value.strength * influence;
        
        // Natural spiral motion
        const angle = Math.atan2(dy, dx);
        
        // Spiral velocity: tangential (circular) + radial (inward)
        // Tangential velocity creates the rotation (faster for dramatic spiral)
        const tangentX = Math.cos(angle + Math.PI / 2) * strength * 0.025;
        const tangentY = Math.sin(angle + Math.PI / 2) * strength * 0.025;
        
        // Radial velocity: stronger pull for near petals, weaker for far
        const radialStrength = Math.max(0.8, strength * 0.012);
        const radialX = (dx / distance) * radialStrength;
        const radialY = (dy / distance) * radialStrength;
        
        // Apply movement
        p.x += tangentX + radialX;
        p.y += tangentY + radialY;
        
        // Smooth rotation following spiral - faster for closer petals
        p.rotation += strength * 0.8;
        
        continue;
      } else {
        p.isInVortex = false;
      }
    } else if (p.isInVortex) {
      // Release from vortex - resume normal physics
      p.isInVortex = false;
    }

    if (p.isLanded) continue;

    p.timeOffset++;
    const sway = Math.sin(p.timeOffset * p.swayFreq) * p.swayAmp;
    p.x += (p.baseSpeedX + sway) * opts.speedMultiplier * 0.5;
    p.y += p.baseSpeedY * opts.speedMultiplier;
    p.rotation += (p.baseSpeedX + sway) * 2;

    // wrap X
    if (p.x > w + 20) p.x = -20;
    if (p.x < -20) p.x = w + 20;

    // landing via grid
    if (p.y > h - p.size) {
      const idx = Math.max(0, Math.min(pileHeights.length - 1, Math.floor(p.x / colWidth.value)));
      const landingY = pileBaselineY.value - pileHeights[idx] - p.size;
      p.y = Math.max(p.y, landingY);
      p.isLanded = true;
      p.rotation = Math.random() * 360;
      pileHeights[idx] += p.size * 0.85;
      smoothColumnHeight(idx);
    }
  }

  // cleanup fallen
  for (let i = petals.length - 1; i >= 0; i--) {
    const p = petals[i];
    if (p.y > h + 100) petals.splice(i, 1);
  }

  // trim landed if too many
  const landed = petals.filter(p => p.isLanded);
  if (landed.length > MAX_LANDED) {
    const over = landed.length - MAX_LANDED;
    for (let i = 0; i < over; i++) {
      const oldest = landed[i];
      const idx = petals.indexOf(oldest);
      if (idx > -1) petals.splice(idx, 1);
    }
  }
}
