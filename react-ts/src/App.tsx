import './App.css';
import type { FC } from 'react';
import { Canvas } from '@react-three/fiber';

const App: FC = () => (
    <Canvas >
        <mesh>
            <boxGeometry />
            <meshBasicMaterial color="orange" />
        </mesh>
    </Canvas>
);

export default App;
