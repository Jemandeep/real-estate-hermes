"use client";
import React, { useState, useEffect } from "react";
import NavBar from "./components/NavBar";
import Header from "./components/Header";
import Layout from "./components/Layout";
import Footer from "./components/Footer";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import Link from "next/link";
import { FaBed, FaBath, FaMapMarkerAlt, FaHome, FaStar } from "react-icons/fa";

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
        console.error("Error fetching data:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Hardcoded reviews
  const reviews = [
    {
      name: "John Doe",
      rating: 5,
      review: "Excellent service! Found the perfect home within my budget. Highly recommended!",
    },
    {
      name: "Jane Smith",
      rating: 4,
      review: "Great experience, very professional team. Would definitely use their service again.",
    },
    {
      name: "Michael Johnson",
      rating: 5,
      review: "The best real estate service in town! I found my dream home with their help.",
    },
    {
      name: "Sarah Lee",
      rating: 4,
      review: "Great selection of properties and very helpful staff. Found a home in no time.",
    },
  ];

  return (
      <div className="bg-stone-100">
        <NavBar />
        <Header />

        <div className="container mx-auto py-10 px-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Featured Listings</h1>

          {loading ? (
              <p className="text-gray-600 text-center mt-8">Loading listings, please wait...</p>
          ) : error ? (
              <p className="text-red-500 text-center mt-8">{error}</p>
          ) : listings.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {listings.map((listing) => (
                    <Link key={listing.id} href={`/viewListings/detailedListing?id=${listing.id}`}>
                      <div className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transform hover:scale-105 transition duration-200 cursor-pointer">
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
                            ${listing.current_price ? listing.current_price.toLocaleString() : 'No price available'}
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

        {/* Reviews Section */}
        <div className="bg-gray-100 py-10 px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">What Our Clients Say</h2>
          <div className="space-y-6">
            {reviews.map((review, index) => (
                <div key={index} className="bg-white p-6 shadow-lg rounded-lg">
                  <div className="flex items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">{review.name}</h3>
                    <div className="flex ml-2">
                      {[...Array(5)].map((_, i) => (
                          <FaStar
                              key={i}
                              className={`text-yellow-500 ${i < review.rating ? "fill-current" : ""}`}
                          />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700">{review.review}</p>
                </div>
            ))}
          </div>
        </div>

        <div className="bg-stone-500 text-white px-40 py-40 text-center">
          <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
          <p className="text-lg max-w-3xl mx-auto">
            At Calgary Real Estate, our vision is to help you discover your dream home with ease and confidence. We aim to provide you with the most accurate and up-to-date property listings, ensuring that you have all the tools you need to make informed decisions about your future home. With a wide range of properties in various locations, we are dedicated to offering you the best real estate experience.
          </p>
        </div>
      </div>
  );
};

export default HomePage;
