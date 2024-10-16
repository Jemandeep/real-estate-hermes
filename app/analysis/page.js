// analysis/page.js
""use client";

import React, { useState, useEffect } from 'react';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../../firebase';
import Layout from '../components/Layout';
import ListingCard from '../components/ListingCard';
import MapComponent from '../components/MapComponent';
import PredictionSidebar from '../components/PredictionsSidebar';
import Filters from '../components/Filters';
import PropertyManager from '../components/PropertyManager'; // Import Property Manager

const Analysis = () => {
  // State hooks to manage various pieces of data within the component
  const [listings, setListings] = useState([]); // Holds the fetched property listings
  const [filteredNeighborhood, setFilteredNeighborhood] = useState('All'); // Holds the selected neighborhood for filtering
  const [filteredPropertyType, setFilteredPropertyType] = useState('All'); // Holds the selected property type for filtering
  const [maxMonth, setMaxMonth] = useState(12); // Holds the number of months for which price data is shown
  const [selectedProperties, setSelectedProperties] = useState([]); // Holds the properties that the user has selected as favorites
  const [neighborhoods, setNeighborhoods] = useState([]); // Holds the list of unique neighborhoods for filtering
  const [propertyTypes, setPropertyTypes] = useState([]); // Holds the list of unique property types for filtering
  const [error, setError] = useState(null); // Holds any errors that occur during data fetching
  const [selectedFavorites, setSelectedFavorites] = useState([]); // Holds the list of properties selected for price prediction
  const [selectedCommunity, setSelectedCommunity] = useState('All'); // Tracks the selected community on the map

  // useEffect hook to fetch data from Firebase once when the component is mounted
  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'listings'));
        const data = querySnapshot.docs.map((doc) => doc.data());
        setListings(data.slice(0, 250)); // Set the listings state with a subset of the data (first 250)

        // Extract unique neighborhoods and property types for filtering
        const uniqueNeighborhoods = ['All', ...new Set(data.map((item) => item.neighborhood))];
        const uniquePropertyTypes = ['All', ...new Set(data.map((item) => item.property_type))];

        setNeighborhoods(uniqueNeighborhoods); // Set the neighborhoods state
        setPropertyTypes(uniquePropertyTypes); // Set the property types state
      } catch (error) {
        setError(error.message); // Catch any errors and set the error state
        console.error('Error fetching data:', error); // Log the error to the console
      }
    };

    fetchData(); // Invoke the fetchData function
  }, []); // Empty dependency array ensures this effect runs only once after component mount

  // Function to handle community selection from the map
  const onSelectCommunity = (communityName) => {
    setSelectedCommunity(communityName); // Set the selected community
    setFilteredNeighborhood(communityName); // Set the filtered neighborhood based on the selected community
  };

  // Function to handle when a property is selected (added to favorites)
  const onSelect = (listing) => {
    setSelectedProperties((prevSelected) => [
      ...prevSelected,
      {
        address: listing.address,
        neighborhood: listing.neighborhood,
        propertyType: listing.property_type,
        prices: listing.prices || [],
        currentPrice: listing.current_price,
      },
    ]);
  };

  // Function to handle selecting and deselecting properties for price predictions
  const handleFavoriteSelection = (property) => {
    if (!property.latitude || !property.longitude) {
      console.warn('Property is missing latitude or longitude:', property);
      return;
    }
    setSelectedFavorites((prevSelectedFavorites) => {
      if (prevSelectedFavorites.includes(property)) {
        // If the property is already in the favorites list, remove it
        return prevSelectedFavorites.filter((fav) => fav !== property);
      } else {
        // Otherwise, add the property to the favorites list
        return [...prevSelectedFavorites, property];
      }
    });
  };

  // Filter the listings based on the selected neighborhood and property type
  const filteredListings = listings.filter((listing) => {
    const matchesNeighborhood =
      filteredNeighborhood === 'All' || listing.neighborhood === filteredNeighborhood;
    const matchesPropertyType =
      filteredPropertyType === 'All' || listing.property_type === filteredPropertyType;
    return matchesNeighborhood && matchesPropertyType; // Return true only if both filters match
  });

  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-4 bg-white rounded shadow mt-10 flex">
        {/* Prediction Sidebar: Display selected properties for price predictions */}
        <PredictionSidebar selectedFavorites={selectedFavorites} />

        {/* Main content container for listings */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-4">Property Listings</h1>

          {/* Map component displaying Calgary communities */}
          <div className="mb-4">
            <h2 className="text-xl font-bold mb-2">Calgary Communities Map</h2>
            <MapComponent onSelectCommunity={onSelectCommunity} /> {/* Map for selecting a community */}
          </div>

          {/* Display the user's favorite properties */}
          <h2 className="text-lg font-bold mb-2">Favorites</h2>
          {selectedProperties.length > 0 ? (
            selectedProperties.map((property, index) => (
              <div key={index} className="favorite-property mb-2 border rounded p-2 bg-white">
                <h3>{property.address || 'Address not available'}</h3>
                <p>{property.neighborhood || 'Neighborhood not available'}</p>
                <p>{property.propertyType || 'Property Type not available'}</p>
                {/* Checkbox to allow the user to select the property for price prediction */}
                <input
                  type="checkbox"
                  checked={selectedFavorites.includes(property)}
                  onChange={() => handleFavoriteSelection(property)}
                />{' '}
                Select for Price Prediction
              </div>
            ))
          ) : (
            <p>No favorites selected.</p> // Message when no favorites are selected
          )}

          {/* Filters for selecting neighborhoods and property types */}
          <Filters
            neighborhoods={neighborhoods} // Pass unique neighborhoods to Filters component
            propertyTypes={propertyTypes} // Pass unique property types to Filters component
            filteredNeighborhood={filteredNeighborhood} // Currently selected neighborhood
            setFilteredNeighborhood={setFilteredNeighborhood} // Function to update the selected neighborhood
            filteredPropertyType={filteredPropertyType} // Currently selected property type
            setFilteredPropertyType={setFilteredPropertyType} // Function to update the selected property type
          />

          {/* Selector to choose the number of months for price data */}
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2" htmlFor="month-selector">
              Select Number of Months:
            </label>
            <select
              id="month-selector"
              className="p-2 border rounded"
              value={maxMonth} // The currently selected number of months
              onChange={(e) => setMaxMonth(parseInt(e.target.value, 10))} // Update the number of months when selected
            >
              {Array.from({ length: 12 }, (_, index) => {
                const month = index + 1;
                return (
                  <option key={month} value={month}>
                    {month} Month{month > 1 ? 's' : ''} {/* Handle pluralization */}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Render the filtered listings */}
          {error ? (
            <p className="text-red-600">{error}</p> // Display error message if fetching fails
          ) : (
            filteredListings.map((listing, index) => {
              const prices = listing.prices?.map((priceObj) => priceObj.price) || [];
              return (
                <ListingCard
                  key={index} // Unique key for each listing
                  address={listing.address}
                  neighborhood={listing.neighborhood}
                  propertyType={listing.property_type}
                  prices={prices}
                  maxMonth={maxMonth} // Pass the selected number of months to the ListingCard
                  currentPrice={listing.current_price}
                  onSelect={() => onSelect(listing)} // Handle property selection
                />
              );
            })
          )}
        </div>

        {/* Add Property Manager on the side */}
        <div className="ml-4 w-1/4">
          <PropertyManager />
        </div>
      </div>
    </Layout>
  );
};

export default Analysis; // Export the Analysis component for use in the application
