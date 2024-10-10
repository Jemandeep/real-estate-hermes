"use client";
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import ListingCard from './ListingCard';

// URL for fetching mock data
const MOCKAROO_URL = 'https://api.mockaroo.com/api/3b6f9270?count=1000&key=9e007e70';

const Listings = () => {
  const [listings, setListings] = useState([]);
  const [filteredNeighborhoods, setFilteredNeighborhoods] = useState([]); // Track selected neighborhoods
  const [filteredPropertyTypes, setFilteredPropertyTypes] = useState([]); // Track selected property types
  const [neighborhoods, setNeighborhoods] = useState([]);
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Start loading
      try {
        const response = await fetch(MOCKAROO_URL, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.statusText}`);
        }
        const text = await response.text();
        const data = JSON.parse(text);
        setListings(data.slice(0, 250));

        // Extract unique neighborhoods and property types
        const uniqueNeighborhoods = [...new Set(data.map((item) => item.neighborhood))];
        const uniquePropertyTypes = [...new Set(data.map((item) => item.property_type))];

        setNeighborhoods(uniqueNeighborhoods);
        setPropertyTypes(uniquePropertyTypes);
        setLoading(false); // End loading after data is fetched
      } catch (error) {
        setError(error.message);
        setLoading(false); // End loading even if there's an error
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Update the selected neighborhoods based on checkbox interactions
  const handleNeighborhoodChange = (e) => {
    const neighborhood = e.target.value;
    const selectedNeighborhoods = [...filteredNeighborhoods];

    if (e.target.checked) {
      selectedNeighborhoods.push(neighborhood); // Add neighborhood if checked
    } else {
      const index = selectedNeighborhoods.indexOf(neighborhood);
      if (index > -1) {
        selectedNeighborhoods.splice(index, 1); // Remove neighborhood if unchecked
      }
    }
    setFilteredNeighborhoods(selectedNeighborhoods);
  };

  // Update the selected property types based on checkbox interactions
  const handlePropertyTypeChange = (e) => {
    const propertyType = e.target.value;
    const selectedPropertyTypes = [...filteredPropertyTypes];

    if (e.target.checked) {
      selectedPropertyTypes.push(propertyType); // Add property type if checked
    } else {
      const index = selectedPropertyTypes.indexOf(propertyType);
      if (index > -1) {
        selectedPropertyTypes.splice(index, 1); // Remove property type if unchecked
      }
    }
    setFilteredPropertyTypes(selectedPropertyTypes);
  };

  const filteredListings = listings.filter((listing) => {
    return (
      (filteredNeighborhoods.length === 0 || filteredNeighborhoods.includes(listing.neighborhood)) &&
      (filteredNeighborhoods.length === 0 || filteredNeighborhoods.includes(listing.neighborhood)) &&
      (filteredPropertyTypes.length === 0 || filteredPropertyTypes.includes(listing.property_type))
    );
  });

  return (
    <Layout>
      <div className="max-w-full mx-auto p-4 bg-white rounded shadow mt-10">
        <h1 className="text-2xl font-bold mb-4">Property Listings</h1>
        
        {/* Filters Section */}
        <div className="mb-4 grid grid-cols-2 gap-4">
          {/* Neighborhood Filters */}
          <div>
            <label className="block text-sm font-semibold mb-2">Filter by Neighborhoods:</label>
            <div className="grid grid-cols-2 gap-2">
              {neighborhoods.map((neighborhood) => (
                <label key={neighborhood} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value={neighborhood}
                    onChange={handleNeighborhoodChange}
                    checked={filteredNeighborhoods.includes(neighborhood)} // Show as checked if already selected
                  />
                  <span>{neighborhood}</span>
                </label>
              ))}
            </div>
          </div>

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
                    checked={filteredPropertyTypes.includes(propertyType)} // Show as checked if already selected
                  />
                  <span>{propertyType}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Show loading message while data is being fetched */}
        {loading ? (
          <p className="text-gray-600 text-center mt-8">Please wait, data is being fetched...</p>
        ) : (
          /* Show message if no checkbox is selected */
          filteredNeighborhoods.length === 0 && filteredPropertyTypes.length === 0 ? (
            <p className="text-gray-600 text-center mt-8">Please select a neighborhood and/or property type to view listings.</p>
          ) : (
            /* Listing Cards in a grid layout */
            filteredListings.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  <ListingCard
                    key={index}
                    address={listing.address || 'N/A'}
                    neighborhood={listing.neighborhood || 'Unknown'}
                    propertyType={listing.property_type || 'Unknown'}
                    currentPrice={listing.current_price || 0}
                    bedCount={listing.bed_count || 0}
                    bathroomCount={listing.bathroom_count || 0}
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No listings to display.</p>
            )
          )
        )}
        {error && <p className="text-red-500">Error: {error}</p>}
      </div>
    </Layout>
  );
};

export default Listings;
