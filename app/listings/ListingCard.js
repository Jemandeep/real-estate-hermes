"use client";
import React from 'react';

const ListingCard = ({ address, neighborhood, propertyType, currentPrice, bedCount, bathroomCount }) => {
  return (
    <div className="bg-stone-300 shadow-lg rounded-lg p-6 mb-4">
      
      <p className="text-lg font-bold  mb-4">{address}, {neighborhood}</p>
      <p className="text-sm text-gray-700 mb-4">
        🛏️ {bedCount} Bedrooms | 🛁 {bathroomCount} Bathrooms
      </p>
      <div className="text-right">
        <p className="text-sm font-bold ">Current Price:</p>
    
        <p className="text-lg font-semibold">${currentPrice.toLocaleString()}</p>
        <p className="text-sm  mb-2">{propertyType}</p>
      </div>
    </div>
  );
};

export default ListingCard;

   