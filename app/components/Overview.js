"use client"; // Ensure client-side rendering

import * as React from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Group from '@mui/material/Stack';
import {
  IconUserPlus,
  IconDiscount2,
  IconReceipt2,
  IconCoin,
} from '@tabler/icons-react';

const icons = {
  user: IconUserPlus,
  discount: IconDiscount2,
  receipt: IconReceipt2,
  coin: IconCoin,
};

const StatsGrid = ({ metrics }) => {
    const stats = [
      { title: 'Total Investment', icon: 'receipt', value: `$${metrics.totalInvestment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, diff: 0 },
      { title: 'Current Portfolio Value', icon: 'coin', value: `$${metrics.currentPortfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, diff: 0 },
      { title: 'ROI', icon: 'discount', value: `${metrics.roi.toFixed(2)}%`, diff: 0 },
      { title: 'Cash Flow', icon: 'user', value: `$${metrics.cashFlow.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, diff: 0 },
    ];

  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' }, padding: '20px' }}>
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Overview
      </Typography>
      <Grid container spacing={2} columns={12} sx={{ mb: 2 }}>
        {stats.map((stat, index) => {
          const Icon = icons[stat.icon];
          return (
            <Grid item xs={12} sm={6} lg={3} key={index}>
              <Paper elevation={3} sx={{ p: 2, textAlign: 'center', backgroundColor: '#f8f9fa' }}>
                <Group direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                  <Typography variant="subtitle1" color="textSecondary" fontWeight={700}>
                    {stat.title}
                  </Typography>
                  <Icon size="1.8rem" stroke={1.5} style={{ position: 'absolute', top: 10, right: 10 }} />
                </Group>
                <Group alignItems="center" justifyContent="center" mt={2}>
                  <Typography variant="h4" fontWeight={700}>
                    {stat.value.toLocaleString()}
                  </Typography>
                </Group>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default StatsGrid;
