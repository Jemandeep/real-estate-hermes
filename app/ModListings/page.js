"use client"; // Ensure the component is client-side
import { useState, useEffect } from 'react';
import { db, auth } from '../../firebase'; // Ensure this path is correct
import { collection, addDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation'; // Updated import for Next.js 13+
import Layout from '../components/Layout'; // Import the Layout component

const ModifyListings = () => {
  const [formValues, setFormValues] = useState({
    address: '',
    bathroom_count: 1,
    bed_count: 1,
    current_price: 50000,
    prices: [],
  });
  const [historicalPrices, setHistoricalPrices] = useState([{ month: 'Last month', price: 50000 }]);
  const [user, setUser] = useState(null); // Track the signed-in user
  const [redirectMessage, setRedirectMessage] = useState(false); // Track if redirect message is shown
  const router = useRouter(); // Next.js navigation router

  // Check if user is authenticated
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser); // Set the user if signed in
      } else {
        // If no user is signed in, show redirect message and start the animation
        setRedirectMessage(true);
        setTimeout(() => {
          router.push('/login'); // Redirect to login after delay
        }, 3000); // 3-second delay before redirection
      }
    });

    // Cleanup the listener on component unmount
    return () => unsubscribe();
  }, [router]);

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

  if (redirectMessage) {
    return (
      <Layout>
        <div className="container mx-auto p-6 flex justify-center items-center h-screen">
          <div className="text-center">
            {/* Transitioning message */}
            <p className="text-2xl font-bold text-gray-800 opacity-0 animate-fadeIn">
              Since you are not logged in, you will be redirected to the login page.
            </p>
            {/* Optional loading spinner or animation */}
            <div className="mt-4">
              <div className="w-8 h-8 border-4 border-stone-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Show a loading state or error if the user is not authenticated yet
  if (user === null) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
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

          {/* Buttons with App Colors */}
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
    </Layout>
  );
};

export default ModifyListings;
