"use client";
import { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';
import Layout from '../components/Layout';
import Link from 'next/link'; // For linking to the detailed page
import { FaBed, FaBath, FaMapMarkerAlt, FaHome } from 'react-icons/fa'; // Import icons

const ViewListings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch listings from Firebase
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'listings'));
        const fetchedListings = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setListings(fetchedListings);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching listings:', error);
        setError('Failed to load listings. Please try again.');
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  return (
    <Layout>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-8">
          View Listings
        </h1>

        {loading ? (
          <p className="text-gray-600 text-center mt-8">
            Loading listings, please wait...
          </p>
        ) : error ? (
          <p className="text-red-500 text-center mt-8">{error}</p>
        ) : listings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {listings.map((listing) => (
              <Link key={listing.id} href={`/viewListings/detailedListing?id=${listing.id}`}>
                <div className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transform hover:scale-105 transition duration-200 cursor-pointer">
                  <div className="mb-4">
                    <p className="text-lg font-bold text-gray-800 mb-2 flex items-center">
                      <FaMapMarkerAlt className="mr-2 text-gray-700" />
                      {listing.address}
                    </p>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm text-gray-700 mb-2 flex items-center">
                      <FaBed className="mr-2 text-gray-600" />
                      {listing.bed_count} Bedrooms
                    </p>
                    <p className="text-sm text-gray-700 mb-2 flex items-center">
                      <FaBath className="mr-2 text-gray-600" />
                      {listing.bathroom_count} Bathrooms
                    </p>
                    <p className="text-sm text-gray-700 mb-2 flex items-center">
                      <FaHome className="mr-2 text-gray-600" />
                      {listing.property_type}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">Current Price:</p>
                    <p className="text-lg font-semibold text-gray-800">
                      ${listing.current_price ? listing.current_price.toLocaleString() : 'No price available'}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center">No listings found.</p>
        )}
      </div>
    </Layout>
  );
};

export default ViewListings;
