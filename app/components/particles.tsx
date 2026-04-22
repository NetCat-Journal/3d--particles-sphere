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
//Alpha = 0 means invisible, 255 means solid
//Darkest possible:R=0, G=0, B=0 (0 + 0 + 0) / 3 = 0, Brightest possible:R=255, G=255, B=255(255 + 255 + 255) / 3 = 255
// if image with particle to small or to big need to ajast the camera in canvas and also scale here positions.push((x - width / 2) * 0.02...

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { useEffect } from "react";


function Particles() {
    const PARTICLE_COUNT = 16000;
    const particlesRef = useRef(null);
    const { mouse } = useThree();
    const velocityRef = useRef(new Float32Array(PARTICLE_COUNT * 3)); //velocity of the particles
    const explodeRef = useRef(false) //flag to trigger explosion
    const explosionStrengthRef = useRef(0) //store 1 in variable 
    const imagePositionsRef = useRef(null) //store the position of the image
    const imageColorsRef = useRef(null)

    //for explosion on click 
    //useEffect(() => {
    //     const handleClick = () => {
    //         explodeRef.current = true

    //         setTimeout(() => {
    //             explodeRef.current = false
    //         }, 2000) // short burst
    //     }

    //    window.addEventListener("click", handleClick)
    //    return () => window.removeEventListener("click", handleClick)
    //}, [])

    //useEffect for image position
    useEffect(() => {
        const positions = [];
        const colors = [];
        const canvas = document.createElement("canvas"); //get the canvas element from the DOM
        const ctx = canvas.getContext("2d");//create a 2D rendering context for the canvas, which allows us to draw on it
        const img = new Image(); //create a new image element
        img.src = "/cat-logo.png"; //set the source of the image to the specified path
        img.onload = () => {
            const width = 300; //get the width of the canvas
            const height = 300; //get the height of the canvas
            canvas.width = width; //set the width of the canvas
            canvas.height = height; //set the height of the canvas
            ctx.drawImage(img, 0, 0, width, height); //draw the image onto the canvas at the specified position and size
            const imageData = ctx.getImageData(0, 0, width, height)
            //console.log("First pixel:", imageData.data[0], imageData.data[1], imageData.data[2], imageData.data[3])
            console.log("Center pixel:",
                imageData.data[((150 * 300) + 150) * 4],
                imageData.data[((150 * 300) + 150) * 4 + 1],
                imageData.data[((150 * 300) + 150) * 4 + 2],
                imageData.data[((150 * 300) + 150) * 4 + 3]
            )
            for (let y = 0; y < height; y += 1) {
                for (let x = 0; x < width; x += 1) {
                    const i = (y * width + x) * 4; //calculate the index of the pixel in the image data array based on its x and y coordinates
                    const r = imageData.data[i] //get the red value of the pixel
                    const g = imageData.data[i + 1] //get the green value of the pixel
                    const b = imageData.data[i + 2] //get the blue value of the pixel
                    const alpha = imageData.data[i + 3]
                    const brightness = (r + g + b) / 3;

                    //const isBackground = r < 30 && g < 30 && b < 50

                    if (alpha > 128 && brightness > 100) { //only consider pixels that are not transparent and have a certain brightness level, which helps to create a more visually appealing particle effect by focusing on the more prominent features of the image and ignoring the darker or more transparent areas.
                        console.log(`pixel ${brightness}: r=${r} g=${g} b=${b} a=${alpha}`)
                        positions.push(  //converting to 3d
                            (x - width / 2) * 0.02, //center the image by subtracting half of the width and height from the x and y coordinates, and then scale it down by multiplying by 0.03 to fit within the desired space in the 3D scene. This allows us to create a particle system that accurately represents the shape and details of the original image while maintaining a manageable size for rendering.
                            -(y - height / 2) * 0.02,
                            (Math.random() - 0.5) * 0.005
                            //brightness * 0.3
                        )
                        colors.push(
                            r / 255 * 1.2,  //divide by 255 to normalize the color values to the range of 0 to 1, which is the expected format for colors in WebGL and Three.js. This allows us to use the color values directly in our shader or material without needing to convert them again.
                            g / 255 * 1.2, //multiply by 1.4 to increse brighteness of the particles, since the original image is quite dark, this will help to make the particles more visible and vibrant in the 3D scene. Adjusting the brightness can enhance the overall visual impact of the particle system and make it more engaging for viewers.
                            b / 255 * 1.2
                        )
                    }
                }
            }
            //const particleCount = 12000;

            const imagePositions = new Float32Array(PARTICLE_COUNT * 3);
            const imageColors = new Float32Array(PARTICLE_COUNT * 3);
            //console.log("Total image positions:", positions.length / 3)
            for (let i = 0; i < PARTICLE_COUNT; i++) {
                //const index = (i % (positions.length / 3)) * 3;
                const index = Math.floor(Math.random() * (positions.length / 3)) * 3;
                imagePositions[i * 3] = positions[index];
                imagePositions[i * 3 + 1] = positions[index + 1];
                imagePositions[i * 3 + 2] = positions[index + 2];

                imageColors[i * 3] = colors[index];
                imageColors[i * 3 + 1] = colors[index + 1];
                imageColors[i * 3 + 2] = colors[index + 2];
            }

            imagePositionsRef.current = imagePositions;
            imageColorsRef.current = imageColors;

            // ✅ set ONLY color (NOT position)
            particlesRef.current.geometry.setAttribute(
                "color",
                new THREE.BufferAttribute(imageColorsRef.current, 3)
            );

        }
    }, [])

    useFrame((state, delta) => {

        explosionStrengthRef.current *= 0.96 //explosion strength decrease over time
        if (particlesRef.current) {
            //particlesRef.current.rotation.y += delta * 0.1; // Rotate the particles around the y-axis
            let currentPosition = particlesRef.current.geometry.attributes.position.array;; //current position of the particles
            const targetPosition = imagePositionsRef.current || particles.endPositionArray; //target position of the particles
            if (!targetPosition) return;
            const velocity = velocityRef.current


            for (let i = 0; i < currentPosition.length; i += 3) {
                const x = currentPosition[i]
                const y = currentPosition[i + 1]
                const z = currentPosition[i + 2]

                const dx = mouse.x * 3 - x //multiple by 3 makes mouse recation all over the sphere, since r=1.5 and mouse.x just covet between -1 and 1  so multiply by 3 makes the mouse reaction cover the whole sphere, otherwise it will only react to the center of the sphere    
                const dy = mouse.y * 3 - y
                const dz = 0 //since mouse is 2D, we can only get the x and y position of the mouse, so we set the z position to 0, which means the mouse will only affect the particles in the x and y direction, and the particles will not be affected in the z direction, this creates a more natural and intuitive interaction as the particles will react to the mouse movement in a way that feels more realistic and engaging.  

                const distance = Math.max(
                    Math.sqrt(dx * dx + dy * dy + dz * dz),
                    0.05
                )

                const directionX = dx / distance
                const directionY = dy / distance
                const directionZ = dz / distance

                const forceRadius = 0.5;

                if (distance < forceRadius && distance > 0.001) {
                    const force = (forceRadius - distance) * 0.05
                    const strength = (forceRadius - distance) / forceRadius //linear falloff
                    const swirlStrength = strength * 0.03
                    //without velocity just dirrect movement 
                    //currentPosition[i] -= directionX * force
                    //currentPosition[i + 1] -= directionY * force
                    //currentPosition[i + 2] -= directionZ * force

                    //currentPosition[i] += -directionY * swirlStrength  // swirlX
                    //currentPosition[i + 1] += directionX * swirlStrength  // swirlY

                    //with velocity

                    velocity[i] -= directionX * force
                    velocity[i + 1] -= directionY * force
                    velocity[i + 2] -= directionZ * force

                    velocity[i] += -directionY * swirlStrength  // swirlX
                    velocity[i + 1] += directionX * swirlStrength  // swirlY

                }
                // lerp only when mouse is far away without velocity
                //currentPosition[i] += (targetPosition[i] - x) * 0.02
                //currentPosition[i + 1] += (targetPosition[i + 1] - y) * 0.02
                //currentPosition[i + 2] += (targetPosition[i + 2] - z) * 0.02

                // with velocity
                //will have this spring effect when mouse move away, the particles will spring back to their original position, the strength of the spring is determined by the distance between the current position and the target position, the farther away the particle is from its target position, the stronger the spring force will be, which creates a natural and dynamic movement as the particles are attracted back to their original positions while still being influenced by the mouse interaction and explosion effect.
                //velocity[i] += (targetPosition[i] - x) * 0.02
                //velocity[i + 1] += (targetPosition[i + 1] - y) * 0.02
                //velocity[i + 2] += (targetPosition[i + 2] - z) * 0.02

                //effect when not click come back to original position to the sphare 
                //if (!explodeRef.current) {
                //    velocity[i] += (targetPosition[i] - x) * 0.003 //im heigher then slower particles going to there position slower 
                //    velocity[i + 1] += (targetPosition[i + 1] - y) * 0.003
                //    velocity[i + 2] += (targetPosition[i + 2] - z) * 0.003
                // }

                //explosion effect when click
                //if (explodeRef.current) {
                //    const explosionForce = 0.2; //how hard particles are push

                //    velocity[i] += (Math.random() - 0.5) * explosionForce + (Math.random() - 0.5)//Random direction explosion
                //    velocity[i + 1] += (Math.random() - 0.5) * explosionForce + (Math.random() - 0.5)
                //    velocity[i + 2] += (Math.random() - 0.5) * explosionForce + (Math.random() - 0.5)
                // }



                if (explosionStrengthRef.current > 0.001) {
                    const explosionForce = 0.12 //how hard particles are push

                    velocity[i] += x * explosionForce + (Math.random() - 0.5) * 0.5//Random direction explosion
                    velocity[i + 1] += y * explosionForce + (Math.random() - 0.5) * 0.5
                    velocity[i + 2] += z * explosionForce + (Math.random() - 0.5) * 0.5
                }

                if (explosionStrengthRef.current < 0.2) { //return of particles  
                    velocity[i] += (targetPosition[i] - x) * 0.08 //multiply by 0.0015 makes the particles return to their original position slower, which creates a more natural and dynamic movement as the particles are attracted back to their original positions while still being influenced by the mouse interaction and explosion effect.
                    velocity[i + 1] += (targetPosition[i + 1] - y) * 0.08
                    velocity[i + 2] += (targetPosition[i + 2] - z) * 0.08
                }

                // Damping — slows velocity over time so particles don't fly forever
                velocity[i] *= 0.88
                velocity[i + 1] *= 0.88
                velocity[i + 2] *= 0.88

                const maxSpeed = 0.05

                const vx = velocity[i]
                const vy = velocity[i + 1]
                const vz = velocity[i + 2]

                const speed = Math.sqrt(vx * vx + vy * vy + vz * vz)

                if (speed > maxSpeed) {
                    const scale = maxSpeed / speed
                    velocity[i] *= scale
                    velocity[i + 1] *= scale
                    velocity[i + 2] *= scale
                }

                // Apply velocity to position
                currentPosition[i] += velocity[i]
                currentPosition[i + 1] += velocity[i + 1]
                currentPosition[i + 2] += velocity[i + 2]
            }
            particlesRef.current.geometry.attributes.position.needsUpdate = true;
            if (particlesRef.current.geometry.attributes.color) {
                particlesRef.current.geometry.attributes.color.needsUpdate = true;
            }
            //  console.log(mouse.x, mouse.y)
        }
    })

    const particles = useMemo(() => {
        const startPositionArray = new Float32Array(PARTICLE_COUNT * 3);
        const particleArray = new Float32Array(PARTICLE_COUNT * 3);
        const colorArray = new Float32Array(PARTICLE_COUNT * 3).fill(1);
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
        return { endPositionArray: particleArray, startPositionArray: startPositionArray, colorArray: colorArray };
    }, [])
    return (
        <>
            <points ref={particlesRef}>
                <bufferGeometry>
                    <bufferAttribute attach="attributes-position" count={particles.startPositionArray.length / 3} array={particles.startPositionArray} itemSize={3} />
                    <bufferAttribute attach="attributes-color" count={PARTICLE_COUNT} array={particles.colorArray} itemSize={3} />
                </bufferGeometry>
                <pointsMaterial size={0.02} vertexColors={true} //color={"#9DFFFF"}
                    sizeAttenuation transparent={true} blending={THREE.AdditiveBlending}       // removed  blending={THREE.AdditiveBlending} for additive blending, which allows the particles to blend together and create a glowing effect. This is particularly effective for creating a sense of depth and luminosity in the particle system.Removed because when converting img to particles this effect create just purple particles not cyan and pink like on the image, but you can add it back for more glowing effect if you want, just change the color to cyan or pink
                    opacity={0.5}
                    depthWrite={false} />
            </points>
        </>

    )
}

export default Particles;