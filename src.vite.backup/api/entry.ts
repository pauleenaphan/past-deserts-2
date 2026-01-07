import { addDoc, collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";

export interface Entry{
  id?: string
  name: string
  date: string // When I made this recipe
  rating: number // 1-5 Stars
  difficulty: string // Easy, Medium, Hard
  link: string // link to original recipe
  summary: string // my process and thoughts of the recipe and outcome
  images: string[] // images of the recipe and outcome
  labels: string[] // tags like what kind of desert it is, protein, vegan, etc
}

export const addEntry = async (entry: Entry) => {
  try {
    const docRef = await addDoc(collection(db, 'Entries'), entry);
    console.log('API: Document written with ID:', docRef.id);
    console.log('=== API: addEntry SUCCESS ===');
    return docRef;
  } catch (error) {
    console.error('API: Error adding entry:', error);
    console.error('API: Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      entry: entry
    });
    console.log('=== API: addEntry FAILED ===');
    throw error;
  }
}

export const getEntries = async () => {
  console.log('=== API: getEntries START ===');
  try {
    const querySnapshot = await getDocs(collection(db, 'Entries'));
    const entries = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log('=== API: getEntries SUCCESS ===');
    return entries;
  } catch (error) {
    console.error('API: Error getting entries:', error);
    console.error('API: Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    console.log('=== API: getEntries FAILED ===');
    throw error;
  }
}

export const editEntry = async (entry: Entry) => {
  try {
    const { id, ...entryData } = entry;
    console.log('API: Entry data to update (without ID):', entryData);
    
    if (!id) {
      throw new Error('Entry ID is required for editing');
    }
    
    await updateDoc(doc(db, 'Entries', id), entryData);
    console.log('=API: Document updated successfully with ID:', id);
    console.log('=== API: editEntry SUCCESS ===');
  } catch (error) {
    console.error('API: Error editing entry:', error);
    console.error('API: Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      entry: entry,
      entryId: entry.id
    });
    console.log('=== API: editEntry FAILED ===');
    throw error;
  }
}

export const deleteEntry = async (id: string) => {
  console.log('=== API: deleteEntry START ===');
  console.log('API: Deleting entry with ID:', id);
  
  try {
    await deleteDoc(doc(db, 'Entries', id));
    console.log('API: Document deleted successfully with ID:', id);
    console.log('=== API: deleteEntry SUCCESS ===');
  } catch (error) {
    console.error('API: Error deleting entry:', error);
    console.error('API: Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      entryId: id
    });
    console.log('=== API: deleteEntry FAILED ===');
    throw error;
  }
}