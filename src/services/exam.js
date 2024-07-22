// firestore.js
import { addDoc, arrayUnion, collection, deleteDoc, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../firbase/firebase";

// Create
export const createExam = async (data) => {
    try {
        const docRef = await addDoc(collection(db, "exam_details"), data);
        console.log({ docRef })
        const docSnapshot = await getDoc(docRef);
        if (docSnapshot.exists()) {
            const createdData = docSnapshot.data();
            return { ...createdData, id: docRef?.id };
        } else {
            return new Promise.reject('Failed to create exam')
        }
    } catch (e) {
        console.error("Error adding document: ", e);
    }
};

// Read
export const getExamDeatilsData = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, "exam_details"));
        let items = [];
        querySnapshot.forEach((doc) => {
            items.push({ id: doc.id, ...doc.data() });
        });
        console.log({ items }); // Log the items to verify
        return items;
    } catch (error) {
        console.error("Error reading data: ", error);
    }
};

export const getExamDetailsById = async (id) => {
    console.log({ id })
    try {
        const docRef = doc(db, "exam_details", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data();
        } else {
            console.log("No such document!");
            return null;
        }
    } catch (error) {
        console.error("Error reading data: ", error);
    }
};

// Update
export const updateData = async (id, newData) => {
    const docRef = doc(db, "items", id);
    await updateDoc(docRef, newData);
};

// update Candidate details

export const updateCandidateDetails = async ({ id, newCandidate }) => {
    console.log({id})
    try {
        const docRef = doc(db, "exam_details", id);
        const docSnap = await getDoc(docRef);
        console.log({docSnap});
        if (docSnap.exists()) {
            // Document exists, update the candidates field
            await updateDoc(docRef, {
                candidates: arrayUnion(newCandidate)
            });
            console.log('Candidates updated successfully');
        }
    } catch (error) {
        console.log({ error });
        console.error("Error updating candidate: ", error);
    }
};

// Delete
export const deleteExamData = async (id) => {
    console.log({ id })
    try {
        await deleteDoc(doc(db, "exam_details", id));
    } catch (error) {
        return new Promise.reject('Failed to delete exam');
    }
};
