// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA2kVUBq72JcmP5BeN8dRNkKppXQQFSiXA",
  authDomain: "pantry-tracker-9df02.firebaseapp.com",
  projectId: "pantry-tracker-9df02",
  storageBucket: "pantry-tracker-9df02.appspot.com",
  messagingSenderId: "555057577288",
  appId: "1:555057577288:web:0f1f174fbb04a5d180877d",
  measurementId: "G-49N9W9JWLN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);

export {firestore}