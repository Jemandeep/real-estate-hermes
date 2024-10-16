"use client";
import { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';
import Layout from '../components/Layout';
import Link from 'next/link'; // For linking to detailed listing page
import { FaBed, FaBath, FaMapMarkerAlt, FaHome } from 'react-icons/fa'; // Icons for better UI

const ViewListings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true); // Track loading state
  const [error, setError] = useState(null); // Track errors

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
      } catch (error) {
        console.error('Error fetching listings:', error);
        setError('Failed to load listings. Please try again later.');
      } finally {
        setLoading(false); // Stop loading regardless of success or failure
      }
    };

    fetchListings();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto p-6 text-center">
          <p className="text-lg text-gray-600">Loading listings...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto p-6 text-center">
          <p className="text-lg text-red-500">{error}</p>
        </div>
      </Layout>
    );
  }

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
              <Link
                key={listing.id}
                href={{ pathname: '/viewListings/detailedListing', query: { id: listing.id } }}
              >
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
                      {listing.bed_count} Bedroom{listing.bed_count > 1 ? 's' : ''}
                    </p>
                    <p className="text-sm text-gray-700 mb-2 flex items-center">
                      <FaBath className="mr-2 text-gray-600" />
                      {listing.bathroom_count} Bathroom{listing.bathroom_count > 1 ? 's' : ''}
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
        )}
      </div>
    </Layout>
  );
};

export default ViewListings;
