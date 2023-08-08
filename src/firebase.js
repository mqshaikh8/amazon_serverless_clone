// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc, collection, addDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAnAtXZ6uGXYqH4lSs_StTGySuNfFnOVVE",
  authDomain: "clone-15817.firebaseapp.com",
  projectId: "clone-15817",
  storageBucket: "clone-15817.appspot.com",
  messagingSenderId: "932036079712",
  appId: "1:932036079712:web:c8709eb76ebe1d81ca5305"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const auth = getAuth(app);


export {db, auth, doc, getDoc, setDoc, collection, addDoc}