// firestore.js
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../firbase/firebase";

// Create
export const createData = async (data) => {
    try {
        const docRef = await addDoc(collection(db, "candidate"), data);
        console.log("Document written with ID: ", docRef.id);
    } catch (e) {
        console.error("Error adding document: ", e);
    }
};

// Read
export const readData = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, "candidate"));
        let items = [];
        querySnapshot.forEach((doc) => {
            items.push({ id: doc.id, ...doc.data() });
        });
        console.log({items}); // Log the items to verify
        return items;
    } catch (error) {
        console.error("Error reading data: ", error);
    }
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
