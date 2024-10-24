// pages/page1.js
"use client";
import React from 'react';
import NavBar from '@/app/components/NavBar';

const Page1 = () => {
  const trends = [
    {
      title: "Rise in Remote Work",
      description: "With more companies adopting remote work, buyers are looking for homes with dedicated office spaces and good internet connectivity.",
      imageSrc: "/images/p11.jpg", // Updated path
    },
    {
      title: "Increased Interest in Suburban Living",
      description: "Many buyers are moving away from urban centers to suburbs, seeking more space and a quieter lifestyle.",
      imageSrc: "/images/p12.jpg", // Updated path
    },
    {
      title: "Eco-Friendly Features",
      description: "Homebuyers are increasingly interested in properties with sustainable features, such as solar panels and energy-efficient appliances.",
      imageSrc: "/images/p13.jpg", // Updated path
    },
    {
      title: "Smart Home Technology",
      description: "Integrating technology into homes, such as smart thermostats and security systems, is becoming a major selling point.",
      imageSrc: "/images/p14.jpg", // Updated path
    },
  ];

  return (
    <>
      <NavBar />
      <div className="container mx-auto p-10 pt-32">
        <h1 className="text-3xl font-bold mb-4">House Trends</h1>
        <p className="text-lg mb-4">
          The real estate market is constantly evolving. Staying updated on current trends is crucial for both buyers and sellers. Here are some of the latest trends in the housing market:
        </p>
        <div className="flex flex-col space-y-6">
          {trends.map((trend, index) => (
            <div key={index} className="flex items-center bg-white rounded-lg shadow-lg p-4">
              <img className="w-1/3 h-48 object-cover rounded-lg" src={trend.imageSrc} alt={trend.title} />
              <div className="ml-4">
                <h2 className="text-xl font-bold">{trend.title}</h2>
                <p className="text-gray-700">{trend.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Page1;
