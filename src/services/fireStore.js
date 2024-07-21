// firestore.js
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../firbase/firebase";

// Create
export const createData = async (data) => {
    try {
        const docRef = await addDoc(collection(db, "items"), data);
        console.log("Document written with ID: ", docRef.id);
    } catch (e) {
        console.error("Error adding document: ", e);
    }
};

// Read
export const readData = async () => {
    const querySnapshot = await getDocs(collection(db, "items"));
    let items = [];
    querySnapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
    });
    return items;
};

// Update
export const updateData = async (id, newData) => {
    const docRef = doc(db, "items", id);
    await updateDoc(docRef, newData);
};

// Delete
export const deleteData = async (id) => {
    await deleteDoc(doc(db, "items", id));
};
