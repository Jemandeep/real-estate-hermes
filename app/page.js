"use client";
import React, { useState, useEffect } from 'react';
import NavBar from './components/NavBar';
import Header from './components/Header';
import ListingCard from './listings/ListingCard'; 

// URL for fetching mock data
const MOCKAROO_URL = 'https://api.mockaroo.com/api/3b6f9270?count=1000&key=9e007e70';

const HomePage = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
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
        setListings(data.slice(0, 6)); // Show only the first 6 listings on the home page
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="overflow-y-auto h-screen bg-stone-100"> {/* Soft background color for the page */}
      <NavBar />
      <Header />

      <div className="container mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Featured Listings</h1>

        {/* Show loading message while data is being fetched */}
        {loading ? (
          <p className="text-gray-600 text-center mt-8">Please wait, data is being fetched...</p>
        ) : error ? (
          <p className="text-red-500 text-center mt-8">{error}</p>
        ) : listings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {listings.map((listing, index) => (
              <ListingCard
                key={index}
                address={listing.adress} // Ensure the field names are correct
                neighborhood={listing.neighboorhood} // Ensure this is correct in the API data
                propertyType={listing.property_type}
                currentPrice={listing.current_price}
                bedCount={listing.bed_count}
                bathroomCount={listing.bathroom_count}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No listings to display.</p>
        )}
      </div>

      {/* Vision Section */}
      <div className="bg-stone-500 text-white px-40 py-40 text-center">
        <h2 className="text-3xl font-bold mb-4 text-white-800">Our Vision</h2>
        <p className="text-lg text-white-600 max-w-3xl mx-auto">
          At Calgary Real Estate, our vision is to help you discover your dream home with ease and confidence. We aim to provide you with the most accurate and up-to-date property listings, ensuring that you have all the tools you need to make informed decisions about your future home. With a wide range of properties in various locations, we are dedicated to offering you the best real estate experience.
        </p>
      </div>
    </div>
  );
};

export default HomePage;
