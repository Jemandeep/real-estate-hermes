"use client"; 

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Layout from '../components/Layout'; 

// Placeholder data for the chart
const data = [
  { name: 'Jan', value: 30 },
  { name: 'Feb', value: 20 },
  { name: 'Mar', value: 27 },
  { name: 'Apr', value: 18 },
  { name: 'May', value: 23 },
  { name: 'Jun', value: 34 },
];

const Analysis = () => {
  return (
    <Layout>
      <div className="max-w-lg mx-auto p-4 bg-white rounded shadow mt-10">
        <h1 className="text-2xl font-bold mb-4">Analysis Dashboard</h1>

        {/* Simple Bar Chart */}
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value"/>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Layout>
  );
};

export default Analysis;
