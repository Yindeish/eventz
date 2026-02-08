import { initializeApp, getApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAkg8cBJwFW6nP0UL3-wvfSabu7GhQQQ9M",
    authDomain: "eventz-47d32.firebaseapp.com",
    projectId: "eventz-47d32",
    storageBucket: "eventz-47d32.firebasestorage.app",
    messagingSenderId: "567189517524",
    appId: "1:567189517524:web:2f54c0c6c7910367ca3741"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore
export const db = getFirestore(app);

export default app;
