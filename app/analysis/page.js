"use client";

import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import ListingCard from '../components/ListingCard'; // Import ListingCard

// Mockaroo API
const MOCKAROO_URL = 'https://api.mockaroo.com/api/3b6f9270?count=1000&key=9e007e70';

const Analysis = () => {
  // State definitions
  const [listings, setListings] = useState([]);
  const [filteredNeighborhood, setFilteredNeighborhood] = useState('All');
  const [filteredPropertyType, setFilteredPropertyType] = useState('All');
  const [maxMonth, setMaxMonth] = useState(12);
  const [selectedProperties, setSelectedProperties] = useState([]);
  const [neighborhoods, setNeighborhoods] = useState([]);
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [error, setError] = useState(null);
  const [selectedFavorites, setSelectedFavorites] = useState([]); // Track selected favorites for price prediction

  useEffect(() => {
    // Fetch listings from the API on component mount
    const fetchData = async () => {
      try {
        const response = await fetch(MOCKAROO_URL, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data: ' + response.statusText);
        }

        const text = await response.text();
        const data = JSON.parse(text);

        setListings(data.slice(0, 250));

        const uniqueNeighborhoods = [
          'All',
          ...new Set(data.map((item) => item.neighborhood)),
        ];
        const uniquePropertyTypes = [
          'All',
          ...new Set(data.map((item) => item.property_type)),
        ];

        setNeighborhoods(uniqueNeighborhoods);
        setPropertyTypes(uniquePropertyTypes);
      } catch (error) {
        setError(error.message);
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const onSelect = (listing) => {
    setSelectedProperties((prevSelected) => [
      ...prevSelected,
      {
        address: listing.address,
        neighborhood: listing.neighborhood,
        propertyType: listing.property_type,
        prices: [
          listing.price_1_month,
          listing.price_2_months,
          listing.price_3_months,
          listing.price_4_months,
          listing.price_5_months,
          listing.price_6_months,
          listing.price_7_months,
          listing.price_8_months,
          listing.price_9_months,
          listing.price_10_months,
          listing.price_11_months,
          listing.price_12_months,
        ],
        currentPrice: listing.price_1_month,
      },
    ]);
  };

  const handleFavoriteSelection = (property) => {
    setSelectedFavorites((prevSelectedFavorites) => {
      if (prevSelectedFavorites.includes(property)) {
        // Remove from selection if already selected
        return prevSelectedFavorites.filter((fav) => fav !== property);
      } else {
        // Add to selected if not already selected
        return [...prevSelectedFavorites, property];
      }
    });
  };

  const filteredListings = listings.filter((listing) => {
    const matchesNeighborhood =
      filteredNeighborhood === 'All' || listing.neighborhood === filteredNeighborhood;
    const matchesPropertyType =
      filteredPropertyType === 'All' || listing.property_type === filteredPropertyType;
    return matchesNeighborhood && matchesPropertyType;
  });

  // Begin return statement
  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-4 bg-white rounded shadow mt-10 flex">
        {/* Prediction Sidebar */}
        <div className="w-1/4 bg-gray-100 rounded p-4 shadow-md mr-4">
          <h2 className="text-lg font-bold mb-2">Price Predictions for Selected Favorites</h2>
          {selectedFavorites.length === 0 ? (
            <p>No favorites selected for prediction.</p>
          ) : (
            selectedFavorites.map((property, index) => {
              const currentPrice = property.prices.find(
                (price) => price !== null && price !== undefined
              );
              const predictedPrice = currentPrice ? currentPrice * 7 : null;

              return (
                <div key={index} className="mb-2 border rounded p-2 bg-white">
                  <h3 className="font-semibold">{property.address}</h3>
                  <p>
                    Current Price:{' '}
                    {currentPrice
                      ? `$${parseFloat(currentPrice).toLocaleString()}`
                      : 'Not available'}
                  </p>
                  <p>
                    Predicted Price in 30 years:{' '}
                    {predictedPrice
                      ? `$${parseFloat(predictedPrice).toLocaleString()}`
                      : 'Unable to predict'}
                  </p>
                </div>
              );
            })
          )}
        </div>
        {/* Property Listings container */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-4">Property Listings</h1>
          {/* Favorites */}
          <h2 className="text-lg font-bold mb-2">Favorites</h2>
          {selectedProperties.length > 0 ? (
            selectedProperties.map((property, index) => (
              <div key={index} className="favorite-property mb-2 border rounded p-2 bg-white">
                <h3>{property.address || 'Address not available'}</h3>
                <p>{property.neighborhood || 'Neighborhood not available'}</p>
                <p>{property.propertyType || 'Property Type not available'}</p>
                <input
                  type="checkbox"
                  checked={selectedFavorites.includes(property)}
                  onChange={() => handleFavoriteSelection(property)}
                />{' '}
                Select for Price Prediction
              </div>
            ))
          ) : (
            <p>No favorites selected.</p>
          )}
          {/* Filters */}
          <div className="mb-4 grid grid-cols-2 gap-4">
            {/* Neighborhood Filter */}
            <div>
              <label className="block text-sm font-semibold mb-2" htmlFor="neighborhood-filter">
                Filter by Neighborhood:
              </label>
              <select
                id="neighborhood-filter"
                className="p-2 border rounded w-full"
                value={filteredNeighborhood}
                onChange={(e) => setFilteredNeighborhood(e.target.value)}
              >
                {neighborhoods.map((neighborhood) => (
                  <option key={neighborhood} value={neighborhood}>
                    {neighborhood}
                  </option>
                ))}
              </select>
            </div>
            {/* Property Type Filter */}
            <div>
              <label className="block text-sm font-semibold mb-2" htmlFor="property-type-filter">
                Filter by Property Type:
              </label>
              <select
                id="property-type-filter"
                className="p-2 border rounded w-full"
                value={filteredPropertyType}
                onChange={(e) => setFilteredPropertyType(e.target.value)}
              >
                {propertyTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {/* Month Selector */}
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2" htmlFor="month-selector">
              Select Number of Months:
            </label>
            <select
              id="month-selector"
              className="p-2 border rounded"
              value={maxMonth}
              onChange={(e) => setMaxMonth(parseInt(e.target.value, 10))}
            >
              {Array.from({ length: 12 }, (_, index) => {
                const month = index + 1;
                return (
                  <option key={month} value={month}>
                    {month} Month{month > 1 ? 's' : ''}
                  </option>
                );
              })}
            </select>
          </div>
          {/* Render Listings */}
          {error ? (
            <p className="text-red-600">{error}</p>
          ) : filteredListings.length > 0 ? (
            filteredListings.map((listing, index) => {
              const prices = [
                listing.price_1_month,
                listing.price_2_months,
                listing.price_3_months,
                listing.price_4_months,
                listing.price_5_months,
                listing.price_6_months,
                listing.price_7_months,
                listing.price_8_months,
                listing.price_9_months,
                listing.price_10_months,
                listing.price_11_months,
                listing.price_12_months,
              ];

              return (
                <ListingCard
                  key={index}
                  address={listing.address}
                  neighborhood={listing.neighborhood}
                  propertyType={listing.property_type}
                  prices={prices}
                  maxMonth={maxMonth}
                  currentPrice={listing.price_1_month}
                  onSelect={() => onSelect(listing)}
                />
              );
            })
          ) : (
            <p className="text-gray-600">No listings to display.</p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Analysis;
