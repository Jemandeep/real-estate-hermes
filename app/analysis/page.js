"use client";

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Layout from '../components/Layout';

//Mockaroo API
const MOCKAROO_URL = 'https://api.mockaroo.com/api/3b6f9270?count=1000&key=9e007e70';

/* chatgpt prompt: I need help building a ListingCard component for a React app. The component should display individual property
listings with the following details: address, neighborhood, property type, and current price.
Additionally, I need it to include a price trend chart that shows the price over several months
(up to 12 months). If the price trend is increasing, the chart should show in green, and if it's
decreasing, the chart should be red. The price trend direction should also be indicated with an up
 or down arrow. Please use the recharts library for the chart. Also, make sure to filter out any
undefined or null prices from the data." I provided the code  I wrote as well */

const ListingCard = ({ address, neighborhood, propertyType, prices, maxMonth, currentPrice, onSelect }) => {
  const validPrices = prices.filter(price => price !== null && price !== undefined && price !== '');

  // Only take prices up to maxMonth
  const limitedPrices = validPrices.slice(0, maxMonth); // Take only up to maxMonth

  const trendDirection = limitedPrices.length > 1 ? (limitedPrices[limitedPrices.length - 1] - limitedPrices[0] > 0 ? 'up' : 'down') : 'neutral';

  const priceData = limitedPrices.map((price, index) => ({
    name: `Month ${index + 1}`,
    price: parseFloat(price),
  }));

  const formattedCurrentPrice = currentPrice && !isNaN(parseFloat(currentPrice))
    ? `$${parseFloat(currentPrice).toLocaleString()}`
    : 'Price not available';

  return (
    <div className="bg-white shadow rounded p-4 mb-4 flex justify-between items-center">
      <div>
        <h2 className="text-lg font-bold">{propertyType}</h2>
        <p className="text-sm text-gray-600">{address}, {neighborhood}</p>
        <div className="flex items-center mt-2">
          <button
            onClick={() => onSelect({ address, neighborhood, propertyType, prices, currentPrice })}
            className="select-button"
          >
            Add to Favorites
          </button>
        </div>
      </div>

      <div className="flex items-center">
        <div className="flex items-center">
          <ResponsiveContainer width={450} height={70}>
            <LineChart data={priceData}>
              <XAxis dataKey="name" hide />
              <YAxis domain={[Math.min(...limitedPrices) - 10, Math.max(...limitedPrices) + 10]} hide />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="price"
                stroke={trendDirection === 'up' ? '#4CAF50' : '#FF0000'}
                strokeWidth={1}
                dot={{ r: 1.5, fill: trendDirection === 'up' ? '#4CAF50' : '#FF0000' }}
                activeDot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>

          <span className={`ml-2 ${trendDirection === 'up' ? 'text-green-500' : 'text-red-500'}`}>
            {trendDirection === 'up' ? '▲' : '▼'}
          </span>
        </div>

        <div className="text-right ml-4">
          <p className="text-sm text-gray-500">Current Price:</p>
          <p className="text-lg font-semibold">{formattedCurrentPrice}</p>
        </div>
      </div>
    </div>
  );
};


const predictPrice = (currentPrice) => {
  const numericPrice = Number(currentPrice);
  return numericPrice;
};

//variables hold the fetched API data, filters, and error tracking
const Analysis = () => {
  // State to store all listings fetched from the API
  const [listings, setListings] = useState([]);
  // State to filter listings by neighborhood
  const [filteredNeighborhood, setFilteredNeighborhood] = useState('All');
  // State to filter listings by property type
  const [filteredPropertyType, setFilteredPropertyType] = useState('All');
  // State to determine the maximum month for price data
  const [maxMonth, setMaxMonth] = useState(12);
  // State to store properties selected for prediction
  const [selectedProperties, setSelectedProperties] = useState([]);
  const [neighborhoods, setNeighborhoods] = useState([]);
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch listings from the API on component mount
    const fetchData = async () => {
      try {
        // Send a GET request to the specified MOCKAROO_URL
        const response = await fetch(MOCKAROO_URL, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        // If the response is not successful, throw an error with the response status
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.statusText}`);
        }
  
        // Parse the response as text and then as JSON data
        const text = await response.text();
        const data = JSON.parse(text);
  
        // Set the listings state with a subset of data (first 250 items)
        setListings(data.slice(0, 250));
  
        // Extract unique neighborhoods and property types for filtering from the fetched data
        const uniqueNeighborhoods = ['All', ...new Set(data.map((item) => item.neighborhood))];
        const uniquePropertyTypes = ['All', ...new Set(data.map((item) => item.property_type))];
  
        // Set the neighborhoods and property types state
        setNeighborhoods(uniqueNeighborhoods);
        setPropertyTypes(uniquePropertyTypes);
      } catch (error) {
        // If there's an error, set the error state and log the error to the console
        setError(error.message);
        console.error('Error fetching data:', error);
      }
    };
  
    // Call the fetchData function to initiate data fetching
    fetchData();
  }, []); // Dependency array is empty, so this effect only runs once on component mount
  
  // Adds a listing to the selected properties for prediction
  const onSelect = (listing) => {
    // Update the selected properties state by adding a new property
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
      },
    ]);
  };
  
  // Filters the listings based on selected neighborhood and property type
  const filteredListings = listings.filter((listing) => {
    // Check if the listing matches the selected neighborhood
    const matchesNeighborhood =
      filteredNeighborhood === 'All' || listing.neighborhood === filteredNeighborhood;
  
    // Check if the listing matches the selected property type
    const matchesPropertyType =
      filteredPropertyType === 'All' || listing.property_type === filteredPropertyType;
  
    // Return listings that match both neighborhood and property type filters
    return matchesNeighborhood && matchesPropertyType;
  });
  
  //function to handle property selection
  //handleSelectProperty will update selectedPrices state when a property is selected
  //handleSelectProperty takes 'prices' as a parameter, setSelectedPrices is used to update the state.
  const handleSelectProperty = (prices) => {
    setSelectedProperties((prevPrices) => [...prevPrices, prices]);
  };
  
  return (
  <Layout>
    {/* Main container with maximum width and padding */}
    <div className="max-w-7xl mx-auto p-4 bg-white rounded shadow mt-10 flex">
      
      {/* Prediction Sidebar */}
      <div className="w-1/4 bg-gray-100 rounded p-4 shadow-md mr-4">
        <h2 className="text-lg font-bold mb-2">Price Predictions in 30 Years</h2>
        
        {/* Display message if no properties are selected */}
        {selectedProperties.length === 0 ? (
          <p>No properties selected.</p>
        ) : (
          selectedProperties.map((property, index) => {
            // Calculate the current price as the first valid price from the list of prices
            const currentPrice = property.prices.find(
              (price) => price !== null && price !== undefined
            );

            // Predict the price in 30 years
            const predictedPrice = currentPrice ? currentPrice * 7 : null;

            return (
              <div key={index} className="mb-2 border rounded p-2 bg-white">
                {/* Display property address */}
                <h3 className="font-semibold">{property.address}</h3>

                {/* Display current price if available */}
                <p>
                  Current Price:{" "}
                  {currentPrice
                    ? `$${currentPrice.toLocaleString()}`
                    : "Not available"}
                </p>

                {/* Display predicted price if available */}
                <p>
                  Predicted Price in 30 years:{" "}
                  {predictedPrice
                    ? `$${predictedPrice.toLocaleString()}`
                    : "Unable to predict"}
                </p>
              </div>
            );
          })
        )}
      </div>

      {/* Property Listings container */}
      <div className="flex-1">
        <h1 className="text-2xl font-bold mb-4">Property Listings</h1>

        {/* Display selected properties (Favorites) */}
        <h2 className="text-lg font-bold mb-2">Favorites</h2>
        {selectedProperties.length > 0 ? (
          selectedProperties.map((property, index) => (
            <div
              key={index}
              className="favorite-property mb-2 border rounded p-2 bg-white"
            >
              {/* Display address, neighborhood, and property type of selected properties */}
              <h3>{property.address || "Address not available"}</h3>
              <p>{property.neighborhood || "Neighborhood not available"}</p>
              <p>{property.propertyType || "Property Type not available"}</p>
            </div>
          ))
        ) : (
          <p>No favorites selected.</p>
        )}

        {/* Filters for Neighborhood and Property Type */}
        <div className="mb-4 grid grid-cols-2 gap-4">
          <div>
            {/* Neighborhood Filter Dropdown */}
            <label
              className="block text-sm font-semibold mb-2"
              htmlFor="neighborhood-filter"
            >
              Filter by Neighborhood:
            </label>
            <select
              id="neighborhood-filter"
              className="p-2 border rounded w-full"
              value={filteredNeighborhood}
              onChange={(e) => setFilteredNeighborhood(e.target.value)}
            >
              {/* Map neighborhoods to dropdown options */}
              {neighborhoods.map((neighborhood) => (
                <option key={neighborhood} value={neighborhood}>
                  {neighborhood}
                </option>
              ))}
            </select>
          </div>
          <div>
            {/* Property Type Filter Dropdown */}
            <label
              className="block text-sm font-semibold mb-2"
              htmlFor="property-type-filter"
            >
              Filter by Property Type:
            </label>
            <select
              id="property-type-filter"
              className="p-2 border rounded w-full"
              value={filteredPropertyType}
              onChange={(e) => setFilteredPropertyType(e.target.value)}
            >
              {/* Map property types to dropdown options */}
              {propertyTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-4">
  {/* Label for selecting the number of months */}
  <label className="block text-sm font-semibold mb-2" htmlFor="month-selector">
    Select Number of Months:
  </label>
  
  {/* Dropdown to select the number of months */}
  <select
    id="month-selector"
    className="p-2 border rounded"
    value={maxMonth} // Controlled component value
    onChange={(e) => setMaxMonth(parseInt(e.target.value, 10))} // Update state with selected value
  >
    {/* Generate options for months from 1 to 12 */}
    {[...Array(12).keys()].map((month) => (
      <option key={month} value={month + 1}>
        {month + 1} Month{month > 0 ? 's' : ''} {/* Display singular or plural based on month count */}
      </option>
    ))}
  </select>
</div>

{/* Render listings */}
{error ? ( // Check for error state
  <p className="text-red-600">{error}</p> // Display error message
) : filteredListings.length > 0 ? ( // Check if there are any filtered listings
  filteredListings.map((listing, index) => {
    // Extract prices for the listing for different months
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
        key={index} // Unique key for each listing card
        address={listing.address} // Property address
        neighborhood={listing.neighborhood} // Neighborhood of the property
        propertyType={listing.property_type} // Type of the property
        onSelect={() => onSelect(listing)} // Function to handle property selection
        prices={prices} // Pass prices array to ListingCard
        maxMonth={maxMonth} // Pass the selected month count
        currentPrice={listing.price_1_month} // Current price for the listing
      />
    );
  })
) : (
  <p className="text-gray-600">No listings to display.</p> // Message for no available listings
)}
</div>
</div>
</Layout>
);
};

export default Analysis;
