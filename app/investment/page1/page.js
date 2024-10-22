"use client";
import React from 'react';
import NavBar from '../../components/NavBar'; // Adjust the path if necessary
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register the required components
ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend);

const InvestmentPage1 = () => {
  const investment = {
    id: 1,
    propertyType: 'Single Family Home',
    location: 'Downtown, City A',
    squareFootage: '1,500 sq ft',
    bedrooms: 3,
    bathrooms: 2,
    potentialReturn: '8%',
    projectedAppreciation: '3% per year',
    description: 'This beautiful single-family home in downtown City A features modern amenities, a spacious backyard, and is within walking distance of schools and parks. Perfect for families or as a rental investment.',
    image: '/images/ih1.jpg', // Reduced image size
    investmentReturns: [5, 8, 6, 10, 7, 12, 9, 11], // Investment returns for the last 8 years
    years: ['2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023'], // Corresponding years
  };

  // Data for the chart
  const data = {
    labels: investment.years,
    datasets: [
      {
        label: 'Investment Returns (%)',
        data: investment.investmentReturns,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
        tension: 0.3, // This creates a smooth line
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Year',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Returns (%)',
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div>
      <NavBar /> {/* Add the NavBar here */}
      <div className="container mx-auto p-6 pt-16 bg-white"> {/* Set background color to white */}
        <header className="mb-6 text-center">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-1">{investment.propertyType}</h1>
          <h2 className="text-xl text-gray-600">{investment.location}</h2>
        </header>

        <img src={investment.image} alt={investment.propertyType} className="w-full h-64 object-cover rounded-lg mb-6" /> {/* Reduced image height */}

        <section className="mb-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Property Details</h3>
          <p className="text-gray-700"><strong>Square Footage:</strong> {investment.squareFootage}</p>
          <p className="text-gray-700"><strong>Bedrooms:</strong> {investment.bedrooms} <strong>Bathrooms:</strong> {investment.bathrooms}</p>
          <p className="text-gray-700"><strong>Potential Return:</strong> {investment.potentialReturn}</p>
          <p className="text-gray-700"><strong>Projected Appreciation:</strong> {investment.projectedAppreciation}</p>
        </section>

        <section>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Description</h3>
          <p className="text-gray-600">{investment.description}</p>
        </section>

        <section className="mt-8 mb-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Investment Returns Over the Last 8 Years</h3>
          <Line data={data} options={options} />
        </section>

        <div className="text-center mt-6">
          <button className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200">
            Contact Us for More Information
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvestmentPage1;
