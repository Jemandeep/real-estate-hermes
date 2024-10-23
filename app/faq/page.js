// pages/FAQ.js

import React from 'react';

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
    // Add more FAQs as needed
  ];

  return (
    <div className="container mx-auto p-6">
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
  );
};

export default FAQ;
