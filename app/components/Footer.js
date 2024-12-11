// components/Footer.js

import React from "react";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";
import Link from "next/link";

const Footer = () => {
  console.log("Footer rendered"); // Debug message

  return (
    <footer className="bg-white text-gray-800 py-10">
      <div className="container mx-auto text-center">
        <div className="mb-4">
          <h2 className="text-2xl font-bold">Calgary Real Estate</h2>
          <p className="text-gray-600">
            Helping you find your dream home with ease and confidence.
          </p>
        </div>
        <div className="flex justify-center space-x-4 mb-6">
          <Link
            href="/analysis"
            className="text-gray-600 hover:text-blue-500 transition duration-200"
          >
            Analysis
          </Link>
          <Link
            href="/viewListings"
            className="text-gray-600 hover:text-blue-500 transition duration-200"
          >
            Listings
          </Link>
          <Link
            href="/advice"
            className="text-gray-600 hover:text-blue-500 transition duration-200"
          >
            Advice
          </Link>
          <Link
            href="/mortcalculator"
            className="text-gray-600 hover:text-blue-500 transition duration-200"
          >
            Calculator
          </Link>
          <Link
            href="/rent"
            className="text-gray-600 hover:text-blue-500 transition duration-200"
          >
            Rent
          </Link>
          <Link
            href="/bookappointment"
            className="text-gray-600 hover:text-blue-500 transition duration-200"
          >
            Book Appointment
          </Link>
          <Link
            href="/investment"
            className="text-gray-600 hover:text-blue-500 transition duration-200"
          >
            Investment
          </Link>
          <Link
            href="/faq"
            className="text-gray-600 hover:text-blue-500 transition duration-200"
          >
            FAQ
          </Link>
          <Link
            href="/login"
            className="text-gray-600 hover:text-blue-500 transition duration-200"
          >
            login
          </Link>
        </div>
        <div className="flex justify-center space-x-4 mb-6">
          <a
            href="https://github.com/Jemandeep/real-estate-hermes"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-blue-500 transition duration-200"
          >
            <FaFacebook size={24} />
          </a>
          <a
            href="https://github.com/Jemandeep/real-estate-hermes"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-blue-500 transition duration-200"
          >
            <FaTwitter size={24} />
          </a>
          <a
            href="https://github.com/Jemandeep/real-estate-hermes"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-blue-500 transition duration-200"
          >
            <FaInstagram size={24} />
          </a>
        </div>
        <div className="text-gray-600">
          <p>
            &copy; {new Date().getFullYear()} Calgary Real Estate. All Rights
            Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
