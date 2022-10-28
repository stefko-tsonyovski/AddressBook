// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage, ref } from "firebase/storage";
import {
  getAuth,
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
} from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDOEZyTgIXOUKTr_fUtFrvWm8lPRyHnmWc",
  authDomain: "address-book-d3160.firebaseapp.com",
  projectId: "address-book-d3160",
  storageBucket: "address-book-d3160.appspot.com",
  messagingSenderId: "745424693107",
  appId: "1:745424693107:web:ebe1c655ddd94c11198706",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

//Initialize Cloud Storage and get a reference to the service
export const storage = getStorage(app);
export const storageRef = ref(storage);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export async function signIn() {
  //   setPersistence(auth, browserSessionPersistence)
  //     .then(() => {
  //       // Existing and future Auth states are now persisted in the current
  //       // session only. Closing the window would clear any existing state even
  //       // if a user forgets to sign out.
  //       // ...
  //       // New sign-in will be persisted with session persistence.
  //       return signInWithPopup(auth, provider);
  //     })
  //     .catch((error) => {
  //       // Handle Errors here.
  //       const errorCode = error.code;
  //       const errorMessage = error.message;
  //     });

  await signInWithPopup(getAuth(), provider);
}

export async function signOutFunc() {
  await signOut(auth);
}

export function getCurrentUser() {
  const user = auth.currentUser;
  return user;
}
