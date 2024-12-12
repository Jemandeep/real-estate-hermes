// components/AnalysisSidebar.js
import React, { useState, useEffect, forwardRef } from "react";
import { Box, Typography, List, ListItem, ListItemText, Divider, Button } from "@mui/material";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { fetchUserProperties } from "../components/firebaseUtils";
import { useRouter } from "next/navigation";

const AnalysisSidebar = forwardRef((props, ref) => {
  const [properties, setProperties] = useState([]);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        loadUserProperties(currentUser.email);
      } else {
        setUser(null);
        setProperties([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const loadUserProperties = async (email) => {
    try {
      const userProperties = await fetchUserProperties(email);
      setProperties(userProperties);
    } catch (error) {
      console.error("Error fetching user properties:", error);
    }
  };

  return (
    <Box
      ref={ref} // Attach the ref for dynamic height calculation
      sx={{
        width: "30%",
        backgroundColor: "#f5f5f5",
        paddingTop: "70px",
        paddingLeft: "20px",
        paddingRight: "20px",
        borderRadius: "8px",
        // Height is handled dynamically by the parent container in analysis/page.js
      }}
    >
      <Typography variant="h6" fontWeight="600" marginBottom="20px">
        Analysis Menu
      </Typography>

      <List>
        <ListItem button onClick={() => router.push("/add-property")}>
          <ListItemText primary="Add Property" />
        </ListItem>
        {/* Property Estimation Option */}
        <ListItem button onClick={() => router.push("/property-estimation")}>
          <ListItemText primary="Property Estimation" />
        </ListItem>
      </List>

      <Divider sx={{ marginY: "20px" }} />

      <Typography variant="h6" fontWeight="600" marginBottom="10px">
        Your Properties
      </Typography>

      {user ? (
        properties.length > 0 ? (
          <List>
            {properties.map((property) => (
              <ListItem
                key={property.id}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  marginBottom: "10px",
                  width: "100%",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                    alignItems: "center",
                  }}
                >
                  <Box>
                    <Typography variant="subtitle1" fontWeight="500">
                      {property.address}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Neighborhood: {property.neighborhood}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Price: ${parseFloat(property.current_price).toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Beds: {property.bed_count} | Baths: {property.bathroom_count}
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => router.push(`/edit-property/${property.id}`)}
                  >
                    Edit
                  </Button>
                </Box>
                <Divider sx={{ width: "100%", marginY: "10px" }} />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography color="textSecondary">No properties available.</Typography>
        )
      ) : (
        <Typography color="textSecondary">Please log in to view your properties.</Typography>
      )}
    </Box>
  );
});

AnalysisSidebar.displayName = "AnalysisSidebar";

export default AnalysisSidebar;
