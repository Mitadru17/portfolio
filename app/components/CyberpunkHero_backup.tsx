'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, useAnimation, useMotionValue, useTransform, useSpring } from 'framer-motion'
import Link from 'next/link'
import { useInView } from 'react-intersection-observer'

export default function CyberpunkHero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [ref, inView] = useInView({ triggerOnce: false })
  const controls = useAnimation()
  const circleControls = useAnimation()
  const [mouseDistance, setMouseDistance] = useState(0)
  const [time, setTime] = useState(Date.now())
  
  // For parallax effect on circle
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  
  // Transform mouse movement to subtle movement
  const rotateX = useTransform(y, [-500, 500], [10, -10])
  const rotateY = useTransform(x, [-500, 500], [-10, 10])
  
  // Spring physics for smooth movement
  const springConfig = { damping: 50, stiffness: 200 }
  const springX = useSpring(rotateX, springConfig)
  const springY = useSpring(rotateY, springConfig)

  // For glitching effect
  const [glitchActive, setGlitchActive] = useState(false)
  
  // Update time for animations
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(Date.now())
    }, 50) // Update roughly every 50ms for smooth animation
    
    return () => clearInterval(interval)
  }, [])
  
  useEffect(() => {
    // Trigger a glitch effect every 5 seconds
    const glitchInterval = setInterval(() => {
      setGlitchActive(true)
      setTimeout(() => setGlitchActive(false), 200)
    }, 5000)
    
    const handleMouseMove = (e: React.MouseEvent<Element, MouseEvent> | MouseEvent) => {
      const { clientX, clientY } = e
      const centerX = window.innerWidth / 2
      const centerY = window.innerHeight / 2
      
      // Calculate distance from center
      const distX = clientX - centerX
      const distY = clientY - centerY
      
      // Calculate normalized distance from mouse to center
      const distance = Math.sqrt(distX * distX + distY * distY)
      const maxDistance = Math.sqrt(window.innerWidth * window.innerWidth / 4 + window.innerHeight * window.innerHeight / 4)
      const normalizedDistance = Math.min(distance / maxDistance, 1)
      setMouseDistance(1 - normalizedDistance) // Invert so closer = higher value
      
      setMousePosition({ 
        x: (clientX - centerX) / 20, 
        y: (clientY - centerY) / 20 
      })
      
      x.set(clientX - centerX)
      y.set(clientY - centerY)
    }
    
    if (inView) {
      controls.start({ opacity: 1, scale: 1, transition: { duration: 0.8 } })
      circleControls.start({ 
        opacity: 1, 
        scale: 1, 
        transition: { 
          duration: 1.2, 
          ease: "easeOut"
        } 
      })
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      clearInterval(glitchInterval)
    }
  }, [controls, circleControls, inView, x, y])

  return (
    <section 
      id="home" 
      className="relative h-screen w-full overflow-hidden bg-black"
      ref={ref}
    >
      {/* Main container with center design */}
      <div className="h-full w-full flex flex-col justify-center items-center relative">
        {/* Name on right side with glitch effect */}
        <motion.div 
          className="absolute top-8 right-8 z-10 text-right cursor-pointer select-none"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          whileHover={{ scale: 1.05 }}
        >
          {/* NAME CONTAINER WITH ENHANCED CYBERPUNK STYLING */}
          <div className="relative group">
            {/* Animated digital noise background */}
            <motion.div 
              className="absolute -inset-2 bg-primary/5 rounded-sm blur-sm"
              animate={{ 
                opacity: [0.3, 0.5, 0.3],
                background: [
                  "radial-gradient(circle, rgba(255,41,87,0.1) 0%, rgba(0,0,0,0) 70%)",
                  "radial-gradient(circle, rgba(255,41,87,0.2) 0%, rgba(0,0,0,0) 70%)",
                  "radial-gradient(circle, rgba(255,41,87,0.1) 0%, rgba(0,0,0,0) 70%)"
                ]
              }}
              transition={{ duration: 4, repeat: Infinity, repeatType: "reverse" }}
            />
            
            {/* MITADRU with enhanced effects */}
            <motion.h1 
              className="font-mono text-3xl sm:text-4xl text-primary tracking-widest relative mb-2 overflow-hidden"
              animate={{ color: glitchActive ? "#08f7fe" : "#ff2957" }}
              transition={{ duration: 0.1 }}
            >
              <span className="relative inline-block">
                {/* Split letters for individual animations */}
                {["M", "I", "T", "A", "D", "R", "U"].map((letter, index) => (
                  <motion.span
                    key={index}
                    className="inline-block relative"
                    animate={{ 
                      y: glitchActive ? Math.random() * 6 - 3 : 0,
                      x: glitchActive ? Math.random() * 4 - 2 : 0,
                      color: glitchActive && Math.random() > 0.7 ? "#08f7fe" : "#ff2957",
                      textShadow: glitchActive ? "0 0 8px rgba(255,41,87,0.8)" : "0 0 5px rgba(255,41,87,0.5)",
                      opacity: 1
                    }}
                    whileHover={{ 
                      y: -5, 
                      scale: 1.2,
                      color: "#08f7fe",
                      transition: { duration: 0.1 } 
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    transition={{ 
                      duration: 0.3, 
                      delay: 0.1 * index,
                      opacity: { duration: 0.3 },
                      y: { type: "spring", stiffness: 100 }
                    }}
                  >
                    {letter}
                  </motion.span>
                ))}
                <motion.div 
                  className="absolute -bottom-1 left-0 h-[2px] bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1, delay: 1 }}
                />
              </span>
              
              {/* Secondary layers for cyberpunk effect */}
              <div className={`absolute inset-0 text-[#08f7fe] ${glitchActive ? 'left-[2px] top-[2px]' : 'left-0'} opacity-70 pointer-events-none`}>MITADRU</div>
              <div className={`absolute inset-0 text-primary ${glitchActive ? 'left-[-2px] top-[-1px]' : 'left-0'} opacity-80 pointer-events-none`}>MITADRU</div>
            </motion.h1>
            
            {/* ROY with enhanced effects */}
            <motion.h1 
              className="font-mono text-3xl sm:text-4xl text-primary tracking-widest relative overflow-hidden"
              animate={{ color: glitchActive ? "#08f7fe" : "#ff2957" }}
              transition={{ duration: 0.1 }}
            >
              <span className="relative inline-block">
                {/* Split letters for individual animations */}
                {["R", "O", "Y"].map((letter, index) => (
                  <motion.span
                    key={index}
                    className="inline-block relative"
                    animate={{ 
                      y: glitchActive ? Math.random() * 6 - 3 : 0,
                      x: glitchActive ? Math.random() * 4 - 2 : 0,
                      color: glitchActive && Math.random() > 0.7 ? "#08f7fe" : "#ff2957",
                      textShadow: glitchActive ? "0 0 8px rgba(255,41,87,0.8)" : "0 0 5px rgba(255,41,87,0.5)",
                      opacity: 1
                    }}
                    whileHover={{ 
                      y: -5, 
                      scale: 1.2,
                      color: "#08f7fe",
                      transition: { duration: 0.1 } 
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    transition={{ 
                      duration: 0.3, 
                      delay: 0.7 + (0.1 * index),
                      opacity: { duration: 0.3 },
                      y: { type: "spring", stiffness: 100 }
                    }}
                  >
                    {letter}
                  </motion.span>
                ))}
                <motion.div 
                  className="absolute -bottom-1 left-0 h-[2px] bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.8, delay: 1.2 }}
                />
              </span>
              
              {/* Secondary layers for cyberpunk effect */}
              <div className={`absolute inset-0 text-[#08f7fe] ${glitchActive ? 'left-[2px] top-[2px]' : 'left-0'} opacity-70 pointer-events-none`}>ROY</div>
              <div className={`absolute inset-0 text-primary ${glitchActive ? 'left-[-2px] top-[-1px]' : 'left-0'} opacity-80 pointer-events-none`}>ROY</div>
            </motion.h1>
            
            {/* Interactive scan line effect */}
            <motion.div 
              className="absolute top-0 left-0 w-full h-[2px] bg-primary/70" 
              initial={{ opacity: 0 }}
              animate={{ 
                y: ["0%", "100%", "0%"],
                opacity: [0.5, 0.8, 0.5]
              }}
              transition={{ 
                duration: 2, 
                ease: "linear", 
                repeat: Infinity,
                repeatType: "loop"
              }}
            />
            
            {/* Pulse effect on hover */}
            <motion.div 
              className="absolute inset-0 opacity-0 bg-primary/10 group-hover:opacity-100 transition-opacity duration-300"
              animate={{
                boxShadow: [
                  "0 0 0px rgba(255,41,87,0)", 
                  "0 0 20px rgba(255,41,87,0.5)", 
                  "0 0 0px rgba(255,41,87,0)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
        
        {/* Center piece - circular glow with interactive movement */}
        <motion.div 
          className="relative flex items-center justify-center cursor-pointer"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={circleControls}
          style={{ 
            rotateX: springX,
            rotateY: springY,
            perspective: 1000,
            transformStyle: "preserve-3d"
          }}
          whileHover={{ 
            scale: 1.05,
            transition: { duration: 0.3 }
          }}
          whileTap={{ 
            scale: 0.98,
            transition: { duration: 0.2 }
          }}
        >
          {/* Animated particles around the circle */}
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div 
              key={i}
              className="absolute rounded-full bg-primary/30"
              style={{
                width: Math.random() * 8 + 2,
                height: Math.random() * 8 + 2,
                left: `calc(50% + ${Math.cos(i / 20 * Math.PI * 2) * 300}px)`,
                top: `calc(50% + ${Math.sin(i / 20 * Math.PI * 2) * 300}px)`,
              }}
              animate={{
                x: [
                  Math.random() * 40 - 20, 
                  Math.random() * 40 - 20, 
                  Math.random() * 40 - 20
                ],
                y: [
                  Math.random() * 40 - 20, 
                  Math.random() * 40 - 20, 
                  Math.random() * 40 - 20
                ],
                opacity: [0.5, 1, 0.5],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: Math.random() * 3 + 6,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
          ))}
          
          {/* Red neon circle */}
          <motion.div 
            className="w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] md:w-[500px] md:h-[500px] rounded-full border-[10px] sm:border-[15px] border-primary flex items-center justify-center relative overflow-hidden"
            style={{
              x: mousePosition.x,
              y: mousePosition.y,
              boxShadow: `0 0 ${50 + mouseDistance * 30}px rgba(255,41,87,${0.7 + mouseDistance * 0.3}), inset 0 0 ${30 + mouseDistance * 20}px rgba(255,41,87,${0.3 + mouseDistance * 0.2})`,
            }}
            animate={{
              boxShadow: [
                `0 0 ${50 + mouseDistance * 30}px rgba(255,41,87,${0.7 + mouseDistance * 0.3}), inset 0 0 ${30 + mouseDistance * 20}px rgba(255,41,87,${0.3 + mouseDistance * 0.2})`,
                `0 0 ${70 + mouseDistance * 30}px rgba(255,41,87,${0.8 + mouseDistance * 0.2}), inset 0 0 ${50 + mouseDistance * 20}px rgba(255,41,87,${0.4 + mouseDistance * 0.2})`,
                `0 0 ${50 + mouseDistance * 30}px rgba(255,41,87,${0.7 + mouseDistance * 0.3}), inset 0 0 ${30 + mouseDistance * 20}px rgba(255,41,87,${0.3 + mouseDistance * 0.2})`
              ]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            {/* Sound bars for audio visualization */}
            {Array.from({ length: 32 }).map((_, i) => {
              // Calculate a unique phase offset for each bar
              const phaseOffset = i * (Math.PI / 16)
              
              // Create a pattern that pulses based on time and index position to simulate audio visualization
              // Using actual time ensures smooth animation
              const pulseFrequency = 2 + (i % 4) * 0.5 // Different frequencies for varied effect
              const pulseHeight = Math.abs(Math.sin((time / 1000 * pulseFrequency) + phaseOffset)) * 50 + 10
              
              // Make bars near the mouse position more active
              const angle = (i / 32) * 360
              const angleRadians = angle * (Math.PI / 180)
              const barX = Math.cos(angleRadians)
              const barY = Math.sin(angleRadians)
              
              // Calculate how close this bar is to the mouse direction
              // This creates a wave-like effect that follows mouse movement
              const mouseAngleRadians = Math.atan2(mousePosition.y, mousePosition.x)
              const angleDifference = Math.abs(angleRadians - mouseAngleRadians) % (Math.PI * 2)
              const normalizedDifference = Math.min(angleDifference, Math.PI * 2 - angleDifference) / Math.PI
              const mouseProximityFactor = 1 - normalizedDifference // 1 when aligned with mouse, 0 when opposite
              
              // Combine the basic pulse with mouse proximity for more dynamic effect
              const adjustedHeight = pulseHeight * (1 + mouseDistance * mouseProximityFactor * 0.8)

              return (
                <motion.div
                  key={i}
                  className="absolute bg-white/80"
                  style={{
                    height: `${adjustedHeight}%`,
                    width: '2px',
                    bottom: '50%',
                    left: '50%',
                    transformOrigin: 'bottom center',
                    transform: `rotate(${angle}deg) translateX(-50%)`,
                    opacity: Math.abs(Math.sin((time / 1000 * 1.5) + phaseOffset)) * 0.5 + 0.3,
                    boxShadow: `0 0 ${3 + mouseDistance * 4}px rgba(255,255,255,${0.3 + mouseDistance * 0.5})`,
                    zIndex: 5
                  }}
                />
              )
            })}
            
            {/* Circular pulse effect */}
            <motion.div 
              className="absolute inset-0 rounded-full"
              style={{
                border: `2px solid rgba(255,255,255,${0.1 + mouseDistance * 0.2})`,
                transform: `scale(${0.9 + (Math.sin(time / 1000) * 0.05)})`,
                opacity: 0.2 + mouseDistance * 0.3
              }}
            />
          </motion.div>
          
          {/* Silhouette figure - more interactive */}
          <motion.div 
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[5] w-[280px] h-[500px] sm:w-[350px] sm:h-[600px]"
            animate={{
              filter: [
                'brightness(1) contrast(1.2)',
                'brightness(1.1) contrast(1.3)',
                'brightness(1) contrast(1.2)'
              ]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            <div className="w-full h-full bg-black">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/5"></div>
              <motion.div 
                className="absolute inset-0 flex items-center justify-center text-[120px] sm:text-[150px] font-bold text-transparent bg-clip-text bg-gradient-to-b from-black via-black to-primary/10"
                animate={{ opacity: [0.9, 1, 0.9] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                M
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
        
        {/* Web Designer from India - with additional animation effects */}
        <motion.div 
          className="absolute bottom-16 left-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          whileHover={{ scale: 1.05 }}
        >
          <div className="text-left">
            <motion.h2 
              className="text-text-primary text-xl sm:text-2xl font-mono font-bold relative inline-block"
              animate={{ 
                textShadow: [
                  "0 0 5px rgba(255,255,255,0)",
                  "0 0 10px rgba(255,255,255,0.3)",
                  "0 0 5px rgba(255,255,255,0)"
                ]
              }}
              transition={{ 
                duration: 2.5, 
                repeat: Infinity, 
                repeatType: "reverse" 
              }}
            >
              Web Designer
              <motion.span 
                className="absolute bottom-0 left-0 w-full h-[1px] bg-primary" 
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1, delay: 1 }}
              />
            </motion.h2>
            <div className="flex items-center mt-2">
              <span className="text-text-secondary">From</span>
              <motion.span 
                className="ml-2 text-primary font-bold neon-text-pulse"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                IN
              </motion.span>
            </div>
          </div>
        </motion.div>
        
        {/* Interactive scroll indicator */}
        <motion.div 
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 cursor-pointer"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: [0.7, 1, 0.7], y: [0, 5, 0] }}
          transition={{ 
            opacity: { duration: 2, repeat: Infinity },
            y: { duration: 1.5, repeat: Infinity }
          }}
          whileHover={{ 
            scale: 1.1, 
            transition: { duration: 0.2 } 
          }}
          onClick={() => {
            document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <div className="flex flex-col items-center">
            <span className="text-text-secondary font-mono text-xs tracking-widest">SCROLL</span>
            <motion.div 
              className="w-px h-8 bg-gradient-to-b from-primary to-transparent mt-2"
              animate={{ 
                height: [8, 16, 8],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
} 