# Kaizen - Habit Tracker

A full-stack mobile habit tracking app built with React Native (Expo) and Firebase.

## Features
- Create habits with custom colors, emojis, and frequencies.
- Real-time social sharing and friend feeds.
- Group challenges and leaderboards.
- Analytics heatmaps and charts.
- Gamification with XP, levels, and badges.

## Setup Instructions

1. **Install Dependencies**
   Run `npm install` in the root directory.

2. **Firebase Setup**
   - Create a project on [Firebase Console](https://console.firebase.google.com/).
   - Enable Firestore, Authentication (Email/Password & Google Sign-in).
   - Upgrade to the Blaze plan to deploy Cloud Functions.
   - Replace the configuration in `firebaseConfig.js` with your Firebase config.
   - Deploy Security Rules: `firebase deploy --only firestore:rules`
   - Deploy Cloud Functions: 
     ```bash
     cd functions
     npm install
     firebase deploy --only functions
     ```

3. **Run Locally**
   Start the Expo dev server:
   ```bash
   npx expo start
   ```

## EAS Deployment

To deploy using Expo Application Services (EAS):

1. **Install EAS CLI**
   ```bash
   npm install -g eas-cli
   ```

2. **Login to Expo**
   ```bash
   eas login
   ```

3. **Configure Build**
   ```bash
   eas build:configure
   ```

4. **Build for iOS (Simulator or TestFlight)**
   ```bash
   eas build --platform ios
   ```

5. **Build for Android**
   ```bash
   eas build --platform android
   ```

## Environment Variables
If you use additional external APIs, place them in an `.env` file at the root. For Firebase, ensure the `firebaseConfig.js` is populated.

For Google Sign-in, configure the OAuth credentials in Google Cloud Platform and add the web client ID to the authentication setup.
