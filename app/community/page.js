"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // For App Router
import Link from "next/link";
import Layout from "../components/Layout";
import {
  FiMessageSquare,
  FiStar,
  FiBarChart2,
} from "react-icons/fi"; // Icons
import { getAuth, onAuthStateChanged } from "firebase/auth"; // Firebase Auth
import Image from "next/image"; // For optimized image handling

// Reusable Card Component
const CommunityCard = ({ href, ariaLabel, icon, title, description }) => (
  <Link href={href} aria-label={ariaLabel} className="w-full">
    <div className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl cursor-pointer transition duration-200 transform hover:scale-105 w-full">
      <div className="flex items-center mb-4">
        {icon}
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
      </div>
      <p className="text-gray-600">{description}</p>
    </div>
  </Link>
);

const CommunityPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoading(false);
      } else {
        router.push("/login");
      }
    });
    return () => unsubscribe();
  }, [router]);

  if (loading)
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <p className="text-xl">Loading...</p>
        </div>
      </Layout>
    );

  return (
    <Layout>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">Community Page</h1>

        <div className="flex items-center justify-center space-x-6">
          {/* Left Image */}
          <div className="hidden lg:block w-1/2">
            <Image
              src="/images/rb_2150618988.png" // Replace with the correct path to your left image
              alt="Left Image"
              width={800}
              height={1000}
              className="rounded-lg "
            />
          </div>

          {/* Tabs Section */}
          <div className="w-full lg:w-1/2 flex flex-col space-y-6">
            {/* Discussion Forum Card */}
            <CommunityCard
              href="/community/discussion"
              ariaLabel="Discussion Forum"
              icon={<FiMessageSquare className="text-2xl text-gray-800 mr-3" />}
              title="Discussion Forum"
              description="Join discussions on real estate topics, neighborhoods, and property trends."
            />

            {/* Discuss Properties Card */}
            <CommunityCard
              href="/community/property"
              ariaLabel="Discuss Properties"
              icon={<FiStar className="text-2xl text-gray-800 mr-3" />}
              title="Discuss Properties"
              description="Talk particularly about properties."
            />

            {/* Polls Card */}
            <CommunityCard
              href="/community/polls"
              ariaLabel="Polls"
              icon={<FiBarChart2 className="text-2xl text-gray-800 mr-3" />}
              title="Polls"
              description="Participate in polls created by agents and share your feedback with the community."
            />
          </div>

          {/* Right Image */}
          <div className="hidden lg:block w-1/2">
            <Image
              src="/images/rb_2150618988.png" // Replace with the correct path to your right image
              alt="Right Image"
              width={800}
              height={1000}
              className="rounded-lg"
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CommunityPage;
