"use client"; // Next.js directive to mark this component as a client-side component

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const ListingCard = ({
  address,
  neighborhood,
  propertyType,
  prices, // The array of price data containing 'month' and 'price'
  maxMonth, // Maximum number of months to display in the chart
  currentPrice,
  onSelect,
}) => {
  // Filter out any invalid price objects from the prices array
  const validPrices = prices.filter(
    (priceObj) =>
      priceObj.price !== null && priceObj.price !== undefined && priceObj.price !== ''
  );

  // Limit the prices array to the number of months specified by maxMonth
  const limitedPrices = validPrices.slice(0, maxMonth);

  // Determine if the price trend is going up or down based on the first and last prices
  const trendDirection =
    limitedPrices.length > 1
      ? parseFloat(limitedPrices[limitedPrices.length - 1].price) -
        parseFloat(limitedPrices[0].price) > 0
        ? 'up'
        : 'down'
      : 'neutral';

  // Create an array of data for the chart, using the 'month' as the label and 'price' as the data
  const priceData = limitedPrices.map((priceObj, index) => ({
    name: priceObj.month, // Using the 'month' field for the X-axis label
    price: parseFloat(priceObj.price), // Ensure the price is a float number for the Y-axis
  }));

  // Format the current price for display
  const formattedCurrentPrice =
    currentPrice && !isNaN(parseFloat(currentPrice))
      ? `$${parseFloat(currentPrice).toLocaleString()}` // Format the price with commas
      : 'Price not available'; // Fallback message

  return (
    <div className="bg-white shadow rounded p-4 mb-4 flex justify-between items-center">
      {/* Left side displaying property details */}
      <div>
        <h2 className="text-lg font-bold">{propertyType}</h2>
        <p className="text-sm text-gray-600">
          {address}, {neighborhood}
        </p>
        <div className="flex items-center mt-2">
          <button onClick={onSelect} className="select-button">
            Add to Favorites
          </button>
        </div>
      </div>

      {/* Right side displaying the price chart and current price */}
      <div className="flex items-center">
        <div className="flex items-center">
          <ResponsiveContainer width={450} height={70}>
            <LineChart data={priceData}>
              <XAxis dataKey="name" hide />
              <YAxis
                domain={[
                  Math.min(...limitedPrices.map((p) => parseFloat(p.price))) - 10,
                  Math.max(...limitedPrices.map((p) => parseFloat(p.price))) + 10,
                ]}
                hide
              />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="price"
                stroke={trendDirection === 'up' ? '#4CAF50' : '#FF0000'}
                strokeWidth={1}
                dot={{
                  r: 1.5,
                  fill: trendDirection === 'up' ? '#4CAF50' : '#FF0000',
                }}
                activeDot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>

          {/* Trend direction indicator */}
          <span
            className={`ml-2 ${
              trendDirection === 'up' ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {trendDirection === 'up' ? '▲' : '▼'}
          </span>
        </div>

        {/* Display the current price */}
        <div className="text-right ml-4">
          <p className="text-sm text-gray-500">Current Price:</p>
          <p className="text-lg font-semibold">{formattedCurrentPrice}</p>
        </div>
      </div>
    </div>
  );
};

export default ListingCard;
