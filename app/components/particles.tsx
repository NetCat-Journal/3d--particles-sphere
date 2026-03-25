//notes:
//sizeAttenuation => near camera → bigger far away → smaller
//fog => foreground → bright background → fading
//fog => the same color as the background color to create a seamless effect
//Parametric Equation for Sphere:
//in bufferAtribute, we need to provide an array of positions for the particles. We can use the parametric equations for a sphere to generate these positions. The equations are as follows:
//blending={THREE.AdditiveBlending} for additive blending, which allows the particles to blend together and create a glowing effect. This is particularly effective for creating a sense of depth and luminosity in the particle system.
//depthWrite={false} particles dont hide each other they particles stack like light
//transparent={true} allows the particles to be transparent, which is essential for achieving the desired visual effect when using additive blending. This ensures that the particles can blend together and create a glowing effect without being completely opaque.   
//opacity={1.0} sets the opacity of the particles to 1, making them fully visible. This is important for achieving the desired visual effect when using additive blending, as it allows the particles to blend together and create a glowing effect without being completely transparent.   



import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";


function Particles() {
    const particlesRef = useRef(null);
    const { mouse } = useThree()

    useFrame((state, delta) => {
        if (particlesRef.current) {
            particlesRef.current.rotation.y += delta * 0.1; // Rotate the particles around the y-axis

            let currentPosition = particlesRef.current.geometry.attributes.position.array;; //current position of the particles
            const targetPosition = particles.endPositionArray; //target position of the particles
            console.log(currentPosition, targetPosition)


            for (let i = 0; i < currentPosition.length; i += 3) {

                const x = currentPosition[i]
                const y = currentPosition[i + 1]
                const z = currentPosition[i + 2]

                const dx = mouse.x * 3 - x //multiple by 3 makes mouse recation all over the sphere, since r=1.5 and mouse.x just covet between -1 and 1  so multiply by 3 makes the mouse reaction cover the whole sphere, otherwise it will only react to the center of the sphere    
                const dy = mouse.y * 3 - y
                const dz = -z

                const distance = Math.sqrt(dx * dx + dy * dy + dz * dz)

                const directionX = dx / distance
                const directionY = dy / distance
                const directionZ = dz / distance

                // return to sphere
                //currentPosition[i] += (targetPosition[i] - x) * 0.02
                //currentPosition[i + 1] += (targetPosition[i + 1] - y) * 0.02 //linear interpolation to move the particles towards their target position
                //currentPosition[i + 2] += (targetPosition[i + 2] - z) * 0.02

                const forceRadius = 1.2;

                if (distance < forceRadius && distance > 0.001) {
                    // repulsion + swirl only
                    const force = (forceRadius - distance) * 0.05
                    const swirlStrength = 0.05 * (1 / (distance + 0.5))

                    currentPosition[i] -= directionX * force
                    currentPosition[i + 1] -= directionY * force
                    currentPosition[i + 2] -= directionZ * force

                    currentPosition[i] += -directionY * swirlStrength  // swirlX
                    currentPosition[i + 1] += directionX * swirlStrength  // swirlY
                } else {
                    // lerp only when mouse is far away
                    currentPosition[i] += (targetPosition[i] - x) * 0.02
                    currentPosition[i + 1] += (targetPosition[i + 1] - y) * 0.02
                    currentPosition[i + 2] += (targetPosition[i + 2] - z) * 0.02
                }
            }
            particlesRef.current.geometry.attributes.position.needsUpdate = true;
            //  console.log(mouse.x, mouse.y)
        }
    })

    const particles = useMemo(() => {
        const startPositionArray = new Float32Array(12000 * 3);
        const particleArray = new Float32Array(12000 * 3);
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
                <pointsMaterial size={0.02} color={"#9DFFFF"} sizeAttenuation fog blending={THREE.AdditiveBlending} transparent={true} opacity={1.0}
                    depthWrite={false} />
            </points>
        </>

    )
}

export default Particles;