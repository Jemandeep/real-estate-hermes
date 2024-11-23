"use client"; // Ensure client-side rendering

import { Group, Paper, SimpleGrid, Text } from '@mantine/core';
import {
  IconUserPlus,
  IconDiscount2,
  IconReceipt2,
  IconCoin,
} from '@tabler/icons-react';

const icons = {
  user: IconUserPlus,
  discount: IconDiscount2,
  receipt: IconReceipt2,
  coin: IconCoin,
};

export function StatsGrid({ metrics }) {
  const stats = [
    { title: 'Total Investment', icon: 'receipt', value: metrics.totalInvestment, diff: 0 },
    { title: 'Current Portfolio Value', icon: 'coin', value: metrics.currentPortfolioValue, diff: 0 },
    { title: 'ROI', icon: 'discount', value: metrics.roi.toFixed(2), diff: 0 },
    { title: 'Cash Flow', icon: 'user', value: metrics.cashFlow, diff: 0 },
  ];

  const statsComponents = stats.map((stat) => {
    const Icon = icons[stat.icon];

    return (
      <Paper withBorder p="md" radius="md" key={stat.title} style={{ backgroundColor: '#f8f9fa', flex: 1, textAlign: 'center' }}>
        <Group position="apart" style={{ marginBottom: 10 }}>
          <Text size="sm" color="dimmed" weight={700}>
            {stat.title}
          </Text>
          <Icon size="1.8rem" stroke={1.5} style={{ position: 'absolute', top: 10, right: 10 }} />
        </Group>

        <Group align="center" spacing="xs" mt={10} style={{ justifyContent: 'center' }}>
          <Text size="xl" weight={700}>
            ${stat.value.toLocaleString()}
          </Text>
        </Group>
      </Paper>
    );
  });

  return (
    <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', padding: '20px' }}>
      {statsComponents}
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { getDoc, getDocs, collection, query, where, updateDoc, doc, arrayUnion } from 'firebase/firestore'; // Firestore functions
import { db } from '../../firebase'; // Firebase configuration
import { getAuth, onAuthStateChanged } from 'firebase/auth'; // Firebase Auth to get the current user
import Layout from '../components/Layout'; // Layout component for consistent structure
import ListingCard from '../components/ListingCard'; // Component to display each listing
import MapComponent from '../components/MapComponent'; // Component to display a map with listings

const Analysis = () => {
  const [userProperties, setUserProperties] = useState([]); // Store fetched properties belonging to the user
  const [listings, setListings] = useState([]); // Store public property listings (those for sale)
  const [watchlist, setWatchlist] = useState([]); // Store watchlist for the logged-in user
  const [error, setError] = useState(null); // Store any potential errors
  const [metrics, setMetrics] = useState({
    totalInvestment: 0,
    currentPortfolioValue: 0,
    roi: 0,
    cashFlow: 0,
  }); // Store calculated metrics
  const [user, setUser] = useState(null); // Store authenticated user

  const auth = getAuth(); // Get Firebase auth instance
  async function handleEstimation(details) {
    console.log("Sending payload:", details); // Log the payload being sent
    try {
      const response = await fetch("http://localhost:5000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(details), // Ensure JSON stringification
      });
  
      const data = await response.json();
      console.log("Response received:", data); // Log the response
      if (response.ok) {
        alert(`Estimated Property Value: $${data.estimatedValue.toFixed(2)}`);
      } else {
        console.error("Server error:", data);
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Network or parsing error:", error);
      alert("Error during estimation.");
    }
  }  
  
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
          const maintenance = parseFloat(property.maintenance || 0) / 12;  // Monthly maintenance
          const insurance = parseFloat(property.insurance || 0) / 12;  // Monthly insurance
          const taxes = parseFloat(property.taxes || 0) / 12;  // Monthly taxes

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

    const fetchWatchlist = async (userEmail) => {
      try {
        const userDocRef = doc(db, 'users', userEmail); // Reference to the user's document
        const userDocSnapshot = await getDoc(userDocRef); // Fetch the single user document
    
        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          setWatchlist(userData.watchlist || []); // Set watchlist from Firestore
        } else {
          console.error('User document not found.');
        }
      } catch (error) {
        setError(error.message);
        console.error('Error fetching watchlist:', error);
      }
    };
    

    // Check for the authenticated user and fetch their properties and watchlist
    const unsubscribe = onAuthStateChanged(auth, (loggedUser) => {
      if (loggedUser) {
        setUser(loggedUser); // Set logged-in user
        fetchUserProperties(loggedUser.email); // Fetch properties for this user
        fetchWatchlist(loggedUser.email); // Fetch the watchlist for this user
      } else {
        setUser(null); // User is not logged in
      }
    });

    fetchListings(); // Fetch public property listings
    return () => unsubscribe(); // Cleanup listener on unmount
  }, [auth]);

  // Function to add a listing to the user's watchlist in Firestore
  const addToWatchlist = async (listing) => {
    if (!user) {
      alert('You need to be logged in to add properties to your watchlist.');
      return;
    }

    try {
      const userDocRef = doc(db, 'users', user.email); // Reference to the user's document in Firestore
      await updateDoc(userDocRef, {
        watchlist: arrayUnion(listing.id), // Add the listing ID to the user's watchlist
      });
      setWatchlist([...watchlist, listing.id]); // Update local state
      alert(`Added ${listing.address} to your watchlist.`);
    } catch (error) {
      console.error('Error adding to watchlist:', error);
      alert('Error adding to watchlist.');
    }
  };

  return (
    <Layout>
  <div className="flex-1 flex justify-between">
    <div className="flex-1">
      <h1 className="text-3xl font-semibold mb-6 text-gray-800">Your Property Portfolio</h1>

      {/* Metrics Overview */}
      <StatsGrid metrics={metrics} />

      {/* LTV Ratio and Map Section */}
      <div className="flex">
        {/* LTV Ratio Section */}
        <div
          className="w-2/3 bg-white p-6 rounded-lg shadow-sm border border-gray-200"
          style={{ maxHeight: '500px', overflowY: 'auto' }}
        >
          <h3 className="text-lg font-semibold mb-2">LTV Ratio</h3>
          {userProperties.map((property) => {
            const ltvRatio = (parseFloat(property.mortgage_amount) / parseFloat(property.current_price)) * 100;
            const getColor = (ratio) => {
              if (ratio < 60) return 'bg-green-500';
              if (ratio >= 60 && ratio <= 80) return 'bg-yellow-500';
              return 'bg-red-500';
            };

            return (
              <div key={property.id} className="mb-6">
                <p className="text-sm font-medium text-gray-700">{property.address}</p>
                <div className="w-full h-6 bg-gray-200 rounded-full mt-2">
                  <div
                    className={`h-6 rounded-full ${getColor(ltvRatio)}`}
                    style={{ width: `${ltvRatio}%` }}
                  />
                </div>
                <p className="text-xs mt-1 text-gray-500">{ltvRatio.toFixed(2)}% LTV Ratio</p>
              </div>
            );
          })}
        </div>

        {/* Map Component */}
        <div className="flex-1 mx-4 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Your Properties Map</h2>
          <MapComponent listings={userProperties} />
        </div>
      </div>

      {/* Rental Income and Public Listings Section */}
      <div className="flex mt-6 space-x-6">
        {/* Rental Income Section */}
        <div
          className="w-1/3 bg-white p-6 rounded-lg shadow-sm border border-gray-200"
          style={{ maxHeight: '500px', overflowY: 'auto' }}
        >
          <h3 className="text-lg font-semibold mb-2">Rental Income vs. Expenses</h3>
          {userProperties
            .filter((property) => property.is_for_rent)
            .map((property) => {
              const rent = parseFloat(property.rent_price || 0);
              const mortgage = parseFloat(property.mortgage_monthly_payment || 0);
              const maintenance = parseFloat(property.maintenance || 0) / 12;
              const insurance = parseFloat(property.insurance || 0) / 12;
              const taxes = parseFloat(property.taxes || 0) / 12;
              const totalExpenses = mortgage + maintenance + insurance + taxes;
              const cashFlowWidth = ((rent - totalExpenses) / rent) * 100;

              return (
                <div key={property.id} className="mb-6">
                  <p className="text-sm font-medium text-gray-700">{property.address}</p>
                  <p className="text-xs font-semibold mt-2">Rental Income: ${rent.toFixed(2)}</p>
                  <div className="w-full h-6 bg-gray-200 rounded-full mt-1">
                    <div className="h-6 rounded-full bg-green-500" style={{ width: '100%' }} />
                  </div>
                  <p className="text-xs font-semibold mt-2">Expenses: ${totalExpenses.toFixed(2)}</p>
                  <div className="w-full h-6 bg-gray-200 rounded-full mt-1">
                    <div
                      className={`h-6 rounded-full ${cashFlowWidth > 0 ? 'bg-green-500' : 'bg-red-500'}`}
                      style={{ width: `${Math.abs(cashFlowWidth)}%` }}
                    />
                  </div>
                </div>
              );
            })}
        </div>

        {/* Public Listings Section */}
        <div className="flex-1 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">Public Listings</h3>
          <div className="max-h-96 overflow-y-auto space-y-4">
            {error ? (
              <p className="text-red-600">{error}</p>
            ) : (
              listings.map((listing) => (
                <div key={listing.id} className="bg-gray-100 p-4 rounded-lg shadow-sm">
                  <ListingCard
                    address={listing.address || 'Address not available'}
                    neighborhood={listing.neighborhood || 'Neighborhood not available'}
                    propertyType={listing.property_type || 'Type not available'}
                    prices={listing.prices?.map((priceObj) => priceObj.price) || []}
                    currentPrice={listing.current_price || 'Price not available'}
                  />
                  
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Property Estimation Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mt-6">
        <h3 className="text-lg font-semibold mb-4">Property Estimation (Machine Learning)</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.target;
            const details = {
              squareFootage: form.squareFootage.value,
              bedrooms: form.bedrooms.value,
              bathrooms: form.bathrooms.value,
              propertyType: form.propertyType.value,
              postalCode: form.postalCode.value.toUpperCase(),
            };
            handleEstimation(details);
            form.reset();
          }}
          className="space-y-4"
        >
          <div>
            <label htmlFor="squareFootage" className="block text-sm font-medium text-gray-700">
              Floor Size (sq ft)
            </label>
            <input
              type="number"
              id="squareFootage"
              name="squareFootage"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>
          <div>
            <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700">
              Number of Bedrooms
            </label>
            <input
              type="number"
              id="bedrooms"
              name="bedrooms"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>
          <div>
            <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700">
              Number of Bathrooms
            </label>
            <input
              type="number"
              id="bathrooms"
              name="bathrooms"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>
          <div>
            <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700">
              Property Type
            </label>
            <input
              type="text"
              id="propertyType"
              name="propertyType"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>
          <div>
            <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
              Postal Code
            </label>
            <input
              type="text"
              id="postalCode"
              name="postalCode"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-md shadow-sm hover:bg-blue-600"
          >
            Estimate Property Value
          </button>
        </form>
      </div>
    </div>
  </div>
</Layout>

);
};

export default Analysis;
