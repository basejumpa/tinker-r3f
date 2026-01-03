import './App.css';
import type { FC } from 'react';
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
            <meshBasicMaterial color={color} wireframe={wireframe} />
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

    const refs = views.map(() => createRef<HTMLDivElement>());

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
                        <OrbitControls
                            enableDamping
                            target={[0, 0, 0]}
                        />
                    </View>
                ))}
            </Canvas>
        </>
    );
};

export default App;
