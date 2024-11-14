"use client";
import React, { useState, useEffect } from 'react';
import { db } from '../../../firebase'; // Adjust the path to your Firebase configuration
import { collection, getDocs } from 'firebase/firestore';
import Layout from '../../components/Layout';
import ListingCard from '../../listings/ListingCard'; 
import { useRouter } from 'next/navigation';

const PropertiesPage = () => {
  const router = useRouter();
  const [listings, setListings] = useState([]);
  const [filteredPropertyTypes, setFilteredPropertyTypes] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 1000000]); // Default price range
  const [filteredBeds, setFilteredBeds] = useState([]);
  const [filteredBathrooms, setFilteredBathrooms] = useState([]);
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch listings from Firebase
  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, 'listings')); // Use 'listings' collection
        const fetchedListings = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setListings(fetchedListings);
        const uniquePropertyTypes = [...new Set(fetchedListings.map((item) => item.property_type))];
        setPropertyTypes(uniquePropertyTypes);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch listings. Please try again.');
        console.error('Error fetching listings:', error);
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  // Filtering logic for property type, price range, bed count, and bathroom count
  const filteredListings = listings.filter((listing) => {
    return (
      (filteredPropertyTypes.length === 0 || filteredPropertyTypes.includes(listing.property_type)) &&
      (listing.current_price >= priceRange[0] && listing.current_price <= priceRange[1]) &&
      (filteredBeds.length === 0 || filteredBeds.includes(listing.bed_count)) &&
      (filteredBathrooms.length === 0 || filteredBathrooms.includes(listing.bathroom_count))
    );
  });

  return (
    <Layout>
      <div className="max-w-full mx-auto p-4 bg-white rounded shadow mt-10">
        <h1 className="text-2xl font-bold mb-4">Select a Property to Discuss</h1>

        {/* Filters Section */}
        <div className="mb-4 grid grid-cols-2 gap-4">
          {/* Property Type Filters */}
          {/* Add filter inputs for property type, price range, bed count, and bathroom count here */}
        </div>

        {/* Show loading message */}
        {loading ? (
          <p className="text-gray-600 text-center mt-8">Please wait, data is being fetched...</p>
        ) : (
          filteredListings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredListings.map((listing) => (
                <ListingCard
                  key={listing.id}
                  id={listing.id}
                  address={listing.address}
                  neighborhood={listing.neighborhood}
                  propertyType={listing.property_type}
                  currentPrice={listing.current_price}
                  bedCount={listing.bed_count}
                  bathroomCount={listing.bathroom_count}
                  showCompareButton={false} // Hide the compare button if not needed
                  onClick={() => router.push(`/community/property/detailed?id=${listing.id}`)} // Navigate to discussion page
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center">No listings to display.</p>
          )
        )}
      </div>
    </Layout>
  );
};

export default PropertiesPage;