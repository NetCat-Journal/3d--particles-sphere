//notes:
//sizeAttenuation => near camera → bigger far away → smaller
//fog => foreground → bright background → fading
//fog => the same color as the background color to create a seamless effect
//Parametric Equation for Sphere:
//in bufferAtribute, we need to provide an array of positions for the particles. We can use the parametric equations for a sphere to generate these positions. The equations are as follows:

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

function Particles() {
    const particlesRef = useRef(null);

    useFrame((state, delta) => {
        if (particlesRef.current) {
            particlesRef.current.rotation.y += delta * 0.1; // Rotate the particles around the y-axis
            let currentPosition = particlesRef.current.geometry.attributes.position.array;; //current position of the particles
            const targetPosition = particles.endPositionArray; //target position of the particles
            console.log(currentPosition, targetPosition)
            for (let i = 0; i < currentPosition.length; i++) {
                currentPosition[i] += (targetPosition[i] - currentPosition[i]) * 0.02;
            }

            particlesRef.current.geometry.attributes.position.needsUpdate = true;
        }
    })

    const particles = useMemo(() => {
        const startPositionArray = new Float32Array(3000 * 3);
        const particleArray = new Float32Array(3000 * 3);
        const r = 1.5;

        for (let i = 0; i < particleArray.length; i += 3) {
            const startPositionX = Math.random() * 2 - 1; // Random value between -1 and 1
            const startPositionY = Math.random() * 2 - 1; // Random value between -1 and 1
            const startPositionZ = Math.random() * 2 - 1; // Random value between -1 and 1  
            startPositionArray[i] = startPositionX;
            startPositionArray[i + 1] = startPositionY;
            startPositionArray[i + 2] = startPositionZ;

            const phi = Math.acos(1 - 2 * Math.random());
            const theta = Math.random() * 2 * Math.PI;
            const x = r * Math.sin(phi) * Math.cos(theta)
            const y = r * Math.sin(phi) * Math.sin(theta)
            const z = r * Math.cos(phi)
            particleArray[i] = x
            particleArray[i + 1] = y
            particleArray[i + 2] = z
        }
        return { endPositionArray: particleArray, startPositionArray: startPositionArray };
    }, [])
    return (
        <>
            <points ref={particlesRef}>
                <bufferGeometry>
                    <bufferAttribute attach="attributes-position" count={particles.startPositionArray.length / 3} array={particles.startPositionArray} itemSize={3} />
                </bufferGeometry>
                <pointsMaterial size={0.03} color={"#9DFFFF"} sizeAttenuation fog blending={THREE.AdditiveBlending} transparent
                    depthWrite={false} />
            </points>
        </>

    )
}

export default Particles;