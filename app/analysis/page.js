// analysis/page.js
"use client";

import React, { useState, useEffect } from 'react';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../../firebase';
import Layout from '../components/Layout';
import ListingCard from '../components/ListingCard';
import MapComponent from '../components/MapComponent';
import PredictionSidebar from '../components/PredictionsSidebar';
import Filters from '../components/Filters';
import PropertyManager from '../components/PropertyManager'; // Import Property Manager

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

  const onSelectCommunity = (communityName) => {
    setSelectedCommunity(communityName);
    setFilteredNeighborhood(communityName);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'listings'));
        const data = querySnapshot.docs.map((doc) => doc.data());
        setListings(data.slice(0, 250));
        const uniqueNeighborhoods = ['All', ...new Set(data.map((item) => item.neighborhood))];
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

  const onSelect = (listing) => {
    setSelectedProperties((prevSelected) => [
      ...prevSelected,
      {
        address: listing.address,
        neighborhood: listing.neighborhood,
        propertyType: listing.property_type,
        prices: listing.prices || [],
        currentPrice: listing.current_price,
      },
    ]);
  };

  const handleFavoriteSelection = (property) => {
    if (!property.latitude || !property.longitude) {
      console.warn('Property is missing latitude or longitude:', property);
      return;
    }
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

        {/* Main Content */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-4">Property Listings</h1>

          <div className="mb-4">
            <h2 className="text-xl font-bold mb-2">Calgary Communities Map</h2>
            <MapComponent
              onSelectCommunity={onSelectCommunity}
              favoriteProperties={selectedFavorites}
            />
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
              const prices = listing.prices?.map((priceObj) => priceObj.price) || [];
              return (
                <ListingCard
                  key={index}
                  address={listing.address}
                  neighborhood={listing.neighborhood}
                  propertyType={listing.property_type}
                  prices={prices}
                  maxMonth={maxMonth}
                  currentPrice={listing.current_price}
                  onSelect={() => onSelect(listing)}
                />
              );
            })
          )}
        </div>

        {/* Add Property Manager on the side */}
        <div className="ml-4 w-1/4">
          <PropertyManager />
        </div>
      </div>
    </Layout>
  );
};

export default Analysis;
