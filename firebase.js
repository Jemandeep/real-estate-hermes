import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyArF4bVxW80wM9STSjEeOk-nt-EnfDIFZQ",
  authDomain: "calgary-real-estate-hermes.firebaseapp.com",
  projectId: "calgary-real-estate-hermes",
  storageBucket: "calgary-real-estate-hermes.appspot.com",
  messagingSenderId: "470724434671",
  appId: "1:470724434671:web:d6e88e7fa48d68b624591a",
  measurementId: "G-BVZDGHTZ97"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}


// Initialize Firebase services like Authentication and Firestore (if needed)
const auth = getAuth(app);
const db = getFirestore(app); // Firestore if needed

// Exporting the initialized Firebase services
export { app, auth, db, analytics };