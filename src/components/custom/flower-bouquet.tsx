'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
    OrbitControls,
    Environment,
    Float,
    Sparkles,
    useGLTF,
    Center,
} from '@react-three/drei';
import * as THREE from 'three';

const FlowerModel = ({
    position,
    targetScale = 1,
    rotation = [0, 0, 0],
    color = '#e32636',
    delay = 0,
}: {
    position: [number, number, number];
    targetScale?: number;
    rotation?: [number, number, number];
    color?: string;
    delay?: number;
}) => {
    const { scene } = useGLTF('/anotherflowers/flower.gltf');
    const [startBloom, setStartBloom] = useState(false);

    const clone = useMemo(() => {
        const clonedScene = scene.clone();
        clonedScene.traverse((child) => {
            if (child.name.startsWith('Cube')) {
                child.visible = false;
                child.scale.set(0, 0, 0);
                return;
            }

            if ((child as THREE.Mesh).isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                const mesh = child as THREE.Mesh;
                const material = mesh.material;
                const materialName = Array.isArray(material)
                    ? (material[0]?.name ?? '')
                    : (material.name ?? '');

                if (materialName === 'taç yaprak' || materialName === '1') {
                    mesh.material = new THREE.MeshStandardMaterial({
                        color: color,
                        roughness: 0.3,
                        metalness: 0.1,
                    });
                } else if (
                    materialName === 'yaprak' ||
                    materialName.includes('sapı')
                ) {
                    mesh.material = new THREE.MeshStandardMaterial({
                        color: '#228B22',
                        roughness: 0.5,
                        metalness: 0.0,
                    });
                } else {
                    mesh.material = new THREE.MeshStandardMaterial({
                        color: '#228B22',
                        roughness: 0.5,
                        metalness: 0.0,
                    });
                }
            }
        });
        return clonedScene;
    }, [scene, color]);

    const groupRef = useRef<THREE.Group>(null);
    const scaleRef = useRef(0);

    useEffect(() => {
        const timeout = setTimeout(() => setStartBloom(true), delay * 1000);
        return () => clearTimeout(timeout);
    }, [delay]);

    useFrame((state, delta) => {
        if (groupRef.current) {
            if (startBloom) {
                scaleRef.current = THREE.MathUtils.lerp(
                    scaleRef.current,
                    targetScale,
                    delta * 2
                );
            }
            groupRef.current.scale.setScalar(scaleRef.current);

            const time = state.clock.elapsedTime;
            groupRef.current.rotation.z =
                rotation[2] + Math.sin(time * 0.5 + position[0]) * 0.05;
            groupRef.current.rotation.x =
                rotation[0] + Math.cos(time * 0.3 + position[1]) * 0.03;
        }
    });

    return (
        <group ref={groupRef} position={position} rotation={rotation} scale={0}>
            <Center>
                <primitive object={clone} />
            </Center>
        </group>
    );
};

const Petal = ({
    mesh,
    range,
    seed,
}: {
    mesh: THREE.Mesh;
    range: number;
    seed: number;
}) => {
    const ref = useRef<THREE.Group>(null);

    const seededRandom = useCallback(
        (offset: number) => {
            const value = Math.sin(seed + offset) * 10000;
            return value - Math.floor(value);
        },
        [seed]
    );

    const initialPos = useMemo(() => {
        const x = (seededRandom(1) - 0.5) * range * 3;
        const y = -10 + seededRandom(2) * 30;
        const z = -2 + seededRandom(3) * 4;
        return new THREE.Vector3(x, y, z);
    }, [range, seededRandom]);

    const rotationSpeed = useMemo(
        () => ({
            x: seededRandom(4) * 0.02,
            y: seededRandom(5) * 0.02,
            z: seededRandom(6) * 0.02,
        }),
        [seededRandom]
    );

    useFrame((state, delta) => {
        if (!ref.current) return;

        ref.current.position.y -= delta * 0.8;

        ref.current.rotation.x += rotationSpeed.x;
        ref.current.rotation.y += rotationSpeed.y;
        ref.current.rotation.z += rotationSpeed.z;

        ref.current.position.x +=
            Math.sin(state.clock.elapsedTime + initialPos.x) * 0.005;

        if (ref.current.position.y < -10) {
            ref.current.position.y = 15 + Math.random() * 5;
            ref.current.position.x = THREE.MathUtils.randFloatSpread(range * 3); // Randomize X on reset
        }
    });

    return (
        <group ref={ref} position={initialPos}>
            <mesh
                geometry={mesh.geometry}
                material={
                    new THREE.MeshStandardMaterial({
                        color: '#dc143c',
                        emissive: '#8b0000',
                        emissiveIntensity: 0.2,
                        side: THREE.DoubleSide,
                        transparent: true,
                        opacity: 0.9,
                    })
                }
                scale={0.15}
            />
        </group>
    );
};

const FallingPetals = ({ count = 50 }: { count?: number }) => {
    const { nodes } = useGLTF('/petals/petal.gltf') as {
        nodes: Record<string, THREE.Object3D>;
    };
    const { viewport } = useThree();

    const petals = useMemo(() => {
        return Object.values(nodes).filter(
            (node): node is THREE.Mesh =>
                node instanceof THREE.Mesh && node.name.startsWith('petal')
        );
    }, [nodes]);

    if (petals.length === 0) return null;

    return (
        <group position={[0, 0, -5]}>
            {Array.from({ length: count }).map((_, i) => (
                <Petal
                    key={i}
                    mesh={petals[i % petals.length]}
                    range={viewport.width / 2}
                    seed={i}
                />
            ))}
        </group>
    );
};

const Bouquet = () => {
    const { viewport } = useThree();
    const isMobile = viewport.width < 5;

    const baseScale = isMobile ? 0.5 : 0.6;

    const spacing = isMobile ? 0.5 : 0.8;

    return (
        <group position={[0, -2.2, 0]}>
            <FlowerModel
                position={[0, 0, 0]}
                targetScale={0.8 * baseScale}
                rotation={[0, 0, 0]}
                color="#e32636"
                delay={0.1}
            />

            <FlowerModel
                position={[-1.0 * spacing, -0.2, 0.5]}
                targetScale={0.7 * baseScale}
                rotation={[0, 0, 0.2]}
                color="#ff69b4"
                delay={0.3}
            />
            <FlowerModel
                position={[1.0 * spacing, -0.2, 0.5]}
                targetScale={0.7 * baseScale}
                rotation={[0, 0, -0.2]}
                color="#ff1493"
                delay={0.5}
            />
            <FlowerModel
                position={[-0.5 * spacing, 0.6 * spacing, -0.5]}
                targetScale={0.6 * baseScale}
                rotation={[0.2, 0, 0.1]}
                color="#e32636"
                delay={0.7}
            />
            <FlowerModel
                position={[0.5 * spacing, 0.6 * spacing, -0.5]}
                targetScale={0.6 * baseScale}
                rotation={[0.2, 0, -0.1]}
                color="#ff69b4"
                delay={0.9}
            />
        </group>
    );
};

export default function FlowerBouquet() {
    return (
        <div className="relative w-full h-full min-h-[50vh]">
            {/* Background Petals Layer - Fixed Camera, No OrbitControls */}
            <div className="absolute inset-0 pointer-events-none">
                <Canvas
                    camera={{ position: [0, 0, 10], fov: 45 }}
                    dpr={[1, 2]}
                    gl={{ alpha: true }}
                    style={{ pointerEvents: 'none' }}
                >
                    <ambientLight intensity={1} />
                    <pointLight position={[10, 10, 10]} intensity={1} />
                    <FallingPetals />
                </Canvas>
            </div>

            {/* Foreground Flower Layer - Interactive */}
            <Canvas
                className="absolute inset-0 z-0"
                camera={{ position: [0, 0.6, 12], fov: 45 }}
                shadows
                dpr={[1, 2]}
                performance={{ min: 0.5 }}
                gl={{ alpha: true }} // Transparent background
            >
                {/* Removed background color attachment to allow petals to show through */}

                <ambientLight intensity={0.5} />
                <spotLight
                    position={[10, 10, 10]}
                    angle={0.15}
                    penumbra={1}
                    intensity={1}
                    castShadow
                />
                <pointLight position={[-10, -10, -10]} intensity={0.5} />

                <Environment preset="sunset" />

                <Float
                    speed={2}
                    rotationIntensity={0.1}
                    floatIntensity={0.1}
                    floatingRange={[-0.1, 0.1]}
                >
                    <Bouquet />
                </Float>

                <Sparkles
                    count={30}
                    scale={8}
                    size={4}
                    speed={0.4}
                    opacity={0.3}
                    color="#ff69b4"
                />

                <OrbitControls
                    enableZoom={true}
                    enablePan={false}
                    minDistance={5}
                    maxDistance={20}
                />
            </Canvas>

            {/* Foreground Petals Layer - Fixed Camera, No OrbitControls */}
            <div className="absolute inset-0 pointer-events-none z-10">
                <Canvas
                    camera={{ position: [0, 0, 10], fov: 45 }}
                    dpr={[1, 2]}
                    gl={{ alpha: true }}
                    style={{ pointerEvents: 'none' }}
                >
                    <ambientLight intensity={1} />
                    <pointLight position={[10, 10, 10]} intensity={1} />
                    {/* Fewer petals in foreground to avoid blocking view too much */}
                    <FallingPetals count={20} />
                </Canvas>
            </div>
        </div>
    );
}

useGLTF.preload('/anotherflowers/flower.gltf');
useGLTF.preload('/petals/petal.gltf');
