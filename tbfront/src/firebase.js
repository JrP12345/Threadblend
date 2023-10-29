import firebase from "firebase/compat/app";
import "firebase/compat/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCc3v9n5Rin3Ainfxvi5vP2fB69HiZei-0",
  authDomain: "threadblend-c0840.firebaseapp.com",
  databaseURL: "https://threadblend-c0840-default-rtdb.firebaseio.com",
  projectId: "threadblend-c0840",
  storageBucket: "threadblend-c0840.appspot.com",
  messagingSenderId: "440965777463",
  appId: "1:440965777463:web:91c6c5280ef92d1bf157b2",
  measurementId: "G-870VHDR0ZX",
};
firebase.initializeApp(firebaseConfig);

const db = firebase.database();

export default db;
