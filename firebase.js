// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
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
const firestore = getFirestore(app);

if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      const analytics = getAnalytics(app);
    } else {
      console.warn("Firebase Analytics is not supported in this environment.");
    }
  }).catch((error) => {
    console.error("Error checking Analytics support:", error);
  });
}

export {firestore}