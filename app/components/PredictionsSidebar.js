import React from 'react'; // Import React to create functional components

// PredictionSidebar component receives 'selectedFavorites' as a prop
// 'selectedFavorites' is an array of properties that the user has selected for predictions
const PredictionSidebar = ({ selectedFavorites }) => {
  return (
    // Sidebar container styled using Tailwind CSS classes
    <div className="w-1/4 bg-gray-100 rounded p-4 shadow-md mr-4">
      {/* Title for the sidebar */}
      <h2 className="text-lg font-bold mb-2">Price Predictions for Selected Favorites</h2>

      {/* Check if the 'selectedFavorites' array is empty */}
      {selectedFavorites.length === 0 ? (
        // If no favorites are selected, show this message
        <p>No favorites selected for prediction.</p>
      ) : (
        // If there are selected favorites, map through the array and display each property
        selectedFavorites.map((property, index) => {
          // Find the current price from the property data
          // The condition ensures that prices are valid (not null or undefined)
          const currentPrice = property.prices.find(
            (price) => price !== null && price !== undefined
          );

          // Calculate the predicted price by multiplying the current price by 7 (simple prediction logic)
          // If currentPrice is found, calculate the predicted price, otherwise set it to null
          const predictedPrice = currentPrice ? currentPrice * 7 : null;

          // Return a styled div for each property with its details
          return (
            // 'key' prop is required for uniquely identifying each list item in React
            <div key={index} className="mb-2 border rounded p-2 bg-white">
              {/* Display the address of the property */}
              <h3 className="font-semibold">{property.address}</h3>

              {/* Display the current price, formatted as a locale string for better readability */}
              <p>
                Current Price:{' '}
                {currentPrice
                  ? `$${parseFloat(currentPrice).toLocaleString()}` // Format the current price as a currency string
                  : 'Not available'} {/* Fallback if no current price is available */}
              </p>

              {/* Display the predicted price in 30 years (using a factor of 7 for prediction) */}
              <p>
                Predicted Price in 30 years:{' '}
                {predictedPrice
                  ? `$${parseFloat(predictedPrice).toLocaleString()}` // Format the predicted price as a currency string
                  : 'Unable to predict'} {/* Fallback if no prediction can be made */}
              </p>
            </div>
          );
        })
      )}
    </div>
  );
};

export default PredictionSidebar; // Export the component to use it in other parts of the application
