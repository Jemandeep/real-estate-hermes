"use client";
import React from 'react';
import { useRouter } from 'next/router';

const Compare = () => {
  const router = useRouter();
  const { ids } = router.query;

  const [listings, setListings] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  const compareListings = async () => {
    if (ids) {
      const idArray = ids.split(',');
      try {
        const response = await fetch(`/api/listings?ids=${idArray.join(',')}`); // Update this to your API endpoint
        const data = await response.json();
        setListings(data);
      } catch (err) {
        setError('Failed to fetch comparison data.');
      } finally {
        setLoading(false);
      }
    }
  };

  React.useEffect(() => {
    if (ids) {
      compareListings();
    }
  }, [ids]);

  return (
    <div className="max-w-full mx-auto p-4 bg-white rounded shadow mt-10">
      <h1 className="text-2xl font-bold mb-4">Compare Properties</h1>
      {loading ? (
        <p className="text-gray-600">Loading comparison data...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <div>
          {listings.length > 0 ? (
            listings.map((listing) => (
              <div key={listing.id} className="border-b mb-4 pb-4">
                <h2 className="text-xl font-bold">{listing.address}</h2>
                <p>{listing.property_type}</p>
                <p>Price: ${listing.current_price}</p>
                <p>{listing.bed_count} Beds | {listing.bathroom_count} Baths</p>
              </div>
            ))
          ) : (
            <p>No properties found for comparison.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Compare;
