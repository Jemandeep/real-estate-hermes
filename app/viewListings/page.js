"use client";
import { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';
import Layout from '../components/Layout';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaBed, FaBath, FaMapMarkerAlt, FaHome } from 'react-icons/fa';

const ViewListings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [compareList, setCompareList] = useState([]); 
  const [sortOrder, setSortOrder] = useState('low'); 
  const [priceRange, setPriceRange] = useState([0, 20000000]); // Adjusted upper limit
  const router = useRouter();

  // Fetch listings from Firebase
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'listings'));
        const fetchedListings = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log('Fetched Listings:', fetchedListings); // For debugging
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
    // If the property is already in the compare list, remove it, otherwise add it
    if (compareList.includes(id)) {
      setCompareList(compareList.filter(item => item !== id));
    } else {
      setCompareList([...compareList, id]);
    }
  };

  // Navigate to compare page
  const handleCompareRedirect = () => {
    if (compareList.length >= 2) {
      router.push(`/compare?ids=${compareList.join(',')}`);
    } else {
      alert('Please select at least two properties to compare.');
    }
  };

  // Sort listings based on selected order
  const sortedListings = [...listings].sort((a, b) => {
    const priceA = Number(a.current_price) || 0;
    const priceB = Number(b.current_price) || 0;
    if (sortOrder === 'low') {
      return priceA - priceB;
    } else {
      return priceB - priceA;
    }
  });

  // Filter listings based on selected price range
  const filteredListings = sortedListings.filter((listing) => {
    const price = Number(listing.current_price) || 0;
    return price >= priceRange[0] && price <= priceRange[1];
  });

  // Function to clear all filters
  const clearFilters = () => {
    setPriceRange([0, 20000000]); // Reset to default values
    setSortOrder('low'); // Reset to default sort order
  };

  return (
    <Layout>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-extrabold text-center text-white mb-8 pt-8">View Listings</h1>

        {/* Price Filter */}
        <div className="text-right mb-4">
          <label htmlFor="minPrice" className="mr-2">Min Price:</label>
          <input 
            type="number" 
            id="minPrice" 
            value={priceRange[0]} 
            onChange={(e) => setPriceRange([Math.max(0, +e.target.value), priceRange[1]])} 
            className="border p-2 rounded-lg" 
            min="0" 
          />
          <label htmlFor="maxPrice" className="ml-4 mr-2">Max Price:</label>
          <input 
            type="number" 
            id="maxPrice" 
            value={priceRange[1]} 
            onChange={(e) => setPriceRange([priceRange[0], Math.max(priceRange[0], +e.target.value)])} 
            className="border p-2 rounded-lg" 
            min="0" 
          />
        </div>

        {/* Sort and Clear Filters */}
        <div className="flex justify-end mb-4 space-x-4">
          <select 
            value={sortOrder} 
            onChange={(e) => setSortOrder(e.target.value)} 
            className="border p-2 rounded-lg"
          >
            <option value="low">Sort by Price: Low to High</option>
            <option value="high">Sort by Price: High to Low</option>
          </select>
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-200"
          >
            Clear All Filters
          </button>
        </div>

        {loading ? (
          <p className="text-gray-600 text-center mt-8">Loading listings, please wait...</p>
        ) : error ? (
          <p className="text-red-500 text-center mt-8">{error}</p>
        ) : filteredListings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredListings.map((listing) => (
              <div key={listing.id} className="relative bg-white shadow-lg rounded-lg p-6 min-h-[350px] flex flex-col justify-between">
                <Link href={`/viewListings/detailedListing?id=${listing.id}`}>
                  <div className="cursor-pointer">
                    <div className="mb-4">
                      <p className="text-lg font-bold text-gray-800 mb-2 flex items-center">
                        <FaMapMarkerAlt className="mr-2 text-gray-700" />
                        {listing.address || 'Address not available'}
                      </p>
                    </div>
                    <div className="mb-4">
                      <p className="text-sm text-gray-700 mb-2 flex items-center">
                        <FaBed className="mr-2 text-gray-600" />
                        {listing.bed_count || 'N/A'} Bedrooms
                      </p>
                      <p className="text-sm text-gray-700 mb-2 flex items-center">
                        <FaBath className="mr-2 text-gray-600" />
                        {listing.bathroom_count || 'N/A'} Bathrooms
                      </p>
                      <p className="text-sm text-gray-700 mb-2 flex items-center">
                        <FaHome className="mr-2 text-gray-600" />
                        {listing.property_type || 'N/A'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">Current Price:</p>
                      <p className="text-lg font-semibold text-gray-800">
                        ${listing.current_price ? Number(listing.current_price).toLocaleString() : 'No price available'}
                      </p>
                    </div>
                  </div>
                </Link>

                {/* Compare Button */}
                <div className="mt-4">
                  <button
                    onClick={() => handleCompare(listing.id)}
                    className={`w-full py-2 px-4 text-white font-semibold rounded-lg ${compareList.includes(listing.id) ? 'bg-red-500' : 'bg-blue-500'} hover:opacity-90 transition duration-200`}
                  >
                    {compareList.includes(listing.id) ? 'Remove from Compare' : 'Add to Compare'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center">No listings found in the selected price range.</p>
        )}

        {/* Compare Page Button */}
        {compareList.length >= 2 && (
          <div className="mt-6">
            <button
              onClick={handleCompareRedirect}
              className="w-full py-2 px-4 bg-green-500 text-white font-semibold rounded-lg hover:opacity-90 transition duration-200"
            >
              Compare Selected Listings
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ViewListings;
