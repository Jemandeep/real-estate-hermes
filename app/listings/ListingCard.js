"use client";
import React from 'react';

const ListingCard = ({
  address = "No Address Available",
  neighborhood = "Unknown Neighborhood",
  propertyType = "Unknown Type",
  currentPrice,
  bedCount = 0,
  bathroomCount = 0,
  id,
  onClick, // New prop to handle click actions
  showCompareButton = true, // Hide compare button for discussions
  onCompare,
  compareList = [],
}) => {
  const isSelected = compareList.includes(id);

  return (
    <div
      onClick={onClick} // Uses onClick to navigate to the property discussion page
      className={`cursor-pointer bg-stone-300 shadow-lg rounded-lg p-6 mb-4 hover:border-blue-500 border-2 transition-all`}
    >
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
        
        {showCompareButton && (
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent onClick from triggering navigation
              if (onCompare) onCompare(id);
            }}
            className={`px-2 py-1 mt-2 text-xs rounded ${
              isSelected
                ? 'bg-red-100 text-red-500 hover:bg-red-200'
                : 'bg-blue-100 text-blue-500 hover:bg-blue-200'
            } transition-all`}
          >
            {isSelected ? 'Remove' : 'Compare'}
          </button>
        )}
      </div>
    </div>
  );
};

export default ListingCard;
