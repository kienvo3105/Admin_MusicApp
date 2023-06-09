// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCbLi1-vs4mwoX662LRIDLn5wEtR7rF4P8",
    authDomain: "musicapp-80f91.firebaseapp.com",
    projectId: "musicapp-80f91",
    storageBucket: "musicapp-80f91.appspot.com",
    messagingSenderId: "1089193701111",
    appId: "1:1089193701111:web:4b58a10a3fcb8d5163adf2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);