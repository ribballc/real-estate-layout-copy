import { useRef, useMemo, useCallback, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Float, Sparkles } from "@react-three/drei";
import * as THREE from "three";

/* ─────────────── Ice Mountain Geometry ─────────────── */
const IceMountain = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  // Create mountain shape: a cone with some noise for organic feel
  const geometry = useMemo(() => {
    const geo = new THREE.ConeGeometry(2.2, 5, 6, 12);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      const scale = 1 + (1 - (y + 2.5) / 5) * 0.15;
      // Add subtle faceted irregularity
      const nx = pos.getX(i) * scale + (Math.random() - 0.5) * 0.08;
      const nz = pos.getZ(i) * scale + (Math.random() - 0.5) * 0.08;
      pos.setX(i, nx);
      pos.setZ(i, nz);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  return (
    <group>
      {/* Main ice mountain */}
      <mesh ref={meshRef} geometry={geometry} position={[0, 0.5, 0]}>
        <meshPhysicalMaterial
          color="hsl(217, 60%, 25%)"
          metalness={0.1}
          roughness={0.3}
          transmission={0.4}
          thickness={1.5}
          transparent
          opacity={0.85}
          envMapIntensity={1}
          clearcoat={1}
          clearcoatRoughness={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Inner glow core */}
      <mesh ref={glowRef} position={[0, 0.5, 0]}>
        <coneGeometry args={[1.8, 4.5, 6, 8]} />
        <meshBasicMaterial
          color="hsl(217, 91%, 60%)"
          transparent
          opacity={0.06}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Wireframe overlay for tech feel */}
      <mesh geometry={geometry} position={[0, 0.5, 0]}>
        <meshBasicMaterial
          color="hsl(213, 94%, 68%)"
          wireframe
          transparent
          opacity={0.08}
        />
      </mesh>
    </group>
  );
};

/* ─────────────── Glowing Peak ─────────────── */
const Peak = () => {
  const ref = useRef<THREE.PointLight>(null);
  const sphereRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (ref.current) {
      ref.current.intensity = 3 + Math.sin(t * 2) * 1.5;
    }
    if (sphereRef.current) {
      sphereRef.current.scale.setScalar(1 + Math.sin(t * 2) * 0.15);
    }
  });

  return (
    <group position={[0, 3.2, 0]}>
      <mesh ref={sphereRef}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshBasicMaterial color="#10b981" transparent opacity={0.9} />
      </mesh>
      {/* Outer glow sphere */}
      <mesh>
        <sphereGeometry args={[0.45, 16, 16]} />
        <meshBasicMaterial color="#10b981" transparent opacity={0.15} />
      </mesh>
      <pointLight ref={ref} color="#10b981" intensity={3} distance={6} />
    </group>
  );
};

/* ─────────────── Revenue Path (spiral trail) ─────────────── */
const RevenuePath = ({ color, offset, speed }: { color: string; offset: number; speed: number }) => {
  const pointsRef = useRef<THREE.Points>(null);
  const trailRef = useRef<THREE.Line>(null);

  // Create spiral path
  const { curve, trailGeo } = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const segments = 80;
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const angle = t * Math.PI * 3 + offset;
      const radius = 2.2 * (1 - t * 0.85);
      const y = t * 5 - 2;
      pts.push(new THREE.Vector3(Math.cos(angle) * radius, y, Math.sin(angle) * radius));
    }
    const c = new THREE.CatmullRomCurve3(pts);
    const geo = new THREE.BufferGeometry().setFromPoints(c.getPoints(100));
    return { curve: c, trailGeo: geo };
  }, [offset]);

  // Particles moving along path
  const particleCount = 12;
  const particleGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed;
    if (pointsRef.current) {
      const pos = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < particleCount; i++) {
        const frac = ((t * 0.1 + i / particleCount) % 1);
        const pt = curve.getPoint(frac);
        pos.setXYZ(i, pt.x, pt.y, pt.z);
      }
      pos.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* Trail line */}
      <primitive object={new THREE.Line(trailGeo, new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.3 }))} />
      {/* Moving particles */}
      <points ref={pointsRef} geometry={particleGeo}>
        <pointsMaterial color={color} size={0.12} transparent opacity={0.9} sizeAttenuation />
      </points>
    </group>
  );
};

/* ─────────────── Data Nodes ─────────────── */
const DataNodes = () => {
  const ref = useRef<THREE.Group>(null);
  const nodes = useMemo(() => [
    { pos: [1.2, 0.5, 0.8] as [number, number, number], color: "#0071e3" },
    { pos: [-1.0, 1.2, 1.0] as [number, number, number], color: "#0071e3" },
    { pos: [0.5, 2.0, -1.2] as [number, number, number], color: "#10b981" },
    { pos: [-0.8, -0.5, -0.6] as [number, number, number], color: "#0071e3" },
  ], []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.children.forEach((child, i) => {
      child.scale.setScalar(1 + Math.sin(t * 2 + i) * 0.3);
    });
  });

  return (
    <group ref={ref}>
      {nodes.map((n, i) => (
        <mesh key={i} position={n.pos}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshBasicMaterial color={n.color} transparent opacity={0.8} />
        </mesh>
      ))}
    </group>
  );
};

/* ─────────────── Holographic Base Ring ─────────────── */
const BaseRing = () => {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (ref.current) {
      (ref.current.material as THREE.MeshBasicMaterial).opacity =
        0.1 + Math.sin(clock.getElapsedTime()) * 0.05;
    }
  });

  return (
    <group position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <mesh ref={ref}>
        <ringGeometry args={[2.5, 3, 64]} />
        <meshBasicMaterial color="hsl(217, 91%, 60%)" transparent opacity={0.1} side={THREE.DoubleSide} />
      </mesh>
      <mesh>
        <ringGeometry args={[1.5, 1.6, 64]} />
        <meshBasicMaterial color="hsl(213, 94%, 68%)" transparent opacity={0.06} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};

/* ─────────────── Scan Beam ─────────────── */
const ScanBeam = () => {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.getElapsedTime();
      const y = ((t * 0.5) % 1) * 7 - 3;
      ref.current.position.y = y;
      (ref.current.material as THREE.MeshBasicMaterial).opacity = 0.08 + Math.sin(t * 3) * 0.04;
    }
  });

  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[6, 0.03]} />
      <meshBasicMaterial color="hsl(217, 91%, 60%)" transparent opacity={0.1} side={THREE.DoubleSide} />
    </mesh>
  );
};

/* ─────────────── Scene Content ─────────────── */
const SceneContent = () => {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 8, 5]} intensity={0.6} color="hsl(213, 94%, 88%)" />
      <directionalLight position={[-3, 4, -5]} intensity={0.3} color="hsl(217, 91%, 70%)" />

      {/* Mountain */}
      <Float speed={1.5} rotationIntensity={0.05} floatIntensity={0.3}>
        <IceMountain />
        <Peak />
        <DataNodes />
      </Float>

      {/* Revenue Paths */}
      <RevenuePath color="#3b82f6" offset={0} speed={0.8} />
      <RevenuePath color="#10b981" offset={Math.PI * 0.66} speed={1.0} />
      <RevenuePath color="#f59e0b" offset={Math.PI * 1.33} speed={0.9} />

      {/* Base elements */}
      <BaseRing />
      <ScanBeam />

      {/* Ambient sparkles */}
      <Sparkles count={60} scale={8} size={1.5} speed={0.4} color="hsl(217, 91%, 60%)" opacity={0.3} />
      <Sparkles count={30} scale={5} size={2} speed={0.3} color="#10b981" opacity={0.2} />

      {/* Controls */}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={1.2}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2.2}
      />
    </>
  );
};

/* ─────────────── Main Component ─────────────── */
const MountRevenue = () => {
  const [hintVisible, setHintVisible] = useState(true);

  const handleInteraction = useCallback(() => {
    if (hintVisible) setHintVisible(false);
  }, [hintVisible]);

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      {/* 3D Canvas */}
      <div
        className="w-full aspect-square max-w-[600px] cursor-grab active:cursor-grabbing"
        onPointerDown={handleInteraction}
        onTouchStart={handleInteraction}
      >
        <Canvas
          camera={{ position: [0, 2, 7], fov: 45 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true }}
          style={{ background: "transparent" }}
        >
          <SceneContent />
        </Canvas>
      </div>

      {/* Caption */}
      <p
        className="text-center text-lg font-semibold tracking-[-0.2px]"
        style={{
          color: "hsla(0, 0%, 100%, 0.9)",
          textShadow: "0 0 20px hsla(217, 91%, 60%, 0.5)",
        }}
      >
        Every path leads to revenue
      </p>

      {/* Interaction hint */}
      <div
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full backdrop-blur-sm transition-opacity duration-500"
        style={{
          background: "hsla(217, 91%, 60%, 0.1)",
          border: "1px solid hsla(217, 91%, 60%, 0.2)",
          opacity: hintVisible ? 1 : 0,
          pointerEvents: hintVisible ? "auto" : "none",
        }}
      >
        <span className="text-xl animate-spin" style={{ animationDuration: "3s" }}>↻</span>
        <span className="text-[13px] font-semibold" style={{ color: "hsla(0, 0%, 100%, 0.7)" }}>
          Drag to rotate
        </span>
      </div>
    </div>
  );
};

export default MountRevenue;
