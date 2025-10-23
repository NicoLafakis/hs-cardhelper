/**
 * Animation React Hooks
 * Easy integration of animations into components
 */

import { useState, useCallback, useRef, useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import { ANIMATION_PRESETS, SPRING_PRESETS } from '../core/AnimationEngine'

/**
 * useAnimation
 * Apply preset or custom animation to element
 */
export function useAnimation(animationKey, options = {}) {
  const [isAnimating, setIsAnimating] = useState(true)
  const animationRef = useRef(null)

  const animation = animationKey ? ANIMATION_PRESETS[animationKey] : null

  const getFramerMotionProps = useCallback(() => {
    if (!animation) return {}

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
      duration: options.duration || duration || 0.5,
      ease: easing || 'easeInOut',
      ...customTransition
    }

    if (spring || options.useSpring) {
      return {
        initial: options.initial || initial,
        animate: options.animate || animate,
        exit: options.exit || exit,
        transition: spring || SPRING_PRESETS.normal,
        whileHover,
        ref: animationRef
      }
    }

    return {
      initial: options.initial || initial,
      animate: options.animate || animate,
      exit: options.exit || exit,
      transition: baseTransition,
      whileHover,
      ref: animationRef
    }
  }, [animation, options])

  const stop = useCallback(() => {
    setIsAnimating(false)
  }, [])

  const play = useCallback(() => {
    setIsAnimating(true)
  }, [])

  return {
    isAnimating,
    play,
    stop,
    ref: animationRef,
    ...getFramerMotionProps()
  }
}

/**
 * useScrollAnimation
 * Trigger animation on scroll/intersection
 */
export function useScrollAnimation(options = {}) {
  const {
    threshold = 0.2,
    triggerOnce = true,
    parallaxIntensity = 0
  } = options

  const { ref, inView } = useInView({
    threshold,
    triggerOnce
  })

  const [scrollY, setScrollY] = useState(0)
  const [parallaxOffset, setParallaxOffset] = useState(0)

  useEffect(() => {
    if (parallaxIntensity === 0) return

    const handleScroll = () => {
      const newScrollY = window.scrollY
      setScrollY(newScrollY)

      if (ref.current) {
        const elementRect = ref.current.getBoundingClientRect()
        const elementCenter = elementRect.top + elementRect.height / 2
        const windowCenter = window.innerHeight / 2
        const distanceFromCenter = elementCenter - windowCenter

        setParallaxOffset(distanceFromCenter * parallaxIntensity * -0.1)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [parallaxIntensity, ref])

  return {
    ref,
    inView,
    isVisible: inView,
    scrollY,
    parallaxOffset,
    transform: parallaxIntensity > 0 ? `translateY(${parallaxOffset}px)` : undefined
  }
}

/**
 * useHoverAnimation
 * Simplified hover animation
 */
export function useHoverAnimation(animationKey = 'hoverScale') {
  const animation = animationKey ? ANIMATION_PRESETS[animationKey] : null
  const [isHovering, setIsHovering] = useState(false)

  const handleMouseEnter = useCallback(() => {
    setIsHovering(true)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false)
  }, [])

  return {
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    isHovering,
    whileHover: animation?.whileHover,
    transition: animation?.transition || SPRING_PRESETS.normal
  }
}

/**
 * useStaggerAnimation
 * Stagger animations for multiple children
 */
export function useStaggerAnimation(itemCount, staggerDelay = 0.1) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return {
    containerVariants,
    itemVariants,
    getItemDelay: (index) => index * staggerDelay
  }
}

/**
 * useContinuousAnimation
 * Loop animation indefinitely
 */
export function useContinuousAnimation(animationKey) {
  const animation = animationKey ? ANIMATION_PRESETS[animationKey] : null

  if (!animation || animation.category !== 'continuous') {
    return null
  }

  return {
    animate: animation.animate,
    transition: {
      ...animation.transition,
      repeat: Infinity
    }
  }
}

/**
 * useAnimationSequence
 * Play multiple animations in sequence
 */
export function useAnimationSequence(animationKeys = [], options = {}) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(options.autoStart !== false)

  const animations = animationKeys
    .map(key => ANIMATION_PRESETS[key])
    .filter(Boolean)

  const currentAnimation = animations[currentIndex]

  const next = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % animations.length)
  }, [animations.length])

  const reset = useCallback(() => {
    setCurrentIndex(0)
  }, [])

  const toggle = useCallback(() => {
    setIsPlaying((prev) => !prev)
  }, [])

  return {
    currentAnimation,
    currentIndex,
    isPlaying,
    next,
    reset,
    toggle,
    progress: ((currentIndex + 1) / animations.length) * 100
  }
}

/**
 * useAnimationController
 * Full animation control for complex scenarios
 */
export function useAnimationController(config = {}) {
  const [animationState, setAnimationState] = useState({
    isPlaying: config.autoStart !== false,
    isPaused: false,
    iterations: 0,
    startTime: Date.now()
  })

  const animationRef = useRef(null)

  const play = useCallback(() => {
    setAnimationState((prev) => ({
      ...prev,
      isPlaying: true,
      isPaused: false,
      startTime: Date.now()
    }))
  }, [])

  const pause = useCallback(() => {
    setAnimationState((prev) => ({
      ...prev,
      isPlaying: false,
      isPaused: true
    }))
  }, [])

  const stop = useCallback(() => {
    setAnimationState((prev) => ({
      ...prev,
      isPlaying: false,
      isPaused: false,
      iterations: 0
    }))
  }, [])

  const reset = useCallback(() => {
    setAnimationState((prev) => ({
      ...prev,
      iterations: 0,
      startTime: Date.now()
    }))
  }, [])

  const getElapsedTime = useCallback(() => {
    if (!animationState.isPlaying) return 0
    return (Date.now() - animationState.startTime) / 1000
  }, [animationState.isPlaying, animationState.startTime])

  return {
    ...animationState,
    play,
    pause,
    stop,
    reset,
    ref: animationRef,
    getElapsedTime,
    duration: config.duration || 1,
    isComplete: animationState.iterations >= (config.iterations || 1)
  }
}

/**
 * useParallax
 * Easy parallax scrolling
 */
export function useParallax(intensity = 0.5) {
  const elementRef = useRef(null)
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      if (!elementRef.current) return

      const rect = elementRef.current.getBoundingClientRect()
      const scrolled = window.scrollY
      const elementOffset = scrolled + rect.top

      const parallax = (window.scrollY - elementOffset) * intensity

      setOffset(parallax)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [intensity])

  return {
    ref: elementRef,
    style: {
      transform: `translateY(${offset}px)`
    }
  }
}

/**
 * useKeyframeAnimation
 * Create custom keyframe animations
 */
export function useKeyframeAnimation(keyframes, options = {}) {
  const {
    duration = 1,
    iterations = Infinity,
    easing = 'easeInOut',
    delay = 0
  } = options

  const animate = {
    ...keyframes
  }

  const transition = {
    duration,
    repeat: iterations === Infinity ? Infinity : iterations - 1,
    ease: easing,
    delay
  }

  return {
    animate,
    transition
  }
}

/**
 * useTapAnimation
 * Quick tap/click animation feedback
 */
export function useTapAnimation(options = {}) {
  const [isTapped, setIsTapped] = useState(false)

  const handleTap = useCallback(() => {
    setIsTapped(true)
    setTimeout(() => setIsTapped(false), options.duration || 200)
  }, [options.duration])

  return {
    isTapped,
    onTap: handleTap,
    whileTap: options.whileTap || { scale: 0.95 },
    transition: options.transition || { type: 'spring', stiffness: 400, damping: 15 }
  }
}
