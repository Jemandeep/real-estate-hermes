"use client";
import { useState, useEffect } from 'react';
import { db } from '../../firebase'; // Make sure this path points correctly to your Firebase config
import { collection, getDocs } from 'firebase/firestore';

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
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">View Listings</h1>

      {listings.length === 0 ? (
        <p>No listings found.</p>
      ) : (
        <table className="table-auto w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2">Listing ID</th>
              <th className="px-4 py-2">Address</th>
              <th className="px-4 py-2">Bathrooms</th>
              <th className="px-4 py-2">Bedrooms</th>
              <th className="px-4 py-2">Current Price</th>
              <th className="px-4 py-2">Neighborhood</th>
              <th className="px-4 py-2">Type</th>
            </tr>
          </thead>
          <tbody>
            {listings.map((listing) => (
              <tr key={listing.id} className="border-t">
                <td className="border px-4 py-2">{listing.id}</td>
                <td className="border px-4 py-2">{listing.address}</td>
                <td className="border px-4 py-2">{listing.bathroom_count}</td>
                <td className="border px-4 py-2">{listing.bed_count}</td>
                <td className="border px-4 py-2">${listing.current_price}</td>
                <td className="border px-4 py-2">{listing.neighborhood}</td>
                <td className="border px-4 py-2">{listing.property_type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ViewListings;
