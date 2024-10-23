// pages/FAQ.js
"use client"
import React from 'react';
import NavBar from '../components/NavBar'; // Adjust the path if necessary

const FAQ = () => {
  const faqs = [
    {
      question: 'What is Calgary Real Estate?',
      answer: 'Calgary Real Estate is a platform to help you find your dream home with ease and confidence.',
    },
    {
      question: 'How do I create an account?',
      answer: 'You can create an account by clicking on the "Sign Up" button and filling in your details.',
    },
    {
      question: 'How do I reset my password?',
      answer: 'To reset your password, go to the login page and click on "Forgot Password?"',
    },
    {
      question: 'Can I schedule a property visit?',
      answer: 'Yes, you can schedule a property visit by contacting the agent through the property details page.',
    },
    {
      question: 'What types of properties can I find on this platform?',
      answer: 'You can find a variety of properties, including single-family homes, condos, townhouses, and rental listings.',
    },
    {
      question: 'Are there any fees for using Calgary Real Estate?',
      answer: 'Creating an account and browsing listings is free. Some services may have associated fees, which will be clearly stated.',
    },
    {
      question: 'How can I contact an agent?',
      answer: 'You can contact an agent through the contact form on the property details page or by calling the number listed.',
    },
    {
      question: 'Can I save my favorite listings?',
      answer: 'Yes, you can save your favorite listings by clicking the "Save" button on the property details page.',
    },
    {
      question: 'How often are the listings updated?',
      answer: 'Listings are updated regularly to ensure you have access to the latest properties on the market.',
    },
    {
      question: 'Is my personal information safe?',
      answer: 'Yes, we prioritize your privacy and use secure methods to protect your personal information.',
    },
    {
      question: 'What should I do if I encounter a problem?',
      answer: 'If you encounter any issues, please reach out to our support team through the contact page for assistance.',
    },
  ];

  return (
    <div>
      <NavBar />
      <div className="container mx-auto p-6 pt-16">
        <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-8">Frequently Asked Questions</h1>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-gray-100 p-4 rounded-lg shadow">
              <h2 className="font-semibold">{faq.question}</h2>
              <p className="text-gray-700">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
