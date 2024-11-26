"use client";
import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Layout from "../components/Layout";
import ListingCard from "../components/ListingCard";
import StatsGrid from "../components/Overview";
import LtvRatio from "../components/LtvRatio";
import AverageMortgage from "../components/AverageMortgage";
import {
  fetchUserProperties,
  fetchListings,
  fetchWatchlist,
  addToWatchlist,
} from "../components/firebaseUtils";
import { calculateMetrics } from "../components/calculateMetrics";
import RentalIncomeExpenses from "../components/RentalIncomeExpenses";

const Analysis = () => {
  const [userProperties, setUserProperties] = useState([]);
  const [listings, setListings] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [error, setError] = useState(null);
  const [metrics, setMetrics] = useState({
    totalInvestment: 0,
    currentPortfolioValue: 0,
    roi: 0,
    cashFlow: 0,
  });
  const [user, setUser] = useState(null);

  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (loggedUser) => {
      if (loggedUser) {
        setUser(loggedUser);
        try {
          const properties = await fetchUserProperties(loggedUser.email);
          setUserProperties(properties);
          setMetrics(calculateMetrics(properties));
          setWatchlist(await fetchWatchlist(loggedUser.email));
        } catch (err) {
          setError(err.message);
          console.error(err);
        }
      } else {
        setUser(null);
      }
    });

    fetchListings()
      .then(setListings)
      .catch((err) => {
        setError(err.message);
        console.error(err);
      });

    return () => unsubscribe();
  }, [auth]);

  const handleAddToWatchlist = async (listing) => {
    if (!user) {
      alert("You need to be logged in to add properties to your watchlist.");
      return;
    }
    try {
      await addToWatchlist(user.email, listing.id);
      setWatchlist((prev) => [...prev, listing.id]);
      alert(`Added ${listing.address} to your watchlist.`);
    } catch (error) {
      alert("Error adding to watchlist.");
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-blue-gray-50/50 p-6">
        {/* Page Header */}
        <h1 className="text-3xl font-semibold mb-6 text-gray-800">
          Your Property Portfolio
        </h1>
  
        {/* Metrics Overview */}
        <div className="mb-8">
          <StatsGrid metrics={metrics} />
        </div>
  
{/* Main Charts Section */}
<div className="grid grid-cols-4 gap-6 mb-12"> {/* Adds margin below the section */}
  {/* LTV Ratio */}
  <div className="col-span-1 h-[50vh]">
    <LtvRatio userProperties={userProperties} />
  </div>

  {/* Average Mortgage */}
  <div className="col-span-1 h-[50vh]">
    <AverageMortgage userProperties={userProperties} />
  </div>

  {/* Empty Space */}
  <div className="col-span-2"></div>
</div>

{/* Rental Income and Expenses Section */}
<div className="mt-12"> {/* Adds margin to avoid overlap */}
  <RentalIncomeExpenses userProperties={userProperties} />
</div>

  
        {/* Public Listings Section */}
        <div className="mt-8">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">
              Public Listings
            </h3>
            <div className="max-h-96 overflow-y-auto space-y-4">
              {error ? (
                <p className="text-red-600">{error}</p>
              ) : (
                listings.map((listing) => (
                  <div
                    key={listing.id}
                    className="bg-gray-100 p-4 rounded-lg shadow-sm"
                  >
                    <ListingCard {...listing} />
                    <button
                      onClick={() => handleAddToWatchlist(listing)}
                      className="mt-2 text-blue-500 hover:underline"
                    >
                      Add to Watchlist
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
  
  
}
  
export default Analysis;
