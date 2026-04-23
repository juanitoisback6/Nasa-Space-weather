"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, useTexture, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

function Sun() {
  const sunRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const sunTexture = useTexture('/sunmap.jpg');

  useFrame(({ clock }) => {
    if (sunRef.current) {
      sunRef.current.rotation.y += 0.002;
    }
    if (glowRef.current) {
      // rotate the irregular flares slowly
      glowRef.current.rotation.y -= 0.001;
      glowRef.current.rotation.z += 0.001;
    }
  });

  return (
    <group>
      {/* Sun Core */}
      <mesh ref={sunRef}>
        <sphereGeometry args={[2.5, 64, 64]} />
        <meshStandardMaterial 
          map={sunTexture}
          emissiveMap={sunTexture}
          color="#ffffff" 
          emissive="#ffffff" 
          emissiveIntensity={0.8} 
          roughness={0.4}
        />
      </mesh>

      {/* Irregular Solar Flares */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[2.6, 64, 64]} />
        <MeshDistortMaterial 
          color="#ff5500"
          transparent={true} 
          opacity={0.35}
          blending={THREE.AdditiveBlending}
          distort={0.4} // Intensity of the irregular deformation
          speed={3}     // Speed of the eruption animation
        />
      </mesh>
    </group>
  );
}

export default function SunScene() {
  return (
    <div className="canvas-container animate-fade-in">
      <Canvas camera={{ position: [0, -1.2, 8], fov: 60 }}>
        <color attach="background" args={["#0a0000"]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[0, 0, 0]} intensity={20} color="#ffaa00" />
        <Stars radius={100} depth={50} count={3000} factor={4} saturation={1} fade speed={1} />
        <Sun />
        <OrbitControls enableZoom={true} enablePan={false} autoRotate autoRotateSpeed={1} />
      </Canvas>
    </div>
  );
}
