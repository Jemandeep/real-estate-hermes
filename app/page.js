"use client";
import React, { useState, useEffect } from "react";
import NavBar from "./components/NavBar";
import Header from "./components/Header";
import ListingCard from "./listings/ListingCard";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const HomePage = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to shuffle array and pick the first three
  const pickRandomListings = (listingsArray) => {
    for (let i = listingsArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [listingsArray[i], listingsArray[j]] = [listingsArray[j], listingsArray[i]];
    }
    return listingsArray.slice(0, 3); // Return the first three elements
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const listingsCollection = collection(db, "listings");
        const snapshot = await getDocs(listingsCollection);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id, // Include the ID of the listing
          ...doc.data(),
        }));
        const randomListings = pickRandomListings(data); // Get three random listings
        setListings(randomListings);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="overflow-y-auto h-screen bg-stone-100">
      <NavBar />
      <Header />

      <div className="container mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Featured Listings</h1>

        {loading ? (
          <p className="text-gray-600 text-center mt-8">
            Please wait, data is being fetched...
          </p>
        ) : error ? (
          <p className="text-red-500 text-center mt-8">{error}</p>
        ) : listings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <ListingCard
                key={listing.id}
                id={listing.id} // Pass ID to the ListingCard
                address={listing.address}
                neighborhood={listing.neighborhood}
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

      <div className="bg-stone-500 text-white px-40 py-40 text-center">
        <h2 className="text-3xl font-bold mb-4 text-white-800">Our Vision</h2>
        <p className="text-lg text-white-600 max-w-3xl mx-auto">
          At Calgary Real Estate, our vision is to help you discover your dream home with ease
          and confidence. We aim to provide you with the most accurate and up-to-date property
          listings, ensuring that you have all the tools you need to make informed decisions
          about your future home. With a wide range of properties in various locations, we are
          dedicated to offering you the best real estate experience.
        </p>
      </div>
    </div>
  );
};

export default HomePage;