"use client"; // Client Component

import React, { useState, useEffect, useRef } from "react";
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
import AnalysisSidebar from "../components/AnalysisSidebar";

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
  const mainContentRef = useRef(null); // Ref for the main content area
  const [sidebarHeight, setSidebarHeight] = useState("auto");

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
  const data = [
    {
      id: "some-id", // Unique identifier
      color: "hsl(22, 70%, 50%)", // Optional
      data: [
        { x: "Label1", y: 10 },
        { x: "Label2", y: 20 },
        { x: "Label3", y: 15 },
      ],
    },
  ];

  useEffect(() => {
    // Function to calculate and set the sidebar height
    const updateSidebarHeight = () => {
      if (mainContentRef.current) {
        const height = mainContentRef.current.offsetHeight;
        setSidebarHeight(height);
      }
    };

    // Update height initially and on window resize
    updateSidebarHeight();
    window.addEventListener("resize", updateSidebarHeight);

    return () => {
      window.removeEventListener("resize", updateSidebarHeight);
    };
  }, [userProperties, listings]); // Add dependencies if the content height might change based on these
  
  return (
    <Layout>
      {/* Main Container: Flexbox for Sidebar and Main Content */}
      <Box display="flex" gap="20px" sx={{
            transform: "scale(0.8)",
            transformOrigin: "top center", // Adjust origin if needed
            height: "containerHeight",
          }}>
        {/* Sidebar Section */}
        <AnalysisSidebar sidebarHeight={sidebarHeight} />

        {/* Main Content: Flex Grow to take available space */}
        <Box flexGrow={1} display="flex" flexDirection="column" ref={mainContentRef}>
          {/* Remove transform: scale(0.8) from here */}
          {/* Overview Section */}
          <Box mt="20px" paddingTop="30px">
            <StatsGrid metrics={metrics} />
          </Box>

          {/* Grid Layout: For the content rows */}
          <Box
            display="grid"
            gridTemplateColumns="repeat(12, 1fr)"
            gap="20px"
            mt="20px"
            sx={{ gridAutoRows: "minmax(auto, max-content)" }}
            flexGrow={1}
          >
            {/* ... Rest of your components ... */}
            <Box gridColumn="span 8" className="grid-item" backgroundColor="#fff" borderRadius="8px" padding="20px">
              <RentalIncomeExpenses userProperties={userProperties} />
            </Box>
  
            {/* Public Listings */}
            <Box
              gridColumn="span 4"
              className="grid-item"
              backgroundColor="#fff"
              borderRadius="8px"
              padding="20px"
              flex= "1"
              sx={{
                overflowY: "auto",
                "::-webkit-scrollbar": { width: "0px" },
                msOverflowStyle: "none",
                scrollbarWidth: "none",
              }}
            >
              <Typography variant="h5" fontWeight="600" marginBottom="10px" color="#333">
                Public Listings
              </Typography>
              <Box>
                {listings.length > 0 ? (
                  listings.slice(0, 6).map((listing, index) => (
                    <Box
                      key={`${listing.id}-${index}`}
                      flexGrow="1"
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      borderBottom="4px solid #ddd"
                      padding="15px"
                    >
                      <Box>
                        <Typography variant="subtitle2" fontWeight="500">
                          {listing.address}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {listing.neighborhood}
                        </Typography>
                      </Box>
                      <Box textAlign="right">
                        <Typography variant="caption" color="textSecondary">
                          Current Price:
                        </Typography>
                        <Typography variant="subtitle2" fontWeight="500">
                          {listing.current_price
                            ? `$${parseFloat(listing.current_price).toLocaleString()}`
                            : "Price not available"}
                        </Typography>
                      </Box>
                    </Box>
                  ))
                ) : (
                  <Typography color="textSecondary">No listings available.</Typography>
                )}
              </Box>
            </Box>
  
            {/* Row 2: LTV Ratio, Average Mortgage, and Map */}
            <Box gridColumn="span 4" backgroundColor="#fff" borderRadius="8px" padding="20px">
              <LtvRatio userProperties={userProperties} />
            </Box>
            <Box gridColumn="span 4" backgroundColor="#fff" borderRadius="8px" padding="20px">
              <AverageMortgage userProperties={userProperties} />
            </Box>
            <Box gridColumn="span 4" backgroundColor="#fff" borderRadius="8px" padding="20px">
              <MapComponent />
            </Box>
          </Box>
        </Box>
      </Box>
    </Layout>
  );
};
  
export default Analysis;
