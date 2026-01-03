import './App.css';
import type { FC } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';

const App: FC = () => (
    <Canvas >
        <mesh>
            <boxGeometry />
            <meshBasicMaterial color="orange" />
        </mesh>
        <Grid />
        <OrbitControls />
    </Canvas >
);

export default App;
