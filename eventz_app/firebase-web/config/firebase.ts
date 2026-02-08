import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyAkg8cBJwFW6nP0UL3-wvfSabu7GhQQQ9M",
    authDomain: "eventz-47d32.firebaseapp.com",
    projectId: "eventz-47d32",
    storageBucket: "eventz-47d32.firebasestorage.app",
    messagingSenderId: "567189517524",
    appId: "1:567189517524:web:2f54c0c6c7910367ca3741"
};

export const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
