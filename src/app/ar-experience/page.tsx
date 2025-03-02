"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useModels, Model } from "@/lib/contexts/ModelContext";

// Dynamically import the AR components to avoid SSR issues
const ARExperience = dynamic(() => import("@/components/ARExperience"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-96">
      Loading AR Experience...
    </div>
  ),
});

export default function ARExperiencePage() {
  const { models, loading, error } = useModels();
  console.log(
    "🚀 ~ ARExperiencePage ~ models, loading, error:",
    models,
    loading,
    error
  );
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [arSupported, setArSupported] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if WebXR is supported
    if (typeof window !== "undefined") {
      if ("xr" in navigator) {
        // @ts-ignore - TypeScript doesn't know about isSessionSupported yet
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
    <main className="flex min-h-screen flex-col">
      <div className="bg-gray-800 text-white p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">AR Furniture Placement</h1>
          <Link href="/" className="text-blue-300 hover:text-blue-100">
            Back to Home
          </Link>
        </div>
      </div>

      <div className="flex flex-col md:flex-row h-[calc(100vh-64px)]">
        {/* Model selection sidebar */}
        <div className="w-full md:w-64 bg-gray-100 p-4 overflow-y-auto">
          <h2 className="text-lg font-semibold mb-4">Your 3D Models</h2>

          {loading ? (
            <p>Loading models...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : models.length === 0 ? (
            <div>
              <p className="text-gray-600 mb-4">No models found.</p>
              <Link
                href="/upload"
                className="inline-block bg-blue-600 text-white px-3 py-1 rounded-md text-sm"
              >
                Upload Models
              </Link>
            </div>
          ) : (
            <ul className="space-y-2">
              {models.map((model) => (
                <li
                  key={model.id}
                  className={`p-2 rounded-md cursor-pointer ${
                    selectedModel?.id === model.id
                      ? "bg-blue-100 border border-blue-300"
                      : "hover:bg-gray-200"
                  }`}
                  onClick={() => setSelectedModel(model)}
                >
                  <div className="truncate font-medium">{model.name}</div>
                </li>
              ))}
            </ul>
          )}

          {selectedModel && (
            <div className="mt-6 p-3 bg-white rounded-md shadow-sm">
              <h3 className="font-medium">Selected Model</h3>
              <p className="text-sm text-gray-600 truncate">
                {selectedModel.name}
              </p>
            </div>
          )}

          <div className="mt-8">
            <h3 className="font-medium mb-2">Controls</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Tap to place model</li>
              <li>• Pinch to scale</li>
              <li>• Two fingers to rotate</li>
              <li>• Long press to move</li>
            </ul>
          </div>
        </div>

        {/* AR View */}
        <div className="flex-1 bg-gray-200 relative">
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
                  {`Your device or browser doesn't support WebXR Augmented
                  Reality. Please try using a compatible device and browser,
                  such as:`}
                </p>
                <ul className="text-left text-sm mb-6">
                  <li>• Chrome on Android (ARCore compatible device)</li>
                  <li>
                    • Safari on iOS 12+ (iPhone 6s or newer, iPad 5th gen or
                    newer)
                  </li>
                </ul>
                <Link
                  href="/"
                  className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md"
                >
                  Return to Home
                </Link>
              </div>
            </div>
          )}

          {arSupported && selectedModel ? (
            <ARExperience modelUrl={selectedModel.url} />
          ) : (
            arSupported && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center p-6">
                  <p className="text-xl mb-4">
                    Select a model from the sidebar to begin
                  </p>
                  {models.length === 0 && (
                    <Link
                      href="/upload"
                      className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md"
                    >
                      Upload Models
                    </Link>
                  )}
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </main>
  );
}
