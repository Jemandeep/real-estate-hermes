"use client"; // Next.js directive to mark this component as a client-side component

import React from 'react'; // Import React to create the functional component
import {
  LineChart, // Main chart component from Recharts for rendering a line chart
  Line, // Line element to draw data points and connect them
  XAxis, // X-axis of the chart (time or months in this case)
  YAxis, // Y-axis of the chart (prices in this case)
  Tooltip, // Tooltip to show detailed information on hover
  ResponsiveContainer, // Wrapper to make the chart responsive to its container's size
} from 'recharts'; // Recharts is a library for creating charts in React

// ListingCard component represents a card for a property listing
// It receives the following props: address, neighborhood, propertyType, prices, maxMonth, currentPrice, and onSelect
const ListingCard = ({
  address, // The property's address
  neighborhood, // The neighborhood the property is located in
  propertyType, // Type of property (e.g., condo, house)
  prices, // An array of prices over time (monthly data)
  maxMonth, // Maximum number of months to display in the chart
  currentPrice, // The current price of the property
  onSelect, // Callback function to handle selecting a property
}) => {
  // Filter out any invalid prices (null, undefined, or empty strings) from the prices array
  const validPrices = prices.filter(
    (price) => price !== null && price !== undefined && price !== ''
  );

  // Limit the prices to the specified number of months (maxMonth)
  const limitedPrices = validPrices.slice(0, maxMonth);

  // Determine if the price trend is going up, down, or neutral based on the first and last prices
  const trendDirection =
    limitedPrices.length > 1 // Ensure we have at least two data points to compare
      ? limitedPrices[limitedPrices.length - 1] - limitedPrices[0] > 0 // Compare the last price to the first
        ? 'up' // If the last price is higher, trend is 'up'
        : 'down' // If the last price is lower, trend is 'down'
      : 'neutral'; // If there aren't enough data points, trend is 'neutral'

  // Create an array of objects to represent the price data for the chart
  const priceData = limitedPrices.map((price, index) => ({
    name: `Month ${index + 1}`, // The name for each data point (e.g., "Month 1", "Month 2")
    price: parseFloat(price), // Convert the price to a float to ensure it's a number
  }));

  // Format the current price for display, ensuring it's a valid number
  const formattedCurrentPrice =
    currentPrice && !isNaN(parseFloat(currentPrice))
      ? `$${parseFloat(currentPrice).toLocaleString()}` // Format the number with commas (e.g., 1,000,000)
      : 'Price not available'; // Fallback if the price is not available or invalid

  return (
    // Main container for the listing card, styled using Tailwind CSS classes
    <div className="bg-white shadow rounded p-4 mb-4 flex justify-between items-center">
      {/* Left side of the card, displaying property information */}
      <div>
        {/* Property type (e.g., condo, house) as the main heading */}
        <h2 className="text-lg font-bold">{propertyType}</h2>
        {/* Display address and neighborhood in smaller text */}
        <p className="text-sm text-gray-600">
          {address}, {neighborhood}
        </p>
        {/* Button to allow the user to select and add the property to their favorites */}
        <div className="flex items-center mt-2">
          <button
            onClick={onSelect} // When clicked, triggers the onSelect function passed as a prop
            className="select-button" // Tailwind CSS class for styling the button (ensure you define this class in your CSS)
          >
            Add to Favorites
          </button>
        </div>
      </div>

      {/* Right side of the card, displaying price trends and the current price */}
      <div className="flex items-center">
        {/* Chart displaying the price trends over time */}
        <div className="flex items-center">
          {/* ResponsiveContainer ensures the chart is responsive and fits its container */}
          <ResponsiveContainer width={450} height={70}>
            <LineChart data={priceData}> {/* LineChart takes the priceData array as input */}
              <XAxis dataKey="name" hide /> {/* X-axis, but hidden */}
              <YAxis
                domain={[
                  Math.min(...limitedPrices) - 10, // Set minimum Y-axis value slightly below the lowest price
                  Math.max(...limitedPrices) + 10, // Set maximum Y-axis value slightly above the highest price
                ]}
                hide // Hide the Y-axis
              />
              <Tooltip /> {/* Tooltip to show detailed data on hover */}
              {/* Line to represent price trends */}
              <Line
                type="monotone" // Smooth line without sharp turns
                dataKey="price" // Use the 'price' field from priceData as the data source
                stroke={trendDirection === 'up' ? '#4CAF50' : '#FF0000'} // Green if the trend is up, red if it's down
                strokeWidth={1} // Line thickness
                dot={{
                  r: 1.5, // Dot radius at data points
                  fill: trendDirection === 'up' ? '#4CAF50' : '#FF0000', // Dot color based on trend direction
                }}
                activeDot={{ r: 3 }} // Larger dot on hover
              />
            </LineChart>
          </ResponsiveContainer>

          {/* Trend direction indicator: Green up arrow if prices are going up, red down arrow if going down */}
          <span
            className={`ml-2 ${
              trendDirection === 'up' ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {trendDirection === 'up' ? '▲' : '▼'} {/* Up or down arrow based on the trend */}
          </span>
        </div>

        {/* Current price display */}
        <div className="text-right ml-4">
          <p className="text-sm text-gray-500">Current Price:</p>
          {/* Display the current price, or a fallback message if unavailable */}
          <p className="text-lg font-semibold">{formattedCurrentPrice}</p>
        </div>
      </div>
    </div>
  );
};

export default ListingCard; // Export the ListingCard component so it can be used elsewhere

