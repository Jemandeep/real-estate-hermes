"use client";

import React from "react";
import { Gauge, gaugeClasses } from "@mui/x-charts/Gauge";
import { Card, CardHeader, CardContent, Typography, Box, LinearProgress } from "@mui/material";

const LtvAverageGauge = ({ userProperties }) => {
  // Calculate the average LTV ratio
  const averageLtv =
    userProperties.length > 0
      ? userProperties.reduce(
          (acc, property) =>
            acc +
            (parseFloat(property.mortgage_amount) /
              parseFloat(property.current_price)) *
              100,
          0
        ) / userProperties.length
      : 0;

  // Calculate LTV ratios for individual properties
  const propertyRatios = userProperties.map((property) => ({
    address: property.address,
    ltvRatio:
      (parseFloat(property.mortgage_amount) / parseFloat(property.current_price)) * 100,
  }));

  return (
<Card
      sx={{
        width: '50vw', // 1/4 of viewport width
        height: '28vw', // Equal height for square
        maxWidth: '37vh', // Prevent exceeding 1/4 of viewport height
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'auto',
        margin: 'auto',
        textAlign: 'center',
        border: '1px solid #ddd',
        borderRadius: '30px',
        justifyContent: "space-between"
      }}
    >
      <CardHeader
        title="Loan-to-Value (LTV) Overview"
        subheader="Visualizing LTV Ratios for Your Properties"
      />
      <CardContent>
        {/* Average LTV Gauge */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
          <Gauge
            width={200}
            height={200}
            value={averageLtv}
            cornerRadius="50%"
            sx={{
              [`& .${gaugeClasses.valueText}`]: {
                fontSize: 40,
              },
              [`& .${gaugeClasses.valueArc}`]: {
                fill:
                  averageLtv <= 50
                    ? "#4caf50" // Green for good
                    : averageLtv <= 75
                    ? "#ffb300" // Yellow for moderate
                    : "#f44336", // Red for high risk
              },
              [`& .${gaugeClasses.referenceArc}`]: {
                fill: "#e0e0e0",
              },
            }}
          />
        </Box>

        {/* Individual Property LTV Ratios */}
        <Box>
          {propertyRatios.map((property, index) => (
            <Box key={index} mb={2}>
              <Typography variant="body2" gutterBottom>
                {property.address || "Unknown Address"}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={property.ltvRatio}
                sx={{
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: "#e0e0e0",
                  "& .MuiLinearProgress-bar": {
                    backgroundColor:
                      property.ltvRatio <= 50
                        ? "#4caf50" // Green for good
                        : property.ltvRatio <= 75
                        ? "#ffb300" // Yellow for moderate
                        : "#f44336", // Red for high risk
                  },
                }}
              />
              <Typography variant="caption" sx={{ display: "block" }}>
                {property.ltvRatio.toFixed(2)}%
              </Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default LtvAverageGauge;
