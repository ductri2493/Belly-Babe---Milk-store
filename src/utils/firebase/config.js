import { initializeApp } from "firebase/app";
import getStorage from "redux-persist/es/storage/getStorage";

const firebaseConfig = {
    apiKey: "AIzaSyDYZsUaykwvJ-d0ZDCwYnHtRFGtUO9DXAQ",
    authDomain: "swp391-3854b.firebaseapp.com",
    projectId: "swp391-3854b",
    storageBucket: "swp391-3854b.appspot.com",
    messagingSenderId: "1055475986483",
    appId: "1:1055475986483:web:f5212691c8c4b9817b7346",
    measurementId: "G-XBJFE1K7X6"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage }