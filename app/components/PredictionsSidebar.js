import React, { useState } from 'react'; // Import React and useState hook for managing state

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
    <div className="w-1/4 bg-gray-100 rounded p-4 shadow-md mr-4">
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
          {[5, 10, 15, 20, 25, 30].map((year) => (
            <option key={year} value={year}>
              {year} Years
            </option>
          ))}
        </select>
      </div>

      {/* Check if the 'selectedFavorites' array is empty */}
      {selectedFavorites.length === 0 ? (
        <p>No favorites selected for prediction.</p> // Display message if no favorites are selected
      ) : (
        selectedFavorites.map((property, index) => {
          // Find the most recent price from the 'prices' array (last entry)
          const mostRecentPriceObj = property.prices.length > 0 ? property.prices[0] : null; // Get the first element, assuming it's the most recent
          const currentPrice = mostRecentPriceObj ? mostRecentPriceObj.price : null;

          // Calculate the predicted price using the selected prediction period
          const predictedPrice = currentPrice
            ? calculatePredictedPrice(currentPrice, predictionYears)
            : null;

          return (
            <div key={index} className="mb-2 border rounded p-2 bg-white">
              {/* Display the address of the property */}
              <h3 className="font-semibold">{property.address}</h3>

              {/* Display the current price */}
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

export default PredictionSidebar;
