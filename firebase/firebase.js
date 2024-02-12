import {initializeApp} from "firebase/app";
import {getDatabase, ref, onValue} from "firebase/database";
import "firebase/database"


const firebaseConfig = {
    apiKey: "AIzaSyDpsJpTWVRzntqF0XyzdeK6X-sLh-yG_BE",
    authDomain: "hpc-app-2f6df.firebaseapp.com",
    projectId: "hpc-app-2f6df",
    storageBucket: "hpc-app-2f6df.appspot.com",
    messagingSenderId: "923174338399",
    appId: "1:923174338399:web:9143ba79e117c71ac9c0ea"
  
  };
  
const app = initializeApp(firebaseConfig)
const db = getDatabase()

export {db, ref, onValue}