import { db } from '../firebaseConfig';
import { 
  collection, doc, setDoc, updateDoc, deleteDoc, 
  query, where, onSnapshot, addDoc, getDoc, serverTimestamp
} from 'firebase/firestore';

export interface Habit {
  id?: string;
  ownerId: string;
  name: string;
  emoji: string;
  color: string;
  category: string;
  frequency: string;
  reminderTime: string | null;
  sharedWith: string[];
  streak: number;
  longestStreak: number;
  lastCompletedDate: any;
  createdAt: any;
  isArchived: boolean;
}

export const createHabit = async (habitData: Omit<Habit, 'id'>) => {
  const docRef = await addDoc(collection(db, 'habits'), {
    ...habitData,
    createdAt: serverTimestamp()
  });
  return docRef.id;
};

export const updateHabit = async (id: string, data: Partial<Habit>) => {
  const docRef = doc(db, 'habits', id);
  await updateDoc(docRef, data);
};

export const deleteHabit = async (id: string) => {
  await deleteDoc(doc(db, 'habits', id));
};

export const checkInHabit = async (habitId: string, userId: string, streakDetails: { currentStreak: number, longestStreak: number }) => {
  // Add completion record
  await addDoc(collection(db, 'completions'), {
    habitId,
    userId,
    completedAt: serverTimestamp(),
    note: ''
  });

  // Update habit document
  const habitRef = doc(db, 'habits', habitId);
  await updateDoc(habitRef, {
    streak: streakDetails.currentStreak,
    longestStreak: streakDetails.longestStreak,
    lastCompletedDate: serverTimestamp()
  });
};

export const subscribeToMyHabits = (userId: string, callback: (habits: Habit[]) => void) => {
  const q = query(
    collection(db, 'habits'), 
    where('ownerId', '==', userId),
    where('isArchived', '==', false)
  );

  return onSnapshot(q, (snapshot) => {
    const habits: Habit[] = [];
    snapshot.forEach(doc => habits.push({ id: doc.id, ...doc.data() } as Habit));
    callback(habits);
  });
};
