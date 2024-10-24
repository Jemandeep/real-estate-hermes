"use client"; // Ensure client-side rendering

import React, { useState, useEffect } from 'react';
import { getDocs, collection, query, where } from 'firebase/firestore'; // Firestore functions
import { db } from '../../firebase'; // Firebase configuration
import { getAuth, onAuthStateChanged } from 'firebase/auth'; // Firebase Auth to get the current user
import Layout from '../components/Layout'; // Layout component for consistent structure
import ListingCard from '../components/ListingCard'; // Component to display each listing
import MapComponent from '../components/MapComponent'; // Component to display a map with listings

const Analysis = () => {
  const [userProperties, setUserProperties] = useState([]); // Store fetched properties belonging to the user
  const [error, setError] = useState(null); // Store any potential errors
  const [metrics, setMetrics] = useState({
    totalInvestment: 0,
    currentPortfolioValue: 0,
    roi: 0,
    cashFlow: 0,
  }); // Store calculated metrics
  const [user, setUser] = useState(null); // Store authenticated user

  const auth = getAuth(); // Get Firebase auth instance

  // Fetch property data for the logged-in user
  useEffect(() => {
    const fetchUserProperties = async (userEmail) => {
      try {
        // Query Firestore to get properties where 'userEmail' matches the logged-in user
        const propertiesQuery = query(
          collection(db, 'properties'),
          where('userEmail', '==', userEmail)
        );

        const querySnapshot = await getDocs(propertiesQuery);
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setUserProperties(data); // Set user's properties

        // Calculate metrics based on the user's properties
        let totalInvestment = 0;
        let currentPortfolioValue = 0;
        let cashFlow = 0;

        data.forEach((property) => {
          const purchasedPrice = parseFloat(property.purchased_price || 0);
          const currentPrice = parseFloat(property.current_price || 0);
          const rentPrice = parseFloat(property.rent_price || 0);
          const mortgageMonthly = parseFloat(property.mortgage_monthly_payment || 0);
          const maintenance = parseFloat(property.maintenance || 0);
          const insurance = parseFloat(property.insurance || 0);
          const taxes = parseFloat(property.taxes || 0);

          totalInvestment += purchasedPrice;
          currentPortfolioValue += currentPrice;

          // Calculate cash flow only for properties that are `is_for_rent: true`
          if (property.is_for_rent) {
            const monthlyInsurance = insurance / 12;
            const monthlyTaxes = taxes / 12;
            const propertyCashFlow = rentPrice - mortgageMonthly - maintenance - monthlyInsurance - monthlyTaxes;
            cashFlow += propertyCashFlow;
          }
        });

        const roi = totalInvestment > 0 ? ((currentPortfolioValue - totalInvestment) / totalInvestment) * 100 : 0;

        // Update the metrics
        setMetrics({
          totalInvestment,
          currentPortfolioValue,
          roi,
          cashFlow,
        });
      } catch (error) {
        setError(error.message); // Set any errors
        console.error('Error fetching user properties:', error); // Log the error
      }
    };

    // Check for the authenticated user and fetch their properties
    const unsubscribe = onAuthStateChanged(auth, (loggedUser) => {
      if (loggedUser) {
        setUser(loggedUser); // Set logged-in user
        fetchUserProperties(loggedUser.email); // Fetch properties for this user
      } else {
        setUser(null); // User is not logged in
      }
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, [auth]);

  return (
    <Layout>
      <div className="flex-1">
        <h1 className="text-2xl font-bold mb-4">Your Property Portfolio</h1>

        {/* Metrics Overview Boxes */}
        <div className="flex justify-between mb-4">
          <div className="bg-blue-100 p-4 rounded shadow-md text-center w-1/4">
            <h3 className="font-bold text-lg">Total Investment</h3>
            <p className="text-xl">${metrics.totalInvestment.toLocaleString()}</p>
          </div>
          <div className="bg-green-100 p-4 rounded shadow-md text-center w-1/4">
            <h3 className="font-bold text-lg">Current Portfolio Value</h3>
            <p className="text-xl">${metrics.currentPortfolioValue.toLocaleString()}</p>
          </div>
          <div className="bg-yellow-100 p-4 rounded shadow-md text-center w-1/4">
            <h3 className="font-bold text-lg">ROI</h3>
            <p className="text-xl">{metrics.roi.toFixed(2)}%</p>
          </div>
          <div className="bg-red-100 p-4 rounded shadow-md text-center w-1/4">
            <h3 className="font-bold text-lg">Cash Flow</h3>
            <p className="text-xl">${metrics.cashFlow.toLocaleString()}</p>
          </div>
        </div>

        {/* Map component displaying user's properties */}
        <div className="mb-4">
          <h2 className="text-xl font-bold mb-2">Your Properties Map</h2>
          <MapComponent listings={userProperties} /> {/* Pass user properties to the MapComponent */}
        </div>

        {/* Scrollable property listings box */}
        <div 
          style={{ 
            maxHeight: '400px',  // Set the height of the box to a finite size
            overflowY: 'auto',   // Enable vertical scrolling when content exceeds the box height
            padding: '10px',
            border: '1px solid #ddd', // Add border for a defined box look
            borderRadius: '8px',   // Optional: rounded corners for better appearance
            width: '1065px',        // Set the width to match the map and sidebar
            backgroundColor: 'white',  // Give it a white background
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Optional: Add a subtle shadow
          }}
        >
          {/* Display error message if data fetching fails */}
          {error ? (
            <p className="text-red-600">{error}</p> // Render the error message in red if there's an error
          ) : (
            userProperties.map((property) => (
              <ListingCard
                key={property.id} // Use the property ID as a key for better performance
                address={property.address || 'Address not available'} // Provide a fallback for missing address
                neighborhood={property.neighborhood || 'Neighborhood not available'} // Provide a fallback for missing neighborhood
                propertyType={property.property_type || 'Type not available'} // Provide a fallback for missing property type
                prices={property.prices?.map((priceObj) => priceObj.price) || []} // Extract prices or default to an empty array
                currentPrice={property.current_price || 'Price not available'} // Provide a fallback for missing current price
              />
            ))
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Analysis;
