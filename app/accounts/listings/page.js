"use client";
import { useState, useEffect } from 'react';
import { db, auth } from '../../../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import Layout from '../../components/Layout';

const UserListings = () => {
  const [listings, setListings] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await fetchUserListings(currentUser.email);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchUserListings = async (email) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', email));
      if (userDoc.exists()) {
        const { listings: listingIds } = userDoc.data();
        const fetchedListings = [];

        // Fetch each listing by ID
        for (const id of listingIds) {
          const listingDoc = await getDoc(doc(db, 'listings', id));
          if (listingDoc.exists()) {
            fetchedListings.push({ id, ...listingDoc.data() });
          }
        }
        setListings(fetchedListings);
      }
    } catch (error) {
      console.error('Error fetching user listings:', error);
    }
  };

  const toggleVisibility = async (id, currentVisibility) => {
    try {
      await updateDoc(doc(db, 'listings', id), { visible: !currentVisibility });
      setListings((prev) =>
        prev.map((listing) =>
          listing.id === id ? { ...listing, visible: !currentVisibility } : listing
        )
      );
    } catch (error) {
      console.error('Error toggling visibility:', error);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">My Listings</h2>
        {listings.map((listing) => (
          <div key={listing.id} className="bg-white shadow p-4 mb-4 rounded">
            <h3 className="text-lg font-bold">{listing.address}</h3>
            <p>Price: ${listing.current_price}</p>
            <p>Visible: {listing.visible ? 'Yes' : 'No'}</p>
            <button
              onClick={() => toggleVisibility(listing.id, listing.visible)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Toggle Visibility
            </button>
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default UserListings;
