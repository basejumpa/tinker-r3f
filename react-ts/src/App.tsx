import './App.css';
import type { FC, RefObject } from 'react';
import { createRef, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { View, OrbitControls, Grid, PerspectiveCamera, Text } from '@react-three/drei';
import { Leva, useControls } from 'leva';
import { Splitter } from 'antd';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { Selector } from './Selector';

type ViewConfig = {
    id: string;
    label: string;
    cameraPosition: [number, number, number];
};

const SceneContents: FC<{ color: string; wireframe: boolean }> = ({ color, wireframe }) => (
    <>
        <mesh
            onClick={(e) => {
                console.log('Box clicked at:', e.point);
            }}
        >
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
        <Selector />
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
    const controlsRefB = useRef<OrbitControlsImpl>(null);
    const controlsRefC = useRef<OrbitControlsImpl>(null);
    const syncInProgress = useRef<'b' | 'c' | null>(null);

    const handleOrbitChange = (source: 'b' | 'c') => {
        // If a sync is already in progress from the other control, ignore this event
        if (syncInProgress.current && syncInProgress.current !== source) {
            return;
        }

        const sourceControls = source === 'b' ? controlsRefB.current : controlsRefC.current;
        const targetControls = source === 'b' ? controlsRefC.current : controlsRefB.current;

        if (sourceControls && targetControls) {
            const sourceAngle = sourceControls.getAzimuthalAngle();

            syncInProgress.current = source;
            targetControls.setAzimuthalAngle(sourceAngle);
            // Use setTimeout to clear the flag after the event loop completes
            setTimeout(() => {
                syncInProgress.current = null;
            }, 0);
        }
    };

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
                        <Splitter orientation="vertical">
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
                        {view.id === 'b' ? (
                            <OrbitControls
                                ref={controlsRefB}
                                enableRotate={true}
                                minPolarAngle={0}
                                maxPolarAngle={0}
                                enablePan={false}
                                onChange={() => handleOrbitChange('b')}
                            />
                        ) : view.id === 'c' ? (
                            <OrbitControls
                                ref={controlsRefC}
                                enableRotate={true}
                                minPolarAngle={Math.PI / 2}
                                maxPolarAngle={Math.PI / 2}
                                enablePan={false}
                                onChange={() => handleOrbitChange('c')}
                            />
                        ) : (
                            <OrbitControls enableDamping />
                        )}
                    </View>
                ))}
            </Canvas>
        </>
    );
};

export default App;
