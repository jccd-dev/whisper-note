'use client';

import { useRef } from 'react';
import { useGLTF, Float } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const RoseModel = ({
    position = [0, 0, 0],
    scale = 1,
    rotation = [0, 0, 0],
}: {
    position?: [number, number, number];
    scale?: number;
    rotation?: [number, number, number];
}) => {
    const { scene } = useGLTF('/rose.gltf');
    const roseRef = useRef<THREE.Group>(null);

    // Apply custom materials to fix missing/dark colors
    scene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            // Identify parts based on material names or geometry logic if names are generic
            // Assuming typical structure: petals might be one material, stem/leaves another

            // Create a vibrant red material for the rose
            const redMaterial = new THREE.MeshStandardMaterial({
                color: '#e32636', // Alizarin Crimson
                emissive: '#500000',
                emissiveIntensity: 0.2,
                roughness: 0.3,
                metalness: 0.1,
            });

            // Create a green material for stem/leaves
            const greenMaterial = new THREE.MeshStandardMaterial({
                color: '#228B22', // Forest Green
                roughness: 0.5,
                metalness: 0.0,
            });

            // Simple heuristic: if it looks like a stem (often cylinder) or leaf, make it green.
            // If it's the main flower head, make it red.
            // Adjusting based on standard low-poly rose structures.
            // Often 'Cylinder' or 'Cube' names are used.
            // Let's try to color everything red first, then specific parts green if we can identify them.
            // Or better: Check original material name if available.

            // For now, let's just make it all Red for visibility as a test,
            // OR use the logic from the bouquet component if applicable.
            // The user said "rose has no color", implying textures/materials might be broken.

            // Let's blindly apply a nice red to everything for now to ensure visibility,
            // as a single rose icon usually is red.
            // If the model has multiple meshes, we might need to be smarter.

            // Re-using logic from bouquet component as a base heuristic
            const materialName = Array.isArray(mesh.material)
                ? (mesh.material[0]?.name ?? '')
                : (mesh.material.name ?? '');

            if (
                materialName.includes('green') ||
                materialName.includes('leaf') ||
                materialName.includes('stem') ||
                mesh.name.toLowerCase().includes('stem') ||
                mesh.name.toLowerCase().includes('leaf')
            ) {
                mesh.material = greenMaterial;
            } else {
                // Default to red for the flower part
                mesh.material = redMaterial;
            }
        }
    });

    useFrame((state) => {
        if (roseRef.current) {
            roseRef.current.rotation.y =
                Math.sin(state.clock.elapsedTime * 0.5) * 0.2 + rotation[1];
        }
    });

    return (
        <group
            ref={roseRef}
            position={position}
            scale={scale}
            rotation={rotation}
        >
            <primitive object={scene} />
        </group>
    );
};

export default function SingleRose() {
    return (
        <div className="w-full h-full">
            <Canvas
                camera={{ position: [0, 0, 5], fov: 45 }}
                gl={{ alpha: true }}
            >
                <ambientLight intensity={2} />
                <spotLight
                    position={[10, 10, 10]}
                    angle={0.3}
                    penumbra={1}
                    intensity={3}
                    color="#ffcccc"
                />
                <pointLight
                    position={[-10, -10, -10]}
                    intensity={1}
                    color="#ffffff"
                />
                <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                    <RoseModel
                        position={[0, -1, 0]}
                        scale={2.5}
                        rotation={[0.5, 0, 0]}
                    />
                </Float>
            </Canvas>
        </div>
    );
}
