// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBmPS28OnnWRHTXZwTsM0PSaa_BIav62J4",
  authDomain: "lu-database.firebaseapp.com",
  projectId: "lu-database",
  storageBucket: "lu-database.firebasestorage.app",
  messagingSenderId: "651858100624",
  appId: "1:651858100624:web:9219133e8565d99c763315",
  measurementId: "G-06NH79TW3R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { app, analytics, auth, googleProvider };