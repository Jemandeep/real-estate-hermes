"use client";

import React from "react";
import { ResponsivePie } from "@nivo/pie";
import { Card, CardContent, Typography, Box } from "@mui/material";

const LtvAverageGauge = ({ userProperties }) => {
  // Calculate the average LTV ratio
  const averageLtv =
    userProperties.length > 0
      ? userProperties.reduce(
          (acc, property) =>
            acc +
            (parseFloat(property.mortgage_amount) / parseFloat(property.current_price)) *
              100,
          0
        ) / userProperties.length
      : 0;

  // Prepare data for the pie chart
  const pieData = [
    {
      id: "LTV Ratio",
      label: "LTV Ratio",
      value: averageLtv,
      color: "hsl(210, 70%, 50%)", // Blue-like color
    },
    {
      id: "Remaining",
      label: "Remaining",
      value: 100 - averageLtv,
      color: "hsl(0, 0%, 80%)", // Light gray
    },
  ];

  return (
    <Card
      sx={{
        marginBottom: "30px",
        maxWidth: "1200px",
        margin: "20px auto",
        padding: "20px",
        textAlign: "center",
        overflow: "hidden",
        height: "400px",
        boxShadow: "none", // Remove box shadow
      }}
    >
      <CardContent>
        <Typography variant="h6" sx={{ marginBottom: "20px" }}>
          Average Loan-to-Value (LTV): {averageLtv.toFixed(2)}%
        </Typography>

        {/* Pie Chart */}
        <Box sx={{ height: "300px" }}>
          <ResponsivePie
            data={pieData}
            theme={{
              axis: {
                domain: {
                  line: {
                    stroke: "#ddd",
                  },
                },
                legend: {
                  text: {
                    fill: "#ddd",
                  },
                },
                ticks: {
                  line: {
                    stroke: "#ddd",
                    strokeWidth: 1,
                  },
                  text: {
                    fill: "#ddd",
                  },
                },
              },
              legends: {
                text: {
                  fill: "#ddd",
                },
              },
            }}
            margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
            innerRadius={0.5}
            padAngle={0.7}
            cornerRadius={3}
            activeOuterRadiusOffset={8}
            colors={["#4A90E2", "#ADD8E6"]} // Blue and Light Blue
            arcLinkLabelsSkipAngle={360} // Hide all arc link labels
            enableArcLabels={false} // Disable arc labels
            defs={[
              {
                id: "dots",
                type: "patternDots",
                background: "inherit",
                color: "rgba(255, 255, 255, 0.3)",
                size: 4,
                padding: 1,
                stagger: true,
              },
              {
                id: "lines",
                type: "patternLines",
                background: "inherit",
                color: "rgba(255, 255, 255, 0.3)",
                rotation: -45,
                lineWidth: 6,
                spacing: 10,
              },
            ]}
            legends={[
              {
                anchor: "bottom",
                direction: "row",
                justify: false,
                translateX: 0,
                translateY: 56,
                itemsSpacing: 0,
                itemWidth: 100,
                itemHeight: 18,
                itemTextColor: "#999",
                itemDirection: "left-to-right",
                itemOpacity: 1,
                symbolSize: 18,
                symbolShape: "circle",
                effects: [
                  {
                    on: "hover",
                    style: {
                      itemTextColor: "#000",
                    },
                  },
                ],
              },
            ]}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default LtvAverageGauge;
