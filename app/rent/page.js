"use client";
import React from 'react';
import NavBar from '@/app/components/NavBar';

const properties = [
  {
    address: "123 Example St",
    neighborhood: "Beltline",
    property_type: "Cozy Apartment",
    current_price: 350000,
    bathroom_count: "2",
    bed_count: "3"
  },
  {
    address: "456 Example Ave",
    neighborhood: "Kensington",
    property_type: "Luxury Villa",
    current_price: 650000,
    bathroom_count: "3",
    bed_count: "4"
  },
  // Add more properties as needed
];

const Rent = () => {
  const handleRentNow = (property) => {
    // Redirect to the payment page
    window.location.href = `/rent/payment`;
  };
  

  return (
    <>
      <NavBar />
      <div className="container mx-auto p-10 pt-32">
        <h1 className="text-3xl font-bold mb-4">Available Rentals</h1>
        <div className="flex flex-col space-y-6">
          {properties.map((property, index) => (
            <div key={index} className="flex items-center justify-between bg-white rounded-lg shadow-lg p-4">
              <div className="ml-4">
                <h2 className="text-xl font-bold">{property.property_type}</h2>
                <p className="text-gray-700">Address: {property.address}</p>
                <p className="text-gray-700">Neighborhood: {property.neighborhood}</p>
                <p className="text-gray-700">Price: ${property.current_price}</p>
                <p className="text-gray-700">Bedrooms: {property.bed_count}</p>
                <p className="text-gray-700">Bathrooms: {property.bathroom_count}</p>
              </div>
              <button 
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                onClick={() => handleRentNow(property)}
              >
                Rent Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Rent;
