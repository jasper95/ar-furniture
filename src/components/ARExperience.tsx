"use client";

import { useState, useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { XR, Interactive, useHitTest } from "@react-three/xr";
import { useGLTF, OrbitControls, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";

// Disable the BatchedMesh warning
if (typeof window !== "undefined") {
  // @ts-ignore
  window.THREE = THREE;
  // @ts-ignore
  window.THREE.BatchedMesh = class BatchedMesh {};
}

type ARExperienceProps = {
  modelUrl: string;
};

type ModelProps = {
  url: string;
  position?: [number, number, number];
  scale?: number;
};

// Custom AR Button component
function CustomARButton() {
  const [isSupported, setIsSupported] = useState<boolean | null>(null);

  useEffect(() => {
    if (typeof navigator !== "undefined" && "xr" in navigator) {
      // @ts-ignore
      navigator.xr
        ?.isSessionSupported("immersive-ar")
        .then((supported: boolean) => {
          setIsSupported(supported);
        })
        .catch(() => {
          setIsSupported(false);
        });
    } else {
      setIsSupported(false);
    }
  }, []);

  if (isSupported === null) {
    return (
      <button className="bg-gray-400 text-white px-4 py-2 rounded-md">
        Checking AR...
      </button>
    );
  }

  if (isSupported === false) {
    return (
      <button className="bg-gray-400 text-white px-4 py-2 rounded-md cursor-not-allowed">
        AR Not Supported
      </button>
    );
  }

  return (
    <button
      onClick={() => {
        // This is just a placeholder - the actual AR session will be started by the XR component
        // when the user clicks on the canvas
        alert("Click on the 3D view to start AR");
      }}
      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
    >
      Start AR
    </button>
  );
}

// Component to handle AR hit testing and model placement
function ARModel({ url, position = [0, 0, 0], scale = 1 }: ModelProps) {
  const ref = useRef<THREE.Group>(null);
  const [placed, setPlaced] = useState(false);
  const [modelPosition, setModelPosition] =
    useState<[number, number, number]>(position);
  const [modelScale, setModelScale] = useState<number>(scale);

  // Load the 3D model
  const { scene } = useGLTF(url);

  // Clone the scene to avoid issues with multiple instances
  const model = scene.clone();

  // Use hit testing to place the model on detected surfaces
  useHitTest((hitMatrix: any, hit: any) => {
    if (!placed) {
      // Get the position from the hit test
      const position = new THREE.Vector3();
      const rotation = new THREE.Quaternion();
      const scale = new THREE.Vector3();

      hitMatrix.decompose(position, rotation, scale);

      if (ref.current) {
        ref.current.position.copy(position);
        setModelPosition([position.x, position.y, position.z]);
      }
    }
  });

  // Handle model placement
  const handleSelect = () => {
    if (!placed) {
      setPlaced(true);
    } else {
      // If already placed, allow repositioning
      setPlaced(false);
    }
  };

  return (
    <Interactive onSelect={handleSelect}>
      <group
        ref={ref}
        position={modelPosition}
        scale={[modelScale, modelScale, modelScale]}
        dispose={null}
      >
        <primitive object={model} />
      </group>
    </Interactive>
  );
}

// Fallback component for non-AR preview
function ModelPreview({ url }: { url: string }) {
  const { scene } = useGLTF(url);

  useEffect(() => {
    // Center the model
    const box = new THREE.Box3().setFromObject(scene);
    const center = box.getCenter(new THREE.Vector3());
    scene.position.sub(center);

    // Adjust the model to be visible in the preview
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 1 / maxDim;
    scene.scale.multiplyScalar(scale);
  }, [scene]);

  return <primitive object={scene} />;
}

export default function ARExperience({ modelUrl }: ARExperienceProps) {
  const [arSupported, setArSupported] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if WebXR is supported
    if (typeof window !== "undefined") {
      if ("xr" in navigator) {
        // @ts-ignore
        navigator.xr
          ?.isSessionSupported("immersive-ar")
          .then((supported) => {
            setArSupported(supported);
          })
          .catch(() => {
            setArSupported(false);
          });
      } else {
        setArSupported(false);
      }
    }
  }, []);

  return (
    <div className="relative h-full w-full">
      <div className="absolute top-4 left-4 z-10">
        <CustomARButton />
      </div>

      <Canvas>
        <XR>
          <PerspectiveCamera makeDefault position={[0, 1.5, 3]} />
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1} />

          <ARModel url={modelUrl} />
          <ModelPreview url={modelUrl} />
          <OrbitControls />
        </XR>
      </Canvas>

      {arSupported === false && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 z-10 p-6">
          <div className="max-w-md text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto text-yellow-500 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <h2 className="text-2xl font-bold mb-2">AR Not Supported</h2>
            <p className="mb-4">
              Your device or browser doesn't support WebXR Augmented Reality.
              Please try using a compatible device and browser, such as:
            </p>
            <ul className="text-left text-sm mb-6">
              <li>• Chrome on Android (ARCore compatible device)</li>
              <li>
                • Safari on iOS 12+ (iPhone 6s or newer, iPad 5th gen or newer)
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
