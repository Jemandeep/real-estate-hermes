"use client";
import React from 'react';

const ListingCard = ({ 
  address = "No Address Available", 
  neighborhood = "Unknown Neighborhood", 
  propertyType = "Unknown Type", 
  currentPrice, 
  bedCount = 0, 
  bathroomCount = 0 
}) => {
  return (
    <div className="bg-stone-300 shadow-lg rounded-lg p-6 mb-4">
      <p className="text-lg font-bold mb-4">
        {address}, {neighborhood}
      </p>
      <p className="text-sm text-gray-700 mb-4">
        🛏️ {bedCount} {bedCount === 1 ? 'Bedroom' : 'Bedrooms'} | 🛁 {bathroomCount} {bathroomCount === 1 ? 'Bathroom' : 'Bathrooms'}
      </p>
      <div className="text-right">
        <p className="text-sm font-bold">Current Price:</p>
        <p className="text-lg font-semibold">
          {currentPrice ? `$${currentPrice.toLocaleString()}` : 'No price available'}
        </p>
        <p className="text-sm mb-2">{propertyType}</p>
      </div>
    </div>
  );
};

export default ListingCard;
