import { db } from '../firebase';
import {
  doc,
  getDoc,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';

// Fetch single discussion by ID
export const fetchDiscussionById = async (discussionId) => {
  try {
    const docRef = doc(db, 'discussions', discussionId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error("Discussion not found.");
    }
  } catch (error) {
    console.error("Error fetching discussion:", error);
    throw error;
  }
};

// Add a new discussion to Firestore
export const addNewDiscussion = async (newDiscussionData) => {
  try {
    const discussionsRef = collection(db, 'discussions');
    const docRef = await addDoc(discussionsRef, {
      ...newDiscussionData,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding new discussion:", error);
    throw error;
  }
};

// Fetch comments for a discussion in real-time
export const fetchComments = (discussionId, setComments) => {
  const commentsRef = collection(db, 'discussions', discussionId, 'comments');
  const unsubscribe = onSnapshot(commentsRef, (snapshot) => {
    const commentsData = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setComments(commentsData);
  });
  return unsubscribe;
};

// Add a new comment
export const addComment = async (discussionId, commentData) => {
  try {
    const commentsRef = collection(db, 'discussions', discussionId, 'comments');
    await addDoc(commentsRef, {
      ...commentData,
      createdAt: serverTimestamp(),
    });

    // Update comment count in discussion
    const discussionRef = doc(db, 'discussions', discussionId);
    await updateDoc(discussionRef, {
      commentCount: (commentData.commentCount || 0) + 1,
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    throw error;
  }
};
