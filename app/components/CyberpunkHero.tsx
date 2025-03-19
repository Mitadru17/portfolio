'use client'

import React, { useState, useEffect } from 'react'
import { motion, useAnimation } from 'framer-motion'
import Link from 'next/link'
import { useInView } from 'react-intersection-observer'
import Image from 'next/image'

export default function CyberpunkHero() {
  const [ref, inView] = useInView({ triggerOnce: false })
  const controls = useAnimation()
  const [glitchActive, setGlitchActive] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  
  useEffect(() => {
    // Trigger a glitch effect every 5 seconds
    const glitchInterval = setInterval(() => {
      setGlitchActive(true)
      setTimeout(() => setGlitchActive(false), 200)
    }, 5000)
    
    if (inView) {
      controls.start({ opacity: 1, y: 0, transition: { duration: 0.8 } })
    }
    
    return () => {
      clearInterval(glitchInterval)
    }
  }, [controls, inView])

  // Calculate rotation based on mouse position
  const calculateRotation = () => {
    const centerX = window.innerWidth / 2
    const centerY = window.innerHeight / 2
    const maxRotation = 15 // Maximum rotation in degrees
    
    // Calculate normalized position (-1 to 1)
    const normalizedX = (mousePosition.x - centerX) / (window.innerWidth / 2)
    const normalizedY = (mousePosition.y - centerY) / (window.innerHeight / 2)
    
    // Calculate rotation angles with limits
    const rotateX = -normalizedY * maxRotation // Inverted for natural tilt
    const rotateY = normalizedX * maxRotation
    
    return `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
  }

  return (
    <section 
      id="home" 
      className="relative h-screen w-full overflow-hidden bg-black"
      ref={ref}
      onMouseMove={(e) => setMousePosition({ x: e.clientX, y: e.clientY })}
      onMouseLeave={() => setMousePosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 })}
    >
      {/* Main container */}
      <div className="h-full w-full flex flex-col justify-center items-center relative">
        {/* Name display */}
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
              className="absolute -inset-2 bg-[#ff2957]/5 rounded-sm blur-sm"
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
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-mono font-bold tracking-tighter relative z-10">
              <div className="relative inline-block bg-clip-text text-transparent bg-gradient-to-r from-gray-500 via-[#ff2957] to-gray-500 bg-[length:200%_100%] animate-gradient">
                <motion.span className="inline-block">M</motion.span>
                <motion.span className="inline-block">I</motion.span>
                <motion.span className="inline-block">T</motion.span>
                <motion.span className="inline-block">A</motion.span>
                <motion.span className="inline-block">D</motion.span>
                <motion.span className="inline-block">R</motion.span>
                <motion.span className="inline-block">U</motion.span>
              </div>
            </h1>
            
            {/* ROY with techy effects */}
            <motion.h2 
              className="text-lg md:text-xl lg:text-2xl font-mono font-bold tracking-widest mt-2 relative z-10"
            >
              <div className="relative inline-block bg-clip-text text-transparent bg-gradient-to-r from-gray-500 via-[#ff2957] to-gray-500 bg-[length:200%_100%] animate-gradient">
                <motion.span className="inline-block">R</motion.span>
                <motion.span className="inline-block">O</motion.span>
                <motion.span className="inline-block">Y</motion.span>
              </div>
            </motion.h2>
            
            {/* Techy line effect */}
            <motion.div 
              className="absolute -bottom-2 left-0 w-full h-[2px] bg-gradient-to-r from-[#ff2957] via-[#ff2957] to-[#ff2957]"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
            />
            
            {/* Glitch effect on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <div className="absolute inset-0 bg-[#08f7fe] left-[2px]" style={{ mixBlendMode: 'overlay', opacity: 0.1 }}></div>
              <div className="absolute inset-0 bg-[#fe53bb] left-[-2px]" style={{ mixBlendMode: 'overlay', opacity: 0.1 }}></div>
            </div>
          </div>
        </motion.div>

        {/* Cyberpunk figure with red neon circle */}
        <motion.div
          className="absolute bottom-0 w-full flex items-end justify-center"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          {/* Background black layer for depth */}
          <div className="absolute inset-0 bg-black z-0"></div>
          
          {/* Red neon glow effect */}
          <motion.div 
            className="absolute w-[550px] h-[550px] rounded-full z-10 cursor-pointer mb-[80px]"
            style={{
              boxShadow: '0 0 80px 15px rgba(255,41,87,0.5)',
              background: 'rgba(0,0,0,1)',
              border: '20px solid rgba(255,41,87,1)',
              transform: `${calculateRotation()} scale(${isHovered ? 0.98 : 1})`,
              transition: 'transform 0.5s ease-out'
            }}
            animate={{
              boxShadow: [
                '0 0 80px 15px rgba(255,41,87,0.5)',
                '0 0 100px 25px rgba(255,41,87,0.6)',
                '0 0 80px 15px rgba(255,41,87,0.5)'
              ]
            }}
            transition={{
              boxShadow: {
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse"
              }
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          ></motion.div>
          
          {/* Hooded figure */}
          <motion.div 
            className="absolute z-20 w-[600px] h-[600px] mb-[10px]"
            style={{
              transform: `${calculateRotation()} scale(${isHovered ? 0.98 : 1}) translateX(60px)`,
              transition: 'transform 0.5s ease-out'
            }}
          >
            <div className="relative w-full h-full">
              {/* Use a div with background image for better control */}
              <div 
                className="w-full h-full bg-cover bg-[center_top] bg-no-repeat"
                style={{
                  backgroundImage: "url('/images/cyberpunk_figure.png')",
                  filter: "brightness(0.9) contrast(1.1)",
                  transform: "scale(1.1)"
                }}
              ></div>
              
              {/* Glitch effect overlay */}
              {glitchActive && (
                <div className="absolute inset-0 z-30 pointer-events-none mix-blend-screen">
                  <div className="absolute inset-0 bg-[#08f7fe] left-[5px]" style={{ mixBlendMode: 'overlay', opacity: 0.15 }}></div>
                  <div className="absolute inset-0 bg-[#fe53bb] left-[-5px]" style={{ mixBlendMode: 'overlay', opacity: 0.15 }}></div>
                </div>
              )}
            </div>
          </motion.div>
          
          {/* Scan lines effect */}
          <div 
            className="absolute inset-0 z-40 pointer-events-none opacity-20" 
            style={{ 
              backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.5), rgba(0,0,0,0.5) 1px, transparent 1px, transparent 2px)',
              backgroundSize: '100% 2px'
            }}
          ></div>
        </motion.div>

        {/* Web Designer text block */}
        <motion.div 
          className="absolute bottom-12 left-12 z-50"
          initial={{ opacity: 0, y: 20 }}
          animate={controls}
          whileHover={{ scale: 1.05 }}
        >
          <div className="text-left">
            <motion.h2 
              className="text-white text-xl sm:text-2xl font-mono font-bold relative inline-block"
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
                className="absolute bottom-0 left-0 w-full h-[1px] bg-[#ff2957]" 
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1, delay: 1 }}
              />
            </motion.h2>
            <div className="flex items-center mt-2">
              <span className="text-gray-400">From</span>
              <motion.span 
                className="ml-2 text-[#ff2957] font-bold neon-text-pulse"
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
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 cursor-pointer z-50"
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
            <span className="text-gray-400 font-mono text-xs tracking-widest">SCROLL</span>
            <motion.div 
              className="w-px h-8 bg-gradient-to-b from-[#ff2957] to-transparent mt-2"
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