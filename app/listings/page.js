"use client";
import React, { useState, useEffect } from 'react';
import { db } from '../../firebase'; // Firebase configuration
import { collection, getDocs } from 'firebase/firestore';
import Layout from '../components/Layout';
import ListingCard from './ListingCard'; // Component to display individual listing cards
import { useRouter } from 'next/navigation'; // Updated import

const Listings = () => {
  const router = useRouter();
  const [listings, setListings] = useState([]);
  const [filteredPropertyTypes, setFilteredPropertyTypes] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 1000000]); // Default price range
  const [filteredBeds, setFilteredBeds] = useState([]);
  const [filteredBathrooms, setFilteredBathrooms] = useState([]);
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [compareList, setCompareList] = useState([]);

  // Fetch listings from Firebase
  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, 'listings'));
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

  const handleCompare = (id) => {
    if (compareList.includes(id)) {
      setCompareList(compareList.filter((item) => item !== id)); // Remove if already selected
    } else {
      if (compareList.length < 2) {
        setCompareList([...compareList, id]); // Add to compare list
      }
    }

    if (compareList.length === 1) {
      // Redirect to compare page if one property was previously selected
      router.push(`/compare?ids=${compareList[0]},${id}`);
    }
  };

  const handlePropertyTypeChange = (e) => {
    const propertyType = e.target.value;
    const selectedPropertyTypes = [...filteredPropertyTypes];

    if (e.target.checked) {
      selectedPropertyTypes.push(propertyType);
    } else {
      const index = selectedPropertyTypes.indexOf(propertyType);
      if (index > -1) {
        selectedPropertyTypes.splice(index, 1);
      }
    }
    setFilteredPropertyTypes(selectedPropertyTypes);
  };

  const handlePriceChange = (e) => {
    const value = e.target.value.split(',').map(Number);
    setPriceRange(value);
  };

  const handleBedChange = (e) => {
    const bedCount = Number(e.target.value);
    const selectedBeds = [...filteredBeds];

    if (e.target.checked) {
      selectedBeds.push(bedCount);
    } else {
      const index = selectedBeds.indexOf(bedCount);
      if (index > -1) {
        selectedBeds.splice(index, 1);
      }
    }
    setFilteredBeds(selectedBeds);
  };

  const handleBathroomChange = (e) => {
    const bathroomCount = Number(e.target.value);
    const selectedBathrooms = [...filteredBathrooms];

    if (e.target.checked) {
      selectedBathrooms.push(bathroomCount);
    } else {
      const index = selectedBathrooms.indexOf(bathroomCount);
      if (index > -1) {
        selectedBathrooms.splice(index, 1);
      }
    }
    setFilteredBathrooms(selectedBathrooms);
  };

  // Clear all filters
  const handleClearFilters = () => {
    setFilteredPropertyTypes([]);
    setPriceRange([0, 1000000]);
    setFilteredBeds([]);
    setFilteredBathrooms([]);
  };

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
        <h1 className="text-2xl font-bold mb-4">Property Listings</h1>

        {/* Filters Section */}
        <div className="mb-4 grid grid-cols-2 gap-4">
          {/* Property Type Filters */}
          <div>
            <label className="block text-sm font-semibold mb-2">Filter by Property Types:</label>
            <div className="grid grid-cols-2 gap-2">
              {propertyTypes.map((propertyType) => (
                <label key={propertyType} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value={propertyType}
                    onChange={handlePropertyTypeChange}
                    checked={filteredPropertyTypes.includes(propertyType)}
                  />
                  <span>{propertyType}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="col-span-2">
            <label className="block text-sm font-semibold mb-2">Filter by Price Range:</label>
            <input
              type="text"
              placeholder="Min,Max"
              onChange={handlePriceChange}
              className="p-2 border rounded w-full"
            />
          </div>

          {/* Bed Count Filters */}
          <div className="col-span-2">
            <label className="block text-sm font-semibold mb-2">Filter by Bed Count:</label>
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3, 4].map((bedCount) => (
                <label key={bedCount} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value={bedCount}
                    onChange={handleBedChange}
                    checked={filteredBeds.includes(bedCount)}
                  />
                  <span>{bedCount} Bed{bedCount > 1 ? 's' : ''}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Bathroom Count Filters */}
          <div className="col-span-2">
            <label className="block text-sm font-semibold mb-2">Filter by Bathroom Count:</label>
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3, 4].map((bathroomCount) => (
                <label key={bathroomCount} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value={bathroomCount}
                    onChange={handleBathroomChange}
                    checked={filteredBathrooms.includes(bathroomCount)}
                  />
                  <span>{bathroomCount} Bath{bathroomCount > 1 ? 's' : ''}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Clear Filters Button */}
          <div className="col-span-2 text-right">
            <button
              onClick={handleClearFilters}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Clear All Filters
            </button>
          </div>
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
                  id={listing.id} // Pass the id here
                  address={listing.address}
                  neighborhood={listing.neighborhood}
                  propertyType={listing.property_type}
                  currentPrice={listing.current_price}
                  bedCount={listing.bed_count}
                  bathroomCount={listing.bathroom_count}
                  onCompare={handleCompare} // Pass the compare function
                  compareList={compareList} // Pass the compareList to highlight selected items
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

export default Listings;
