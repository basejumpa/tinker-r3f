import './App.css';
import type { FC, RefObject } from 'react';
import { createRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { View, OrbitControls, Grid, PerspectiveCamera } from '@react-three/drei';
import { Leva, useControls } from 'leva';

type ViewConfig = {
    id: string;
    label: string;
    cameraPosition: [number, number, number];
};

const SceneContents: FC<{ color: string; wireframe: boolean }> = ({ color, wireframe }) => (
    <>
        <mesh>
            <boxGeometry />
            <meshBasicMaterial color={color} wireframe={wireframe} attach="material-0" />
            <meshBasicMaterial color="red" wireframe={wireframe} attach="material-1" />
            <meshBasicMaterial color="green" wireframe={wireframe} attach="material-2" />
            <meshBasicMaterial color="blue" wireframe={wireframe} attach="material-3" />
            <meshBasicMaterial color="yellow" wireframe={wireframe} attach="material-4" />
            <meshBasicMaterial color="magenta" wireframe={wireframe} attach="material-5" />
        </mesh>
        <Grid />
    </>
);

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
            id: 'a',
            label: 'A',
            cameraPosition: [5, 0, 0],
        },
        {
            id: 'b',
            label: 'B',
            cameraPosition: [0, 5, 0],
        },
        {
            id: 'c',
            label: 'C',
            cameraPosition: [0, 0, 5],
        },
    ];

    const refs: RefObject<HTMLElement | null>[] = views.map(() => createRef<HTMLElement>());

    return (
        <>
            <div className="app">
                {views.map((view, index) => (
                    <div className="view" key={view.id} ref={refs[index]}>
                        <div className="view__label">{view.label}</div>
                    </div>
                ))}
                <Leva collapsed />
            </div>
            <Canvas
                className="canvas"
                style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
                eventSource={document.getElementById('root')!}
                eventPrefix="client"
            >
                <color attach="background" args={['#0b0c12']} />
                {views.map((view, index) => (
                    <View key={view.id} track={refs[index]}>
                        <PerspectiveCamera makeDefault position={view.cameraPosition} />
                        <color attach="background" args={['#0b0c12']} />
                        <SceneContents color={color} wireframe={wireframe} />
                        <OrbitControls />
                    </View>
                ))}
            </Canvas>
        </>
    );
};

export default App;
