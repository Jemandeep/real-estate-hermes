"use client";
import React, { useState } from 'react';

const ListingCard = ({
  address = "No Address Available",
  neighborhood = "Unknown Neighborhood",
  propertyType = "Unknown Type",
  currentPrice,
  bedCount = 0,
  bathroomCount = 0,
  id,
  onClick, // New prop to handle click actions
  showCompareButton = false, // Initially hide the compare button
  onCompare,
  compareList = [],
}) => {
  const [isSelected, setIsSelected] = useState(false); // State to track selection
  const [isExpanded, setIsExpanded] = useState(false); // State to track expanded view
  
  const handleCardClick = (e) => {
    // Prevent the default onClick if it's triggered from the compare button
    if (e.target.tagName !== "BUTTON") {
      setIsSelected(!isSelected); // Toggle selection when card is clicked
      setIsExpanded(true); // Make the card expand to full screen (if needed)
      if (onCompare) onCompare(id); // Add to compare list
    }
  };

  return (
    <div
      onClick={handleCardClick} // Toggle selection and expand the card
      className={`cursor-pointer p-6 mb-4 transition-all rounded-lg relative ${
        isSelected ? 'bg-white shadow-lg border-2 border-blue-500' : 'bg-stone-300 shadow-lg'
      } hover:scale-105 hover:translate-x-0 hover:translate-y-0 hover:shadow-xl hover:z-50`}
      style={{
        transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease, z-index 0.3s ease',
        maxWidth: isExpanded ? '100%' : '300px', // Adjust size when expanded
        maxHeight: isExpanded ? '90vh' : 'auto', // Adjust height when expanded
        margin: isExpanded ? 'auto' : 'initial', // Center when expanded
        borderRadius: isExpanded ? '10px' : '8px',
        overflow: 'auto',
      }}
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

        {/* Hide the compare button */}
        {showCompareButton && !isSelected && (
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent onClick from triggering navigation
              if (onCompare) onCompare(id); // Add to compare list
            }}
            className="px-2 py-1 mt-2 text-xs rounded bg-blue-100 text-blue-500 hover:bg-blue-200 transition-all"
          >
            Compare
          </button>
        )}
      </div>
    </div>
  );
};

export default ListingCard;
