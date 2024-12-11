"use client";

import React, { useState, useEffect } from "react";
import { db } from "../../../firebase";
import { collection, getDocs } from "firebase/firestore";
import Layout from "../../components/Layout";
import Link from "next/link";

const PropertiesPage = () => {
  const [listings, setListings] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch all listings from Firebase
  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "listings"));
        const fetchedListings = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setListings(fetchedListings);
      } catch (err) {
        setError("Failed to fetch listings. Please try again.");
        console.error("Error fetching listings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12">
        <div className="max-w-6xl mx-auto px-6">
          {/* Heading Section */}
          <div className="mb-10 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-blue-900 mb-4">
              Explore a variety of properties and join the conversation.
            </h1>
            <p className="text-lg text-gray-700">
              Browse through the listings below and find a property to discuss.
            </p>
          </div>

          {/* Loading and Error States */}
          {loading && (
            <p className="text-gray-600 text-center mt-8">
              Loading listings, please wait...
            </p>
          )}
          {error && (
            <p className="text-red-500 text-center mt-8">{error}</p>
          )}

          {/* Listings Grid */}
          {!loading && !error && listings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {listings.map((listing) => (
                <Link
                  key={listing.id}
                  href={`/community/property/detailed?id=${listing.id}`}
                  passHref
                >
                  <div className="cursor-pointer bg-white rounded-xl border border-gray-200 p-6 flex flex-col justify-between min-h-[240px] transition-transform transform hover:-translate-y-1 hover:shadow-xl">
                    <div>
                      <h3 className="font-bold text-lg text-gray-800 mb-3 line-clamp-2 break-words border-b pb-2">
                        {listing.address || "No Address Available"}
                      </h3>
                      <p className="text-gray-700 mb-1">
                        <span className="font-semibold">Neighborhood:</span>{" "}
                        {listing.neighborhood || "Unknown"}
                      </p>
                      <p className="text-gray-700 mb-1">
                        <span className="font-semibold">Type:</span>{" "}
                        {listing.property_type || "N/A"}
                      </p>
                      <p className="text-gray-700 mb-1">
                        <span className="font-semibold">Price:</span>{" "}
                        {listing.current_price
                          ? `$${listing.current_price.toLocaleString()}`
                          : "N/A"}
                      </p>
                      <p className="text-gray-700 mb-1">
                        <span className="font-semibold">Beds:</span>{" "}
                        {listing.bed_count || "N/A"}
                      </p>
                      <p className="text-gray-700 mb-1">
                        <span className="font-semibold">Baths:</span>{" "}
                        {listing.bathroom_count || "N/A"}
                      </p>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <span className="inline-block text-sm text-blue-600 font-semibold hover:underline">
                        View Details →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            !loading &&
            !error && (
              <p className="text-gray-600 text-center mt-8">
                No listings available.
              </p>
            )
          )}
        </div>
      </div>
    </Layout>
  );
};

export default PropertiesPage;
