// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBf-4YjaahbLCU0V2Y-hEpWdTId_IXSi4c",
  authDomain: "onfido-demo.firebaseapp.com",
  projectId: "onfido-demo",
  storageBucket: "onfido-demo.appspot.com",
  messagingSenderId: "425161709549",
  appId: "1:425161709549:web:18b8788ab243991bb5b9e4",
  measurementId: "G-2X43NZJ22G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);