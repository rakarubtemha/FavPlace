import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD37tdVZeCrNtYeymFF7-KkEgQ9-wqQNpM",
  authDomain: "favplace2.firebaseapp.com",
  projectId: "favplace2",
  storageBucket: "favplace2.firebasestorage.app",
  messagingSenderId: "1070314078621",
  appId: "1:1070314078621:web:7fd36ce830c11f41812f74"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut };