"use client";
import { useState, useEffect } from 'react';
import { db } from '../../firebase'; // Ensure this path is correct
import { collection, getDocs } from 'firebase/firestore';
import Layout from '../components/Layout';

const ViewListings = () => {
  const [listings, setListings] = useState([]);

  // Fetch listings from Firebase when component mounts
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'listings'));
        const fetchedListings = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setListings(fetchedListings);
      } catch (error) {
        console.error('Error fetching listings:', error);
      }
    };

    fetchListings(); // Fetch listings when the component mounts
  }, []);

  return (
    <Layout>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-8">
          View Listings
        </h1>

        {listings.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">
            No listings found.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {listings.map((listing) => (
              <div key={listing.id} className="bg-stone-100 shadow-lg rounded-lg p-6">
                <p className="text-lg font-bold mb-2">{listing.address}</p>
                <p className="text-sm text-gray-700 mb-2">
                  🛏️ {listing.bed_count} Bedrooms | 🛁 {listing.bathroom_count} Bathrooms
                </p>
                <p className="text-sm text-gray-700 mb-2">{listing.neighborhood}</p>
                <p className="text-sm text-gray-700 mb-2">{listing.property_type}</p>
                <div className="text-right">
                  <p className="text-sm font-bold">Current Price:</p>
                  <p className="text-lg font-semibold">
                    ${listing.current_price ? listing.current_price.toLocaleString() : 'No price available'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ViewListings;
