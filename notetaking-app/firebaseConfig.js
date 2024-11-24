// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDjKFNnWtkcUChprPAPmyzYor2dHgWJRok",
  authDomain: "notetaking-app-8820c.firebaseapp.com",
  projectId: "notetaking-app-8820c",
  storageBucket: "notetaking-app-8820c.appspot.com",
  messagingSenderId: "229669623424",
  appId: "1:229669623424:web:5791e6a489fe0c8839f865",
  measurementId: "G-RJXWJX1S3B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);