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
  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    beds: "",
    baths: "",
  });
  const [showModal, setShowModal] = useState(false);

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
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
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

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  return (
    <div className="overflow-y-auto h-screen bg-stone-100">
      <NavBar />
      <Header />

      <div className="container mx-auto py-10 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Featured Listings</h1>
          {/* Filter Button */}
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Filter
          </button>
        </div>

        {loading ? (
          <p className="text-gray-600 text-center mt-8">
            Please wait, data is being fetched...
          </p>
        ) : error ? (
          <p className="text-red-500 text-center mt-8">{error}</p>
        ) : listings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {listings.map((listing, index) => (
              <ListingCard
                key={index}
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

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-8 rounded-lg max-w-2xl w-full relative">
              <button
                className="absolute top-3 right-3 text-gray-600 hover:text-gray-800"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
              <h2 className="text-2xl font-bold mb-4">Filter Listings</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="transactionType" className="block text-sm font-medium text-gray-700">Transaction Type</label>
                  <select id="transactionType" name="transactionType" className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm">
                    <option value="forSale">For Sale</option>
                    <option value="forRent">For Rent</option>
                    <option value="sold">Sold</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700">Property Type</label>
                  <select id="propertyType" name="propertyType" className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm">
                    <option value="residential">Residential</option>
                    <option value="commercial">Commercial</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700">Min Price</label>
                  <input
                    type="number"
                    id="minPrice"
                    name="minPrice"
                    value={filters.minPrice}
                    onChange={handleFilterChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm"
                  />
                </div>
                <div>
                  <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700">Max Price</label>
                  <input
                    type="number"
                    id="maxPrice"
                    name="maxPrice"
                    value={filters.maxPrice}
                    onChange={handleFilterChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm"
                  />
                </div>
                <div>
                  <label htmlFor="beds" className="block text-sm font-medium text-gray-700">Beds</label>
                  <input
                    type="number"
                    id="beds"
                    name="beds"
                    value={filters.beds}
                    onChange={handleFilterChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm"
                  />
                </div>
                <div>
                  <label htmlFor="baths" className="block text-sm font-medium text-gray-700">Baths</label>
                  <input
                    type="number"
                    id="baths"
                    name="baths"
                    value={filters.baths}
                    onChange={handleFilterChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm"
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-between">
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-red-500 text-white py-2 px-4 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-green-500 text-white py-2 px-4 rounded"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
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
