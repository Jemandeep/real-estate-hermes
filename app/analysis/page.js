"use client"; // Next.js directive to specify that this component runs on the client-side

import React, { useState, useEffect } from 'react';
import { getDocs, collection } from 'firebase/firestore'; // Firestore imports
import { db } from '../../firebase'; // Import Firestore instance
import Layout from '../components/Layout';
import ListingCard from '../components/ListingCard';
import MapComponent from '../components/MapComponent';
import PredictionSidebar from '../components/PredictionsSidebar';
import Filters from '../components/Filters';

const Analysis = () => {
  const [listings, setListings] = useState([]);
  const [filteredNeighborhood, setFilteredNeighborhood] = useState('All');
  const [filteredPropertyType, setFilteredPropertyType] = useState('All');
  const [maxMonth, setMaxMonth] = useState(12);
  const [selectedProperties, setSelectedProperties] = useState([]);
  const [neighborhoods, setNeighborhoods] = useState([]);
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [error, setError] = useState(null);
  const [selectedFavorites, setSelectedFavorites] = useState([]);
  const [selectedCommunity, setSelectedCommunity] = useState('All');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'listings')); // Firestore collection 'listings'
        const data = querySnapshot.docs.map((doc) => doc.data()); // Map through documents and extract data

        setListings(data.slice(0, 250)); // Limit the number of listings

        // Extract unique neighborhoods and property types for filtering
        const uniqueNeighborhoods = ['All', ...new Set(data.map((item) => item.neighborhood))];
        const uniquePropertyTypes = ['All', ...new Set(data.map((item) => item.property_type))];

        setNeighborhoods(uniqueNeighborhoods);
        setPropertyTypes(uniquePropertyTypes);
      } catch (error) {
        setError(error.message);
        console.error('Error fetching data:', error);
      }
    };

    fetchData(); // Fetch data when the component mounts
  }, []);

  const onSelectCommunity = (communityName) => {
    setSelectedCommunity(communityName);
    setFilteredNeighborhood(communityName);
  };

  const onSelect = (listing) => {
    setSelectedProperties((prevSelected) => [
      ...prevSelected,
      {
        address: listing.address,
        neighborhood: listing.neighborhood,
        propertyType: listing.property_type,
        prices: [
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
        ],
        currentPrice: listing.price_1_month,
      },
    ]);
  };

  const handleFavoriteSelection = (property) => {
    setSelectedFavorites((prevSelectedFavorites) => {
      if (prevSelectedFavorites.includes(property)) {
        return prevSelectedFavorites.filter((fav) => fav !== property);
      } else {
        return [...prevSelectedFavorites, property];
      }
    });
  };

  const filteredListings = listings.filter((listing) => {
    const matchesNeighborhood =
      filteredNeighborhood === 'All' || listing.neighborhood === filteredNeighborhood;
    const matchesPropertyType =
      filteredPropertyType === 'All' || listing.property_type === filteredPropertyType;
    return matchesNeighborhood && matchesPropertyType;
  });

  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-4 bg-white rounded shadow mt-10 flex">
        {/* Prediction Sidebar */}
        <PredictionSidebar selectedFavorites={selectedFavorites} />

        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-4">Property Listings</h1>

          <div className="mb-4">
            <h2 className="text-xl font-bold mb-2">Calgary Communities Map</h2>
            <MapComponent onSelectCommunity={onSelectCommunity} />
          </div>

          <h2 className="text-lg font-bold mb-2">Favorites</h2>
          {selectedProperties.length > 0 ? (
            selectedProperties.map((property, index) => (
              <div key={index} className="favorite-property mb-2 border rounded p-2 bg-white">
                <h3>{property.address || 'Address not available'}</h3>
                <p>{property.neighborhood || 'Neighborhood not available'}</p>
                <p>{property.propertyType || 'Property Type not available'}</p>
                <input
                  type="checkbox"
                  checked={selectedFavorites.includes(property)}
                  onChange={() => handleFavoriteSelection(property)}
                />{' '}
                Select for Price Prediction
              </div>
            ))
          ) : (
            <p>No favorites selected.</p>
          )}

          <Filters
            neighborhoods={neighborhoods}
            propertyTypes={propertyTypes}
            filteredNeighborhood={filteredNeighborhood}
            setFilteredNeighborhood={setFilteredNeighborhood}
            filteredPropertyType={filteredPropertyType}
            setFilteredPropertyType={setFilteredPropertyType}
          />

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
              {Array.from({ length: 12 }, (_, index) => {
                const month = index + 1;
                return (
                  <option key={month} value={month}>
                    {month} Month{month > 1 ? 's' : ''}
                  </option>
                );
              })}
            </select>
          </div>

          {error ? (
            <p className="text-red-600">{error}</p>
          ) : (
            filteredListings.map((listing, index) => {
              const prices = [
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
              ];

              return (
                <ListingCard
                  key={index}
                  address={listing.address}
                  neighborhood={listing.neighborhood}
                  propertyType={listing.property_type}
                  prices={prices}
                  maxMonth={maxMonth}
                  currentPrice={listing.price_1_month}
                  onSelect={() => onSelect(listing)}
                />
              );
            })
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Analysis;
