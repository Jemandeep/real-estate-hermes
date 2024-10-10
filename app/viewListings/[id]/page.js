"use client";
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation'; // To get the query parameters
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase'; // Make sure this path is correct
import Layout from '../../components/Layout';

const DetailedListing = () => {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const searchParams = useSearchParams();
  const id = searchParams.get('id'); // Get the id from query parameters

  useEffect(() => {
    const fetchListing = async () => {
      if (!id) return; // Ensure we have the id before fetching
      try {
        const docRef = doc(db, 'listings', id); // Reference to the document in Firestore
        const docSnap = await getDoc(docRef); // Fetch the document

        if (docSnap.exists()) {
          setListing({ id: docSnap.id, ...docSnap.data() }); // Set listing data in state
        } else {
          setError('Listing not found.');
        }
      } catch (err) {
        setError('Error fetching listing details.');
        console.error(err);
      } finally {
        setLoading(false); // Set loading to false once fetching is complete
      }
    };

    fetchListing();
  }, [id]); // Fetch the listing when the id changes

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <h2 className="text-xl font-bold">Loading Detailed Listing...</h2>
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!listing) {
    return <div>No listing found.</div>;
  }

  // Function to handle both old and new price formats
  const renderPriceHistory = () => {
    if (Array.isArray(listing.prices)) {
      // If the prices are stored as an array of objects (new format)
      return listing.prices.map((price, index) => (
        <li key={index} className="text-sm text-gray-700 mb-2">
          {price.month}: ${parseInt(price.price).toLocaleString()}
        </li>
      ));
    } else {
      // If the prices are stored as separate fields (old format with 'months')
      return Object.entries(listing)
        .filter(([key]) => key.includes('price_') && key.includes('_months')) // Only process keys that include 'price_' and 'months'
        .map(([key, value]) => (
          <li key={key} className="text-sm text-gray-700 mb-2">
            {key.replace(/_/g, ' ').replace('price ', 'Price for ')}: ${parseInt(value).toLocaleString()}
          </li>
        ));
    }
  };

  return (
    <Layout>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-8">
          {listing.address}
        </h1>

        {/* Display Main Listing Info */}
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
          <p className="text-lg font-bold text-gray-800 mb-2">
            Address: {listing.address}
          </p>
          <p className="text-sm text-gray-700 mb-2">
            Neighborhood: {listing.neighborhood}
          </p>
          <p className="text-sm text-gray-700 mb-2">
            Bedrooms: {listing.bed_count}
          </p>
          <p className="text-sm text-gray-700 mb-2">
            Bathrooms: {listing.bathroom_count}
          </p>
          <p className="text-sm text-gray-700 mb-2">
            Property Type: {listing.property_type}
          </p>
          <p className="text-sm text-gray-700 mb-2">
            Current Price: ${parseInt(listing.current_price).toLocaleString()}
          </p>
        </div>

        {/* Display Price History */}
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Price History</h2>
          <ul className="list-disc list-inside">
            {renderPriceHistory()}
          </ul>
        </div>

        {/* Display Summary */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Property Summary</h2>
          <p className="text-sm text-gray-700">
            {listing.summary ? listing.summary : "No summary available."}
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default DetailedListing;
