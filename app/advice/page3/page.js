"use client";
import React from "react";
import { useRouter } from "next/navigation"; // Updated for Next.js app directory
import NavBar from "@/app/components/NavBar";

const Page3 = () => {
  const router = useRouter(); // Correct usage in a client component

  const firstTimeBuyerTips = [
    {
      title: "Understand the Buying Process",
      description: "Familiarize yourself with the steps involved in buying a home, from searching to closing the deal.",
      imageSrc: "/images/p31.jpg", // Updated path
      page: "/advice/page3/page1", // Add the link to navigate
    },
    {
      title: "Know Your Financing Options",
      description: "Explore different financing options, including FHA loans and first-time buyer programs that can help reduce your costs.",
      imageSrc: "/images/p32.jpg", // Updated path
      page: "/advice/page3/page2", // Add the link to navigate
    },
    {
      title: "Stay Within Your Budget",
      description: "It's easy to get carried away when house hunting. Stick to your budget to avoid financial strain.",
      imageSrc: "/images/p33.jpg", // Assuming another image for this tip
      page: "/advice/page3/page3", // Add the link to navigate
    },
    {
      title: "Hire a Home Inspector",
      description: "A home inspection can uncover hidden issues with the property, saving you from unexpected costs in the future.",
      imageSrc: "/images/p34.jpg", // New image for this tip
      page: "/advice/page3/page4", // Add the link to navigate
    },
    {
      title: "Understand Closing Costs",
      description: "Don't forget about closing costs. These can include appraisal fees, title insurance, and other expenses that aren't part of the home price.",
      imageSrc: "/images/p35.jpg", // New image for this tip
      page: "/advice/page3/page5", // Add the link to navigate
    },
  ];

  const handleCardClick = (page) => {
    router.push(page); // Navigate to the respective page
  };

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
                <div
                    key={index}
                    className="flex items-center bg-white rounded-lg shadow-lg p-4 cursor-pointer hover:shadow-2xl transition-shadow"
                    onClick={() => handleCardClick(tip.page)} // Add onClick handler to navigate
                >
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
