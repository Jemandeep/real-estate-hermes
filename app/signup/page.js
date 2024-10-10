"use client";
import { useRouter } from "next/navigation";
import Layout from "../components/Layout"; // Ensure this is the correct path to your Layout component

export default function SignupChoice() {
  const router = useRouter();

  const handleUserSignup = () => {
    router.push("/signup/user");
  };

  const handleAgentSignup = () => {
    router.push("/signup/agent");
  };

  return (
    <Layout> 
      <div className="flex items-center justify-center min-h-screen bg-gray-100 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
          {/* Regular User Card */}
          <div
            onClick={handleUserSignup}
            className="cursor-pointer flex flex-col items-center justify-center p-10 bg-white rounded-lg shadow-md transition-transform transform hover:scale-105 duration-300 ease-in-out"
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Regular User</h2>
            <p className="text-gray-600 text-center">
              Sign up as a regular user to explore listings and save properties.
            </p>
          </div>

          {/* Agent Card */}
          <div
            onClick={handleAgentSignup}
            className="cursor-pointer flex flex-col items-center justify-center p-10 bg-white rounded-lg shadow-md transition-transform transform hover:scale-105 duration-300 ease-in-out"
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Agent</h2>
            <p className="text-gray-600 text-center">
              Sign up as an agent to list properties and manage your clients.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
