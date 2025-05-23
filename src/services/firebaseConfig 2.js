import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDoe3wYxX0xL_VJwwOUucX7Jp0PGAEgxrU",
  authDomain: "webb-f728b.firebaseapp.com",
  projectId: "webb-f728b",
  storageBucket: "webb-f728b.firebasestorage.app",
  messagingSenderId: "310694459401",
  appId: "1:310694459401:web:03a925d5d91d0b266a20d8",
  measurementId: "G-LCRWL0JYC3"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };