import React from "react";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { ResponsiveLine } from "@nivo/line";
import { useTheme } from "@mui/material";

const RentalIncomeExpenses = ({ userProperties }) => {
  // Define static colors
  const incomeColor = "#4caf50"; // Green for income
  const expenseColor = "#f44336"; // Red for expenses

  const rentalProperties = userProperties.filter((property) => property.is_for_rent);
  // Prepare data for the line chart
  const chartData = [
    {
      id: "Income",
      color: "#4caf50", // Green for income
      data: rentalProperties.map((property, index) => ({
        x: property.address || `Property ${index + 1}`,
        y: parseFloat(property.rent_price || 0),
      })),
    },
    {
      id: "Expenses",
      color: "#f44336", // Red for expenses
      data: rentalProperties.map((property, index) => ({
        x: property.address || `Property ${index + 1}`,
        y:
          parseFloat(property.mortgage_monthly_payment || 0) +
          parseFloat(property.maintenance || 0) / 12 +
          parseFloat(property.insurance || 0) / 12 +
          parseFloat(property.taxes || 0) / 12,
      })),
    },
    {
      id: "Maintenance",
      color: "#ffa726", // Orange for maintenance
      data: rentalProperties.map((property, index) => ({
        x: property.address || `Property ${index + 1}`,
        y: parseFloat(property.maintenance || 0) / 12,
      })),
    },
    {
      id: "Insurance",
      color: "#42a5f5", // Blue for insurance
      data: rentalProperties.map((property, index) => ({
        x: property.address || `Property ${index + 1}`,
        y: parseFloat(property.insurance || 0) / 12,
      })),
    },
    {
      id: "Taxes",
      color: "#ab47bc", // Purple for taxes
      data: rentalProperties.map((property, index) => ({
        x: property.address || `Property ${index + 1}`,
        y: parseFloat(property.taxes || 0) / 12,
      })),
    },
  ];

  return (
    <Card
      sx={{
        borderRadius: "30px",
        maxWidth: 1200,
        margin: "20px 0",
        textAlign: "center",
        padding: "20px",
        border: "1px solid #ddd",
      }}
    >
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Rental Income and Expenses Analysis
        </Typography>

        {/* Line Chart */}
        <div style={{ height: "400px" }}>
          <ResponsiveLine
            data={chartData}
            theme={{
              axis: {
                domain: {
                  line: {
                    stroke: "#ddd", // Static axis color
                  },
                },
                ticks: {
                  line: {
                    stroke: "#ddd",
                    strokeWidth: 1,
                  },
                  text: {
                    fill: "#333", // Static tick text color
                  },
                },
              },
              legends: {
                text: {
                  fill: "#333",
                },
              },
              tooltip: {
                container: {
                  background: "#fff",
                  color: "#000",
                  fontSize: "14px",
                },
              },
            }}
            colors={{ datum: "color" }}
            margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
            xScale={{ type: "point" }}
            yScale={{ type: "linear", min: "auto", max: "auto", stacked: false }}
            axisTop={null}
            axisRight={null}
            axisBottom={{
              orient: "bottom",
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 45,
              legend: "Properties",
              legendOffset: 36,
              legendPosition: "middle",
            }}
            axisLeft={{
              orient: "left",
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "Amount ($)",
              legendOffset: -40,
              legendPosition: "middle",
            }}
            pointSize={10}
            pointColor={{ theme: "background" }}
            pointBorderWidth={2}
            pointBorderColor={{ from: "serieColor" }}
            useMesh={true}
            legends={[
              {
                anchor: "bottom-right",
                direction: "column",
                translateX: 100,
                itemWidth: 80,
                itemHeight: 20,
                symbolSize: 12,
                symbolShape: "circle",
                itemTextColor: "#333",
                effects: [
                  {
                    on: "hover",
                    style: {
                      itemBackground: "rgba(0, 0, 0, .03)",
                      itemOpacity: 1,
                    },
                  },
                ],
              },
            ]}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default RentalIncomeExpenses;
