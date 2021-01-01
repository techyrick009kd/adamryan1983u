import { initializeApp } from "firebase/app"
import { getFirestore} from "firebase/firestore";
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/auth';


import firebaseConfig from "./firebaseConfig";

let firebaseApp:any;

if (!firebase.apps.length) {
    firebaseApp = initializeApp(firebaseConfig);
} else {
  firebase.app(); // if already initialized, use that one
}

const db = getFirestore(firebaseApp);


export default db;