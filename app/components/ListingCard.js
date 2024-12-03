"use client";
import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { db } from '../../firebase';
import { collection, getDocs } from "firebase/firestore";

const ListingCard = () => {
  const [listings, setListings] = useState([]);

  // Fetch listings from Firestore
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "listings")); // Adjust collection name if needed
        const fetchedListings = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setListings(fetchedListings);
      } catch (error) {
        console.error("Error fetching listings:", error);
      }
    };

    fetchListings();
  }, []);

  return (
    <Box>
      {listings.map((listing) => (
        <Box
          key={listing.id}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          borderBottom="1px solid #ddd"
          padding="10px"
          width="450px" // Fixed width for all cards
          height="100px" // Fixed height for all cards
          overflow="hidden" // Hide overflow content
        >
          {/* Address and Neighborhood */}
          <Box
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            <Typography variant="subtitle1" fontWeight="500">
              {listing.address || "No Address Available"}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {listing.neighborhood || "Unknown Neighborhood"}
            </Typography>
          </Box>

          {/* Current Price */}
          <Box ml="auto" textAlign="right">
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
      ))}
    </Box>
  );
};

export default ListingCard;
