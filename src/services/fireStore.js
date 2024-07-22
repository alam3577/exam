// firestore.js
import { addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
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

export const updateEvaluationDetails = async (documentId, newEvaluationDetails) => {
    const docRef = doc(db, 'candidate', documentId);

    try {
        await updateDoc(docRef, {
            'evaluation_details.score': newEvaluationDetails.score,
            'evaluation_details.comments': newEvaluationDetails.comments,
            'evaluation_details.evaluation_status': newEvaluationDetails.evaluation_status
        });
        console.log('Evaluation details updated successfully');
    } catch (error) {
        console.error('Error updating evaluation details:', error);
    }
};

export const findFilteredCandidateData = async (examId, batchId, rollNumber) => {
    // Create a reference to the collection
    const candidateCollectionRef = collection(db, 'candidate');

    // Create a query to find documents that match the specified criteria
    const q = query(
        candidateCollectionRef,
        where('exam_id', '==', examId),
        where('roll_number', '==', rollNumber),
        where('batch_id', '==', batchId)
    );

    try {
        // Execute the query and get the matching documents
        const querySnapshot = await getDocs(q);

        // Check if any documents were found
        if (querySnapshot.empty) {
            console.log('No matching documents found');
            return [];
        }

        // Extract and return the data from the matching documents
        const matchingDocs = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        console.log('Matching documents:', { matchingDocs });
        return matchingDocs;
    } catch (e) {
        console.error('Error finding documents:', e);
        return [];
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
        console.log({ items }); // Log the items to verify
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
