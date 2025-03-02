# AR Furniture Placement App

This is a web application that allows users to upload 3D furniture models and place them in their space using Augmented Reality (AR). The app uses WebXR for AR functionality, React Three Fiber for 3D rendering, and Firebase for storage and database.

## Features

- Upload 3D models (GLB/GLTF format)
- View models in 3D preview mode
- Place models in your space using AR
- Move, rotate, and scale models in AR
- Save and manage your 3D models

## Technologies Used

- Next.js 14 with App Router
- React Three Fiber (@react-three/fiber)
- React Three XR (@react-three/xr)
- React Three Drei (@react-three/drei)
- Three.js
- Firebase (Storage, Firestore)
- TypeScript
- Tailwind CSS

## Prerequisites

- Node.js 18+ and npm/yarn
- A Firebase project with Firestore and Storage enabled
- A compatible AR device:
  - Android: ARCore-compatible device with Chrome
  - iOS: iPhone 6s+ or iPad 5th gen+ with Safari (iOS 12+)

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```
3. Create a `.env.local` file in the root directory with your Firebase configuration:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id
   ```
4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) with your browser

## Usage

1. Upload your 3D models in GLB or GLTF format
2. Launch the AR experience on your mobile device
3. Point your camera at an open space in your home
4. Select and place furniture models in your space
5. Use gestures to move, rotate, and scale the models

## AR Controls

- Tap to place model
- Pinch to scale
- Two fingers to rotate
- Long press to move

## Notes on AR Compatibility

WebXR is still an evolving technology and may not work on all devices. For the best experience:

- Use Chrome on Android (ARCore compatible device)
- Use Safari on iOS 12+ (iPhone 6s or newer, iPad 5th gen or newer)
- Ensure your device has the latest OS updates
- Allow camera permissions when prompted

## License

This project is licensed under the MIT License - see the LICENSE file for details.
