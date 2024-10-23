// components/Footer.js

import React from "react";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-10">
      <div className="container mx-auto text-center">
        <div className="mb-4">
          <h2 className="text-2xl font-bold">Calgary Real Estate</h2>
          <p className="text-gray-400">
            Helping you find your dream home with ease and confidence.
          </p>
        </div>
        <div className="flex justify-center space-x-4 mb-6">
          <a
            href="https://github.com/Jemandeep/real-estate-hermes"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition duration-200"
          >
            <FaFacebook size={24} />
          </a>
          <a
            href="https://github.com/Jemandeep/real-estate-hermes"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition duration-200"
          >
            <FaTwitter size={24} />
          </a>
          <a
            href="https://github.com/Jemandeep/real-estate-hermes"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition duration-200"
          >
            <FaInstagram size={24} />
          </a>
        </div>
        <div className="text-gray-400">
          <p>&copy; {new Date().getFullYear()} Calgary Real Estate. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
