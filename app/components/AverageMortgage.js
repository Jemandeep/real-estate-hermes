"use client";

import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { db } from "../../firebase"; // Adjust the path to your Firebase config
import { collection, getDocs } from "firebase/firestore";
import { Card, CardContent, Typography } from "@mui/material"; // Added this import

const chartsConfig = {
  chart: {
    toolbar: {
      show: false,
    },
  },
  title: {
    show: false,
  },
  dataLabels: {
    enabled: false,
  },
  xaxis: {
    axisTicks: {
      show: false,
    },
    axisBorder: {
      show: false,
    },
    labels: {
      style: {
        colors: "#37474f",
        fontSize: "13px",
        fontFamily: "inherit",
        fontWeight: 300,
      },
    },
  },
  yaxis: {
    labels: {
      style: {
        colors: "#37474f",
        fontSize: "13px",
        fontFamily: "inherit",
        fontWeight: 300,
      },
    },
  },
  grid: {
    show: true,
    borderColor: "#dddddd",
    strokeDashArray: 5,
    xaxis: {
      lines: {
        show: true,
      },
    },
    padding: {
      top: 5,
      right: 20,
    },
  },
  fill: {
    opacity: 0.8,
  },
  tooltip: {
    theme: "dark",
  },
};

const AverageMortgage = () => {
  const [properties, setProperties] = useState([]);
  const [averageMortgage, setAverageMortgage] = useState(0);

  // Fetch property data from Firestore
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "properties")); // Firestore collection name
        const fetchedProperties = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setProperties(fetchedProperties);

        // Calculate average mortgage
        const totalMortgage = fetchedProperties.reduce(
          (sum, property) =>
            sum + parseFloat(property.mortgage_monthly_payment || 0) * 12, // Annualize monthly payments
          0
        );
        const average = totalMortgage / fetchedProperties.length || 0;
        setAverageMortgage(average);
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
    };

    fetchProperties();
  }, []);

  // Prepare chart data
  const categories = properties.map(
    (property) => property.address || "Unknown Address"
  );

  const mortgagePaid = properties.map(
    (property) => parseFloat(property.down_payment || 0)
  );

  const mortgageRemaining = properties.map(
    (property) =>
      parseFloat(property.mortgage_amount || 0) - parseFloat(property.down_payment || 0)
  );

  const chartOptions = {
    ...chartsConfig,
    chart: {
      ...chartsConfig.chart,
      type: "bar",
      stacked: true, // Stacked bars to separate paid and remaining
      responsive: [
        {
          breakpoint: 768, // Example for tablet screens
          options: {
            plotOptions: {
              bar: {
                columnWidth: "50%", // Adjust bar width for smaller screens
              },
            },
            xaxis: {
              labels: {
                style: {
                  fontSize: "10px", // Smaller font size for x-axis
                },
              },
            },
            yaxis: {
              labels: {
                style: {
                  fontSize: "10px", // Smaller font size for y-axis
                },
              },
            },
          },
        },
        {
          breakpoint: 480, // Example for mobile screens
          options: {
            plotOptions: {
              bar: {
                columnWidth: "70%", // Wider bars for very small screens
              },
            },
            xaxis: {
              labels: {
                show: false, // Hide labels on very small screens for readability
              },
            },
          },
        },
      ],
    },
    xaxis: {
      ...chartsConfig.xaxis,
      categories, // Keep categories for internal functionality but hide labels
      labels: {
        show: false, // Hide x-axis labels (addresses under bars)
      },
    },
    yaxis: {
      ...chartsConfig.yaxis,
      title: {
        text: "Mortgage Amount",
        style: {
          color: "#37474f",
          fontSize: "14px",
          fontWeight: 400,
        },
      },
      labels: {
        formatter: (val) => {
          if (val >= 1000000) {
            return `${(val / 1000000).toFixed(1)}M`; // Format for millions (e.g., 1.2M)
          } else if (val >= 1000) {
            return `${(val / 1000).toFixed(0)}k`; // Format for thousands (e.g., 150k)
          }
          return val; // Keep original for smaller numbers
        },
      },
    },
    tooltip: {
      ...chartsConfig.tooltip,
      y: {
        formatter: (val) => `$${val.toLocaleString()}`, // Format as currency in tooltip
      },
    },
    colors: ["#4caf50", "#f44336"], // Green for paid, red for remaining
    plotOptions: {
      bar: {
        horizontal: false, // Ensure vertical bars
        columnWidth: "30%", // Adjust this value for thinner bars
        borderRadius: 4, // Optional: round the bar edges
      },
    },
  };

  const chartSeries = [
    {
      name: "Paid",
      data: mortgagePaid, // Green bars for the paid portion
    },
    {
      name: "Remaining",
      data: mortgageRemaining, // Red bars for the remaining portion
    },
  ];

  return (
    <Card
      sx={{
        maxWidth: 1200, // Matches RentalIncomeExpenses maxWidth for consistency
        margin: "20px auto", // Center horizontally with vertical spacing
        textAlign: "center",
        padding: "10px", // Padding inside the card
        border: "1px solid #ddd",
        borderRadius: "30px",
      }}
    >
      <CardContent>
        <Typography
          variant="h6"
          sx={{ textAlign: "center", marginBottom: 3 }}
        >
          Average Mortgage: ${averageMortgage.toFixed(2)}
        </Typography>
        <Chart
          options={chartOptions}
          series={chartSeries}
          type="bar"
          width="100%"
          height="400px" // Fixed height for consistency
        />
      </CardContent>
    </Card>
  );
};

export default AverageMortgage;
