"use client"; // Ensure the component is client-side
import { useState, useEffect } from 'react';
import { db, auth } from '../../firebase'; // Ensure this path is correct
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter, useSearchParams } from 'next/navigation'; 
import Layout from '../components/Layout'; 

const ModifyListings = () => {
  const [formValues, setFormValues] = useState({
    address: '',
    bathroom_count: 1,
    bed_count: 1,
    current_price: 50000,
    property_type: '',
    postal_code: '',
    latitude: '',
    longitude: '',
    neighborhood: ''
  });

  const [historicalPrices, setHistoricalPrices] = useState([{ month: 'Last month', price: 50000 }]);
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
  const [user, setUser] = useState(null);
  const [agentDetails, setAgentDetails] = useState({ firstName: '', lastName: '', email: '' });
  const router = useRouter();
  const searchParams = useSearchParams(); 
  const listingId = searchParams.get('id'); 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        const { displayName, email } = currentUser;
        const [firstName, lastName] = displayName ? displayName.split(' ') : ['Agent', ''];
        setAgentDetails({ firstName, lastName, email });
        setUser(currentUser);
      } else {
        router.push('/login'); 
      }
    });
    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    const fetchListing = async () => {
      if (!listingId) return;
      try {
        const docRef = doc(db, 'listings', listingId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormValues(data);
          if (data.prices) setHistoricalPrices(data.prices);
        } else {
          router.push('/viewListings');
        }
      } catch (error) {
        console.error('Error fetching listing:', error);
      }
    };
    fetchListing();
  }, [listingId, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
  };

  const formatPrice = (price) => price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const unformatPrice = (price) => price.replace(/,/g, '');

  const handlePriceChange = (e) => {
    const priceValue = unformatPrice(e.target.value);
    setFormValues((prevValues) => ({ ...prevValues, current_price: priceValue }));
  };

  const handleAddPrice = () => {
    const lastPriceCount = historicalPrices.length;
    const nextMonth = `Last ${lastPriceCount + 1} month`;
    setHistoricalPrices((prevPrices) => [...prevPrices, { month: nextMonth, price: formValues.current_price }]);
  };

  const handleHistoricalChange = (index, e) => {
    const { value } = e.target;
    const updatedPrices = historicalPrices.map((price, i) =>
      i === index ? { ...price, price: unformatPrice(value) } : price
    );
    setHistoricalPrices(updatedPrices);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const confirmed = window.confirm('Are you sure you want to update this listing?');
    if (!confirmed) return;

    try {
      await updateDoc(doc(db, 'listings', listingId), {
        ...formValues,
        prices: historicalPrices,
      });
      alert('Listing updated successfully!');
      router.push('/viewListings');
    } catch (error) {
      console.error('Error updating listing:', error);
      alert(`Error updating listing: ${error.message}`);
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <Layout>
      <div className="container mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">Modify Listing</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Agent Details */}
          <div className="bg-gray-100 p-4 rounded">
            <h3 className="text-lg font-semibold">Agent Details</h3>
            <p>First Name: {agentDetails.firstName}</p>
            <p>Last Name: {agentDetails.lastName}</p>
            <p>Email: {agentDetails.email}</p>
          </div>

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

          {/* Property Type */}
          <div>
            <label className="block text-gray-700">Property Type</label>
            <input
              type="text"
              name="property_type"
              value={formValues.property_type}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Bathrooms */}
          <div>
            <label className="block text-gray-700">Bathrooms</label>
            <input
              type="number"
              name="bathroom_count"
              value={formValues.bathroom_count}
              onChange={handleChange}
              min="1"
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Bedrooms */}
          <div>
            <label className="block text-gray-700">Bedrooms</label>
            <input
              type="number"
              name="bed_count"
              value={formValues.bed_count}
              onChange={handleChange}
              min="1"
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Current Price */}
          <div>
            <label className="block text-gray-700">Current Price</label>
            <input
              type="text"
              name="current_price"
              value={formatPrice(formValues.current_price)}
              onChange={handlePriceChange}
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Coordinates (Read-Only) */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700">Latitude</label>
              <input
                type="text"
                value={formValues.latitude}
                readOnly
                className="w-full p-2 border rounded bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-gray-700">Longitude</label>
              <input
                type="text"
                value={formValues.longitude}
                readOnly
                className="w-full p-2 border rounded bg-gray-100"
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
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddPrice}
            className="bg-blue-500 text-white px-4 py-2 rounded mt-4 hover:bg-blue-600"
          >
            + Add Previous Month Price
          </button>

          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded mt-4 hover:bg-green-600"
          >
            Update Listing
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default ModifyListings;
