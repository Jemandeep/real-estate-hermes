"use client"; // Ensures this component is client-side
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation'; // To get the dynamic route param
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase'; // Adjust the path to your Firebase config
import Layout from '../../components/Layout';

const DetailedListing = () => {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { id } = useParams(); // Get the dynamic id from the route

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

  return (
    <Layout>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-8">
          {listing.address}
        </h1>

        <div className="bg-white shadow-lg rounded-lg p-6">
          <p className="text-lg font-bold text-gray-800 mb-2">
            Address: {listing.address}
          </p>
          <p className="text-sm text-gray-700 mb-2">
            Bedrooms: {listing.bed_count}
          </p>
          <p className="text-sm text-gray-700 mb-2">
            Bathrooms: {listing.bathroom_count}
          </p>
          <p className="text-sm text-gray-700 mb-2">
            Current Price: ${listing.current_price.toLocaleString()}
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default DetailedListing;
