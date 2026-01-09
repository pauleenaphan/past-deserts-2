import { addDoc, collection, getDocs, deleteDoc, doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

export interface Entry {
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
    return docRef;
  } catch (error) {
    console.error('API: Error adding entry:', error);
    throw error;
  }
}

export const getEntries = async (): Promise<Entry[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'Entries'));
    const entries = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Entry[];
    return entries;
  } catch (error) {
    console.error('API: Error getting entries:', error);
    throw error;
  }
}

export const getEntryById = async (id: string): Promise<Entry | null> => {
  try {
    const docRef = doc(db, 'Entries', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Entry;
    }
    return null;
  } catch (error) {
    console.error('API: Error getting entry by ID:', error);
    throw error;
  }
}

export const editEntry = async (entry: Entry) => {
  try {
    const { id, ...entryData } = entry;
    
    if (!id) {
      throw new Error('Entry ID is required for editing');
    }
    
    await updateDoc(doc(db, 'Entries', id), entryData);
    console.log('API: Document updated successfully with ID:', id);
  } catch (error) {
    console.error('API: Error editing entry:', error);
    throw error;
  }
}

export const deleteEntry = async (id: string) => {
  try {
    await deleteDoc(doc(db, 'Entries', id));
    console.log('API: Document deleted successfully with ID:', id);
  } catch (error) {
    console.error('API: Error deleting entry:', error);
    throw error;
  }
}

