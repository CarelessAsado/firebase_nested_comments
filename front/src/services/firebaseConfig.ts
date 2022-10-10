// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCq89ly8uDE88YP0lDFisq2FjHsr8eOi-M",
  authDomain: "rodrigo-b45c3.firebaseapp.com",
  projectId: "rodrigo-b45c3",
  storageBucket: "rodrigo-b45c3.appspot.com",
  messagingSenderId: "190324375039",
  appId: "1:190324375039:web:fbeb2a9373dfc07852fbca",
};

// Initialize Firebase
const fireBaseApp = initializeApp(firebaseConfig);
export default fireBaseApp;

export const fireBaseAuth = getAuth();
