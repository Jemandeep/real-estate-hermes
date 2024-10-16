"use client";
import { useState } from 'react';
import { db } from '../../firebase'; // Ensure this path is correct
import { collection, addDoc } from 'firebase/firestore';

const ModifyListings = () => {
  const [formValues, setFormValues] = useState({
    address: '',
    bathroom_count: 1,
    bed_count: 1,
    current_price: 50000,
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
  const unformatPrice = (price) => price.replace(/,/g, '');

  // Handle price input change
  const handlePriceChange = (e) => {
    const priceValue = parseInt(unformatPrice(e.target.value), 10) || 0;
    setFormValues({ ...formValues, current_price: priceValue });
  };

  // Add a new historical price
  const handleAddPrice = () => {
    const nextMonth = `Last ${historicalPrices.length + 1} month`;
    setHistoricalPrices([...historicalPrices, { month: nextMonth, price: formValues.current_price }]);
  };

  // Handle historical price changes
  const handleHistoricalChange = (index, e) => {
    const { value } = e.target;
    const updatedPrices = [...historicalPrices];
    updatedPrices[index].price = parseInt(unformatPrice(value), 10) || 0;
    setHistoricalPrices(updatedPrices);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const confirmed = window.confirm('Are you sure you want to add this new listing?');
    if (!confirmed) return;

    try {
      const docRef = await addDoc(collection(db, 'listings'), {
        ...formValues,
        prices: historicalPrices,
      });
      alert(`Listing added successfully with ID: ${docRef.id}`);
    } catch (error) {
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
              onChange={(e) => handlePriceChange(e)}
              className="w-2/3"
            />
          </div>
        </div>

        {/* Historical Prices */}
        <h3 className="text-xl font-semibold">Historical Prices</h3>
        {historicalPrices.map((price, index) => (
          <div key={index} className="space-y-2">
            <label className="block text-gray-700">{price.month}</label>
            <input
              type="text"
              value={formatPrice(price.price)}
              onChange={(e) => handleHistoricalChange(index, e)}
              className="w-full p-2 border rounded"
            />
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

        {/* Add Historical Price Button */}
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
