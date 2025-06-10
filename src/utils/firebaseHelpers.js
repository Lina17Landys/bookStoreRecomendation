// utils/firebaseHelpers.js
import { doc, updateDoc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../services/firebaseConfig";

export const saveUserPreferences = async (uid, data) => {
  const userRef = doc(db, "users", uid);
  const docSnap = await getDoc(userRef);

  if (docSnap.exists()) {
    await updateDoc(userRef, data);
  } else {
    await setDoc(userRef, data);
  }
};

export const getUserPreferences = async (uid) => {
  const userRef = doc(db, "users", uid);
  const docSnap = await getDoc(userRef);

  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    return null; // o {}
  }
};

export const addBookToUser = async (uid, book) => {
  const userRef = doc(db, "users", uid);
  const docSnap = await getDoc(userRef);

  if (docSnap.exists()) {
    const userData = docSnap.data();
    const currentBooks = userData.myBooks || [];
    const alreadyExists = currentBooks.some(b => b.titulo === book.titulo);
    if (!alreadyExists) {
      await updateDoc(userRef, {
        myBooks: [...currentBooks, book],
      });
    }
  } else {
    await setDoc(userRef, {
      myBooks: [book],
    });
  }
};
