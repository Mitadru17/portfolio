'use client'

import React, { Suspense, useState, useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { Html, PerspectiveCamera } from '@react-three/drei'
import FabricAvatar from './FabricAvatar'
import { motion } from 'framer-motion'

function Loader() {
  return (
    <Html center>
      <div className="font-mono text-primary">
        <span className="inline-block animate-pulse">[</span> Loading... <span className="inline-block animate-pulse">]</span>
      </div>
    </Html>
  )
}

interface CyberpunkSceneProps {
  name?: string;
}

export default function CyberpunkScene({ name = 'YOUR NAME' }: CyberpunkSceneProps) {
  const [mounted, setMounted] = useState(false)
  
  // Fix for hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Background grid - removed */}
      
      {/* Name display */}
      <motion.div 
        className="absolute top-1/2 right-12 transform -translate-y-1/2 z-10"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-mono font-bold tracking-tighter text-text-primary">
          <span className="text-primary">{name.charAt(0)}</span>
          <span className="text-primary">{name.charAt(1)}</span>
          {name.slice(2).split('').map((char, index) => (
            <span key={index}>{char}</span>
          ))}
        </h1>
        <div className="h-px w-full bg-primary mt-4 mb-4"></div>
        <div className="font-mono text-text-secondary text-xs uppercase tracking-widest">
          <span className="text-primary">{'>'}</span> Developer <span className="text-primary">|</span> Designer <span className="text-primary">|</span> Creator
        </div>
      </motion.div>
      
      {/* Simplified 3D canvas with error handling */}
      <div className="absolute top-0 left-0 w-2/3 h-full">
        <ErrorBoundary fallback={<div className="p-4 font-mono text-primary">Could not load 3D model</div>}>
          <Canvas dpr={[1, 2]}>
            <ambientLight intensity={0.4} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <Suspense fallback={<Loader />}>
              <FabricAvatar 
                position={[0, 0, 0]} 
                size={2}
                color="#ff2957"
                hoverColor="#08f7fe"
                distort={0.4}
                speed={1.5}
              />
            </Suspense>
            <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={45} />
          </Canvas>
        </ErrorBoundary>
      </div>
      
      {/* Overlay for "interactive" text */}
      <div className="absolute bottom-10 left-10 font-mono text-xs text-text-secondary">
        <span className="text-primary">{'>'}</span> INTERACTIVE 3D MODEL <span className="text-primary animate-pulse">_</span>
      </div>
    </div>
  )
}

// Simple error boundary for Three.js components
class ErrorBoundary extends React.Component<{children: React.ReactNode, fallback: React.ReactNode}> {
  state = { hasError: false }
  
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  
  render() {
    if (this.state.hasError) {
      return this.props.fallback
    }
    return this.props.children
  }
} 