"use client";
import React, { useEffect, useState } from "react";
import { db } from "../../firebase"; // Import your Firebase configuration
import { doc, getDoc } from "firebase/firestore"; // Firestore methods
import { useSearchParams } from "next/navigation"; // For accessing query parameters
import NavBar from "../components/NavBar";

const Compare = () => {
  const [properties, setProperties] = useState([]); // State for fetched properties
  const [error, setError] = useState(null); // Error state
  const [loading, setLoading] = useState(true); // Loading state

  const searchParams = useSearchParams(); // Get query parameters
  const ids = searchParams.get("ids") ? searchParams.get("ids").split(",") : []; // Parse IDs from query params

  // Fetch properties based on IDs
  useEffect(() => {
    const fetchProperties = async () => {
      if (ids.length < 2) {
        setError("Please select at least two properties to compare.");
        setLoading(false);
        return;
      }

      try {
        const fetchedProperties = await Promise.all(
          ids.map(async (id) => {
            const docRef = doc(db, "listings", id); // Reference to the document
            const docSnap = await getDoc(docRef); // Fetch document
            return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null; // Return data if exists
          })
        );

        const validProperties = fetchedProperties.filter(Boolean); // Filter out null values
        if (validProperties.length > 0) {
          setProperties(validProperties);
          setError(null); // Clear error state if successful
        } else {
          setError("None of the selected properties could be found.");
        }
      } catch (error) {
        console.error("Error fetching properties:", error);
        setError("Failed to fetch properties.");
      } finally {
        setLoading(false); // Ensure loading is false after fetching
      }
    };

    fetchProperties();
  }, [ids]); // Runs when `ids` changes

  return (
    <>
      <NavBar />
      <div className="container mx-auto p-4 pt-32">
        <h1 className="text-2xl font-bold mb-4">Compare Properties</h1>

        {/* Show loading state */}
        {loading && <p className="text-gray-500">Loading properties...</p>}

        {/* Show error message */}
        {error && !loading && <p className="text-red-600">{error}</p>}

        {/* Show properties if fetched */}
        {!loading && !error && properties.length > 0 && (
          <div className="border rounded shadow p-4 bg-gray-50">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2 text-left">Feature</th>
                  {properties.map((property) => (
                    <th key={property.id} className="border p-2 text-left">
                      {property.address || "Unknown Address"}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2">Neighborhood</td>
                  {properties.map((property) => (
                    <td key={property.id} className="border p-2">
                      {property.neighborhood || "N/A"}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="border p-2">Type</td>
                  {properties.map((property) => (
                    <td key={property.id} className="border p-2">
                      {property.property_type || "N/A"}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="border p-2">Price</td>
                  {properties.map((property) => (
                    <td key={property.id} className="border p-2">
                      ${property.current_price?.toLocaleString() || "N/A"}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="border p-2">Beds</td>
                  {properties.map((property) => (
                    <td key={property.id} className="border p-2">
                      {property.bed_count || "N/A"}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="border p-2">Baths</td>
                  {properties.map((property) => (
                    <td key={property.id} className="border p-2">
                      {property.bathroom_count || "N/A"}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Message if no properties are available */}
        {!loading && !error && properties.length === 0 && (
          <p>No properties available for comparison.</p>
        )}
      </div>
    </>
  );
};

export default Compare;
