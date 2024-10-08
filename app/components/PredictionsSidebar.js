import React from 'react';

const PredictionSidebar = ({ selectedFavorites }) => {
  return (
    <div className="w-1/4 bg-gray-100 rounded p-4 shadow-md mr-4">
      <h2 className="text-lg font-bold mb-2">Price Predictions for Selected Favorites</h2>
      {selectedFavorites.length === 0 ? (
        <p>No favorites selected for prediction.</p>
      ) : (
        selectedFavorites.map((property, index) => {
          const currentPrice = property.prices.find(
            (price) => price !== null && price !== undefined
          );
          const predictedPrice = currentPrice ? currentPrice * 7 : null;

          return (
            <div key={index} className="mb-2 border rounded p-2 bg-white">
              <h3 className="font-semibold">{property.address}</h3>
              <p>
                Current Price:{' '}
                {currentPrice
                  ? `$${parseFloat(currentPrice).toLocaleString()}`
                  : 'Not available'}
              </p>
              <p>
                Predicted Price in 30 years:{' '}
                {predictedPrice
                  ? `$${parseFloat(predictedPrice).toLocaleString()}`
                  : 'Unable to predict'}
              </p>
            </div>
          );
        })
      )}
    </div>
  );
};

export default PredictionSidebar;
