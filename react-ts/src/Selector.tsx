import type { FC } from 'react';
import { useState } from 'react';
import { Html } from '@react-three/drei';
import type { ThreeEvent } from '@react-three/fiber';
import { Vector3, ArrowHelper } from 'three';

interface ClickInfo {
    point: Vector3;
    faceNormal: Vector3;
    distance: number;
}

export const Selector: FC = () => {
    const [clickInfo, setClickInfo] = useState<ClickInfo | null>(null);

    const handleClick = (event: ThreeEvent<MouseEvent>) => {
        event.stopPropagation();

        // The event object contains all raycasting information
        const { point, face, distance } = event;

        if (face) {
            setClickInfo({
                point: point.clone(),
                faceNormal: face.normal.clone(),
                distance,
            });

            // Log to console for debugging
            console.log('Click detected:', {
                coordinates: `(${point.x.toFixed(2)}, ${point.y.toFixed(2)}, ${point.z.toFixed(2)})`,
                faceNormal: `(${face.normal.x.toFixed(2)}, ${face.normal.y.toFixed(2)}, ${face.normal.z.toFixed(2)})`,
                distance: distance.toFixed(2),
            });
        }
    };

    return (
        <>
            {/* Invisible plane for click detection */}
            <mesh onClick={handleClick} visible={false}>
                <planeGeometry args={[100, 100]} />
                <meshBasicMaterial />
            </mesh>

            {/* Display click point */}
            {clickInfo && (
                <group position={clickInfo.point}>
                    {/* Small sphere at click point */}
                    <mesh>
                        <sphereGeometry args={[0.1, 16, 16]} />
                        <meshBasicMaterial color="red" />
                    </mesh>

                    {/* HTML overlay with coordinates */}
                    <Html
                        position={[0, 0.3, 0]}
                        center
                        style={{
                            background: 'rgba(0, 0, 0, 0.8)',
                            color: 'white',
                            padding: '8px 12px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            whiteSpace: 'nowrap',
                            pointerEvents: 'none',
                        }}
                    >
                        <div>
                            <strong>Position:</strong><br />
                            X: {clickInfo.point.x.toFixed(2)}<br />
                            Y: {clickInfo.point.y.toFixed(2)}<br />
                            Z: {clickInfo.point.z.toFixed(2)}<br />
                            <strong>Distance:</strong> {clickInfo.distance.toFixed(2)}
                        </div>
                    </Html>

                    {/* Normal vector visualization */}
                    <primitive
                        object={new ArrowHelper(
                            clickInfo.faceNormal,
                            new Vector3(0, 0, 0),
                            0.5,
                            0x00ff00,
                            0.2,
                            0.1
                        )}
                    />
                </group>
            )}
        </>
    );
};
