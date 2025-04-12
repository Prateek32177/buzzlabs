"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface AnimatedLogoProps {
  loading?: boolean
  onComplete?: () => void
  size?: "sm" | "md" | "lg"
  showText?: boolean
  className?: string
}

export default function AnimatedLogo({ 
  loading = false, 
  onComplete, 
  size = "md",
  showText = true,
  className = ""
}: AnimatedLogoProps) {
  const [textVisible, setTextVisible] = useState(false)
  const [animationComplete, setAnimationComplete] = useState(false)
  const animationStarted = useRef(false)

  // Reset animation state when loading changes
  useEffect(() => {
    if (loading) {
      setTextVisible(false)
      setAnimationComplete(false)
      animationStarted.current = true
    } else if (!loading && !animationStarted.current) {
      animationStarted.current = true
    }
  }, [loading])

  // Handle animation completion
  useEffect(() => {
    if (!loading && animationComplete) {
      const timer = setTimeout(() => {
        setTextVisible(true)
        if (onComplete) onComplete()
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [loading, animationComplete, onComplete])

  // Size configurations
  const sizeConfig = {
    sm: { width: 150, height: 150, viewBox: "0 0 300 400", textSize: "text-xl" },
    md: { width: 300, height: 300, viewBox: "0 0 300 400", textSize: "text-4xl" },
    lg: { width: 450, height: 450, viewBox: "0 0 300 400", textSize: "text-6xl" }
  }

  const currentSize = sizeConfig[size]

  // Animation variants for the dots
  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2,
      },
    },
    loading: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    }
  }

  const dotVariants = {
    initial: {
      opacity: 0,
      scale: 0,
      y: 10,
    },
    animate: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
      },
    },
  }

  // Enhanced infinite animation for loading state
  const loadingDotVariants = {
    initial: {
      opacity: 0,
      scale: 0,
    },
    animate: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
      },
    },
    loading: {
      y: [0, -8, 0],
      scale: [1, 1.1, 1],
      transition: {
        duration: 1.5,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse" as const,
        // Slightly offset each dot's animation
        repeatDelay: Math.random() * 0.2,
      },
    },
  }

  // Enhanced special animation for the white dot
  const whiteDotVariants = {
    initial: {
      opacity: 0,
      scale: 0,
    },
    animate: {
      opacity: 1,
      scale: [0, 1.5, 1],
      transition: {
        delay: 1.5,
        duration: 0.8,
        times: [0, 0.6, 1],
        onComplete: () => setAnimationComplete(true),
      },
    },
    loading: {
      opacity: 1,
      scale: [1, 1.3, 1],
      filter: [
        "drop-shadow(0 0 2px rgba(255,255,255,0.5))",
        "drop-shadow(0 0 10px rgba(255,255,255,0.8))",
        "drop-shadow(0 0 2px rgba(255,255,255,0.5))",
      ],
      transition: {
        duration: 2,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse" as const,
      },
    },
  }

  // Enhanced text animation
  const textVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  }

  // Create staggered loading animations for each dot
  const getLoadingDelay = (index: number) => {
    return index * 0.1
  }

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="relative">
        <motion.svg
          width={currentSize.width}
          height={currentSize.height}
          viewBox={currentSize.viewBox}
          xmlns="http://www.w3.org/2000/svg"
          initial="initial"
          animate={loading ? "loading" : "animate"}
          variants={containerVariants}
        >
          {/* Column 1 */}
          <motion.circle
            cx="75"
            cy="75"
            r="30"
            fill="#A692E5"
            variants={loading ? loadingDotVariants : dotVariants}
            custom={0}
            transition={loading ? { delay: getLoadingDelay(0) } : undefined}
          />
          <motion.circle
            cx="75"
            cy="175"
            r="30"
            fill="#A692E5"
            variants={loading ? loadingDotVariants : dotVariants}
            custom={1}
            transition={loading ? { delay: getLoadingDelay(1) } : undefined}
          />
          <motion.circle
            cx="75"
            cy="275"
            r="30"
            fill="#A692E5"
            variants={loading ? loadingDotVariants : dotVariants}
            custom={2}
            transition={loading ? { delay: getLoadingDelay(2) } : undefined}
          />

          {/* Column 2 */}
          <motion.circle
            cx="150"
            cy="75"
            r="30"
            fill="#A692E5"
            variants={loading ? loadingDotVariants : dotVariants}
            custom={3}
            transition={loading ? { delay: getLoadingDelay(3) } : undefined}
          />
          <motion.circle
            cx="150"
            cy="175"
            r="30"
            fill="#A692E5"
            variants={loading ? loadingDotVariants : dotVariants}
            custom={4}
            transition={loading ? { delay: getLoadingDelay(4) } : undefined}
          />
          <motion.circle
            cx="150"
            cy="275"
            r="30"
            fill="#fff"
            variants={whiteDotVariants}
            style={{
              filter: "drop-shadow(0 0 5px rgba(255,255,255,0.7))",
            }}
            transition={loading ? { delay: getLoadingDelay(5) } : undefined}
          />

          {/* Column 3 */}
          <motion.circle
            cx="225"
            cy="75"
            r="30"
            fill="#A692E5"
            variants={loading ? loadingDotVariants : dotVariants}
            custom={6}
            transition={loading ? { delay: getLoadingDelay(6) } : undefined}
          />
          <motion.circle
            cx="225"
            cy="175"
            r="30"
            fill="#A692E5"
            variants={loading ? loadingDotVariants : dotVariants}
            custom={7}
            transition={loading ? { delay: getLoadingDelay(7) } : undefined}
          />
          <motion.circle
            cx="225"
            cy="275"
            r="30"
            fill="#A692E5"
            variants={loading ? loadingDotVariants : dotVariants}
            custom={8}
            transition={loading ? { delay: getLoadingDelay(8) } : undefined}
          />
        </motion.svg>

        <AnimatePresence>
          {textVisible && showText && !loading && (
            <motion.div
              className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-16 ${currentSize.textSize}`}
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={textVariants}
            >
              <h1 className="font-bold text-[#A692E5]">hookflo</h1>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
