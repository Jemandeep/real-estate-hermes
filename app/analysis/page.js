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
  const [listings, setListings] = useState([]); // Store public property listings (those for sale)
  const [error, setError] = useState(null); // Store any potential errors
  const [metrics, setMetrics] = useState({
    totalInvestment: 0,
    currentPortfolioValue: 0,
    roi: 0,
    cashFlow: 0,
  }); // Store calculated metrics
  const [user, setUser] = useState(null); // Store authenticated user

  const auth = getAuth(); // Get Firebase auth instance

  // Fetch personal properties and public listings from Firestore
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

    const fetchListings = async () => {
      try {
        // Fetch public listings from Firestore (those that are for sale)
        const querySnapshot = await getDocs(collection(db, 'listings')); // Adjust the collection name if needed
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setListings(data); // Set public property listings
      } catch (error) {
        setError(error.message); // Set any errors
        console.error('Error fetching listings:', error); // Log the error
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

    fetchListings(); // Fetch public property listings
    return () => unsubscribe(); // Cleanup listener on unmount
  }, [auth]);

  return (
    <Layout>
      <div className="flex-1">
        <h1 className="text-3xl font-semibold mb-6 text-gray-800">Your Property Portfolio</h1>

        {/* Metrics Overview Boxes */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
            <h3 className="font-semibold text-lg text-gray-600">Total Investment</h3>
            <p className="text-2xl font-bold text-gray-800 mt-2">${metrics.totalInvestment.toLocaleString()}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
            <h3 className="font-semibold text-lg text-gray-600">Current Portfolio Value</h3>
            <p className="text-2xl font-bold text-gray-800 mt-2">${metrics.currentPortfolioValue.toLocaleString()}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
            <h3 className="font-semibold text-lg text-gray-600">ROI</h3>
            <p className="text-2xl font-bold text-gray-800 mt-2">{metrics.roi.toFixed(2)}%</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
            <h3 className="font-semibold text-lg text-gray-600">Cash Flow</h3>
            <p className="text-2xl font-bold text-gray-800 mt-2">${metrics.cashFlow.toLocaleString()}</p>
          </div>
        </div>

        {/* Map Component */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Your Properties Map</h2>
          <MapComponent listings={userProperties} /> {/* Pass user properties to the MapComponent */}
        </div>

        {/* Public Listings - Align below the map */}
        <div 
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mt-6" 
          style={{ maxWidth: '80%', marginLeft: 'auto', marginRight: '0' }}
        >
          <h3 className="text-xl font-semibold mb-4 text-gray-700">Public Listings</h3>
          <div className="max-h-96 overflow-y-auto space-y-4">
            {error ? (
              <p className="text-red-600">{error}</p> // Render the error message in red if there's an error
            ) : (
              listings.map((listing) => (
                <ListingCard
                  key={listing.id} // Use the listing ID as a key for better performance
                  address={listing.address || 'Address not available'} // Provide a fallback for missing address
                  neighborhood={listing.neighborhood || 'Neighborhood not available'} // Provide a fallback for missing neighborhood
                  propertyType={listing.property_type || 'Type not available'} // Provide a fallback for missing property type
                  prices={listing.prices?.map((priceObj) => priceObj.price) || []} // Extract prices or default to an empty array
                  currentPrice={listing.current_price || 'Price not available'} // Provide a fallback for missing current price
                />
              ))
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Analysis;
