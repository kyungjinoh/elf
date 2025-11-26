# Firebase Setup Guide

This guide will help you set up Firebase for the ELF application.

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the setup wizard:
   - Enter project name (e.g., "elf-app")
   - Enable/disable Google Analytics (optional)
   - Click "Create project"

## Step 2: Enable Authentication

1. In Firebase Console, go to **Authentication** > **Get started**
2. Click on **Sign-in method** tab
3. Enable **Email/Password**:
   - Click on "Email/Password"
   - Toggle "Enable" to ON
   - Click "Save"

## Step 3: Create Firestore Database

1. In Firebase Console, go to **Firestore Database** > **Create database**
2. Choose **Start in test mode** (for development)
3. Select a location (choose the closest to your users)
4. Click "Enable"

### Set up Firestore Security Rules

1. Go to **Firestore Database** > **Rules**
2. Update the rules to:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      // Allow read for username checking (needed before signup)
      // This allows checking username availability without authentication
      allow read: if true;
      // Allow write only if user is creating/updating their own document
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Messages collection
    match /messages/{messageId} {
      // Allow read if user is authenticated and is the recipient
      allow read: if request.auth != null && request.auth.uid == resource.data.recipientId;
      // Allow create for anyone (anonymous messages from letter page)
      allow create: if request.resource.data.recipientId != null
        && request.resource.data.recipientUsername != null
        && request.resource.data.message != null
        && request.resource.data.read == false;
      // Allow update if user is authenticated and is the recipient (for marking as read)
      allow update: if request.auth != null && request.auth.uid == resource.data.recipientId;
    }

    // Views collection - tracks when someone visits a user's letter page
    match /views/{viewId} {
      // Allow unauthenticated users to create views (when visiting letter pages for the first time)
      allow create: if request.resource.data.userId != null
        && request.resource.data.username != null
        && request.resource.data.visitorId != null
        && request.resource.data.createdAt != null;
      // Allow unauthenticated users to read views to check if they've already viewed (for duplicate prevention)
      // This allows checking by visitorId to see if a view already exists
      allow read: if true;
      // Allow authenticated users to read their own views (for displaying in Recent Views)
      // This is already covered by the allow read: if true above, but kept for clarity
    }
  }
}
```

**Note**: The `allow read: if true` allows anyone to read user documents, which is needed for username availability checks during signup. If you want more security, you can restrict this to only allow queries (not individual document reads), but for username checking, this simpler rule works.

3. Click "Publish"

## Step 4: Set up Storage

1. In Firebase Console, go to **Storage** > **Get started**
2. Start in test mode
3. Select a location (same as Firestore)
4. Click "Done"

### Set up Storage Security Rules

1. Go to **Storage** > **Rules**
2. Update the rules to:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /profile-pictures/{userId}/{allPaths=**} {
      // Allow read for authenticated users
      allow read: if request.auth != null;
      // Allow write only for the user's own folder
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

3. Click "Publish"

## Step 5: Get Firebase Configuration

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll down to **Your apps** section
3. Click the **Web** icon (`</>`) to add a web app
4. Register your app:
   - Enter app nickname (e.g., "ELF Web App")
   - You can skip Firebase Hosting for now
   - Click "Register app"
5. Copy the Firebase configuration object

## Step 6: Add Configuration to Your App

1. Open `src/firebase/config.js`
2. Replace the placeholder values with your Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
}
```

## Step 7: Test the Setup

1. Run your development server: `npm run dev`
2. Try creating a new account:
   - Enter a username
   - Select a profile picture (optional)
   - Enter email and password
   - Click "Next"
3. Check Firebase Console:
   - **Authentication** should show the new user
   - **Firestore Database** should show a document in `users` collection
   - **Storage** should show the profile picture (if uploaded)

## Security Notes

⚠️ **Important**: The test mode rules are for development only. For production:

1. Update Firestore rules to be more restrictive
2. Update Storage rules to be more restrictive
3. Consider adding:
   - Email verification
   - Rate limiting
   - Additional security measures

## Troubleshooting

### "Permission denied" errors
- Check that your Firestore and Storage rules are correct
- Ensure Authentication is enabled

### "Username already taken" not working
- Firestore will automatically create single-field indexes as needed
- Check browser console for errors

### Profile picture not uploading
- Check Storage rules allow writes
- Verify file size is under 5MB
- Check browser console for errors

### Authentication errors
- Ensure Email/Password is enabled in Authentication
- Check that your Firebase config is correct

## Next Steps

After setup, you can:
- Customize user data fields in Firestore
- Add email verification
- Implement password reset
- Add social login (Google, Facebook, etc.)

