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
        border: "1px solid #ddd",
        borderRadius: "30px",
        textAlign: "center",
        overflow: "hidden",
        height: "400px", // Adjust the height to match the PieChart
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
            borderColor={{
              from: "color",
              modifiers: [["darker", 0.2]],
            }}
            arcLinkLabelsSkipAngle={10}
            arcLinkLabelsTextColor="#ddd"
            arcLinkLabelsThickness={2}
            arcLinkLabelsColor={{ from: "color" }}
            enableArcLabels={false}
            arcLabelsRadiusOffset={0.4}
            arcLabelsSkipAngle={7}
            arcLabelsTextColor={{
              from: "color",
              modifiers: [["darker", 2]],
            }}
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
