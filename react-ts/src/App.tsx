import './App.css';
import type { FC } from 'react';
import { useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import { Leva, useControls } from 'leva';


const App: FC = () => {
    const { color, wireframe } = useControls({
        color: {
            label: 'Color',
            value: 'orange',
            options: ['orange', 'green', 'blue'],
        },
        wireframe: {
            label: 'Wireframe',
            value: true,
        },
    });

    return (
        <>
            <Canvas>
                <mesh>
                    <boxGeometry />
                    <meshBasicMaterial color={color} wireframe={wireframe} />
                </mesh>
                <Grid />
                <OrbitControls />
            </Canvas>
            <Leva />
        </>
    );
};

export default App;
