'use client'

import React, { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere, MeshDistortMaterial } from '@react-three/drei'

interface FabricAvatarProps {
  position?: [number, number, number];
  size?: number;
  color?: string;
  hoverColor?: string;
  distort?: number;
  speed?: number;
}

export default function FabricAvatar({
  position = [0, 0, 0],
  size = 2,
  color = '#ff2957',
  hoverColor = '#08f7fe',
  distort = 0.4,
  speed = 1
}: FabricAvatarProps) {
  const sphereRef = useRef(null)
  const [hovered, setHovered] = useState(false)
  
  // Simple animation
  useFrame(({ clock }) => {
    if (sphereRef.current) {
      // @ts-ignore: Type issues with Three.js refs
      sphereRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.2 * speed) * 0.2
      // @ts-ignore: Type issues with Three.js refs
      sphereRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.3 * speed) * 0.2 + clock.getElapsedTime() * 0.1 * speed
    }
  })

  return (
    <group position={[position[0], position[1], position[2]]}>
      <Sphere
        ref={sphereRef}
        args={[size, 32, 32]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <MeshDistortMaterial
          color={hovered ? hoverColor : color}
          roughness={0.5}
          metalness={0.8}
          distort={hovered ? distort * 1.5 : distort}
        />
      </Sphere>
    </group>
  )
} 