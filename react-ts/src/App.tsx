import './App.css';
import type { FC, RefObject } from 'react';
import { createRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { View, OrbitControls, Grid, PerspectiveCamera, Text } from '@react-three/drei';
import { Leva, useControls } from 'leva';
import { Splitter } from 'antd';

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
        {/* X+ (right face) */}
        <Text position={[0.51, 0, 0]} rotation={[0, Math.PI / 2, 0]} fontSize={0.3} color="white">
            X+
        </Text>
        {/* X- (left face) */}
        <Text position={[-0.51, 0, 0]} rotation={[0, -Math.PI / 2, 0]} fontSize={0.3} color="white">
            X-
        </Text>
        {/* Y+ (top face) */}
        <Text position={[0, 0.51, 0]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.3} color="white">
            Y+
        </Text>
        {/* Y- (bottom face) */}
        <Text position={[0, -0.51, 0]} rotation={[Math.PI / 2, 0, 0]} fontSize={0.3} color="white">
            Y-
        </Text>
        {/* Z+ (front face) */}
        <Text position={[0, 0, 0.51]} fontSize={0.3} color="white">
            Z+
        </Text>
        {/* Z- (back face) */}
        <Text position={[0, 0, -0.51]} rotation={[0, Math.PI, 0]} fontSize={0.3} color="white">
            Z-
        </Text>
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
            value: false,
        },
    });

    const views: ViewConfig[] = [
        {
            id: 'a',
            label: 'A',
            cameraPosition: [0, 0, -5],
        },
        {
            id: 'b',
            label: 'B',
            cameraPosition: [0, 5, 0],
        },
        {
            id: 'c',
            label: 'C',
            cameraPosition: [5, 0, 0],
        },
    ];

    const refs: RefObject<HTMLElement | null>[] = views.map(() => createRef<HTMLElement>());

    return (
        <>
            <div className="app">
                <Splitter>
                    <Splitter.Panel min="30%" max="70%">
                        <div className="view" ref={refs[0]}>
                            <div className="view__label">{views[0].label}</div>
                        </div>
                    </Splitter.Panel>
                    <Splitter.Panel defaultSize="calc((100vh - 1.5rem) / 2)" min="200px">
                        <Splitter layout="vertical">
                            <Splitter.Panel>
                                <div className="view" ref={refs[1]}>
                                    <div className="view__label">{views[1].label}</div>
                                </div>
                            </Splitter.Panel>
                            <Splitter.Panel>
                                <div className="view" ref={refs[2]}>
                                    <div className="view__label">{views[2].label}</div>
                                </div>
                            </Splitter.Panel>
                        </Splitter>
                    </Splitter.Panel>
                </Splitter>
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
