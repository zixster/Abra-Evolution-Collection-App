import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCjo6Jgd9Xc4tS3MhiWLS8AsD-dK6jVkUo",
  authDomain: "abra-evolution-line-collection.firebaseapp.com",
  projectId: "abra-evolution-line-collection",
  storageBucket: "abra-evolution-line-collection.firebasestorage.app",
  messagingSenderId: "990255521226",
  appId: "1:990255521226:web:710ffca8e8469235894333",
  measurementId: "G-NC9L5E822R"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
