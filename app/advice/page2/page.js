// pages/page2.js
"use client";
import React from 'react';
import NavBar from '@/app/components/NavBar';

const Page2 = () => {
  const tips = [
    {
      title: "Buying a Home: Start with a Budget",
      description: "Before you begin house hunting, it's essential to determine your budget. Factor in your income, expenses, and potential mortgage rates.",
      imageSrc: "https://via.placeholder.com/300", // Placeholder image
    },
    {
      title: "Get Pre-Approved for a Mortgage",
      description: "A pre-approval gives you a clearer idea of what you can afford, streamlining the buying process when you find the right home.",
      imageSrc: "https://via.placeholder.com/300",
    },
    {
      title: "Research Neighborhoods",
      description: "Take the time to research different neighborhoods. Consider factors like schools, amenities, and proximity to work.",
      imageSrc: "https://via.placeholder.com/300",
    },
    {
      title: "Hire a Real Estate Agent",
      description: "An experienced agent can provide invaluable insights, negotiate on your behalf, and help navigate the complexities of the market.",
      imageSrc: "https://via.placeholder.com/300",
    },
  ];

  return (
    <>
      <NavBar />
      <div className="container mx-auto p-10 pt-32">
        <h1 className="text-3xl font-bold mb-4">Buying and Selling Tips</h1>
        <p className="text-lg mb-4">
          Here are some essential tips to help you navigate the buying and selling process effectively:
        </p>
        <div className="flex flex-col space-y-6">
          {tips.map((tip, index) => (
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

export default Page2;
