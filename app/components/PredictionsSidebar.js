
import React, { useState } from 'react'; // Import React and useState hook for managing state

// PredictionSidebar component receives 'selectedFavorites' as a prop
// 'selectedFavorites' is an array of properties that the user has selected for predictions
const PredictionSidebar = ({ selectedFavorites }) => {
  const [predictionYears, setPredictionYears] = useState(5); // State to track selected prediction years (default 5 years)
  // Function to handle the dropdown selection change
  const handleYearChange = (e) => {
    setPredictionYears(parseInt(e.target.value, 10)); // Update the prediction years state
  };
  // Function to calculate predicted price based on the selected number of years
  const calculatePredictedPrice = (currentPrice, years) => {
    const appreciationRate = 0.03; // Assuming a 3% annual appreciation rate
    return (currentPrice * Math.pow(1 + appreciationRate, years)).toFixed(2); // Compound annual growth
  };
  return (
    // Sidebar container styled using Tailwind CSS classes
    <div className="w-1/4 bg-gray-100 rounded p-4 shadow-md mr-4">
      {/* Title for the sidebar */}
      <h2 className="text-lg font-bold mb-2">Price Predictions for Selected Favorites</h2>

      {/* Dropdown for selecting prediction period (in years) */}
      <div className="mb-4">
        <label className="block text-sm font-semibold mb-2" htmlFor="year-selector">
          Select Prediction Period (Years):
        </label>
        <select
          id="year-selector"
          className="p-2 border rounded"
          value={predictionYears} // Current selected years
          onChange={handleYearChange} // Update the state when selection changes
        >
          {/* Dropdown options for selecting prediction years */}
          {[5, 10, 15, 20, 25, 30].map((year) => (
            <option key={year} value={year}>
              {year} Years
            </option>
          ))}
        </select>
      </div>
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

          // Calculate the predicted price using the selected prediction period
          const predictedPrice = currentPrice
            ? calculatePredictedPrice(currentPrice, predictionYears)
            : null;

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

              {/* Display the predicted price based on the selected number of years */}
              <p>
                Predicted Price in {predictionYears} years:{' '}
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
