// analysis/page.js
"use client"; // Instructs Next.js to render this file on the client-side, allowing access to hooks like useState and useEffect

import React, { useState, useEffect } from 'react'; // Import React and hooks for state management and side-effects
import { getDocs, collection } from 'firebase/firestore'; // Firebase functions to fetch documents from Firestore
import { db } from '../../firebase'; // Import Firebase configuration (database instance)
import Layout from '../components/Layout'; // Custom layout component for consistent page structure
import ListingCard from '../components/ListingCard'; // Component to display individual property listing details
import MapComponent from '../components/MapComponent'; // Component to render an interactive map with community data
import PredictionSidebar from '../components/PredictionsSidebar'; // Sidebar for displaying predictions related to favorite properties
import Filters from '../components/Filters'; // Component to filter listings by neighborhood and property type
import PropertyManager from '../components/PropertyManager'; // Component to manage properties, imported but not yet functional

const Analysis = () => {
  // React state hooks for managing data and UI state across the component
  const [listings, setListings] = useState([]); // Store the list of property listings fetched from Firestore
  const [filteredNeighborhood, setFilteredNeighborhood] = useState('All'); // Track the currently selected neighborhood filter
  const [filteredPropertyType, setFilteredPropertyType] = useState('All'); // Track the selected property type filter
  const [maxMonth, setMaxMonth] = useState(12); // Number of months to display price history, defaulting to 12
  const [selectedProperties, setSelectedProperties] = useState([]); // Track properties selected by the user for predictions
  const [neighborhoods, setNeighborhoods] = useState([]); // Store a list of unique neighborhoods to be used in the filter dropdown
  const [propertyTypes, setPropertyTypes] = useState([]); // Store unique property types for filtering
  const [error, setError] = useState(null); // Store any errors that may occur during data fetching
  const [selectedFavorites, setSelectedFavorites] = useState([]); // Track properties selected as favorites by the user
  const [selectedCommunity, setSelectedCommunity] = useState('All'); // Track the community selected via the map

  // useEffect hook to fetch listings from Firestore when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'listings')); // Fetch all documents from the 'listings' collection in Firestore
        const data = querySnapshot.docs.map((doc) => doc.data()); // Extract data from each document
  
        // Ensure latitude and longitude are included when setting the listings
        setListings(data.slice(0, 250)); // Set the listings state, limiting the number of listings to 250 for performance
  
        const uniqueNeighborhoods = ['All', ...new Set(data.map((item) => item.neighborhood))]; // Extract unique neighborhoods from data
        const uniquePropertyTypes = ['All', ...new Set(data.map((item) => item.property_type))]; // Extract unique property types from data
        
        setNeighborhoods(uniqueNeighborhoods); // Update the neighborhoods state with these unique values
        setPropertyTypes(uniquePropertyTypes); // Update the property types state
      } catch (error) {
        setError(error.message); // Set the error state in case of failure
        console.error('Error fetching data:', error); // Log the error to the console
      }
    };
  
    fetchData(); // Invoke fetchData to load the listings when the component mounts
  }, []); // Empty dependency array ensures this effect runs only once, after the initial render
  

  // Function to handle property selection for price predictions
  const onSelect = (listing) => {
    setSelectedProperties((prevSelected) => [
      ...prevSelected, // (...) spread operator: expands the elements into the new array.
      {
        address: listing.address, // Store the address of the selected property
        neighborhood: listing.neighborhood, // Store the neighborhood of the selected property
        propertyType: listing.property_type, // Store the property type
        prices: listing.prices || [], // Store the price history or an empty array incase its missing
        currentPrice: listing.current_price, // Store the current price of the property
        latitude: listing.latitude, // Store the latitude of the selected property
        longitude: listing.longitude // Store the longitude of the selected property
      },
    ]);
  };

  // Function to toggle property selection as a favorite
  const handleFavoriteSelection = (property) => {
    if (!property.latitude || !property.longitude) {
      console.warn('Property is missing latitude or longitude:', property); // Warn if the property is missing geographic coordinates
      return;
    }
    setSelectedFavorites((prevSelectedFavorites) => {
      // Check if the property is already a favorite; if so, remove it; otherwise, add it
      if (prevSelectedFavorites.includes(property)) {
        return prevSelectedFavorites.filter((fav) => fav !== property); // Remove the property from favorites
      } else {
        return [...prevSelectedFavorites, property]; // Add the property to favorites
      }
    });
  };

  // Filter the listings based on selected neighborhood and property type
  const filteredListings = listings.filter((listing) => {
    const matchesNeighborhood =
      filteredNeighborhood === 'All' || listing.neighborhood === filteredNeighborhood; // Check if listing matches selected neighborhood
    const matchesPropertyType =
      filteredPropertyType === 'All' || listing.property_type === filteredPropertyType; // Check if listing matches selected property type
    return matchesNeighborhood && matchesPropertyType; // Return listings that match both filters
  });


  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-4 bg-white rounded shadow mt-10 flex">
        {/* Prediction Sidebar */}
        <PredictionSidebar selectedFavorites={selectedFavorites} /> {/* Pass selected favorites to the prediction sidebar */}

        {/* Main content container for listings */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-4">Property Listings</h1> {/* Heading for the property listings section */}

          {/* Map component displaying Calgary communities */}
          <div className="mb-4">
            <h2 className="text-xl font-bold mb-2">Calgary Communities Map</h2> {/* Subheading for the map */}
            <MapComponent
              favoriteProperties={selectedFavorites} // Pass selected favorites to the MapComponent
              listings={filteredListings} // Pass filtered listings with coordinates to the MapComponent
            />
          </div>

          <h2 className="text-lg font-bold mb-2">Favorites</h2> {/* Subheading for the favorites section */}
          {selectedProperties.length > 0 ? (
            selectedProperties.map((property, index) => (
              <div key={index} className="favorite-property mb-2 border rounded p-2 bg-white">
                <h3>{property.address || 'Address not available'}</h3> {/* Display property address */}
                <p>{property.neighborhood || 'Neighborhood not available'}</p> {/* Display property neighborhood */}
                <p>{property.propertyType || 'Property Type not available'}</p> {/* Display property type */}
                <input
                  type="checkbox"
                  checked={selectedFavorites.includes(property)} // Check if the property is selected as a favorite
                  onChange={() => handleFavoriteSelection(property)} // Toggle favorite selection on checkbox change
                />{' '}
                Select for Price Prediction
              </div>
            ))
          ) : (
            <p>No favorites selected.</p> // Display message if no properties are selected as favorites
          )}

          {/* Filters Component */}
          <Filters
            neighborhoods={neighborhoods} // Pass the list of neighborhoods to the Filters component
            propertyTypes={propertyTypes} // Pass the list of property types to the Filters component
            filteredNeighborhood={filteredNeighborhood} // Pass the current neighborhood filter
            setFilteredNeighborhood={setFilteredNeighborhood} // Pass the function to update the neighborhood filter
            filteredPropertyType={filteredPropertyType} // Pass the current property type filter
            setFilteredPropertyType={setFilteredPropertyType} // Pass the function to update the property type filter
          />

          {/* Month Selector for Price Prediction */}
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2" htmlFor="month-selector">
              Select Number of Months:
            </label>
            <select
              id="month-selector"
              className="p-2 border rounded"
              value={maxMonth}
              onChange={(e) => setMaxMonth(parseInt(e.target.value, 10))} // Update maxMonth state when user selects a different value
            >
              {Array.from({ length: 12 }, (_, index) => {
                const month = index + 1; // Generate month numbers 1 through 12
                return (
                  <option key={month} value={month}>
                    {month} Month{month > 1 ? 's' : ''} {/* Handle pluralization */}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Display error message if data fetching fails */}
          {error ? (
            <p className="text-red-600">{error}</p> // Render the error message in red if there's an error
          ) : (
            filteredListings.map((listing, index) => {
              const prices = listing.prices?.map((priceObj) => priceObj.price) || []; // Extract price history or default to an empty array
              return (
                <ListingCard
                  key={index}
                  address={listing.address} // Pass the listing address to the ListingCard component
                  neighborhood={listing.neighborhood} // Pass the neighborhood
                  propertyType={listing.property_type} // Pass the property type
                  prices={prices} // Pass the price history
                  maxMonth={maxMonth} // Pass the selected number of months for the price history
                  currentPrice={listing.current_price} // Pass the current price
                  onSelect={() => onSelect(listing)} // Pass the onSelect function to allow property selection
                />
              );
            })
          )}
        </div>

        {/* Add Property Manager on the side */}
        <div className="ml-4 w-1/4">
          <PropertyManager /> {/* Display the Property Manager component on the side */}
        </div>
      </div>
    </Layout>
  );
};

export default Analysis; // Export the Analysis component for use in the application
