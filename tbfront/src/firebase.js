import firebase from "firebase/compat/app";
import "firebase/compat/database";

// Your web app's Firebase configuration
const firebaseConfig = {
// config
};
firebase.initializeApp(firebaseConfig);

const db = firebase.database();

export default db;
