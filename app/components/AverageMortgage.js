import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";
import { Card, CardContent, Typography } from "@mui/material";

const AverageMortgage = () => {
  const [properties, setProperties] = useState([]);
  const [averageMortgage, setAverageMortgage] = useState(0);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "properties"));
        const fetchedProperties = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setProperties(fetchedProperties);

        const totalMortgage = fetchedProperties.reduce(
          (sum, property) =>
            sum + parseFloat(property.mortgage_monthly_payment || 0) * 12,
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

  const categories = properties.map(
    (property) => property.address || "Unknown Address"
  );

  const mortgagePaid = properties.map(
    (property) => parseFloat(property.down_payment || 0)
  );

  const mortgageRemaining = properties.map(
    (property) =>
      parseFloat(property.mortgage_amount || 0) -
      parseFloat(property.down_payment || 0)
  );

  const chartOptions = {
    chart: {
      type: "bar",
      stacked: true,
      toolbar: { show: false },
      responsive: [
        {
          breakpoint: 768,
          options: {
            plotOptions: {
              bar: { columnWidth: "50%" },
            },
            xaxis: {
              labels: { style: { fontSize: "10px" } },
            },
            yaxis: {
              labels: { style: { fontSize: "10px" } },
            },
          },
        },
        {
          breakpoint: 480,
          options: {
            plotOptions: {
              bar: { columnWidth: "70%" },
            },
            xaxis: { labels: { show: false } },
          },
        },
      ],
    },
    xaxis: {
      categories,
      labels: { show: false },
    },
    yaxis: {
      title: { text: "Mortgage Amount", style: { fontSize: "14px" } },
      labels: {
        formatter: (val) =>
          val >= 1000000
            ? `${(val / 1000000).toFixed(1)}M`
            : val >= 1000
            ? `${(val / 1000).toFixed(0)}k`
            : val,
      },
    },
    tooltip: {
      y: { formatter: (val) => `$${val.toLocaleString()}` },
    },
    colors: ["#4caf50", "#f44336"],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "30%",
        borderRadius: 4,
      },
    },
  };

  const chartSeries = [
    { name: "Paid", data: mortgagePaid },
    { name: "Remaining", data: mortgageRemaining },
  ];

  return (
    <Card
      sx={{
        marginBottom: "30px", // Add margin below to separate it
        maxWidth: "1200px",
        margin: "20px auto",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "30px",
        textAlign: "center",
        overflow: "hidden", // Prevents content overflow
      }}
    >
      <CardContent>
        <Typography variant="h6" sx={{ marginBottom: "20px" }}>
          Average Mortgage: ${averageMortgage.toFixed(2)}
        </Typography>
        <Chart
          options={chartOptions}
          series={chartSeries}
          type="bar"
          width="100%"
          height="100%"
        />
      </CardContent>
    </Card>
  );
};

export default AverageMortgage;