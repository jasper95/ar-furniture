# Firebase Security Rules

To fix the Firebase permission errors, you need to update your Firebase security rules for both Firestore and Storage. Here's how to do it:

## Firestore Rules

Go to your Firebase console > Firestore Database > Rules and update them to:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to all users for the models collection
    match /models/{document=**} {
      allow read, write;
    }

    // For all other collections, only allow authenticated users
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Storage Rules

Go to your Firebase console > Storage > Rules and update them to:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow read access to all users
    match /models/{allPaths=**} {
      allow read;
      allow write;
    }

    // For all other paths, only allow authenticated users
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Important Notes

1. These rules allow public read/write access to your models collection and storage folder. This is fine for development but not recommended for production.

2. For a production environment, you should implement proper authentication and more restrictive rules.

3. After updating the rules, it may take a few minutes for the changes to propagate.

4. Make sure your Firebase project has Firestore and Storage enabled in the Firebase console.

## Checking Your Firebase Configuration

Ensure your `.env.local` file contains all the required Firebase configuration values:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

You can find these values in your Firebase project settings.
