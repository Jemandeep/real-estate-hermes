"use client";
import React from 'react';
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
import NavBar from '../../components/NavBar'; // Updated path for NavBar

// Register the required components
ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend);

const InvestmentPage2 = () => {
  const investment = {
    id: 2,
    propertyType: 'Luxury Condo',
    location: 'Uptown, City B',
    squareFootage: '1,200 sq ft',
    bedrooms: 2,
    bathrooms: 2,
    potentialReturn: '6%',
    projectedAppreciation: '4% per year',
    description: 'Experience upscale living in this luxury condo with breathtaking views of the skyline. Amenities include a fitness center, rooftop pool, and concierge services. Ideal for young professionals and investors alike.',
    image: '/images/ih2.jpg', // Adjusted image size
    investmentReturns: [4, 5, 6, 7, 8, 9, 10, 11], // Investment returns for the last 8 years
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
    <div className="container mx-auto pt-16 p-6 bg-white"> {/* Added pt-16 */}
      <NavBar /> {/* Added NavBar */}
      <header className="mb-6 text-center">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-1">{investment.propertyType}</h1> {/* Reduced font size */}
        <h2 className="text-xl text-gray-600">{investment.location}</h2> {/* Reduced font size */}
      </header>

      <img src={investment.image} alt={investment.propertyType} className="w-full h-64 object-cover rounded-lg mb-6" /> {/* Reduced image height */}

      <section className="mb-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Property Details</h3> {/* Reduced font size */}
        <p className="text-gray-700"><strong>Square Footage:</strong> {investment.squareFootage}</p>
        <p className="text-gray-700"><strong>Bedrooms:</strong> {investment.bedrooms} <strong>Bathrooms:</strong> {investment.bathrooms}</p>
        <p className="text-gray-700"><strong>Potential Return:</strong> {investment.potentialReturn}</p>
        <p className="text-gray-700"><strong>Projected Appreciation:</strong> {investment.projectedAppreciation}</p>
      </section>

      <section>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Description</h3> {/* Reduced font size */}
        <p className="text-gray-600">{investment.description}</p>
      </section>

      <section className="mt-8 mb-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Investment Returns Over the Last 8 Years</h3> {/* Reduced font size */}
        <Line data={data} options={options} />
      </section>

      <div className="text-center mt-6">
        <button className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200">
          Contact Us for More Information
        </button>
      </div>
    </div>
  );
};

export default InvestmentPage2;