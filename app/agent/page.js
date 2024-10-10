// pages/about.js

import React from 'react';
import Layout from '../components/Layout';
export default function About() {
  return (
    <Layout>
    <div className="container mx-auto px-6 py-12">
      <div className="max-w-4xl mx-auto bg-gray-100 p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Successful Home Journeys with Houseful™
        </h1>

        <p className="text-gray-700 mb-6">
          The Houseful™ agent network introduces top-performing agents to homebuyers and sellers, creating lasting connections that continue throughout the home journey.
        </p>

        <p className="text-gray-700 mb-6">
          We’re looking for agents in select areas of Alberta, British Columbia, Manitoba, Newfoundland, and Ontario. Depending on capacity limits, you may be placed on our waitlist. However, we are actively expanding and will reach out as soon as space allows.
        </p>

        <p className="text-gray-700 mb-6">
          <strong>Qualifications:</strong> To qualify, we require 5 years of experience and 10+ transactions in the last 12 months.
        </p>

        <button className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 mb-12">
          Apply Now
        </button>

        <h2 className="text-2xl font-bold mb-4 text-gray-800">Top Talent</h2>
        <p className="text-gray-700 mb-6">
          Houseful is an exclusive, boutique brokerage built for experienced agents and teams committed to responsiveness, effectiveness, and giving customers confidence. We carefully select every member of our brokerage to ensure we’re recruiting entrepreneurial and driven individuals and teams, who are dedicated to serving customers and passionate about growing their business and network.
        </p>

        <h2 className="text-2xl font-bold mb-4 text-gray-800">Qualified Customers</h2>
        <p className="text-gray-700 mb-6">
          Houseful offers a tailored home-search platform, featuring the latest listings and up-to-date market insights to educate customers. Our technology learns customer preferences, delivers customized properties, and enables them to hone their preferences, making them more knowledgeable and ready to buy. For our network of agents, this means access to high-quality introductions and the opportunity to build their client base with qualified customers.
        </p>

        <h2 className="text-2xl font-bold mb-4 text-gray-800">Tools and Support</h2>
        <p className="text-gray-700 mb-6">
          Houseful provides agents with the tools, support, and guidance they need to be successful. A dedicated Houseful Concierge, combined with the agent dashboard, helps agents to build strong client relationships and ensures the home journey keeps moving forward. Houseful is also committed to the development of our team, providing support and training opportunities that allow driven agents and teams to grow.
        </p>

        <h2 className="text-2xl font-bold mb-4 text-gray-800">Apply Now</h2>
        <p className="text-gray-700 mb-6">
          Apply to join our team of hand-selected agents who are committed to fostering more meaningful connections with buyers and sellers to guide them throughout their home journey. Depending on capacity limits, you may be placed on our waitlist. However, we are actively expanding and will reach out as soon as space allows.
        </p>

        <p className="text-gray-700 mb-6">
          <strong>Qualifications:</strong> To qualify, we require 5 years of experience and 15+ transactions in the last 12 months.
        </p>

        <div className="mt-8">
          <form className="space-y-4">
            <div>
              <label className="block text-gray-700">Full Name</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-gray-700">Phone</label>
              <input
                type="tel"
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Enter your phone number"
              />
            </div>

            <div>
              <label className="block text-gray-700">Years in Business</label>
              <input
                type="number"
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Enter your years in business"
              />
            </div>

            <div>
              <label className="block text-gray-700">Service Area</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Enter your service area"
              />
            </div>

            <div>
              <label className="block text-gray-700">Licence Type</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Enter your licence type"
              />
            </div>

            <div className="pt-6">
              <button
                type="submit"
                className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
              >
                Apply Now
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    </Layout>
  );
}
