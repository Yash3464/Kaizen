import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const firebaseConfig = {
  apiKey: "AIzaSyAK0AXiNxuSR8xWDIHYIscgPb_P5AA5LWA",
  authDomain: "habittracker-a1407.firebaseapp.com",
  projectId: "habittracker-a1407",
  storageBucket: "habittracker-a1407.firebasestorage.app",
  messagingSenderId: "233606228711",
  appId: "1:233606228711:web:e61c4b02a34b6f10149042",
  measurementId: "G-CMDDDS3LRS"
};

const app = initializeApp(firebaseConfig);

let auth;
if (Platform.OS === 'web') {
  auth = getAuth(app);
} else {
  const firebaseAuth = require('firebase/auth');
  auth = firebaseAuth.initializeAuth(app, {
    persistence: firebaseAuth.getReactNativePersistence(ReactNativeAsyncStorage)
  });
}

export const db = getFirestore(app);
export { auth };
