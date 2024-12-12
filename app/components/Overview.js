"use client"; // Ensure client-side rendering

import * as React from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
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
    {
      title: 'Total Investment',
      icon: 'receipt',
      value: `$${metrics.totalInvestment.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
    },
    {
      title: 'Current Portfolio Value',
      icon: 'coin',
      value: `$${metrics.currentPortfolioValue.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
    },
    {
      title: 'ROI',
      icon: 'discount',
      value: `${metrics.roi.toFixed(2)}%`,
    },
    {
      title: 'Cash Flow',
      icon: 'coin',
      value: `$${metrics.cashFlow.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
    },
  ];

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: '100%',
        padding: '20px',
        borderRadius: "8px",
        backgroundColor: '#f5f5f5',
      }}
    >
      <Typography
        component="h2"
        variant="h6"
        sx={{ mb: 4, fontWeight: 'bold', textAlign: 'center' }}
      >
        Overview
      </Typography>
      <Grid
        container
        spacing={2}
        justifyContent="space-evenly"
        alignItems="stretch"
      >
        {stats.map((stat, index) => {
          const Icon = icons[stat.icon];
          return (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  backgroundColor: '#ffffff',
                  height: '100%',
                  borderRadius: "8px",

                }}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{ mb: 2 }}
                >
                  <Typography
                    variant="subtitle1"
                    color="textSecondary"
                    fontWeight={700}
                  >
                    {stat.title}
                  </Typography>
                  <Icon
                    size="1.8rem"
                    stroke={1.5}
                    style={{ position: 'relative' }}
                  />
                </Stack>
                <Typography variant="h4" fontWeight={700}>
                  {stat.value}
                </Typography>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default StatsGrid;
