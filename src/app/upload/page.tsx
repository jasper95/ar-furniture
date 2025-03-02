"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useModels } from "@/lib/contexts/ModelContext";

// We'll use Firebase for storage
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { firebaseApp } from "@/lib/firebase/firebase";

export default function UploadPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{
    [key: string]: number;
  }>({});
  const [uploadedModels, setUploadedModels] = useState<
    { id: string; name: string; url: string }[]
  >([]);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { refreshModels } = useModels();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).filter(
        (file) => file.name.endsWith(".glb") || file.name.endsWith(".gltf")
      );

      if (newFiles.length !== Array.from(e.target.files).length) {
        alert("Only GLB and GLTF files are supported.");
      }

      setFiles((prev) => [...prev, ...newFiles]);
      setError(null); // Clear any previous errors
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setUploading(true);
    setError(null);

    try {
      // Check if Firebase is properly configured
      if (
        !process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
        process.env.NEXT_PUBLIC_FIREBASE_API_KEY.includes("your-")
      ) {
        throw new Error(
          "Firebase is not properly configured. Please check your environment variables."
        );
      }

      const storage = getStorage(firebaseApp);
      const db = getFirestore(firebaseApp);

      for (const file of files) {
        try {
          const storageRef = ref(storage, `models/${file.name}`);
          const uploadTask = uploadBytesResumable(storageRef, file);

          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setUploadProgress((prev) => ({
                ...prev,
                [file.name]: progress,
              }));
            },
            (error) => {
              console.error("Upload error:", error);
              setError(`Error uploading ${file.name}: ${error.message}`);
              setUploading(false);
            },
            async () => {
              try {
                const downloadURL = await getDownloadURL(
                  uploadTask.snapshot.ref
                );

                // Save model info to Firestore
                const docRef = await addDoc(collection(db, "models"), {
                  name: file.name,
                  url: downloadURL,
                  createdAt: new Date(),
                });

                setUploadedModels((prev) => [
                  ...prev,
                  { id: docRef.id, name: file.name, url: downloadURL },
                ]);

                // If all files are uploaded, reset the state
                if (
                  Object.keys(uploadProgress).length === files.length &&
                  Object.values(uploadProgress).every(
                    (progress) => progress === 100
                  )
                ) {
                  setFiles([]);
                  setUploading(false);
                  setUploadProgress({});

                  // Refresh the models in the context
                  await refreshModels();
                }
              } catch (error: any) {
                console.error(
                  "Error getting download URL or saving to Firestore:",
                  error
                );
                setError(`Error processing ${file.name}: ${error.message}`);
                setUploading(false);
              }
            }
          );
        } catch (error: any) {
          console.error("Error setting up upload for file:", error);
          setError(`Error processing ${file.name}: ${error.message}`);
          setUploading(false);
        }
      }
    } catch (error: any) {
      console.error("Error during upload setup:", error);
      setError(`Upload error: ${error.message}`);
      setUploading(false);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <div className="w-full max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Upload 3D Models</h1>
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            Back to Home
          </Link>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <p>{error}</p>
            <p className="text-sm mt-1">
              Make sure you have properly configured your Firebase environment
              variables in .env.local
            </p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              multiple
              accept=".glb,.gltf"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p className="text-lg font-medium">
              Drag and drop your 3D models here
            </p>
            <p className="text-sm text-gray-500 mt-1">or click to browse</p>
            <p className="text-xs text-gray-400 mt-2">
              Supported formats: GLB, GLTF
            </p>
          </div>
        </div>

        {files.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Selected Files</h2>
            <ul className="space-y-4">
              {files.map((file, index) => (
                <li key={index} className="flex justify-between items-center">
                  <span className="truncate max-w-xs">{file.name}</span>
                  <div className="flex items-center">
                    {uploadProgress[file.name] && (
                      <div className="w-32 bg-gray-200 rounded-full h-2.5 mr-4">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full"
                          style={{ width: `${uploadProgress[file.name]}%` }}
                        ></div>
                      </div>
                    )}
                    <button
                      onClick={() => removeFile(index)}
                      className="text-red-500 hover:text-red-700"
                      disabled={uploading}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <button
              onClick={handleUpload}
              disabled={uploading || files.length === 0}
              className={`mt-6 px-4 py-2 rounded-md text-white ${
                uploading || files.length === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {uploading ? "Uploading..." : "Upload Models"}
            </button>
          </div>
        )}

        {uploadedModels.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Uploaded Models</h2>
            <ul className="space-y-2">
              {uploadedModels.map((model) => (
                <li
                  key={model.id}
                  className="flex justify-between items-center"
                >
                  <span>{model.name}</span>
                  <span className="text-green-600">Uploaded</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex justify-end">
              <Link
                href="/ar-experience"
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Continue to AR Experience
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
