"use client"; // Ensure this is a client component
import React from 'react';
import { useRouter } from 'next/navigation'; // Updated import for useRouter

const ListingCard = ({ 
  address = "No Address Available", 
  neighborhood = "Unknown Neighborhood", 
  propertyType = "Unknown Type", 
  currentPrice, 
  bedCount = 0, 
  bathroomCount = 0, 
  id, 
  onCompare, 
  compareList 
}) => {
  const isSelected = compareList.includes(id); // Check if the current listing is selected for comparison

  const handleCompareClick = () => {
    onCompare(id); // Call the parent compare function
  };

  return (
    <div className={`bg-stone-300 shadow-lg rounded-lg p-6 mb-4 ${isSelected ? 'border-4 border-blue-500' : ''}`}>
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
        <button 
          onClick={handleCompareClick}
          className={`px-4 py-2 rounded ${isSelected ? 'bg-red-500' : 'bg-blue-500'} text-white hover:bg-opacity-80`}
        >
          {isSelected ? 'Remove from Compare' : 'Compare'}
        </button>
      </div>
    </div>
  );
};

export default ListingCard;
