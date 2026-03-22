//Notes:
//dpr => device pixel ratio, it determines the resolution of the canvas. A higher dpr will result in a sharper image but may also decrease performance. Setting it to [1, 2] allows the canvas to use a dpr of 1 on standard displays and 2 on high-resolution displays (like Retina screens), providing a balance between image quality and performance.

'use client'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei';
import Particles from './components/particles';

export default function Home() {
  return (
    <div className='w-full h-screen bg-[#110828]'>
      <Canvas camera={{ position: [0, 0, 4] }} dpr={[1, 2]}>
        <fog attach="fog" args={['#110828', 2, 4]} />
        <OrbitControls />
        <Particles />
      </Canvas>
    </div>
  );
}
