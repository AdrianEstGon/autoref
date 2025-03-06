// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCvGsPbi56B4P9uf8ao8qCJXP961qBgY5s",
  authDomain: "autoref-dcd7a.firebaseapp.com",
  projectId: "autoref-dcd7a",
  storageBucket: "autoref-dcd7a.firebasestorage.app",
  messagingSenderId: "329080308158",
  appId: "1:329080308158:web:3f8df13b878082c8db79ef",
  measurementId: "G-137DQ97YWM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);