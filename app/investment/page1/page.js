"use client";
import React, { useState } from 'react';
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
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility
  const [email, setEmail] = useState(''); // State for email input
  const [thankYouMessageVisible, setThankYouMessageVisible] = useState(false); // State for thank you message visibility

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
    image: '/images/ih1.jpg',
    investmentReturns: [5, 8, 6, 10, 7, 12, 9, 11],
    years: ['2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023'],
  };

  const data = {
    labels: investment.years,
    datasets: [
      {
        label: 'Investment Returns (%)',
        data: investment.investmentReturns,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
        tension: 0.3,
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

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEmail(''); // Reset the email input when closing
    setThankYouMessageVisible(false); // Hide the thank you message
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    console.log('Email submitted:', email); // For demonstration

    // Show the thank you message
    setThankYouMessageVisible(true);
    setIsModalOpen(false); // Close the modal
  };

  return (
    <div>
      <NavBar />
      <div className="container mx-auto p-6 pt-16 bg-white">
        <header className="mb-6 text-center">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-1">{investment.propertyType}</h1>
          <h2 className="text-xl text-gray-600">{investment.location}</h2>
        </header>

        <img src={investment.image} alt={investment.propertyType} className="w-full h-64 object-cover rounded-lg mb-6" />

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
          <button onClick={handleOpenModal} className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200">
            Contact Us for More Information
          </button>
        </div>

        {/* Thank You Message Pop-out */}
        {thankYouMessageVisible && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm">
              <h2 className="text-xl font-bold mb-4">Thank You!</h2>
              <p>We appreciate your submission. We will get in touch with you soon.</p>
              <div className="flex justify-end mt-4">
                <button onClick={() => setThankYouMessageVisible(false)} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200">
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal for Email Submission */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm mx-auto">
            <h2 className="text-xl font-bold mb-4">Get in Touch</h2>
            <p className="mb-4">We'd love to hear from you! Please enter your email address:</p>
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border border-gray-300 rounded w-full p-2 mb-4"
                required
              />
              <div className="flex justify-end">
                <button type="button" onClick={handleCloseModal} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition duration-200 mr-2">
                  Close
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvestmentPage1;
