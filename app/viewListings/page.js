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
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-8">
        View Listings
      </h1>

      {listings.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">
          No listings found.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table-auto w-full shadow-lg rounded-lg">
            <thead>
              <tr className="bg-stone-500 text-white">
                <th className="px-6 py-4 text-left">Listing ID</th>
                <th className="px-6 py-4 text-left">Address</th>
                <th className="px-6 py-4 text-left">Bathrooms</th>
                <th className="px-6 py-4 text-left">Bedrooms</th>
                <th className="px-6 py-4 text-left">Current Price</th>
                <th className="px-6 py-4 text-left">Neighborhood</th>
                <th className="px-6 py-4 text-left">Type</th>
              </tr>
            </thead>
            <tbody>
              {listings.map((listing) => (
                <tr key={listing.id} className="border-t even:bg-gray-100 hover:bg-stone-400 transition duration-200 ease-in-out">
                  <td className="border px-6 py-4">{listing.id}</td>
                  <td className="border px-6 py-4">{listing.address}</td>
                  <td className="border px-6 py-4">{listing.bathroom_count}</td>
                  <td className="border px-6 py-4">{listing.bed_count}</td>
                  <td className="border px-6 py-4">${listing.current_price.toLocaleString()}</td>
                  <td className="border px-6 py-4">{listing.neighborhood}</td>
                  <td className="border px-6 py-4">{listing.property_type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ViewListings;
