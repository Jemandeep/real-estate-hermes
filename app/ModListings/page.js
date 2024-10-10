"use client";
import { useState, useEffect } from 'react';
import { db } from '../../firebase'; // Ensure this path is correct
import { collection, addDoc } from 'firebase/firestore';

const ModifyListings = () => {
  const [formValues, setFormValues] = useState({
    address: '',
    bathroom_count: 1,
    bed_count: 1,
    current_price: 50000,
    postal_code: '',
    latitude: '',
    longitude: '',
    prices: [],
  });
  const [historicalPrices, setHistoricalPrices] = useState([{ month: 'Last month', price: 50000 }]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  // Format numbers with commas for price input
  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // Remove commas for operations
  const unformatPrice = (price) => {
    return price.replace(/,/g, '');
  };

  // Handle price input change (without commas)
  const handlePriceChange = (e) => {
    const priceValue = unformatPrice(e.target.value);
    setFormValues({ ...formValues, current_price: priceValue });
  };

  // Handle adding more input fields for historical prices with default current price
  const handleAddPrice = () => {
    const lastPriceCount = historicalPrices.length;
    const nextMonth = `Last ${lastPriceCount + 1} month`;
    setHistoricalPrices([...historicalPrices, { month: nextMonth, price: formValues.current_price }]);
  };

  // Handle the changes in historical prices inputs
  const handleHistoricalChange = (index, e) => {
    const { value } = e.target;
    const newPrices = [...historicalPrices];
    newPrices[index].price = unformatPrice(value);
    setHistoricalPrices(newPrices);
  };

  // Google Maps Geocoding API to get postal code and coordinates
  const getCoordinatesFromAddress = async (address) => {
    const apiKey = 'AIzaSyCY0X51vTPdfNR_oNX9Q9DZR4sIVUYySFY'; // Replace with your Google API key
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'OK') {
        const { lat, lng } = data.results[0].geometry.location;
        const postalCode = data.results[0].address_components.find(component => component.types.includes('postal_code')).short_name;

        // Update form values with postal code and coordinates
        setFormValues((prev) => ({
          ...prev,
          postal_code: postalCode,
          latitude: lat,
          longitude: lng
        }));
      } else {
        console.error('Geocoding failed:', data.status);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Call this function whenever the address is updated
  useEffect(() => {
    if (formValues.address) {
      getCoordinatesFromAddress(formValues.address);
    }
  }, [formValues.address]);

  // Handle form submission to add a new document with an auto-generated ID
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ask for confirmation before submission
    const confirmed = window.confirm('Are you sure you want to add this new listing?');
    if (!confirmed) return;

    try {
      // Add a new listing document with an auto-generated ID
      const docRef = await addDoc(collection(db, 'listings'), {
        address: formValues.address,
        bathroom_count: formValues.bathroom_count,
        bed_count: formValues.bed_count,
        current_price: formValues.current_price,
        postal_code: formValues.postal_code,
        latitude: formValues.latitude,
        longitude: formValues.longitude,
        prices: historicalPrices,
      });

      // Confirm the addition
      alert(`Listing added successfully with ID: ${docRef.id}`);
    } catch (error) {
      // Log the error for debugging
      console.error('Error adding new listing: ', error);
      alert(`Error adding listing: ${error.message}`);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Add New Listing</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Address Input */}
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

        {/* Bathroom Dropdown */}
        <div>
          <label className="block text-gray-700">Bathrooms</label>
          <select
            name="bathroom_count"
            value={formValues.bathroom_count}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            {[...Array(6).keys()].map((num) => (
              <option key={num + 1} value={num + 1}>
                {num + 1} Bathroom(s)
              </option>
            ))}
          </select>
        </div>

        {/* Bedroom Dropdown */}
        <div>
          <label className="block text-gray-700">Bedrooms</label>
          <select
            name="bed_count"
            value={formValues.bed_count}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            {[...Array(6).keys()].map((num) => (
              <option key={num + 1} value={num + 1}>
                {num + 1} Bedroom(s)
              </option>
            ))}
          </select>
        </div>

        {/* Current Price Input and Slider */}
        <div>
          <label className="block text-gray-700">Current Price</label>
          <div className="flex items-center">
            <input
              type="text"
              name="current_price"
              value={formatPrice(formValues.current_price)}
              onChange={handlePriceChange}
              className="w-1/3 p-2 border rounded mr-4"
            />
            <input
              type="range"
              min="50000"
              max="20000000"
              step="50000"
              value={formValues.current_price}
              onChange={handlePriceChange}
              className="w-2/3"
            />
          </div>
        </div>

        {/* Postal Code (Auto-filled by Geocoding API) */}
        <div>
          <label className="block text-gray-700">Postal Code (Auto-filled)</label>
          <input
            type="text"
            name="postal_code"
            value={formValues.postal_code}
            readOnly
            className="w-full p-2 border rounded bg-gray-100"
          />
        </div>

        {/* Latitude (Auto-filled by Geocoding API) */}
        <div>
          <label className="block text-gray-700">Latitude (Auto-filled)</label>
          <input
            type="text"
            name="latitude"
            value={formValues.latitude}
            readOnly
            className="w-full p-2 border rounded bg-gray-100"
          />
        </div>

        {/* Longitude (Auto-filled by Geocoding API) */}
        <div>
          <label className="block text-gray-700">Longitude (Auto-filled)</label>
          <input
            type="text"
            name="longitude"
            value={formValues.longitude}
            readOnly
            className="w-full p-2 border rounded bg-gray-100"
          />
        </div>

        {/* Historical Prices */}
        <h3 className="text-xl font-semibold">Historical Prices</h3>
        {historicalPrices.map((price, index) => (
          <div key={index} className="space-y-2">
            <label className="block text-gray-700">{price.month}</label>
            <input
              type="text"
              name="price"
              value={formatPrice(price.price)}
              onChange={(e) => handleHistoricalChange(index, e)}
              placeholder="Price"
              className="w-full p-2 border rounded"
            />
            {/* Slider for adjusting historical prices */}
            <input
              type="range"
              min="50000"
              max="20000000"
              step="50000"
              value={price.price}
              onChange={(e) => handleHistoricalChange(index, e)}
              className="w-full"
            />
          </div>
        ))}

        {/* Buttons */}
        <div className="mt-6">
          <button
            type="button"
            onClick={handleAddPrice}
            className="block px-4 py-2 bg-stone-300 text-stone-600 rounded mb-4 hover:bg-gray-100"
          >
            + Add Previous Month Price
          </button>

          <button type="submit" className="block px-4 py-2 bg-stone-300 text-stone-600 rounded hover:bg-gray-100">
            Add New Listing
          </button>
        </div>
      </form>
    </div>
  );
};

export default ModifyListings;
