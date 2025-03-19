import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const CyberpunkScene = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    // --- 1. SCENE SETUP ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    // Perspective camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0.5, 4); // Lowered and moved closer
    camera.lookAt(0, 0, 0); // Look directly at the center of the scene

    // WebGL renderer with antialiasing
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // Enable shadows
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // --- 2. GLOWING RED CIRCLE (NEON EFFECT) ---
    const torusGeometry = new THREE.TorusGeometry(2, 0.08, 24, 100); // Slightly thicker torus
    const torusMaterial = new THREE.MeshStandardMaterial({
      color: 0xff0033,
      emissive: 0xff0033,
      emissiveIntensity: 3, // Increased intensity
      roughness: 0.1, // More shiny
      metalness: 0.9  // More metallic
    });
    
    const ring = new THREE.Mesh(torusGeometry, torusMaterial);
    ring.rotation.x = Math.PI / 2; // Rotate to face camera
    ring.castShadow = true;
    ring.receiveShadow = true;
    scene.add(ring);

    // Add multiple point lights around the ring for enhanced glow
    const ringLightIntensity = 1.5;
    const ringLightDistance = 6;
    
    // Central light
    const ringLight = new THREE.PointLight(0xff0033, ringLightIntensity, ringLightDistance);
    ringLight.position.set(0, 0, 0);
    ring.add(ringLight);
    
    // Additional lights around the ring for stronger glow effect
    const createRingLight = (angle) => {
      const light = new THREE.PointLight(0xff0033, ringLightIntensity * 0.5, ringLightDistance);
      const x = Math.cos(angle) * 2;
      const z = Math.sin(angle) * 2;
      light.position.set(x, 0, z);
      scene.add(light);
      return light;
    };
    
    const ringLights = [
      createRingLight(0),
      createRingLight(Math.PI * 0.5),
      createRingLight(Math.PI),
      createRingLight(Math.PI * 1.5)
    ];

    // --- 3. LIGHTING FOR A DRAMATIC EFFECT ---
    // Main red spotlight from above
    const spotlight = new THREE.SpotLight(0xff0033, 2);
    spotlight.position.set(0, 5, 5);
    spotlight.angle = Math.PI / 6;
    spotlight.penumbra = 0.5;
    spotlight.decay = 2;
    spotlight.distance = 25;
    spotlight.castShadow = true;
    spotlight.shadow.bias = -0.001;
    spotlight.shadow.mapSize.width = 1024;
    spotlight.shadow.mapSize.height = 1024;
    scene.add(spotlight);
    
    // Blue rim light from behind for cyberpunk contrast
    const rimLight = new THREE.DirectionalLight(0x0066ff, 1.0);
    rimLight.position.set(0, 2, -3);
    rimLight.castShadow = true;
    scene.add(rimLight);
    
    // Ambient light for fill (very subtle)
    const ambientLight = new THREE.AmbientLight(0x111111, 0.5);
    scene.add(ambientLight);

    // Add a reflective ground plane for cyberpunk aesthetic
    const planeGeometry = new THREE.PlaneGeometry(10, 10);
    const planeMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x000000,
      roughness: 0.1, // More reflective
      metalness: 0.7  // More metallic
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -2;
    plane.receiveShadow = true;
    scene.add(plane);

    // --- 4. MOUSE INTERACTION LOGIC ---
    // Target rotations (will be updated with mouse)
    const targetRotation = { x: 0, y: 0 };
    const currentRotation = { x: 0, y: 0 };
    
    // Mouse movement tracking
    const handleMouseMove = (event) => {
      // Calculate normalized mouse position (-1 to 1)
      targetRotation.y = ((event.clientX / window.innerWidth) * 2 - 1) * Math.PI / 6;
      targetRotation.x = ((event.clientY / window.innerHeight) * 2 - 1) * Math.PI / 12;
    };
    
    document.addEventListener('mousemove', handleMouseMove);

    // Window resize handler
    const handleWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleWindowResize);

    // Optional: orbit controls for debugging (can be removed in final version)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    controls.enablePan = false;
    controls.enabled = false; // Disable for mouse rotation effect

    // Add cyberpunk fog effect
    scene.fog = new THREE.FogExp2(0x000000, 0.035);

    // --- 5. SHADOWS AND RENDERING ---
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Get current time for animations
      const time = Date.now() * 0.001;
      
      // Apply smooth interpolation for rotation based on mouse
      currentRotation.y += (targetRotation.y - currentRotation.y) * 0.05;
      currentRotation.x += (targetRotation.x - currentRotation.x) * 0.05;
      
      // Rotate main ring - combination of auto-rotation and mouse interaction
      ring.rotation.z += 0.005;
      ring.rotation.y = Math.sin(time * 0.2) * 0.05 + currentRotation.y * 0.3;
      ring.rotation.x = Math.PI / 2 + currentRotation.x * 0.3;
      
      // Pulse effect for the main ring - more dramatic
      const pulseScale = 1 + Math.sin(time * 2) * 0.05;
      ring.scale.set(pulseScale, pulseScale, 1);
      
      // Animate the ring lights for enhanced glow effect - more intense
      ringLights.forEach((light, i) => {
        const lightPulse = 1 + Math.sin(time * 3 + i) * 0.4;
        light.intensity = ringLightIntensity * 0.5 * lightPulse;
      });
      
      // Move camera slightly for a floating effect
      camera.position.y = 0.5 + Math.sin(time * 0.5) * 0.1;
      
      // Update controls if enabled
      if (controls.enabled) controls.update();
      
      // Render scene
      renderer.render(scene, camera);
    };
    
    // Start animation loop
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleWindowResize);
      document.removeEventListener('mousemove', handleMouseMove);
      
      // Dispose geometries and materials
      torusGeometry.dispose();
      torusMaterial.dispose();
      planeGeometry.dispose();
      planeMaterial.dispose();
      
      // Remove lights
      ringLights.forEach(light => {
        scene.remove(light);
      });
      
      // Remove objects from scene
      scene.remove(ring);
      scene.remove(plane);
      
      // Clean up DOM elements
      if (mountRef.current) {
        if (mountRef.current.contains(renderer.domElement)) {
          mountRef.current.removeChild(renderer.domElement);
        }
      }
      
      // Dispose renderer
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      style={{ 
        width: '100%', 
        height: '100vh', 
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      {/* Info indicator */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        color: '#ff0033',
        fontFamily: 'monospace',
        fontSize: '14px'
      }}>
        Neon Ring - Move mouse to interact
      </div>
    </div>
  );
};

export default CyberpunkScene; 