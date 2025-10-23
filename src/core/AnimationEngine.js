/**
 * Animation Engine
 * Core animation definitions, presets, and utility functions
 */

/**
 * Animation Presets - Ready-to-use animation configurations
 */
export const ANIMATION_PRESETS = {
  // Entrance Animations
  fadeIn: {
    name: 'Fade In',
    category: 'entrance',
    duration: 0.5,
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    easing: 'easeInOut'
  },

  slideInLeft: {
    name: 'Slide In Left',
    category: 'entrance',
    duration: 0.6,
    initial: { opacity: 0, x: -100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 },
    easing: 'easeOut'
  },

  slideInRight: {
    name: 'Slide In Right',
    category: 'entrance',
    duration: 0.6,
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 100 },
    easing: 'easeOut'
  },

  slideInUp: {
    name: 'Slide In Up',
    category: 'entrance',
    duration: 0.6,
    initial: { opacity: 0, y: 100 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 100 },
    easing: 'easeOut'
  },

  slideInDown: {
    name: 'Slide In Down',
    category: 'entrance',
    duration: 0.6,
    initial: { opacity: 0, y: -100 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -100 },
    easing: 'easeOut'
  },

  zoomIn: {
    name: 'Zoom In',
    category: 'entrance',
    duration: 0.5,
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
    easing: 'easeOut'
  },

  bounceIn: {
    name: 'Bounce In',
    category: 'entrance',
    duration: 0.7,
    initial: { opacity: 0, scale: 0.3 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.3 },
    easing: 'easeOut',
    spring: { type: 'spring', damping: 8, stiffness: 100 }
  },

  rotateIn: {
    name: 'Rotate In',
    category: 'entrance',
    duration: 0.6,
    initial: { opacity: 0, rotate: -45 },
    animate: { opacity: 1, rotate: 0 },
    exit: { opacity: 0, rotate: -45 },
    easing: 'easeOut'
  },

  // Hover Animations
  hoverScale: {
    name: 'Hover Scale',
    category: 'hover',
    duration: 0.3,
    whileHover: { scale: 1.05 },
    transition: { type: 'spring', stiffness: 400, damping: 10 }
  },

  hoverLift: {
    name: 'Hover Lift',
    category: 'hover',
    duration: 0.3,
    whileHover: { y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.2)' },
    transition: { type: 'spring', stiffness: 400, damping: 10 }
  },

  hoverGlow: {
    name: 'Hover Glow',
    category: 'hover',
    duration: 0.3,
    whileHover: { boxShadow: '0 0 20px rgba(102, 126, 234, 0.6)' },
    transition: { duration: 0.3 }
  },

  hoverRotate: {
    name: 'Hover Rotate',
    category: 'hover',
    duration: 0.3,
    whileHover: { rotate: 5 },
    transition: { type: 'spring', stiffness: 400, damping: 10 }
  },

  // Scroll Animations
  parallaxLight: {
    name: 'Parallax Light',
    category: 'scroll',
    parallaxIntensity: 0.3,
    description: 'Subtle parallax effect'
  },

  parallaxMedium: {
    name: 'Parallax Medium',
    category: 'scroll',
    parallaxIntensity: 0.6,
    description: 'Medium parallax effect'
  },

  parallaxStrong: {
    name: 'Parallax Strong',
    category: 'scroll',
    parallaxIntensity: 1.0,
    description: 'Strong parallax effect'
  },

  fadeOnScroll: {
    name: 'Fade On Scroll',
    category: 'scroll',
    useScroll: true,
    triggerType: 'onEnter',
    duration: 0.6
  },

  slideOnScroll: {
    name: 'Slide On Scroll',
    category: 'scroll',
    useScroll: true,
    triggerType: 'onEnter',
    duration: 0.7
  },

  // Exit Animations
  fadeOut: {
    name: 'Fade Out',
    category: 'exit',
    duration: 0.5,
    animate: { opacity: 0 },
    easing: 'easeInOut'
  },

  slideOutLeft: {
    name: 'Slide Out Left',
    category: 'exit',
    duration: 0.6,
    animate: { opacity: 0, x: -100 },
    easing: 'easeIn'
  },

  slideOutRight: {
    name: 'Slide Out Right',
    category: 'exit',
    duration: 0.6,
    animate: { opacity: 0, x: 100 },
    easing: 'easeIn'
  },

  // Continuous Animations
  pulse: {
    name: 'Pulse',
    category: 'continuous',
    duration: 2,
    animate: { opacity: [1, 0.5, 1] },
    transition: { repeat: Infinity, duration: 2 }
  },

  swing: {
    name: 'Swing',
    category: 'continuous',
    duration: 1,
    animate: { rotate: [0, 5, -5, 0] },
    transition: { repeat: Infinity, duration: 1 }
  },

  float: {
    name: 'Float',
    category: 'continuous',
    duration: 3,
    animate: { y: [-10, 10, -10] },
    transition: { repeat: Infinity, duration: 3 }
  },

  shimmer: {
    name: 'Shimmer',
    category: 'continuous',
    duration: 2,
    animate: { backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] },
    transition: { repeat: Infinity, duration: 2 }
  }
}

/**
 * Get animations by category
 */
export function getAnimationsByCategory(category) {
  return Object.entries(ANIMATION_PRESETS)
    .filter(([, config]) => config.category === category)
    .map(([key, config]) => ({ key, ...config }))
}

/**
 * Create custom animation config
 */
export function createCustomAnimation(config) {
  return {
    id: `anim_${Date.now()}`,
    ...config,
    isCustom: true
  }
}

/**
 * Easing Functions
 */
export const EASING = {
  linear: 'linear',
  easeIn: 'easeIn',
  easeOut: 'easeOut',
  easeInOut: 'easeInOut',
  circIn: 'circIn',
  circOut: 'circOut',
  circInOut: 'circInOut',
  backIn: 'backIn',
  backOut: 'backOut',
  backInOut: 'backInOut',
  elasticIn: 'elasticIn',
  elasticOut: 'elasticOut',
  elasticInOut: 'elasticInOut'
}

/**
 * Spring Physics Presets
 */
export const SPRING_PRESETS = {
  gentle: { type: 'spring', damping: 15, stiffness: 100 },
  normal: { type: 'spring', damping: 10, stiffness: 150 },
  wobbly: { type: 'spring', damping: 5, stiffness: 200 },
  stiff: { type: 'spring', damping: 20, stiffness: 300 }
}

/**
 * Delay Presets
 */
export const DELAY_PRESETS = {
  none: 0,
  tiny: 0.05,
  small: 0.1,
  medium: 0.2,
  large: 0.4,
  xl: 0.6
}

/**
 * Stagger Children
 */
export function createStaggerContainer(staggerDelay = 0.1) {
  return {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0
      }
    }
  }
}

/**
 * Stagger Item
 */
export function createStaggerItem() {
  return {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }
}

/**
 * Get animation by key
 */
export function getAnimation(key) {
  return ANIMATION_PRESETS[key] || null
}

/**
 * Combine animations
 */
export function combineAnimations(animKey1, animKey2) {
  const anim1 = ANIMATION_PRESETS[animKey1]
  const anim2 = ANIMATION_PRESETS[animKey2]

  if (!anim1 || !anim2) return null

  return {
    ...anim1,
    initial: { ...anim1.initial, ...anim2.initial },
    animate: { ...anim1.animate, ...anim2.animate },
    exit: { ...anim1.exit, ...anim2.exit }
  }
}

/**
 * Create scroll animation trigger
 */
export function createScrollTrigger(options = {}) {
  return {
    triggerType: options.triggerType || 'onEnter', // 'onEnter', 'inView', 'onScroll'
    threshold: options.threshold || 0.2,
    margin: options.margin || '0px 0px -100px 0px',
    once: options.once !== false, // Animate only once
    parallaxIntensity: options.parallaxIntensity || 0
  }
}

/**
 * Animation state manager
 */
export class AnimationState {
  constructor() {
    this.animations = new Map()
    this.active = new Set()
  }

  register(elementId, animation) {
    this.animations.set(elementId, animation)
  }

  activate(elementId) {
    this.active.add(elementId)
  }

  deactivate(elementId) {
    this.active.delete(elementId)
  }

  isActive(elementId) {
    return this.active.has(elementId)
  }

  get(elementId) {
    return this.animations.get(elementId)
  }

  clear() {
    this.animations.clear()
    this.active.clear()
  }
}
