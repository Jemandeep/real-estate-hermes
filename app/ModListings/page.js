"use client";
import { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, doc, setDoc, getDocs } from 'firebase/firestore';

const ModListings = () => {
  const [formValues, setFormValues] = useState({
    address: '',
    bathroom_count: 0,
    bed_count: 0,
    current_price: 0,
    neighborhood: '',
    property_type: '',  // Added property_type
    prices: {
      price_1_month: '',
      price_2_month: '',
      price_3_month: '',
      price_4_month: '',
      price_5_month: '',
      price_6_month: '',
      price_7_month: '',
      price_8_month: '',
      price_9_month: '',
      price_10_month: '',
      price_11_month: '',
      price_12_month: ''
    }
  });

  const [nextListingId, setNextListingId] = useState('');
  const [listings, setListings] = useState([]);

  // Fetch existing listings and determine the next listing ID
  useEffect(() => {
    const fetchListings = async () => {
      const listingsSnapshot = await getDocs(collection(db, 'listings'));
      const listingNumbers = listingsSnapshot.docs.map((doc) => {
        const id = doc.id.replace('listing', ''); // Remove the 'listing' prefix to get the number
        return parseInt(id, 10); // Convert to number
      });

      const maxListingNumber = Math.max(...listingNumbers); // Get the highest listing number
      const newListingNumber = maxListingNumber + 1; // Increment by 1 for the new listing ID
      setNextListingId(`listing${newListingNumber}`); // Set the next listing ID (e.g., listing12)
    };

    fetchListings(); // Fetch the existing listings on component mount
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('price_')) {
      setFormValues((prevState) => ({
        ...prevState,
        prices: { ...prevState.prices, [name]: value }
      }));
    } else {
      setFormValues({ ...formValues, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nextListingId) {
      alert('Error generating the next listing ID');
      return;
    }

    try {
      await setDoc(doc(db, 'listings', nextListingId), {
        address: formValues.address,
        bathroom_count: formValues.bathroom_count,
        bed_count: formValues.bed_count,
        current_price: formValues.current_price,
        neighborhood: formValues.neighborhood,
        property_type: formValues.property_type,  // Include property_type
        prices: { ...formValues.prices }
      });

      alert(`Listing added successfully with ID: ${nextListingId}`);
    } catch (err) {
      console.error('Error adding document: ', err);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Add or Modify Listing</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700">Address</label>
          <input
            type="text"
            name="address"
            value={formValues.address}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-gray-700">Bathrooms</label>
          <input
            type="number"
            name="bathroom_count"
            value={formValues.bathroom_count}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-gray-700">Bedrooms</label>
          <input
            type="number"
            name="bed_count"
            value={formValues.bed_count}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-gray-700">Current Price</label>
          <input
            type="number"
            name="current_price"
            value={formValues.current_price}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-gray-700">Neighborhood</label>
          <input
            type="text"
            name="neighborhood"
            value={formValues.neighborhood}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-gray-700">Property Type</label>
          <input
            type="text"
            name="property_type"
            value={formValues.property_type}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <h3 className="text-xl font-semibold">Optional Monthly Prices</h3>
        {Object.keys(formValues.prices).map((priceKey, index) => (
          <div key={index}>
            <label className="block text-gray-700">{`Price ${index + 1} Month`}</label>
            <input
              type="number"
              name={priceKey}
              value={formValues.prices[priceKey]}
              onChange={handleChange}
              placeholder={`Optional Price for month ${index + 1}`}
              className="w-full p-2 border rounded"
            />
          </div>
        ))}
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
          Add Listing
        </button>
      </form>
    </div>
  );
};

export default ModListings;
