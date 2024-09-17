"use client";

import NavBar from './components/NavBar';
import Header from './components/Header';

const listings = [
  {
    location: "123 Maple St, Calgary, AB",
    bedrooms: 4,
    bathrooms: 3,
    area: "2500 sqft",
    description: "A spacious 4-bedroom house in a quiet neighborhood with a large backyard.",
    imageUrl: "https://via.placeholder.com/300x200"
  },
  {
    location: "456 Oak St, Vancouver, BC",
    bedrooms: 3,
    bathrooms: 2,
    area: "1800 sqft",
    description: "A modern 3-bedroom house located in the heart of Vancouver with easy access to public transit.",
    imageUrl: "https://via.placeholder.com/300x200"
  },
  {
    location: "789 Pine Ave, Toronto, ON",
    bedrooms: 4,
    bathrooms: 3,
    area: "2200 sqft",
    description: "A family-friendly 4-bedroom home with a finished basement and modern appliances.",
    imageUrl: "https://via.placeholder.com/300x200"
  }
];

export default function HomePage() {
  return (
    <div className="overflow-y-auto h-screen">
      {/* Navigation Bar */}
      <NavBar />

      {/* Header with Buttons */}
      <Header />

      

      {/* Listings Section */}
      <div className="container mx-auto py-10 px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {listings.map((listing, index) => (
          <div key={index} className="border rounded-lg shadow-lg p-4 bg-white">
            <img src={listing.imageUrl} alt={listing.location} className="w-full h-40 object-cover mb-4" />
            <h2 className="text-xl font-bold mb-2 text-gray-800">{listing.location}</h2>
            <p className="mb-2 text-gray-700">🛏️ {listing.bedrooms} Bedrooms | 🛁 {listing.bathrooms} Bathrooms</p>
            <p className="mb-2 text-gray-700">📏 {listing.area}</p>
            <p className="text-sm text-gray-600">{listing.description}</p>
            <div className="mt-4">
              <a href="#" className="text-blue-500 hover:underline">View Details</a>
            </div>
          </div>
        ))}
      </div>
      {/* Vision Section */}
      <div className="bg-stone-500 text-white px-40 py-40 text-center">
        
        <h2 className="text-3xl font-bold mb-4 text-white-800">Our Vision</h2>
        <p className="text-lg text-white-600 max-w-3xl mx-auto">
          At Calgary Real Estate, our vision is to help you discover your dream home with ease and confidence. We aim to provide you with the most accurate and up-to-date property listings, ensuring that you have all the tools you need to make informed decisions about your future home. With a wide range of properties in various locations, we are dedicated to offering you the best real estate experience.
        </p>
      </div>
    </div>
    
  );
}
