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

  const newBook = {
    ...book,
    leido: false, // <--- importante
  };

  if (docSnap.exists()) {
    const userData = docSnap.data();
    const currentBooks = userData.myBooks || [];
    const alreadyExists = currentBooks.some(b => b.titulo === book.titulo);
    if (!alreadyExists) {
      await updateDoc(userRef, {
        myBooks: [...currentBooks, newBook],
      });
    }
  } else {
    await setDoc(userRef, {
      myBooks: [newBook],
    });
  }
};

export const toggleBookReadStatus = async (uid, titulo) => {
  const userRef = doc(db, "users", uid);
  const docSnap = await getDoc(userRef);

  if (docSnap.exists()) {
    const userData = docSnap.data();
    const books = userData.myBooks || [];

    const updatedBooks = books.map(book =>
      book.titulo === titulo ? { ...book, leido: !book.leido } : book
    );

    await updateDoc(userRef, {
      myBooks: updatedBooks,
    });
  }
};

export const removeBookFromUser = async (uid, titulo) => {
  const userRef = doc(db, "users", uid);
  const docSnap = await getDoc(userRef);

  if (docSnap.exists()) {
    const userData = docSnap.data(); // Corregido: era userSnap.data()
    const books = userData.myBooks || [];

    const updatedBooks = books.filter(book => book.titulo !== titulo);

    await updateDoc(userRef, {
      myBooks: updatedBooks,
    });
  }
};

export const addGroupToUser = async (uid, group) => {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    const userData = userSnap.data();
    const currentGroups = userData.myGroups || [];

    const alreadyJoined = currentGroups.some(g => g.nombre === group.nombre);
    if (!alreadyJoined) {
      await updateDoc(userRef, {
        myGroups: [...currentGroups, group],
      });
    }
  } else {
    await setDoc(userRef, {
      myGroups: [group],
    });
  }
};