"use client";
import React, { useState, useEffect } from "react";
import NavBar from "./components/NavBar";
import Header from "./components/Header";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import Link from "next/link";
import { FaBed, FaBath, FaMapMarkerAlt, FaHome } from "react-icons/fa";

const HomePage = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const pickRandomListings = (listingsArray) => {
    for (let i = listingsArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [listingsArray[i], listingsArray[j]] = [listingsArray[j], listingsArray[i]];
    }
    return listingsArray.slice(0, 3);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const listingsCollection = collection(db, "listings");
        const snapshot = await getDocs(listingsCollection);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        const randomListings = pickRandomListings(data);
        setListings(randomListings);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-stone-100">
      <NavBar />
      <Header />

      <div className="container mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 fade-in">Featured Listings</h1>

        {loading ? (
          <p className="text-gray-600 text-center mt-8">Loading listings, please wait...</p>
        ) : error ? (
          <p className="text-red-500 text-center mt-8">{error}</p>
        ) : listings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <Link key={listing.id} href={`/viewListings/detailedListing?id=${listing.id}`}>
                <div className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transform hover:scale-105 transition duration-300 ease-in-out cursor-pointer hover:bg-gray-100">
                  <div className="mb-4">
                    <p className="text-lg font-bold text-gray-800 mb-2 flex items-center">
                      <FaMapMarkerAlt className="mr-2 text-gray-700" />
                      {listing.address}
                    </p>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm text-gray-700 mb-2 flex items-center">
                      <FaBed className="mr-2 text-gray-600" />
                      {listing.bed_count} Bedrooms
                    </p>
                    <p className="text-sm text-gray-700 mb-2 flex items-center">
                      <FaBath className="mr-2 text-gray-600" />
                      {listing.bathroom_count} Bathrooms
                    </p>
                    <p className="text-sm text-gray-700 mb-2 flex items-center">
                      <FaHome className="mr-2 text-gray-600" />
                      {listing.property_type}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">Current Price:</p>
                    <p className="text-lg font-semibold text-gray-800">
                      ${listing.current_price ? listing.current_price.toLocaleString() : "No price available"}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No listings to display.</p>
        )}
      </div>

      <div className="bg-[#144272] text-white px-40 py-40 text-center fade-in">
        <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
        <p className="text-lg max-w-3xl mx-auto">
          At Calgary Real Estate, our vision is to help you discover your dream home with ease and confidence. We aim to provide you with the most accurate and up-to-date property listings, ensuring that you have all the tools you need to make informed decisions about your future home. With a wide range of properties in various locations, we are dedicated to offering you the best real estate experience.
        </p>
      </div>
    </div>
  );
};

export default HomePage;
