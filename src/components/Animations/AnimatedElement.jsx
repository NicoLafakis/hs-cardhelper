/**
 * Animated Element Component
 * Wrapper for applying animations to any element
 */

import React from 'react'
import { motion } from 'framer-motion'
import { ANIMATION_PRESETS } from '../../core/AnimationEngine'

/**
 * AnimatedElement
 * Applies animation presets to children with customizable options
 */
export const AnimatedElement = React.forwardRef(({
  animationKey,
  children,
  onClick,
  className = '',
  style = {},
  disabled = false,
  ...props
}, ref) => {
  const animation = animationKey ? ANIMATION_PRESETS[animationKey] : null

  if (!animation) {
    return (
      <div ref={ref} className={className} style={style} onClick={onClick} {...props}>
        {children}
      </div>
    )
  }

  const getMotionProps = () => {
    const {
      initial,
      animate,
      exit,
      duration,
      easing,
      spring,
      whileHover,
      transition: customTransition
    } = animation

    const baseTransition = {
      duration: duration || 0.5,
      ease: easing || 'easeInOut',
      ...customTransition
    }

    return {
      initial,
      animate,
      exit,
      transition: spring ? spring : baseTransition,
      whileHover: !disabled && whileHover ? whileHover : undefined,
      onClick: !disabled ? onClick : undefined
    }
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={style}
      {...getMotionProps()}
      {...props}
    >
      {children}
    </motion.div>
  )
})

AnimatedElement.displayName = 'AnimatedElement'

/**
 * withAnimation
 * Higher-order component to add animations to any component
 */
export function withAnimation(Component, animationKey) {
  const Wrapped = React.forwardRef((props, ref) => (
    <AnimatedElement ref={ref} animationKey={animationKey}>
      <Component {...props} />
    </AnimatedElement>
  ))
  Wrapped.displayName = `withAnimation(${Component.displayName || Component.name || 'Component'})`
  return Wrapped
}

/**
 * useAnimatedChildren
 * Apply staggered animations to multiple children
 */
export function createStaggeredAnimationProps(childCount, staggerDelay = 0.1) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.1
      }
    }
  }

  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100
      }
    }
  }

  return { containerVariants, childVariants }
}

/**
 * AnimatedList
 * Component for animated lists with staggered children
 */
export const AnimatedList = React.forwardRef(({
  items = [],
  renderItem,
  staggerDelay = 0.1,
  className = '',
  listClassName = '',
  itemClassName = '',
  ...props
}, ref) => {
  const { containerVariants, childVariants } = createStaggeredAnimationProps(items.length, staggerDelay)

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      {...props}
    >
      <div className={listClassName}>
        {items.map((item, index) => (
          <motion.div
            key={item.id || index}
            className={itemClassName}
            variants={childVariants}
          >
            {renderItem(item, index)}
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
})

AnimatedList.displayName = 'AnimatedList'

/**
 * AnimatedGrid
 * Component for animated grids with staggered children
 */
export const AnimatedGrid = React.forwardRef(({
  items = [],
  renderItem,
  columns = 3,
  staggerDelay = 0.1,
  gap = 16,
  className = '',
  itemClassName = '',
  ...props
}, ref) => {
  const { containerVariants, childVariants } = createStaggeredAnimationProps(items.length, staggerDelay)

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fill, minmax(${100 / columns}%, 1fr))`,
        gap: `${gap}px`
      }}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      {...props}
    >
      {items.map((item, index) => (
        <motion.div
          key={item.id || index}
          className={itemClassName}
          variants={childVariants}
        >
          {renderItem(item, index)}
        </motion.div>
      ))}
    </motion.div>
  )
})

AnimatedGrid.displayName = 'AnimatedGrid'

/**
 * PulseAnimation
 * Pulsing attention-drawing component
 */
export const PulseAnimation = React.forwardRef(({
  children,
  color = '#667eea',
  intensity = 1,
  speed = 1,
  className = '',
  ...props
}, ref) => {
  return (
    <motion.div
      ref={ref}
      className={className}
      animate={{
        boxShadow: [
          `0 0 0 0 ${color}`,
          `0 0 0 ${10 * intensity}px ${color}33`,
          `0 0 0 ${20 * intensity}px ${color}00`
        ]
      }}
      transition={{
        duration: 2 / speed,
        repeat: Infinity,
        ease: 'easeOut'
      }}
      {...props}
    >
      {children}
    </motion.div>
  )
})

PulseAnimation.displayName = 'PulseAnimation'

/**
 * FloatingAnimation
 * Smooth floating effect
 */
export const FloatingAnimation = React.forwardRef(({
  children,
  distance = 10,
  duration = 3,
  delay = 0,
  className = '',
  ...props
}, ref) => {
  return (
    <motion.div
      ref={ref}
      className={className}
      animate={{
        y: [-distance, distance, -distance]
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
        delay
      }}
      {...props}
    >
      {children}
    </motion.div>
  )
})

FloatingAnimation.displayName = 'FloatingAnimation'

/**
 * ShimmerAnimation
 * Loading shimmer effect
 */
export const ShimmerAnimation = React.forwardRef(({
  children,
  duration = 2,
  className = '',
  ...props
}, ref) => {
  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        backgroundSize: '200% 200%',
        backgroundImage: 'linear-gradient(90deg, #f0f0f0 0%, #e8e8e8 50%, #f0f0f0 100%)'
      }}
      animate={{
        backgroundPosition: ['200% 0%', '-200% 0%']
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'linear'
      }}
      {...props}
    >
      {children}
    </motion.div>
  )
})

ShimmerAnimation.displayName = 'ShimmerAnimation'
