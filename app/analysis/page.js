"use client"; // Add this line at the top to indicate a Client Component

import React, { useState, useEffect } from "react";
import { Box, Button, Typography } from "@mui/material";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  fetchUserProperties,
  fetchListings,
  fetchWatchlist,
  addToWatchlist,
} from "../components/firebaseUtils";
import { calculateMetrics } from "../components/calculateMetrics";
import Layout from "../components/Layout";
import StatsGrid from "../components/Overview";
import LtvRatio from "../components/LtvRatio";
import AverageMortgage from "../components/AverageMortgage";
import RentalIncomeExpenses from "../components/RentalIncomeExpenses";
import ListingCard from "../components/ListingCard";
import MapComponent from "../components/MapComponent"; // Import the Map Component


const Analysis = () => {
  const [userProperties, setUserProperties] = useState([]);
  const [listings, setListings] = useState([]);
  const [error, setError] = useState(null);
  const [metrics, setMetrics] = useState({
    totalInvestment: 0,
    currentPortfolioValue: 0,
    roi: 0,
    cashFlow: 0,
  });
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (loggedUser) => {
      if (loggedUser) {
        try {
          const properties = await fetchUserProperties(loggedUser.email);
          setUserProperties(properties);
          setMetrics(calculateMetrics(properties));
          setListings(await fetchListings());
        } catch (err) {
          console.error(err);
        }
      }
    });
    return () => unsubscribe();
  }, [auth]);

  const handleAddToWatchlist = async (listing) => {
    try {
      await addToWatchlist(userProperties.email, listing.id);
      alert(`Added ${listing.address} to your watchlist.`);
    } catch (err) {
      console.error("Error adding to watchlist:", err);
    }
  };

  return (
    <Layout>
      {/* Overview Section */}
      <Box mt="20px">
        <StatsGrid metrics={metrics} />
      </Box>

      {/* Grid Layout */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)" // 12-column grid layout
        gap="20px"
        mt="20px"
      >
        {/* Row 1: LTV Ratio, Average Mortgage, and Map */}
        <Box
          gridColumn="span 4"
          backgroundColor="#fff"
          borderRadius="8px"
          padding="20px"
        >
          <LtvRatio userProperties={userProperties} />
        </Box>
        <Box
          gridColumn="span 4"
          backgroundColor="#fff"
          borderRadius="8px"
          padding="20px"
        >
          <AverageMortgage userProperties={userProperties} />
        </Box>
        <Box
          gridColumn="span 4"
          backgroundColor="#fff"
          borderRadius="8px"
          padding="20px"
        >
          <MapComponent /> {/* Add the Map Component */}
        </Box>

        {/* Row 2: Rental Income and Expenses Analysis */}
        <Box
          gridColumn="span 8"
          backgroundColor="#fff"
          borderRadius="8px"
          padding="20px"
        >
          <RentalIncomeExpenses userProperties={userProperties} />
        </Box>

        {/* Row 2: Public Listings */}
        <Box
          gridColumn="span 4"
          backgroundColor="#fff"
          borderRadius="8px"
          padding="20px"
          overflow="auto"
        >
          <Typography
            variant="h5"
            fontWeight="600"
            marginBottom="10px"
            color="#333"
          >
            Public Listings
          </Typography>
          <Box>
            {listings.length > 0 ? (
              listings.map((listing) => (
                <Box
                  key={listing.id}
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  borderBottom="1px solid #ddd"
                  padding="10px 0"
                >
                  <ListingCard {...listing} />
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => handleAddToWatchlist(listing)}
                  >
                    Add to Watchlist
                  </Button>
                </Box>
              ))
            ) : (
              <Typography color="textSecondary">No listings available.</Typography>
            )}
          </Box>
        </Box>
      </Box>
    </Layout>
  );
};

export default Analysis;
