import React from 'react';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { PieChart } from '@mui/x-charts/PieChart';
import { BarChart } from '@mui/x-charts/BarChart';

const RentalIncomeExpenses = ({ userProperties }) => {
  // Filter properties that are for rent
  const rentalProperties = userProperties.filter((property) => property.is_for_rent);

  // Calculate total and average values
  let totalMortgage = 0,
    totalMaintenance = 0,
    totalInsurance = 0,
    totalTaxes = 0,
    totalRent = 0;

  const propertyData = rentalProperties.map((property) => {
    const rent = parseFloat(property.rent_price || 0);
    const mortgage = parseFloat(property.mortgage_monthly_payment || 0);
    const maintenance = parseFloat(property.maintenance || 0) / 12;
    const insurance = parseFloat(property.insurance || 0) / 12;
    const taxes = parseFloat(property.taxes || 0) / 12;
    const totalExpenses = mortgage + maintenance + insurance + taxes;

    totalRent += rent;
    totalMortgage += mortgage;
    totalMaintenance += maintenance;
    totalInsurance += insurance;
    totalTaxes += taxes;

    return {
      category: property.address, // Use property address for individual labels
      income: rent,
      expenses: totalExpenses,
    };
  });

  const totalExpenses = totalMortgage + totalMaintenance + totalInsurance + totalTaxes;
  const averageIncome = totalRent / rentalProperties.length;
  const averageExpenses = totalExpenses / rentalProperties.length;

  // Add averages to the dataset
  const combinedData = [
    ...propertyData,
    { category: 'Average', income: averageIncome, expenses: averageExpenses },
  ];

  const chartSetting = {
    width: 800,
    height: 300,
    barWidth: 10, // Thinner bars
  };

  return (
    <Card 
  sx={{ 
    borderRadius: "30px", 
    maxWidth: 1200, 
    margin: '20px 0', // Removes horizontal centering
    textAlign: 'center', 
    padding: '10px', 
    border: '1px solid #ddd' 
  }}
>

      <CardContent>
        <Typography variant="h6" gutterBottom>
          Rental Income and Expenses Analysis
        </Typography>

        {/* Combined Average Graphs */}
        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', marginBottom: '40px' }}>
          {/* Average Expenses Pie Chart */}
          <div style={{ textAlign: 'center', flex: 1 }}>
            <Typography variant="h6" sx={{ marginBottom: 2 }}>
              Average Expenses Breakdown
            </Typography>
            <PieChart
  series={[
    {
      data: [
        { id: 0, value: totalMortgage / rentalProperties.length, label: 'Mortgage' },
        { id: 1, value: totalMaintenance / rentalProperties.length, label: 'Maintenance' },
        { id: 2, value: totalInsurance / rentalProperties.length, label: 'Insurance' },
        { id: 3, value: totalTaxes / rentalProperties.length, label: 'Taxes' },
      ],
      innerRadius: 30,
      outerRadius: 100,
      paddingAngle: 0,
      cornerRadius: 5,
      startAngle: -45,
      endAngle: 225,
      cx: 150,
      cy: 170,
    },
  ]}
  slotProps={{
    legend: {
      direction: 'row', // Arrange items vertically
      position: { vertical: 'top', horizontal: 'center' }, // Place the legend on the right
      textStyle: { fontSize: 10, color: '#333', }, // Customize text style if supported
    },
  }}
  width={300}
  height={300}
/>


          </div>

          {/* Income vs. Expenses for All Properties and Average */}
          <div style={{ textAlign: 'center', flex: 1 }}>
            <Typography variant="h6" sx={{ marginBottom: 2 }}>
              Income vs. Expenses (Including Average)
            </Typography>
            <BarChart
              dataset={combinedData}
              xAxis={[{ scaleType: 'band', dataKey: 'category' }]}
              series={[
                { dataKey: 'income', label: 'Income', valueFormatter: (val) => `$${val.toLocaleString(2)}` },
                { dataKey: 'expenses', label: 'Expenses', valueFormatter: (val) => `$${val.toLocaleString(2)}` },
              ]}
              {...chartSetting}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RentalIncomeExpenses;
