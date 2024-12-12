"use client";
import { useRouter } from "next/navigation";
import Layout from "../components/Layout"; // Ensure the path to your Layout component is correct

export default function SignupChoice() {
  const router = useRouter();

  const handleUserSignup = () => {
    router.push("/signup/user"); // Navigate to the User Signup page
  };

  const handleAgentSignup = () => {
    router.push("/signup/agent"); // Navigate to the Agent Signup page
  };

  return (
    
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
          {/* Regular User Signup Card */}
          <div
            onClick={handleUserSignup}
            className="cursor-pointer flex flex-col items-center justify-center p-10 bg-white rounded-lg shadow-md transition-transform transform hover:scale-105 duration-300"
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Regular User
            </h2>
            <p className="text-gray-600 text-center">
              Sign up as a regular user to explore listings and save properties.
            </p>
          </div>

          {/* Agent Signup Card */}
          <div
            onClick={handleAgentSignup}
            className="cursor-pointer flex flex-col items-center justify-center p-10 bg-white rounded-lg shadow-md transition-transform transform hover:scale-105 duration-300"
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Agent
            </h2>
            <p className="text-gray-600 text-center">
              Sign up as an agent to list properties and manage your clients.
            </p>
          </div>
        </div>
      </div>
    
  );
}
