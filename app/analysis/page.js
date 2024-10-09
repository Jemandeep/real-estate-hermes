"use client"; // Next.js directive to specify that this component runs on the client-side

import React, { useState, useEffect } from 'react'; // Import React and hooks for managing state and side effects
import Layout from '../components/Layout'; // Import the Layout component to wrap the content
import ListingCard from '../components/ListingCard'; // Import the ListingCard component for each property listing
import MapComponent from '../components/MapComponent'; // Import the MapComponent for displaying the map
import PredictionSidebar from '../components/PredictionsSidebar'; // Import the PredictionSidebar for price predictions
import Filters from '../components/Filters';  // Import the Filters component for filtering listings by neighborhood and property type

// URL to the Mockaroo API (simulated data source) for fetching property listings
const MOCKAROO_URL = 'https://api.mockaroo.com/api/3b6f9270?count=1000&key=9e007e70';

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

  // useEffect hook runs once when the component is mounted to fetch the data
  useEffect(() => {
    // Fetch property listings from the API
    const fetchData = async () => {
      try {
        const response = await fetch(MOCKAROO_URL, {
          headers: { 'Content-Type': 'application/json' }, // Specify that we're expecting JSON
        });

        // Check if the response is not OK and throw an error if needed
        if (!response.ok) {
          throw new Error('Failed to fetch data: ' + response.statusText);
        }

        const text = await response.text(); // Get the response text
        const data = JSON.parse(text); // Parse the JSON data

        setListings(data.slice(0, 250)); // Set the listings state with a subset of the data (first 250)

        // Extract unique neighborhoods and property types for filtering
        const uniqueNeighborhoods = [
          'All',
          ...new Set(data.map((item) => item.neighborhood)), // Use Set to get unique values
        ];
        const uniquePropertyTypes = [
          'All',
          ...new Set(data.map((item) => item.property_type)),
        ];

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
        // Store the price history for the property (up to 12 months)
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
        currentPrice: listing.price_1_month, // Set the current price as the price for the first month
      },
    ]);
  };

  // Function to handle selecting and deselecting properties for price predictions
  const handleFavoriteSelection = (property) => {
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
              // Extract the price history for each listing
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
                  key={index} // Unique key for each listing
                  address={listing.address}
                  neighborhood={listing.neighborhood}
                  propertyType={listing.property_type}
                  prices={prices}
                  maxMonth={maxMonth} // Pass the selected number of months to the ListingCard
                  currentPrice={listing.price_1_month}
                  onSelect={() => onSelect(listing)} // Handle property selection
                />
              );
            })
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Analysis; // Export the Analysis component for use in the application
