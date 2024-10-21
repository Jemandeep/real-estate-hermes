"use client"; // Instructs Next.js to render this file on the client-side

import React, { useState, useEffect } from 'react'; // Import React and hooks for state management and side-effects
import { getDocs, collection } from 'firebase/firestore'; // Firebase functions to fetch documents from Firestore
import { db } from '../../firebase'; // Import Firebase configuration (database instance)
import Layout from '../components/Layout'; // Custom layout component for consistent page structure
import ListingCard from '../components/ListingCard'; // Component to display individual property listing details
import MapComponent from '../components/MapComponent'; // Component to render an interactive map with community data

const Analysis = () => {
  const [listings, setListings] = useState([]); // Store the list of property listings fetched from Firestore
  const [error, setError] = useState(null); // Store any errors that may occur during data fetching

  // useEffect hook to fetch listings from Firestore when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'listings')); 
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id, 
          ...doc.data()
        })); // Extract data from each document, including the document ID for key usage
  
        // Set the listings state with the fetched data (limit to 250 listings for performance)
        setListings(data.slice(0, 250));
      } catch (error) {
        setError(error.message); // Set the error state in case of failure
        console.error('Error fetching data:', error); // Log the error to the console
      }
    };
  
    fetchData(); // Invoke fetchData to load the listings when the component mounts
  }, []); // Empty dependency array ensures this effect runs only once, after the initial render

  return (
    <Layout>
      {/* Remove the box styling */}
      <div className="flex-1">
        <h1 className="text-2xl font-bold mb-4">Property Listings</h1>

        {/* Map component displaying communities and listings */}
        <div className="mb-4">
          <h2 className="text-xl font-bold mb-2">Calgary Communities Map</h2>
          <MapComponent listings={listings} /> {/* Pass listings to the MapComponent */}
        </div>

        {/* Display error message if data fetching fails */}
        {error ? (
          <p className="text-red-600">{error}</p> // Render the error message in red if there's an error
        ) : (
          listings.map((listing) => (
            <ListingCard
              key={listing.id} // Use the listing ID as a key for better performance
              address={listing.address || 'Address not available'} // Provide a fallback for missing address
              neighborhood={listing.neighborhood || 'Neighborhood not available'} // Provide a fallback for missing neighborhood
              propertyType={listing.property_type || 'Type not available'} // Provide a fallback for missing property type
              prices={listing.prices?.map((priceObj) => priceObj.price) || []} // Extract prices or default to an empty array
              currentPrice={listing.current_price || 'Price not available'} // Provide a fallback for missing current price
            />
          ))
        )}
      </div>
    </Layout>
  );
};

export default Analysis;
