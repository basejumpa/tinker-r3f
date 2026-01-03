import './App.css';
import type { FC } from 'react';
import { useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import { Leva, useControls } from 'leva';

type CameraControllerProps = {
    cameraZ: number;
};

const CameraController: FC<CameraControllerProps> = ({ cameraZ }) => {
    const { camera } = useThree();

    useEffect(() => {
        camera.position.set(camera.position.x, camera.position.y, cameraZ);
        camera.updateProjectionMatrix();
    }, [camera, cameraZ]);

    return null;
};

const App: FC = () => {
    const { color, wireframe, cameraZ } = useControls({
        color: {
            label: 'Color',
            value: 'orange',
            options: ['orange', 'green', 'blue'],
        },
        wireframe: {
            label: 'Wireframe',
            value: true,
        },
        cameraZ: {
            label: 'Camera Z',
            value: 8,
            min: 2,
            max: 20,
            step: 1,
        },
    });

    return (
        <>
            <Canvas camera={{ position: [0, 0, cameraZ], fov: 50 }}>
                <CameraController cameraZ={cameraZ} />
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
