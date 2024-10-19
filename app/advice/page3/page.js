// pages/page3.js
"use client";
import React from 'react';
import NavBar from '@/app/components/NavBar';

const Page3 = () => {
  const firstTimeBuyerTips = [
    {
      title: "Understand the Buying Process",
      description: "Familiarize yourself with the steps involved in buying a home, from searching to closing the deal.",
      imageSrc: "https://via.placeholder.com/300", // Placeholder image
    },
    {
      title: "Know Your Financing Options",
      description: "Explore different financing options, including FHA loans and first-time buyer programs that can help reduce your costs.",
      imageSrc: "https://via.placeholder.com/300",
    },
    {
      title: "Don't Skip the Home Inspection",
      description: "A thorough home inspection can save you from unexpected repairs after purchase. Always have a professional inspect the property.",
      imageSrc: "https://via.placeholder.com/300",
    },
    {
      title: "Stay Within Your Budget",
      description: "It's easy to get carried away when house hunting. Stick to your budget to avoid financial strain.",
      imageSrc: "https://via.placeholder.com/300",
    },
  ];

  return (
    <>
      <NavBar />
      <div className="container mx-auto p-10 pt-32">
        <h1 className="text-3xl font-bold mb-4">First Time Buyers</h1>
        <p className="text-lg mb-4">
          Here are some key tips for first-time homebuyers to make the process smoother:
        </p>
        <div className="flex flex-col space-y-6">
          {firstTimeBuyerTips.map((tip, index) => (
            <div key={index} className="flex items-center bg-white rounded-lg shadow-lg p-4">
              <img className="w-1/3 h-48 object-cover rounded-lg" src={tip.imageSrc} alt={tip.title} />
              <div className="ml-4">
                <h2 className="text-xl font-bold">{tip.title}</h2>
                <p className="text-gray-700">{tip.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Page3;
