"use client";

import Link from "next/link";
import { useState } from "react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <h1 className="text-4xl font-bold mb-8">AR Furniture Placement</h1>

      <div className="w-full max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Upload 3D Models</h2>
            <p className="text-gray-600 mb-4">
              Upload your 3D furniture models in GLB or GLTF format to place
              them in your space.
            </p>
            <Link
              href="/upload"
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Upload Models
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Start AR Experience</h2>
            <p className="text-gray-600 mb-4">
              Place your furniture in your space using augmented reality through
              your device camera.
            </p>
            <Link
              href="/ar-experience"
              className="inline-block bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              Launch AR
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Upload your 3D furniture models (GLB/GLTF format)</li>
            <li>Launch the AR experience on your mobile device</li>
            <li>Point your camera at an open space in your home</li>
            <li>Select and place furniture models in your space</li>
            <li>Move, rotate, and scale the models to fit your needs</li>
          </ol>
        </div>
      </div>
    </main>
  );
}
