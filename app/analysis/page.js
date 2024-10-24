"use client"; // Ensure client-side rendering

import React, { useState, useEffect } from 'react';
import { getDocs, collection, query, where } from 'firebase/firestore'; // Firestore functions
import { db } from '../../firebase'; // Firebase configuration
import { getAuth, onAuthStateChanged } from 'firebase/auth'; // Firebase Auth to get the current user
import Layout from '../components/Layout'; // Layout component for consistent structure
import ListingCard from '../components/ListingCard'; // Component to display each listing
import MapComponent from '../components/MapComponent'; // Component to display a map with listings
import { Bar } from 'react-chartjs-2'; // Import Bar chart from react-chartjs-2

// Import and register necessary components for Chart.js
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register the components you are going to use
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

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

  // Function to generate Rental Income vs. Expenses bar chart data for user properties
  const rentalIncomeVsExpensesData = (property) => {
    const rent = parseFloat(property.rent_price || 0);
    const mortgage = parseFloat(property.mortgage_monthly_payment || 0);
    const maintenance = parseFloat(property.maintenance || 0) / 12;
    const insurance = parseFloat(property.insurance || 0) / 12;
    const taxes = parseFloat(property.taxes || 0) / 12;

    return {
      labels: ['Rent', 'Mortgage', 'Maintenance', 'Insurance', 'Taxes'],
      datasets: [
        {
          label: 'Rental Income vs. Expenses',
          data: [rent, mortgage, maintenance, insurance, taxes],
          backgroundColor: ['#4CAF50', '#F44336', '#FFC107', '#2196F3', '#9C27B0'],
          borderColor: ['#388E3C', '#D32F2F', '#FFA000', '#1976D2', '#7B1FA2'],
          borderWidth: 1,
        },
      ],
    };
  };

  // Function to generate LTV Ratio bar chart data for user properties
  const loanToValueData = (property) => {
    const mortgage = parseFloat(property.mortgage_amount || 0);
    const currentPrice = parseFloat(property.current_price || 0);
    const ltvRatio = currentPrice > 0 ? (mortgage / currentPrice) * 100 : 0;

    return {
      labels: ['LTV Ratio'],
      datasets: [
        {
          label: 'Loan-to-Value (LTV) Ratio',
          data: [ltvRatio],
          backgroundColor: ['#FF6384'],
          borderColor: ['#FF6384'],
          borderWidth: 1,
        },
      ],
    };
  };

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

        {/* Flex layout for the map and charts */}
        <div className="flex">
          {/* Left: LTV Ratio Horizontal Bar */}
          <div
            className="w-1/4 bg-white p-6 rounded-lg shadow-sm border border-gray-200"
            style={{ maxHeight: '500px', overflowY: 'auto' }} // Ensure scrolling for multiple properties
          >
            <h3 className="text-lg font-semibold mb-2">LTV Ratio</h3>
            {userProperties.map((property) => {
              const ltvRatio = (parseFloat(property.mortgage_amount) / parseFloat(property.current_price)) * 100;

              // Determine bar color based on LTV ratio
              const getColor = (ratio) => {
                if (ratio < 60) return 'bg-green-500'; // Good: Green
                if (ratio >= 60 && ratio <= 80) return 'bg-yellow-500'; // Okay: Yellow
                return 'bg-red-500'; // Bad: Red
              };

              return (
                <div key={property.id} className="mb-6">
                  {/* Property Address Label */}
                  <p className="text-sm font-medium text-gray-700">{property.address}</p>

                  {/* LTV Ratio Loading Bar */}
                  <div className="w-full h-6 bg-gray-200 rounded-full mt-2">
                    <div
                      className={`h-6 rounded-full ${getColor(ltvRatio)}`} // Dynamic bar color
                      style={{ width: `${ltvRatio}%` }} // Dynamic bar width based on LTV ratio
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
            <MapComponent listings={userProperties} /> {/* Pass user properties to the MapComponent */}
          </div>
        </div>

        {/* Public Listings */}
        <div className="flex mt-6">
          {/* Right: Rental Income vs Expenses Horizontal Bars */}
          <div
            className="w-1/4 bg-white p-6 rounded-lg shadow-sm border border-gray-200"
            style={{ maxHeight: '500px', overflowY: 'auto' }} // Ensure scrolling for multiple properties
          >
            <h3 className="text-lg font-semibold mb-2">Rental Income vs. Expenses</h3>
            {userProperties
              .filter((property) => property.is_for_rent) // Only show for rental properties
              .map((property) => {
                const rent = parseFloat(property.rent_price || 0);
                const mortgage = parseFloat(property.mortgage_monthly_payment || 0);
                const maintenance = parseFloat(property.maintenance || 0) / 12;
                const insurance = parseFloat(property.insurance || 0) / 12;
                const taxes = parseFloat(property.taxes || 0) / 12;

                const totalExpenses = mortgage + maintenance + insurance + taxes;

                // Calculate percentage width of each expense relative to the rent
                const mortgageWidth = (mortgage / rent) * 100;
                const maintenanceWidth = (maintenance / rent) * 100;
                const insuranceWidth = (insurance / rent) * 100;
                const taxesWidth = (taxes / rent) * 100;
                const cashFlowWidth = ((rent - totalExpenses) / rent) * 100; // Cash flow relative to rent

                return (
                  <div key={property.id} className="mb-6">
                    {/* Property Address Label */}
                    <p className="text-sm font-medium text-gray-700">{property.address}</p>

                    {/* Rental Income Bar with Amount */}
                    <p className="text-xs font-semibold mt-2">Rental Income: ${rent.toFixed(2)}</p>
                    <div className="w-full h-6 bg-gray-200 rounded-full mt-1">
                      <div
                        className="h-6 rounded-full bg-green-500" // Green for rental income
                        style={{ width: '100%' }} // Full width represents 100% of rental income
                      />
                    </div>

                    {/* Expenses Label */}
                    <p className="text-xs font-semibold mt-2">Expenses (Total: ${totalExpenses.toFixed(2)})</p>
                    <div className="w-full h-6 bg-gray-200 rounded-full mt-1 relative">
                      {/* Mortgage Expense */}
                      <div
                        className="h-6 rounded-l-full bg-red-500 absolute left-0"
                        style={{ width: `${Math.min(mortgageWidth, 100)}%` }} // Restrict width to fit container
                        title={`Mortgage: $${mortgage.toFixed(2)}`}
                      />
                      {/* Maintenance Expense */}
                      <div
                        className="h-6 bg-yellow-500 absolute left-[calc(${Math.min(mortgageWidth, 100)}%)]"
                        style={{ width: `${Math.min(maintenanceWidth, 100)}%` }} // Restrict width to fit container
                        title={`Maintenance: $${maintenance.toFixed(2)}`}
                      />
                      {/* Insurance Expense */}
                      <div
                        className="h-6 bg-blue-500 absolute left-[calc(${Math.min(mortgageWidth + maintenanceWidth, 100)}%)]"
                        style={{ width: `${Math.min(insuranceWidth, 100)}%` }} // Restrict width to fit container
                        title={`Insurance: $${insurance.toFixed(2)}`}
                      />
                      {/* Taxes Expense */}
                      <div
                        className="h-6 bg-purple-500 absolute left-[calc(${Math.min(mortgageWidth + maintenanceWidth + insuranceWidth, 100)}%)]"
                        style={{ width: `${Math.min(taxesWidth, 100)}%` }} // Restrict width to fit container
                        title={`Taxes: $${taxes.toFixed(2)}`}
                      />
                    </div>

                    {/* Cash Flow Bar */}
                    <p className="text-xs font-semibold mt-2">
                      Cash Flow: ${((rent - totalExpenses) > 0 ? rent - totalExpenses : 0).toFixed(2)} (Profit)
                    </p>
                    <div className="w-full h-6 bg-gray-200 rounded-full mt-1">
                      <div
                        className={`h-6 rounded-full ${cashFlowWidth > 0 ? 'bg-green-500' : 'bg-red-500'}`} // Green for positive, red for negative
                        style={{ width: `${Math.abs(cashFlowWidth)}%` }} // Cash flow bar
                      />
                    </div>
                  </div>
                );
              })}
          </div>




          {/* Public Listings Container */}
          <div className="flex-1 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">Public Listings</h3>
            <div className="max-h-96 overflow-y-auto space-y-4">
              {error ? (
                <p className="text-red-600">{error}</p>
              ) : (
                listings.map((listing) => (
                  <ListingCard
                    key={listing.id}
                    address={listing.address || 'Address not available'}
                    neighborhood={listing.neighborhood || 'Neighborhood not available'}
                    propertyType={listing.property_type || 'Type not available'}
                    prices={listing.prices?.map((priceObj) => priceObj.price) || []}
                    currentPrice={listing.current_price || 'Price not available'}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Analysis;
