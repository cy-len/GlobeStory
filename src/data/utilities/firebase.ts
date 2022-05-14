// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAM9B5zWnLifvKZ5oa3DdUT_dY0EhllSnM",
  authDomain: "globestory-7809b.firebaseapp.com",
  projectId: "globestory-7809b",
  storageBucket: "globestory-7809b.appspot.com",
  messagingSenderId: "88525926711",
  appId: "1:88525926711:web:897465cc8b4b7111c82ab2",
  measurementId: "G-GP3VW07NK2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const firestore = getFirestore(app);