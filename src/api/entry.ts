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
  const docRef = await addDoc(collection(db, 'Entries'), entry);
  console.log('Document written with ID: ', docRef.id);
  return docRef;
}

export const getEntries = async () => {
  const querySnapshot = await getDocs(collection(db, 'Entries'));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export const editEntry = async (entry: Entry) => {
  const { id, ...entryData } = entry;
  await updateDoc(doc(db, 'Entries', id!), entryData);
}

export const deleteEntry = async (id: string) => {
  await deleteDoc(doc(db, 'Entries', id));
}