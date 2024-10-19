"use client";
import React from 'react';
import NavBar from '@/app/components/NavBar';

const Payment = () => {
  const handlePayment = () => {
    // Simulate a payment process
    alert("Payment processed successfully!");
    // Redirect to the homepage after payment
    window.location.href = '/'; // Change this to '/' for the homepage
  };

  return (
    <>
      <NavBar />
      <div className="container mx-auto p-10 pt-32">
        <h1 className="text-3xl font-bold mb-4">Payment Page</h1>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">Complete Your Rental Payment</h2>
          <p className="mb-4">Please confirm the payment details below:</p>
          <div className="border p-4 mb-4">
            <p><strong>Property:</strong> Cozy Apartment</p>
            <p><strong>Rent Amount:</strong> $1,500</p>
            <p><strong>Payment Method:</strong></p>
            <ul>
              <li>Credit Card</li>
              <li>PayPal</li>
            </ul>
          </div>
          <button 
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
            onClick={handlePayment}
          >
            Confirm Payment
          </button>
        </div>
      </div>
    </>
  );
};

export default Payment;
