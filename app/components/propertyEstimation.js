"use client";

import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Divider,
} from "@mui/material";

const PropertyEstimation = () => {
  const [squareFootage, setSquareFootage] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [estimatedValue, setEstimatedValue] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setEstimatedValue(null);

    try {
      const response = await fetch("/api/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          squareFootage: parseFloat(squareFootage),
          bedrooms: parseInt(bedrooms, 10),
          bathrooms: parseInt(bathrooms, 10),
          propertyType: propertyType.toLowerCase(),
          postalCode: postalCode.toUpperCase(),
        }),
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        setEstimatedValue(data.estimatedValue);
      }
    } catch (err) {
      setError("An unexpected error occurred.");
      console.error(err);
    }
  };

  return (
    <Box
      sx={{
        padding: "40px",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "flex-start",
        gap: "60px",
      }}
    >
      {/* Left side: Property Estimator Form */}
      <Box sx={{ maxWidth: "400px", flex: "1", paddingTop: "20px" }}>
        <Typography variant="h4" gutterBottom sx={{ marginBottom: "20px" }}>
          Property Value Estimation
        </Typography>

        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <TextField
            label="Square Footage"
            type="number"
            value={squareFootage}
            onChange={(e) => setSquareFootage(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Bedrooms"
            type="number"
            value={bedrooms}
            onChange={(e) => setBedrooms(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Bathrooms"
            type="number"
            value={bathrooms}
            onChange={(e) => setBathrooms(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <FormControl fullWidth margin="normal" required>
            <InputLabel id="property-type-label">Property Type</InputLabel>
            <Select
              labelId="property-type-label"
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              label="Property Type"
            >
              <MenuItem value="apartment">Apartment</MenuItem>
              <MenuItem value="single detached house">Single Detached House</MenuItem>
              <MenuItem value="duplex">Duplex</MenuItem>
              <MenuItem value="triplex">Triplex</MenuItem>
              <MenuItem value="townhouse">Townhouse</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Postal Code"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value.toUpperCase())}
            fullWidth
            margin="normal"
            required
            inputProps={{ style: { textTransform: "uppercase" } }}
          />

          <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
            Estimate Value
          </Button>
        </form>

        {estimatedValue && (
          <Typography variant="h6" sx={{ mt: 3 }}>
            Estimated Value: ${estimatedValue.toLocaleString()}
          </Typography>
        )}

        {error && (
          <Typography variant="body1" color="error" sx={{ mt: 3 }}>
            Error: {error}
          </Typography>
        )}
      </Box>

      {/* Vertical Divider */}
      <Divider orientation="vertical" flexItem />

      {/* Right side: Information about the model */}
      <Box sx={{ flex: "1", maxWidth: "400px" ,  paddingTop: "20px"}}>
        <Typography variant="h5" gutterBottom sx={{ marginBottom: "20px" }}>
          How This Model Works
        </Typography>
        <Typography variant="body1" paragraph>
          This property value estimation model uses a machine learning algorithm trained on 4000+ recently sold listing in Calgary. It takes into account features such as:
        </Typography>
        <ul style={{ marginLeft: "20px" }}>
          <li><Typography variant="body1">1. Square Footage</Typography></li>
          <li><Typography variant="body1">2. Number of Bedrooms and Bathrooms</Typography></li>
          <li><Typography variant="body1">3. Property Type</Typography></li>
          <li><Typography variant="body1">4. Postal Code (to determine local market influences)</Typography></li>
        </ul>
        <Typography variant="body1" paragraph sx={{ marginTop: "20px" }}>
          By analyzing these factors, the model provides an estimated property value. Keep in mind that this is a 
          statistical estimation and actual market conditions, renovations, and unique property characteristics can 
          influence final valuations.
        </Typography>
      </Box>
    </Box>
  );
};

export default PropertyEstimation;
