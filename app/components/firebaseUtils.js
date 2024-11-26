import { db } from '../../firebase';
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
  query,
  where,
} from 'firebase/firestore';

// Fetch user properties by email
export const fetchUserProperties = async (userEmail) => {
  try {
    const propertiesQuery = query(
      collection(db, 'properties'),
      where('userEmail', '==', userEmail)
    );

    const querySnapshot = await getDocs(propertiesQuery);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching user properties:", error);
    throw error;
  }
};

// Fetch all public listings
export const fetchListings = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'listings')); // Adjust the collection name if needed
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching listings:", error);
    throw error;
  }
};

// Fetch user watchlist by email
export const fetchWatchlist = async (userEmail) => {
  try {
    const userDocRef = doc(db, 'users', userEmail); // Reference to the user's document
    const userDocSnapshot = await getDoc(userDocRef);

    if (userDocSnapshot.exists()) {
      const userData = userDocSnapshot.data();
      return userData.watchlist || [];
    } else {
      console.error('User document not found.');
      return [];
    }
  } catch (error) {
    console.error("Error fetching watchlist:", error);
    throw error;
  }
};

// Add a listing to the user's watchlist
export const addToWatchlist = async (userEmail, listingId) => {
  try {
    const userDocRef = doc(db, 'users', userEmail);
    await updateDoc(userDocRef, {
      watchlist: arrayUnion(listingId),
    });
  } catch (error) {
    console.error("Error adding to watchlist:", error);
    throw error;
  }
};

// Remove a listing from the user's watchlist
export const removeFromWatchlist = async (userEmail, listingId) => {
  try {
    const userDocRef = doc(db, 'users', userEmail);
    await updateDoc(userDocRef, {
      watchlist: arrayRemove(listingId),
    });
  } catch (error) {
    console.error("Error removing from watchlist:", error);
    throw error;
  }
};
