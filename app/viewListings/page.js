"use client";
import { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';
import Layout from '../components/Layout';
import Link from 'next/link'; // For linking to the detailed page
import { useRouter } from 'next/navigation'; // For navigation
import { FaBed, FaBath, FaMapMarkerAlt, FaHome } from 'react-icons/fa'; // Import icons

const ViewListings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [compareList, setCompareList] = useState([]); // State for comparing listings
  const router = useRouter(); // Router for navigation

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

  // Handle compare selection
  const handleCompare = (id) => {
    if (compareList.includes(id)) {
      setCompareList(compareList.filter(item => item !== id)); // Remove if already selected
    } else {
      if (compareList.length < 2) {
        setCompareList([...compareList, id]); // Add to compare list
      }
    }

    // Redirect to compare page when two listings are selected
    if (compareList.length === 1) {
      router.push(`/compare?ids=${compareList[0]},${id}`);
    }
  };

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
              <div key={listing.id} className="relative bg-white shadow-lg rounded-lg p-6 min-h-[350px] flex flex-col justify-between">
                <Link href={`/viewListings/detailedListing?id=${listing.id}`}>
                  <div className="cursor-pointer">
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

                {/* Compare Button */}
                <div className="mt-4">
                  <button
                    onClick={() => handleCompare(listing.id)}
                    className={`w-full py-2 px-4 text-white font-semibold rounded-lg ${
                      compareList.includes(listing.id) ? 'bg-red-500' : 'bg-blue-500'
                    } hover:opacity-90 transition duration-200`}
                  >
                    {compareList.includes(listing.id) ? 'Remove from Compare' : 'Add to Compare'}
                  </button>
                </div>
              </div>
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
