"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

interface ShuffleBurstCanvasProps {
  triggerKey: number; // Increment this to fire the 3D burst
  className?: string;
}

export default function ShuffleBurstCanvas({
  triggerKey,
  className = "",
}: ShuffleBurstCanvasProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!mountRef.current || triggerKey === 0) return;

    const container = mountRef.current;
    const width = container.clientWidth || 320;
    const height = container.clientHeight || 120;

    let scene: THREE.Scene | null = null;
    let camera: THREE.PerspectiveCamera | null = null;
    let renderer: THREE.WebGLRenderer | null = null;

    try {
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
      camera.position.z = 4.5;

      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "low-power",
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      container.appendChild(renderer.domElement);
      rendererRef.current = renderer;
    } catch {
      // Safe fallback if WebGL not supported or context unavailable
      return undefined;
    }

    // Lighting for glass reflections
    const ambient = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambient);

    const dirLight = new THREE.DirectionalLight(0xff3355, 2.5);
    dirLight.position.set(2, 3, 4);
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0xff1f3d, 4, 10);
    pointLight.position.set(0, 0, 1);
    scene.add(pointLight);

    // 24 Faceted obsidian-red glass crystal fragments
    const count = 22;
    const shardGeom = new THREE.TetrahedronGeometry(0.22, 0);
    const shardMat = new THREE.MeshStandardMaterial({
      color: 0xff1f3d,
      roughness: 0.18,
      metalness: 0.82,
      emissive: 0x3a0008,
      emissiveIntensity: 0.6,
      transparent: true,
      opacity: 0.95,
    });

    const shards: {
      mesh: THREE.Mesh;
      vel: THREE.Vector3;
      rotVel: THREE.Vector3;
      basePos: THREE.Vector3;
    }[] = [];

    const group = new THREE.Group();

    for (let i = 0; i < count; i++) {
      const mesh = new THREE.Mesh(shardGeom, shardMat);
      const angle = (i / count) * Math.PI * 2;
      const radius = 0.2 + Math.random() * 0.4;

      mesh.position.set(
        Math.cos(angle) * radius,
        (Math.random() - 0.5) * 0.4,
        (Math.sin(angle) * radius)
      );

      const speed = 1.8 + Math.random() * 2.2;
      const vel = new THREE.Vector3(
        Math.cos(angle) * speed,
        (Math.random() - 0.5) * 1.5,
        Math.sin(angle) * speed * 0.5
      );

      const rotVel = new THREE.Vector3(
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 8
      );

      group.add(mesh);
      shards.push({ mesh, vel, rotVel, basePos: mesh.position.clone() });
    }

    scene.add(group);

    const startTime = performance.now();
    const DURATION = 680; // 680ms total burst life

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / DURATION);

      if (!scene || !camera || !renderer) return;

      // Elastic explosion & magnetic pull back into order
      const expansion = Math.sin(progress * Math.PI);

      shards.forEach((s) => {
        s.mesh.position.x = s.basePos.x + s.vel.x * expansion * 0.85;
        s.mesh.position.y = s.basePos.y + s.vel.y * expansion * 0.85;
        s.mesh.position.z = s.basePos.z + s.vel.z * expansion * 0.85;

        s.mesh.rotation.x += s.rotVel.x * 0.016;
        s.mesh.rotation.y += s.rotVel.y * 0.016;
        s.mesh.rotation.z += s.rotVel.z * 0.016;

        s.mesh.scale.setScalar(Math.max(0.01, 1 - Math.pow(progress, 2)));
      });

      shardMat.opacity = Math.max(0, 1 - progress * 0.9);
      group.rotation.y += 0.04;
      group.rotation.z += 0.02;

      renderer.render(scene, camera);

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        // Complete & clear canvas immediately
        if (renderer.domElement && renderer.domElement.parentNode) {
          renderer.domElement.parentNode.removeChild(renderer.domElement);
        }
        renderer.dispose();
        shardGeom.dispose();
        shardMat.dispose();
      }
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (renderer) {
        if (renderer.domElement && renderer.domElement.parentNode) {
          renderer.domElement.parentNode.removeChild(renderer.domElement);
        }
        renderer.dispose();
      }
      shardGeom.dispose();
      shardMat.dispose();
    };
  }, [triggerKey]);

  return (
    <div
      ref={mountRef}
      className={`pointer-events-none absolute inset-0 overflow-hidden z-20 ${className}`}
      aria-hidden="true"
    />
  );
}
