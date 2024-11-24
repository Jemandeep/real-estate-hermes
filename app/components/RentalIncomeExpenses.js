import React from 'react';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

const RentalIncomeExpenses = ({ userProperties }) => {
  return (
    <Card sx={{ maxWidth: 400, margin: '20px auto', textAlign: 'center', padding: '10px', border: '1px solid #ddd' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Rental Income vs. Expenses
        </Typography>
        {userProperties.filter((property) => property.is_for_rent).map((property) => {
          const rent = parseFloat(property.rent_price || 0);
          const mortgage = parseFloat(property.mortgage_monthly_payment || 0);
          const maintenance = parseFloat(property.maintenance || 0) / 12;
          const insurance = parseFloat(property.insurance || 0) / 12;
          const taxes = parseFloat(property.taxes || 0) / 12;
          const totalExpenses = mortgage + maintenance + insurance + taxes;
          const cashFlowWidth = ((rent - totalExpenses) / rent) * 100;

          return (
            <div key={property.id} className="mb-6">
              <Typography variant="body2" gutterBottom>
                {property.address}
              </Typography>
              <Typography variant="body2" sx={{ marginBottom: 1 }}>
                Rental Income: ${rent.toFixed(2)}
              </Typography>
              <div style={{ width: '100%', height: '6px', backgroundColor: '#f0f0f0', borderRadius: '3px' }}>
                <div
                  style={{
                    height: '6px',
                    width: '100%',
                    backgroundColor: 'green',
                    borderRadius: '3px',
                  }}
                />
              </div>
              <Typography variant="body2" sx={{ marginTop: 1 }}>
                Expenses: ${totalExpenses.toFixed(2)}
              </Typography>
              <div style={{ width: '100%', height: '6px', backgroundColor: '#f0f0f0', borderRadius: '3px', marginTop: '5px' }}>
                <div
                  style={{
                    height: '6px',
                    width: `${Math.abs(cashFlowWidth)}%`,
                    backgroundColor: cashFlowWidth > 0 ? 'green' : 'red',
                    borderRadius: '3px',
                  }}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default RentalIncomeExpenses;
