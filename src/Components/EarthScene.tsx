"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, useTexture } from "@react-three/drei";
import * as THREE from "three";

function Earth() {
  const earthRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const earthTexture = useTexture('/try5.png');
  const cloudsTexture = useTexture('/earthcloudmap.jpg');  

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

function Satellite({ orbitRadius, orbitSpeed, orbitAngleX, orbitAngleZ, color }: { orbitRadius: number, orbitSpeed: number, orbitAngleX: number, orbitAngleZ: number, color: string }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      // Rotate the inner group to make the satellite orbit around the center (Earth)
      groupRef.current.rotation.y = clock.getElapsedTime() * orbitSpeed;
    }
  });

  return (
    // Outer group to tilt the orbit plane
    <group rotation={[orbitAngleX, 0, orbitAngleZ]}>
      {/* Inner group that rotates over time */}
      <group ref={groupRef}>
        {/* Offset the satellite by the orbitRadius */}
        <group position={[orbitRadius, 0, 0]}>
          {/* Main Body */}
          <mesh>
            <boxGeometry args={[0.08, 0.08, 0.08]} />
            <meshStandardMaterial color="#dddddd" metalness={0.8} roughness={0.2} />
          </mesh>
          {/* Solar Panel 1 */}
          <mesh position={[0, 0.08, 0]}>
            <boxGeometry args={[0.16, 0.01, 0.08]} />
            <meshStandardMaterial color={color} metalness={0.5} roughness={0.5} />
          </mesh>
          {/* Solar Panel 2 */}
          <mesh position={[0, -0.08, 0]}>
            <boxGeometry args={[0.16, 0.01, 0.08]} />
            <meshStandardMaterial color={color} metalness={0.5} roughness={0.5} />
          </mesh>
          {/* Antenna */}
          <mesh position={[0.05, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.005, 0.005, 0.1]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
        </group>
      </group>
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
        
        {/* 5 Orbiting Satellites */}
        <Satellite orbitRadius={2.4} orbitSpeed={0.5} orbitAngleX={0.2} orbitAngleZ={0.5} color="#0ea5e9" />
        <Satellite orbitRadius={2.7} orbitSpeed={0.3} orbitAngleX={1.2} orbitAngleZ={-0.3} color="#f59e0b" />
        <Satellite orbitRadius={2.3} orbitSpeed={0.8} orbitAngleX={-0.5} orbitAngleZ={0.8} color="#10b981" />
        <Satellite orbitRadius={2.8} orbitSpeed={0.4} orbitAngleX={0.8} orbitAngleZ={-0.8} color="#ef4444" />
        <Satellite orbitRadius={2.5} orbitSpeed={0.6} orbitAngleX={-1.0} orbitAngleZ={0.2} color="#8b5cf6" />
        
        <OrbitControls enableZoom={true} enablePan={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  );
}
