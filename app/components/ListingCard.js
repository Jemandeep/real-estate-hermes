"use client";

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
  prices,
  maxMonth,
  currentPrice,
  onSelect,
}) => {
  const validPrices = prices.filter(
    (price) => price !== null && price !== undefined && price !== ''
  );

  // Only take prices up to maxMonth
  const limitedPrices = validPrices.slice(0, maxMonth);

  const trendDirection =
    limitedPrices.length > 1
      ? limitedPrices[limitedPrices.length - 1] - limitedPrices[0] > 0
        ? 'up'
        : 'down'
      : 'neutral';

  const priceData = limitedPrices.map((price, index) => ({
    name: `Month ${index + 1}`,
    price: parseFloat(price),
  }));

  const formattedCurrentPrice =
    currentPrice && !isNaN(parseFloat(currentPrice))
      ? `$${parseFloat(currentPrice).toLocaleString()}`
      : 'Price not available';

  return (
    <div className="bg-white shadow rounded p-4 mb-4 flex justify-between items-center">
      <div>
        <h2 className="text-lg font-bold">{propertyType}</h2>
        <p className="text-sm text-gray-600">
          {address}, {neighborhood}
        </p>
        <div className="flex items-center mt-2">
          <button
            onClick={onSelect}
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
              <YAxis
                domain={[
                  Math.min(...limitedPrices) - 10,
                  Math.max(...limitedPrices) + 10,
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

          <span
            className={`ml-2 ${
              trendDirection === 'up' ? 'text-green-500' : 'text-red-500'
            }`}
          >
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

export default ListingCard;
