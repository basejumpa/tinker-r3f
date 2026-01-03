import './App.css';
import type { FC } from 'react';
import { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import { Leva, useControls } from 'leva';
import { Vector3 } from 'three';

type ViewConfig = {
    id: string;
    label: string;
    cameraPosition: [number, number, number];
};

type ViewProps = ViewConfig & {
    color: string;
    wireframe: boolean;
};

const SceneContents: FC<{ color: string; wireframe: boolean }> = ({ color, wireframe }) => (
    <>
        <mesh>
            <boxGeometry />
            <meshBasicMaterial color={color} wireframe={wireframe} />
        </mesh>
        <Grid />
    </>
);

const View: FC<ViewProps> = ({ id, label, cameraPosition, color, wireframe }) => {
    const camera = useMemo(
        () => ({ position: new Vector3(...cameraPosition) }),
        [cameraPosition],
    );

    return (
        <div className="view" key={id}>
            <div className="view__label">{label}</div>
            <Canvas className="view__canvas" camera={camera}>
                <color attach="background" args={["#0b0c12"]} />
                <SceneContents color={color} wireframe={wireframe} />
                <OrbitControls enableDamping target={[0, 0, 0]} />
            </Canvas>
        </div>
    );
};

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

    const views: ViewConfig[] = [
        {
            id: 'iso',
            label: 'Isometric',
            cameraPosition: [4, 3, 4],
        },
        {
            id: 'front',
            label: 'Front',
            cameraPosition: [0, 2, 6],
        },
        {
            id: 'top',
            label: 'Top',
            cameraPosition: [0, 6, 0],
        },
    ];

    return (
        <div className="app">
            {views.map((view) => (
                <View key={view.id} {...view} color={color} wireframe={wireframe} />
            ))}
            <Leva collapsed />
        </div>
    );
};

export default App;
