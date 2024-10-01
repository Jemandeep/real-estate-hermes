"use client";

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Layout from '../components/Layout';

//Mockaroo API
const MOCKAROO_URL = 'https://api.mockaroo.com/api/3b6f9270?count=1000&key=9e007e70';

/* chatgpt prompt: I need help building a ListingCard component for a React app. The component should display individual property
listings with the following details: address, neighborhood, property type, and current price.
Additionally, I need it to include a price trend chart that shows the price over several months
(up to 12 months). If the price trend is increasing, the chart should show in green, and if it's
decreasing, the chart should be red. The price trend direction should also be indicated with an up
 or down arrow. Please use the recharts library for the chart. Also, make sure to filter out any
undefined or null prices from the data." I provided the code  I wrote as well */

const ListingCard = ({ address, neighborhood, propertyType, prices, maxMonth, currentPrice, onSelect  }) => {
  const validPrices = prices.slice(0, maxMonth).filter((price) => price !== undefined && price !== null);
  const trendDirection = validPrices[validPrices.length - 1] - validPrices[0] > 0 ? 'up' : 'down';
//Filters the price data based on selected months
// Explain the $ sign and =>
const priceData = validPrices.map((price, index) => ({
  name: `Month ${index + 1}`,
  price,

}));

  return (
    <div className="bg-white shadow rounded p-4 mb-4 flex justify-between items-center">
      <div>
        <h2 className="text-lg font-bold">{propertyType}</h2>
        <p className="text-sm text-gray-600">{address}, {neighborhood}</p>
        <div className="flex items-center mt-2">
        <button onClick={onSelect} className="select-button"> Select Property </button>
          <ResponsiveContainer width={250} height={70}>
            <LineChart data={priceData}>
              <XAxis dataKey="name" hide />
              <YAxis hide />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="price"
                stroke={trendDirection === 'up' ? '#4CAF50' : '#FF0000'}
                strokeWidth={2}
                dot={{ r: 1.5, fill: trendDirection === 'up' ? '#4CAF50' : '#FF0000' }}
                activeDot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
          <span className={`ml-2 ${trendDirection === 'up' ? 'text-green-500' : 'text-red-500'}`}>
            {trendDirection === 'up' ? '▲' : '▼'}
          </span>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm text-gray-500">Current Price:</p>
        <p className="text-lg font-semibold">${currentPrice.toLocaleString()}</p>
      </div>
    </div>
  );
};



//variables hold the fetched API data, filters, and error tracking
const Analysis = () => {
  const [listings, setListings] = useState([]);
  const [filteredNeighborhood, setFilteredNeighborhood] = useState('All');
  const [filteredPropertyType, setFilteredPropertyType] = useState('All');
  const [neighborhoods, setNeighborhoods] = useState([]);
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [error, setError] = useState(null);
  const [maxMonth, setMaxMonth] = useState(1);
  const [selectedPrices, setSelectedPrices] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(MOCKAROO_URL, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.statusText}`);
        }
        const text = await response.text();
        const data = JSON.parse(text);
        setListings(data.slice(0, 250));

        // Extract unique neighborhoods and property types for filtering from Mockaroo
        const uniqueNeighborhoods = ['All', ...new Set(data.map((item) => item.neighboorhood))];
        const uniquePropertyTypes = ['All', ...new Set(data.map((item) => item.property_type))];

        setNeighborhoods(uniqueNeighborhoods);
        setPropertyTypes(uniquePropertyTypes);
      } catch (error) {
        setError(error.message);
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Filters
  const filteredListings = listings.filter((listing) => {
    const matchesNeighborhood =
      filteredNeighborhood === 'All' || listing.neighboorhood === filteredNeighborhood;
    const matchesPropertyType =
      filteredPropertyType === 'All' || listing.property_type === filteredPropertyType;
    return matchesNeighborhood && matchesPropertyType;
  });

  //function to handle property selection
  //handleSelectProperty will update selectedPrices state when a property is selected
  //handleSelectProperty takes 'prices' as a parameter, setSelectedPrices is used to update the state.
  const handleSelectProperty = (prices) => {
    setSelectedPrices((prevPrices) => [...prevPrices, prices]);
  };
  
  return (
    <Layout>
      <div className="max-w-lg mx-auto p-4 bg-white rounded shadow mt-10">
        <h1 className="text-2xl font-bold mb-4">Property Listings</h1>
        {}
        <div className="mb-4 grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2" htmlFor="neighborhood-filter">
              Filter by Neighborhood:
            </label>
            <select
              id="neighborhood-filter"
              className="p-2 border rounded w-full"
              value={filteredNeighborhood}
              onChange={(e) => setFilteredNeighborhood(e.target.value)}
            >
              {neighborhoods.map((neighborhood) => (
                <option key={neighborhood} value={neighborhood}>
                  {neighborhood}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2" htmlFor="property-type-filter">
              Filter by Property Type:
            </label>
            <select
              id="property-type-filter"
              className="p-2 border rounded w-full"
              value={filteredPropertyType}
              onChange={(e) => setFilteredPropertyType(e.target.value)}
            >
              {propertyTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        {}
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2" htmlFor="month-selector">
            Select Number of Months:
          </label>
          <select
            id="month-selector"
            className="p-2 border rounded"
            value={maxMonth}
            onChange={(e) => setMaxMonth(parseInt(e.target.value, 10))}
          >
            {[...Array(12).keys()].map((month) => (
              <option key={month} value={month + 1}>
                {month + 1} Month{month > 0 ? 's' : ''}
              </option>
            ))}
          </select>
        </div>
        {/* Render listing*/}
        {error ? (
          <p className="text-red-600">{error}</p>
        ) : filteredListings.length > 0 ? (
          filteredListings.map((listing, index) => (
            <ListingCard
              key={index}
              address={listing.adress}
              neighborhood={listing.neighboorhood}
              propertyType={listing.property_type}
              //passing the handleSelectPropert function as a prop to the component, so that it can be used when the button is clicked
              onSelect={() => handleSelectProperty(listing.prices)}
              prices={[
                listing.price_1_month,
                listing.price_2_months,
                listing.price_3_months,
                listing.price_4_months,
                listing.price_5_months,
                listing.price_6_months,
                listing.price_7_months,
                listing.price_8_months,
                listing.price_9_months,
                listing.price_10_months,
                listing.price_11_months,
                listing.price_12_months,
              ]}
              maxMonth={maxMonth}
              currentPrice={listing.current_price}
              //select button
            />
          ))
        ) : (
          <p className="text-gray-600">No listings to display.</p>
        )}
      </div>
    </Layout>
  );
};

export default Analysis;