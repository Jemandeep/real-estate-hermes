"use client";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import Image from "next/image";

import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import Layout from "../../components/Layout";
import dynamic from "next/dynamic";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Dynamically import Chart.js Line chart
const Chart = dynamic(() => import("react-chartjs-2").then((mod) => mod.Line), { ssr: false });

const DetailedListing = () => {
  const [listing, setListing] = useState(null);
  const [agent, setAgent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  useEffect(() => {
    const fetchListing = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, "listings", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setListing({ id: docSnap.id, ...data });

          // Fetch agent details
          if (data.agent_name) {
            const agentRef = doc(db, "users", data.agent_name);
            const agentSnap = await getDoc(agentRef);
            if (agentSnap.exists()) {
              setAgent(agentSnap.data());
            }
          }
        } else {
          setError("Listing not found.");
        }
      } catch (err) {
        setError("Error fetching listing details.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <h2 className="text-xl font-bold text-gray-700">Loading Detailed Listing...</h2>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (!listing) {
    return <div className="text-center">No listing found.</div>;
  }

  const renderPriceChart = () => {
    const labels = listing.prices.map((price) => price.month);
    const data = listing.prices.map((price) => parseFloat(price.price));

    return {
      labels,
      datasets: [
        {
          label: "Price History",
          data,
          borderColor: "#205295",
          backgroundColor: "rgba(32, 82, 149, 0.2)",
          fill: true,
        },
      ],
    };
  };

  return (
    <Layout>
      <div className="container mx-auto p-6 bg-white">
        {/* Address Section */}
        <h1 className="text-4xl font-extrabold text-center text-[#0A2647] mb-10 pt-8">
          {listing.address}
        </h1>

                  ``<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column: Carousel */}
            <div className="w-full h-full rounded-lg overflow-hidden border-2 border-[#144272]">
              <Swiper
                spaceBetween={10}
                slidesPerView={1}
                loop={true}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                pagination={{ clickable: true }}
                navigation={true}
                className="w-full h-full"
              >
                {listing.images && listing.images.length > 0 ? (
                  listing.images.map((image, index) => (
                    <SwiperSlide key={index} className="flex justify-center items-center">
  <Image
    src={image}
    alt={`Image ${index + 1}`}
    width={100}
    height={100}
    className="object-cover rounded"
  />
</SwiperSlide>

                  ))
                ) : (
                  <SwiperSlide className="flex justify-center items-center bg-gray-100">
                    <p className="text-center text-[#144272]">No images available for this listing.</p>
                  </SwiperSlide>
                )}
              </Swiper>
            </div>

            {/* Right Column: Details */}
            <div className="grid grid-cols-2 gap-6 text-3xl font-bold text-black bg-[#f9f9f9] p-6 rounded-lg shadow">
              <div>
                <p className="font-bold text-lg">Bathrooms:</p>
                <p>{listing.bathroom_count}</p>
              </div>
              <div>
                <p className="font-bold text-lg">Bedrooms:</p>
                <p>{listing.bed_count}</p>
              </div>
              <div>
                <p className="font-bold text-lg">Price:</p>
                <p>${parseInt(listing.current_price).toLocaleString()}</p>
              </div>
              <div>
                <p className="font-bold text-lg">Neighborhood:</p>
                <p>{listing.neighborhood}</p>
              </div>
              <div>
                <p className="font-bold text-lg">Property Type:</p>
                <p>{listing.property_type}</p>
              </div>
            </div>
          </div>``

        {/* Summary Section */}
        <div className="bg-[#144272] text-white shadow-lg rounded-lg p-6 mt-10">
          <h2 className="text-3xl font-bold mb-4">Property Summary</h2>
          <p>{listing.summary || "No summary available."}</p>
        </div>

        {/* Price History Section */}
        <div className="bg-white text-white shadow-lg rounded-lg p-6 mt-10">
          <h2 className="text-2xl font-bold mb-4">Price History</h2>
          <Chart data={renderPriceChart()} />
        </div>

        {/* Agent Details */}
        {agent && (
          <div className="bg-[#205295] text-white shadow-lg rounded-lg p-6 mt-10">
            <h2 className="text-2xl font-bold mb-4">Agent Details</h2>
            <div className="space-y-4">
              <div>
                <p className="font-bold">Name:</p>
                <p>{agent.name}</p>
              </div>
              <div>
                <p className="font-bold">Email:</p>
                <p>{agent.email}</p>
              </div>
              <div>
                <p className="font-bold">Phone Number:</p>
                <p>{agent.phoneNumber}</p>
              </div>
              <div>
                <p className="font-bold">LinkedIn:</p>
                <p>{agent.linkedIn || "Not available"}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default DetailedListing;
