// app/advice/page.js
"use client"; // Required for using client components

import React from "react";
import Card from "./Card"; // Adjust the import path as needed
import NavBar from "../components/NavBar"; // Adjust the import path as needed

const Advice = () => {
  return (
    <>
      <NavBar />
      <div className="pt-24 min-h-screen bg-gray-50">
        <div className="flex flex-col items-center p-10 space-y-10">
          <h1 className="text-4xl font-extrabold text-stone-700 mb-8">Expert Advice</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl">
            <Card
              imageSrc="/images/logo1.jpg"
              title="House Trends"
              description="Discover the latest house trends and market insights with our expert advice from Canada's top real estate agents."
              link="/advice/page1"
            />
            <Card
              imageSrc="/images/logo2.jpg"
              title="Buying and Selling Tips"
              description="Get essential tips and tricks to navigate the real estate market like a pro, curated by industry experts."
              link="/advice/page2"
            />
            <Card
              imageSrc="/images/logo3.jpg"
              title="First Time Buyers"
              description="Step into the world of real estate with confidence, using our easy-to-follow guide for first-time buyers."
              link="/advice/page3"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Advice;
