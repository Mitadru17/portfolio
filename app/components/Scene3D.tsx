'use client'

import React, { Suspense, useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Environment, useProgress, Html } from '@react-three/drei'
import HolographicText from './HolographicText'

function Loader() {
  const { progress } = useProgress()
  return (
    <Html center>
      <div className="text-accent font-medium">
        {progress.toFixed(0)}% loaded
      </div>
    </Html>
  )
}

interface Scene3DProps {
  text?: string;
}

export default function Scene3D({ text = 'Your Name' }: Scene3DProps) {
  const [mounted, setMounted] = useState(false)

  // Fix for hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="w-full h-[300px] md:h-[400px]">
      <Canvas dpr={[1, 2]} shadows>
        <color attach="background" args={['transparent']} />
        <fog attach="fog" args={['#111827', 8, 25]} />
        <ambientLight intensity={0.5} />
        <directionalLight 
          position={[5, 5, 5]} 
          intensity={1} 
          castShadow 
          shadow-mapSize={2048} 
        />
        <Suspense fallback={<Loader />}>
          <HolographicText text={text} />
          <Environment preset="city" />
        </Suspense>
        <OrbitControls 
          autoRotate 
          autoRotateSpeed={0.5} 
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 2}
        />
        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />
      </Canvas>
    </div>
  )
} 