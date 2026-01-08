# Animation & Interaction Library

## Overview

The Animation & Interaction Library transforms static UIs into living, breathing experiences. With 20+ production-ready animation presets, smooth scroll effects, parallax scrolling, and a visual animation builder, creating professional animations is now a 30-second drag-and-drop process instead of hours of CSS work.

## Architecture

```
┌────────────────────────────────────────────────────────┐
│              React Components                           │
│  AnimationBuilder, AnimatedElement, AnimatedList       │
└────────────┬─────────────────────────────────────────┘
             │
             ▼
┌────────────────────────────────────────────────────────┐
│              React Hooks                                │
│  useAnimation, useScrollAnimation, useHoverAnimation   │
│  useStaggerAnimation, useAnimationController           │
└────────────┬─────────────────────────────────────────┘
             │
             ▼
┌────────────────────────────────────────────────────────┐
│              Animation Engine                           │
│  ANIMATION_PRESETS (20+ presets)                       │
│  SPRING_PRESETS, EASING, createScrollTrigger           │
└────────────────────────────────────────────────────────┘
             │
             ▼
┌────────────────────────────────────────────────────────┐
│              Framer Motion                              │
│  GPU-accelerated animations, will-change optimization  │
└────────────────────────────────────────────────────────┘
```

## Animation Presets (20+)

### Entrance Animations (8)
Triggered when elements appear in the DOM.

```javascript
// Fade in
fadeIn: { opacity: 0 → 1 }

// Slide from directions
slideInLeft, slideInRight, slideInUp, slideInDown
{ opacity: 0, offset → opacity: 1, 0 }

// Zoom and Rotate
zoomIn: { scale: 0.8 → 1 }
rotateIn: { rotate: -45 → 0 }

// Bounce
bounceIn: { scale: 0.3 → 1 } (with spring)
```

### Hover Animations (4)
Interactive feedback on user hover.

```javascript
hoverScale: scale 1 → 1.05
hoverLift: y: 0 → -8px + shadow
hoverGlow: boxShadow glow effect
hoverRotate: rotate: 0 → 5°
```

### Scroll Animations (5)
Triggered by scroll position and intersection.

```javascript
parallaxLight: 0.3x intensity
parallaxMedium: 0.6x intensity
parallaxStrong: 1.0x intensity
fadeOnScroll: fade as you scroll
slideOnScroll: slide as you scroll
```

### Exit Animations (3)
When elements are removed.

```javascript
fadeOut: opacity 1 → 0
slideOutLeft, slideOutRight
```

### Continuous Animations (4)
Infinite loops for attention-drawing.

```javascript
pulse: opacity oscillation
swing: rotation back and forth
float: y-axis floating motion
shimmer: loading shimmer effect
```

## React Hooks

### useAnimation
Apply preset animation with full control.

```javascript
const {
  isAnimating,
  play,
  stop,
  ref,
  initial,
  animate,
  exit,
  transition,
  whileHover
} = useAnimation('slideInUp', { duration: 0.6 })

return <motion.div {...animationProps}>{children}</motion.div>
```

### useScrollAnimation
Trigger animations on scroll with parallax.

```javascript
const {
  ref,
  inView,
  isVisible,
  scrollY,
  parallaxOffset,
  transform
} = useScrollAnimation({
  threshold: 0.2,
  parallaxIntensity: 0.5,
  triggerOnce: true
})

return <div ref={ref} style={{ transform }}>{content}</div>
```

### useHoverAnimation
Simplified hover animations.

```javascript
const {
  onMouseEnter,
  onMouseLeave,
  isHovering,
  whileHover,
  transition
} = useHoverAnimation('hoverScale')

return (
  <motion.div {...{onMouseEnter, onMouseLeave, whileHover, transition}}>
    {children}
  </motion.div>
)
```

### useStaggerAnimation
Coordinated animations for multiple children.

```javascript
const {
  containerVariants,
  itemVariants,
  getItemDelay
} = useStaggerAnimation(itemCount, staggerDelay)

// Wrap container with containerVariants
// Wrap children with itemVariants
```

### useContinuousAnimation
Infinite looping animations.

```javascript
const {
  animate,
  transition
} = useContinuousAnimation('float')

return <motion.div animate={animate} transition={transition}>{content}</motion.div>
```

### useAnimationSequence
Play multiple animations in sequence.

```javascript
const {
  currentAnimation,
  currentIndex,
  isPlaying,
  next,
  reset,
  toggle,
  progress
} = useAnimationSequence(['slideInUp', 'fadeOut'])
```

### useAnimationController
Full animation control with timing.

```javascript
const {
  isPlaying,
  isPaused,
  iterations,
  play,
  pause,
  stop,
  reset,
  getElapsedTime,
  isComplete
} = useAnimationController({ duration: 2, iterations: 1 })
```

### useParallax
Easy parallax scrolling.

```javascript
const {
  ref,
  style
} = useParallax(0.5) // intensity

return <div ref={ref} style={style}>{content}</div>
```

### useTapAnimation
Quick tap/click feedback.

```javascript
const {
  isTapped,
  onTap,
  whileTap,
  transition
} = useTapAnimation()

return (
  <motion.button
    onTap={onTap}
    whileTap={whileTap}
    transition={transition}
  >
    Click Me
  </motion.button>
)
```

## Components

### AnimationBuilder
Visual animation editor interface.

```javascript
<AnimationBuilder
  onAnimationSelect={(animation) => {
    // { key: 'slideInUp', config: {...} }
  }}
  onClose={() => setShowBuilder(false)}
/>
```

**Features:**
- 5 animation category tabs
- Thumbnail preview grid
- Real-time animation preview
- Duration and delay controls
- Apply/cancel buttons

### AnimatedElement
Wrapper to apply animations to any element.

```javascript
<AnimatedElement
  animationKey="slideInUp"
  onClick={handleClick}
  className="my-element"
>
  Animated Content
</AnimatedElement>
```

### AnimatedList
List with staggered item animations.

```javascript
<AnimatedList
  items={items}
  renderItem={(item) => <div>{item.name}</div>}
  staggerDelay={0.1}
  itemClassName="list-item"
/>
```

### AnimatedGrid
Grid with staggered item animations.

```javascript
<AnimatedGrid
  items={items}
  renderItem={(item) => <Card>{item}</Card>}
  columns={3}
  gap={16}
  staggerDelay={0.08}
/>
```

### PulseAnimation
Pulsing attention effect.

```javascript
<PulseAnimation color="#667eea" intensity={1} speed={1}>
  <Badge>New</Badge>
</PulseAnimation>
```

### FloatingAnimation
Smooth floating effect.

```javascript
<FloatingAnimation distance={10} duration={3}>
  <div>Floating Content</div>
</FloatingAnimation>
```

### ShimmerAnimation
Loading shimmer effect.

```javascript
<ShimmerAnimation duration={2}>
  <Skeleton height={40} />
</ShimmerAnimation>
```

## Animation Presets Reference

### Entrance Animations

```javascript
{
  fadeIn: { duration: 0.5, easing: 'easeInOut' },
  slideInLeft: { duration: 0.6, easing: 'easeOut' },
  slideInRight: { duration: 0.6, easing: 'easeOut' },
  slideInUp: { duration: 0.6, easing: 'easeOut' },
  slideInDown: { duration: 0.6, easing: 'easeOut' },
  zoomIn: { duration: 0.5, easing: 'easeOut' },
  bounceIn: { duration: 0.7, spring: { damping: 8, stiffness: 100 } },
  rotateIn: { duration: 0.6, easing: 'easeOut' }
}
```

### Hover Animations

```javascript
{
  hoverScale: { scale: 1.05, spring: { stiffness: 400, damping: 10 } },
  hoverLift: { y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.2)' },
  hoverGlow: { boxShadow: '0 0 20px rgba(102, 126, 234, 0.6)' },
  hoverRotate: { rotate: 5, spring: { stiffness: 400, damping: 10 } }
}
```

### Continuous Animations

```javascript
{
  pulse: { repeat: Infinity, duration: 2 },
  swing: { repeat: Infinity, duration: 1, rotate: [0, 5, -5, 0] },
  float: { repeat: Infinity, duration: 3, y: [-10, 10, -10] },
  shimmer: { repeat: Infinity, duration: 2 }
}
```

## Usage Examples

### Example 1: Hero Section with Entrance Animation
```javascript
import { AnimatedElement } from '../components/Animations'

export function HeroSection() {
  return (
    <div>
      <AnimatedElement animationKey="slideInUp" style={{ delay: 0.2 }}>
        <h1>Welcome</h1>
      </AnimatedElement>
      <AnimatedElement animationKey="slideInUp" style={{ delay: 0.4 }}>
        <p>Powerful animations made simple</p>
      </AnimatedElement>
    </div>
  )
}
```

### Example 2: Animated Product Grid
```javascript
import { AnimatedGrid } from '../components/Animations'

export function ProductGrid({ products }) {
  return (
    <AnimatedGrid
      items={products}
      renderItem={(product) => (
        <ProductCard product={product} />
      )}
      columns={3}
      staggerDelay={0.1}
    />
  )
}
```

### Example 3: Interactive Cards with Hover
```javascript
import { useHoverAnimation } from '../hooks/useAnimation'
import { motion } from 'framer-motion'

export function Card() {
  const hoverProps = useHoverAnimation('hoverLift')
  
  return (
    <motion.div {...hoverProps}>
      <h3>Hover Me</h3>
    </motion.div>
  )
}
```

### Example 4: Parallax Scrolling Section
```javascript
import { useScrollAnimation } from '../hooks/useAnimation'

export function ScrollSection() {
  const { ref, transform } = useScrollAnimation({
    parallaxIntensity: 0.3
  })
  
  return (
    <div ref={ref} style={{ transform }}>
      <img src="background.jpg" alt="" />
    </div>
  )
}
```

### Example 5: Attention-Drawing Badge
```javascript
import { PulseAnimation } from '../components/Animations'

export function NotificationBadge() {
  return (
    <PulseAnimation color="#ff6b6b" intensity={1.5}>
      <span className="badge">3 New Messages</span>
    </PulseAnimation>
  )
}
```

### Example 6: Staggered List
```javascript
import { useStaggerAnimation } from '../hooks/useAnimation'
import { motion } from 'framer-motion'

export function TodoList({ todos }) {
  const { containerVariants, itemVariants } = useStaggerAnimation(todos.length, 0.1)
  
  return (
    <motion.ul variants={containerVariants} initial="hidden" animate="visible">
      {todos.map((todo) => (
        <motion.li key={todo.id} variants={itemVariants}>
          {todo.title}
        </motion.li>
      ))}
    </motion.ul>
  )
}
```

## Performance Tips

1. **Use `will-change` CSS** - Framer Motion handles this automatically
2. **Prefer transform/opacity** - Fastest animations (GPU-accelerated)
3. **Avoid animating layout** - Use `layoutId` sparingly
4. **Batch animations** - Use stagger for coordinated timing
5. **Preload animations** - Animations defined at top level
6. **Disable on low-end devices** - Use `prefers-reduced-motion` media query

## Accessibility

The library respects user preferences:

```javascript
// Automatically respects prefers-reduced-motion
// Users with motion sensitivity see static UI instead
@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
  }
}
```

## Browser Support

- Chrome 75+
- Firefox 63+
- Safari 13.1+
- Edge 79+

## Best Practices

1. **Don't over-animate** - 2-3 animations per element max
2. **Keep durations short** - 0.3-0.8s for most interactions
3. **Use consistent easing** - Stick to 1-2 easing functions
4. **Purpose over pizzazz** - Animations should enhance UX
5. **Test on low-end devices** - Performance matters
6. **Group related animations** - Stagger related elements
7. **Document animation intentions** - Future-proof your work

## Migration from Manual CSS Animations

**Before (CSS):**
```css
@keyframes slideIn {
  from { opacity: 0; transform: translateX(-100px); }
  to { opacity: 1; transform: translateX(0); }
}
.element {
  animation: slideIn 0.6s ease-out;
}
```

**After (Animation Library):**
```javascript
<AnimatedElement animationKey="slideInLeft">
  <div>Content</div>
</AnimatedElement>
```

## Limitations & Workarounds

**Limitation:** Can't animate CSS Grid/Flex layout changes  
**Workaround:** Use `position: absolute` or move animation to parent

**Limitation:** Performance degrades with 100+ animated elements  
**Workaround:** Use `virtualization` or batch animations

**Limitation:** Mobile phones may struggle with complex animations  
**Workaround:** Detect device and reduce animation count

## Future Enhancements

- [ ] Gesture-based animations (swipe, pinch)
- [ ] Shared layout animations between routes
- [ ] Advanced timeline/keyframe editor
- [ ] Physics-based animations (gravity, friction)
- [ ] Motion paths and SVG animations
- [ ] Orchestrated multi-step animations
- [ ] Analytics on animation engagement
