import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  doc,
  updateDoc,
  arrayUnion,
} from 'firebase/firestore';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../config/firebase';
import type { HomeworkResult, ConversationMessage } from '../types';

export async function uploadHomeworkImage(
  userId: string,
  imageDataUrl: string,
): Promise<string> {
  const storageRef = ref(storage, `homework-images/${userId}/${Date.now()}.jpg`);
  await uploadString(storageRef, imageDataUrl, 'data_url');
  return getDownloadURL(storageRef);
}

export async function saveHomeworkResult(
  result: Omit<HomeworkResult, 'id'>,
): Promise<string> {
  const docRef = await addDoc(collection(db, 'homework'), result);
  return docRef.id;
}

export async function getUserHomework(userId: string): Promise<HomeworkResult[]> {
  const q = query(
    collection(db, 'homework'),
    where('userId', '==', userId),
    orderBy('timestamp', 'desc'),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as HomeworkResult);
}

export async function createConversation(
  homeworkId: string,
  userId: string,
): Promise<string> {
  const docRef = await addDoc(collection(db, 'conversations'), {
    homeworkId,
    userId,
    messages: [],
    createdAt: Date.now(),
  });
  return docRef.id;
}

export async function addConversationMessage(
  conversationId: string,
  message: ConversationMessage,
): Promise<void> {
  const ref_doc = doc(db, 'conversations', conversationId);
  await updateDoc(ref_doc, {
    messages: arrayUnion(message),
  });
}
