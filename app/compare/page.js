"use client";
import React, { useEffect, useState } from 'react';
import { db } from '../../firebase'; // Import your Firebase configuration
import { doc, getDoc } from 'firebase/firestore'; // Firestore methods
import { useSearchParams } from 'next/navigation'; // For accessing query parameters
import NavBar from '../components/NavBar';

const Compare = () => {
  const [properties, setProperties] = useState([]); // State for fetched properties
  const [error, setError] = useState(null); // Error state

  const searchParams = useSearchParams(); // Get query parameters
  const ids = searchParams.get('ids') ? searchParams.get('ids').split(',') : []; // Parse IDs from query params

  // Fetch properties based on IDs
  useEffect(() => {
    const fetchProperties = async () => {
      if (ids.length !== 2) {
        setError('Please select exactly two properties to compare.');
        return;
      }

      try {
        const fetchedProperties = await Promise.all(
          ids.map(async (id) => {
            const docRef = doc(db, 'listings', id); // Reference to the document
            const docSnap = await getDoc(docRef); // Fetch document
            return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null; // Return data if exists
          })
        );

        const validProperties = fetchedProperties.filter(Boolean); // Filter out null values
        setProperties(validProperties); // Set properties state
        setError(null); // Clear error state if successful
      } catch (error) {
        console.error('Error fetching properties:', error);
        setError('Failed to fetch properties.'); // Set error if fetching fails
      }
    };

    fetchProperties();
  }, [ids]); // Runs when `ids` changes

  return (
    <>
      <NavBar />
      <div className="container mx-auto p-4 pt-32">
        <h1 className="text-2xl font-bold mb-4">Compare Properties</h1>

        {error && <p className="text-red-600">{error}</p>} {/* Show error message */}

        {properties.length === 2 ? ( // Show properties if exactly two are fetched
          <div className="border rounded shadow p-4 bg-gray-50"> {/* Light background for the table */}
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2 text-left">Feature</th>
                  <th className="border p-2 text-left">{properties[0].address}</th>
                  <th className="border p-2 text-left">{properties[1].address}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2">Neighborhood</td>
                  <td className="border p-2">{properties[0].neighborhood}</td>
                  <td className="border p-2">{properties[1].neighborhood}</td>
                </tr>
                <tr>
                  <td className="border p-2">Type</td>
                  <td className="border p-2">{properties[0].property_type}</td>
                  <td className="border p-2">{properties[1].property_type}</td>
                </tr>
                <tr>
                  <td className="border p-2">Price</td>
                  <td className="border p-2">${properties[0].current_price.toLocaleString()}</td>
                  <td className="border p-2">${properties[1].current_price.toLocaleString()}</td>
                </tr>
                <tr>
                  <td className="border p-2">Beds</td>
                  <td className="border p-2">{properties[0].bed_count}</td>
                  <td className="border p-2">{properties[1].bed_count}</td>
                </tr>
                <tr>
                  <td className="border p-2">Baths</td>
                  <td className="border p-2">{properties[0].bathroom_count}</td>
                  <td className="border p-2">{properties[1].bathroom_count}</td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : ( // Message if properties are not exactly two
          <p>No properties available for comparison.</p>
        )}
      </div>
    </>
  );
};

export default Compare;
