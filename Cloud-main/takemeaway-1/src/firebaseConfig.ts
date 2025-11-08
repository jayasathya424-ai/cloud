import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  signOut
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCP41X8ruyVi_0rAU8LNkHo9bJQHpjhNzE",
  authDomain: "takemeaway-cd9a7.firebaseapp.com",
  projectId: "takemeaway-cd9a7",
  storageBucket: "takemeaway-cd9a7.appspot.com", 
  messagingSenderId: "1007993136557",
  appId: "1:1007993136557:web:fddb2e9cdc921beadaad24",
  measurementId: "G-W68ZXB2KXQ",
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


const provider = new GoogleAuthProvider();


const login = async () => {
  try {
    await signInWithPopup(auth, provider);
  } catch (error: any) {
    console.warn("Popup login failed — switching to redirect login", error);
    await signInWithRedirect(auth, provider);
  }
};

export { auth, provider, login, signOut };
