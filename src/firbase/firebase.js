// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import 'firebase/storage';
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC1-ZFe3hCkGmEr5TBvtnYRkCDQilftPmU",
    authDomain: "test-1c4a2.firebaseapp.com",
    projectId: "test-1c4a2",
    storageBucket: "test-1c4a2.appspot.com",
    messagingSenderId: "90936893795",
    appId: "1:90936893795:web:7bc081329f73d49d4cb356"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const storage = getStorage(app);
const db = getFirestore(app);
export { app, auth, db, storage };

