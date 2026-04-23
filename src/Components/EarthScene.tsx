"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, useTexture } from "@react-three/drei";
import * as THREE from "three";

function Earth() {
  const earthRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const earthTexture = useTexture('/try5.png');
  const cloudsTexture = useTexture('/earthcloudmap.jpg'); // Add the clouds texture here

  useFrame(() => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.001;
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += 0.0015; // Clouds rotate slightly faster
    }
  });

  return (
    <group rotation={[0, 0, -23.4 * (Math.PI / 180)]}>
      {/* Earth Surface */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshStandardMaterial 
          map={earthTexture}
          roughness={0.6}
          metalness={0.1}
        />
      </mesh>

      {/* Atmospheric Haze / Clouds Layer */}
      <mesh ref={cloudsRef}>
        <sphereGeometry args={[2.02, 64, 64]} />
        <meshStandardMaterial 
          map={cloudsTexture}
          transparent={true}
          opacity={0.6}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

export default function EarthScene() {
  return (
    <div className="canvas-container animate-fade-in">
      <Canvas camera={{ position: [0, -1, 5], fov: 60 }}>
        <color attach="background" args={["#020205"]} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 3, 5]} intensity={1.5} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <Earth />
        <OrbitControls enableZoom={true} enablePan={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  );
}
