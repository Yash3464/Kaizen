import { db } from '../firebaseConfig';
import { 
  collection, doc, setDoc, updateDoc, deleteDoc, 
  query, where, onSnapshot, addDoc, serverTimestamp, getDoc, arrayUnion
} from 'firebase/firestore';

export const sendFriendRequest = async (fromUid: string, toUid: string) => {
  await addDoc(collection(db, 'friendRequests'), {
    fromUid,
    toUid,
    status: 'pending',
    createdAt: serverTimestamp()
  });
};

export const acceptFriendRequest = async (reqId: string, fromUid: string, toUid: string) => {
  // Update request status
  await updateDoc(doc(db, 'friendRequests', reqId), { status: 'accepted' });
  
  // Add to each other's friendIds array
  await updateDoc(doc(db, 'users', fromUid), { friendIds: arrayUnion(toUid) });
  await updateDoc(doc(db, 'users', toUid), { friendIds: arrayUnion(fromUid) });
};

export const subscribeToNotifications = (userId: string, callback: (notifs: any[]) => void) => {
  const q = query(collection(db, 'notifications'), where('toUid', '==', userId));
  return onSnapshot(q, (snapshot) => {
    const notifs: any[] = [];
    snapshot.forEach(doc => notifs.push({ id: doc.id, ...doc.data() }));
    callback(notifs);
  });
};

export const subscribeToSharedHabits = (userId: string, callback: (habits: any[]) => void) => {
  // Finds habits where userId is in the sharedWith array
  const q = query(collection(db, 'habits'), where('sharedWith', 'array-contains', userId));
  return onSnapshot(q, (snapshot) => {
    const habits: any[] = [];
    snapshot.forEach(doc => habits.push({ id: doc.id, ...doc.data() }));
    callback(habits);
  });
};
