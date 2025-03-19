'use client'

import React, { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text3D, Float, useMatcapTexture } from '@react-three/drei'
import { Mesh, MeshStandardMaterial, Color } from 'three'

interface HolographicTextProps {
  text: string;
  size?: number;
  height?: number;
  speed?: number;
  color?: string;
}

export default function HolographicText({ 
  text = 'Your Name', 
  size = 0.5, 
  height = 0.2, 
  speed = 0.5,
  color = '#6366F1' // accent color
}: HolographicTextProps) {
  const textRef = useRef<Mesh>(null!)
  const [hovered, setHovered] = useState(false)
  const [matcapTexture] = useMatcapTexture('C7C7D7_4C4E5A_818393_6C6C74', 1024)
  const [glowIntensity, setGlowIntensity] = useState(0)
  
  // Animation for text rotation
  useFrame((state) => {
    if (textRef.current) {
      textRef.current.rotation.y += 0.005 * speed
      
      // Add a subtle floating animation
      textRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05
      
      // Update glow effect
      const material = textRef.current.material as MeshStandardMaterial
      if (material) {
        // Pulse the emissive intensity
        const pulseIntensity = (Math.sin(state.clock.elapsedTime * 2) + 1) * 0.1
        setGlowIntensity(hovered ? 0.4 + pulseIntensity : 0.2 + pulseIntensity)
        material.emissiveIntensity = glowIntensity
      }
    }
  })

  // Setup the material with glow effect
  useEffect(() => {
    if (textRef.current) {
      const material = textRef.current.material as MeshStandardMaterial
      if (material) {
        material.emissive = new Color(color)
        material.emissiveIntensity = 0.2
        material.needsUpdate = true
      }
    }
  }, [color])

  return (
    <Float
      speed={2} // Animation speed
      rotationIntensity={0.2} // XYZ rotation intensity
      floatIntensity={0.5} // Up/down float intensity
    >
      <Text3D
        ref={textRef}
        font="/fonts/Inter_Bold.json"
        size={size}
        height={height}
        curveSegments={32}
        bevelEnabled
        bevelThickness={0.02}
        bevelSize={0.02}
        bevelOffset={0}
        bevelSegments={5}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        {text}
        <meshStandardMaterial
          color="#ffffff"
          metalness={0.8}
          roughness={0.2}
          transparent
          opacity={0.9}
          emissive={new Color(color)}
          emissiveIntensity={0.2}
        />
      </Text3D>
    </Float>
  )
} 