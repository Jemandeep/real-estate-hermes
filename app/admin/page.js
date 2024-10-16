
"use client";
import Link from "next/link";
import Layout from "../components/Layout";
import { FiHome, FiUsers, FiUserCheck } from "react-icons/fi"; // Import icons

const AdminPage = () => {
  return (
    <Layout>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Manage Listings Card */}
          <Link href="/admin/manageListings" aria-label="Manage Listings">
            <div className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl cursor-pointer transition duration-200 transform hover:scale-105">
              <div className="flex items-center mb-4">
                <FiHome className="text-2xl text-gray-800 mr-3" /> {/* Icon */}
                <h2 className="text-xl font-bold text-gray-800">Manage Listings</h2>
              </div>
              <p className="text-gray-600">View, edit, approve, or delete property listings posted by agents.</p>
            </div>
          </Link>

          {/* Manage Users Card */}
          <Link href="/admin/manageUsers" aria-label="Manage Users">
            <div className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl cursor-pointer transition duration-200 transform hover:scale-105">
              <div className="flex items-center mb-4">
                <FiUsers className="text-2xl text-gray-800 mr-3" /> {/* Icon */}
                <h2 className="text-xl font-bold text-gray-800">Manage Users</h2>
              </div>
              <p className="text-gray-600">View, promote, or block users. Manage roles like admin and agent.</p>
            </div>
          </Link>

          {/* Manage Agents Card */}
          <Link href="/admin/manageAgents" aria-label="Manage Agents">
            <div className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl cursor-pointer transition duration-200 transform hover:scale-105">
              <div className="flex items-center mb-4">
                <FiUserCheck className="text-2xl text-gray-800 mr-3" /> {/* Icon */}
                <h2 className="text-xl font-bold text-gray-800">Manage Agents</h2>
              </div>
              <p className="text-gray-600">Approve or reject agent applications. Manage agent profiles and performance.</p>
            </div>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default AdminPage;