"use client";
import { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, addDoc, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth'; 
import { useRouter } from 'next/navigation'; 
import Layout from '../components/Layout';

const ModifyListings = () => {
  const router = useRouter();
  const auth = getAuth(); 
  const [user, setUser] = useState(null); 
  const [formValues, setFormValues] = useState({
    address: '',
    bathroom_count: 1,
    bed_count: 1,
    current_price: 50000,
    postal_code: '',
    latitude: '',
    longitude: '',
    neighborhood: '',
  });

  const [historicalPrices, setHistoricalPrices] = useState([
    { month: 'Last month', price: 50000 },
  ]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (loggedUser) => {
      if (loggedUser) {
        setUser(loggedUser);
      } else {
        router.push('/login');
      }
    });
    return () => unsubscribe();
  }, [auth, router]);

  useEffect(() => {
    const loadAutocomplete = () => {
      const autocomplete = new window.google.maps.places.Autocomplete(
        document.getElementById('address-input'),
        { types: ['address'] }
      );

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (!place.geometry) return;

        const { lat, lng } = place.geometry.location;
        const postalCodeComponent = place.address_components.find((component) =>
          component.types.includes('postal_code')
        );
        const neighborhoodComponent = place.address_components.find((component) =>
          component.types.includes('neighborhood') || component.types.includes('sublocality')
        );

        setFormValues((prev) => ({
          ...prev,
          address: place.formatted_address,
          postal_code: postalCodeComponent ? postalCodeComponent.short_name : '',
          latitude: lat(),
          longitude: lng(),
          neighborhood: neighborhoodComponent ? neighborhoodComponent.long_name : '',
        }));
      });
    };

    if (window.google && window.google.maps) {
      loadAutocomplete();
    } else {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAkhw-ajGfapfGKUYblHstW85TIm-IjKSU&libraries=places`;
      script.onload = () => loadAutocomplete();
      document.body.appendChild(script);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handlePriceChange = (e) => {
    const priceValue = e.target.value.replace(/,/g, '');
    setFormValues({ ...formValues, current_price: priceValue });
  };

  const handleAddPrice = () => {
    const newPrice = { month: `Last ${historicalPrices.length + 1} month`, price: formValues.current_price };
    setHistoricalPrices([...historicalPrices, newPrice]);
  };

  const handleHistoricalChange = (index, e) => {
    const updatedPrices = [...historicalPrices];
    updatedPrices[index].price = e.target.value.replace(/,/g, '');
    setHistoricalPrices(updatedPrices);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    try {
      const docRef = await addDoc(collection(db, 'listings'), {
        ...formValues,
        prices: historicalPrices,
      });

      const userDocRef = doc(db, 'users', user.email);
      await updateDoc(userDocRef, {
        listings: arrayUnion(docRef.id),
      });

      alert(`Listing added successfully with ID: ${docRef.id}`);
      router.push('/viewListings');
    } catch (error) {
      console.error('Error adding listing: ', error);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">Add New Listing</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Address</label>
            <input
              type="text"
              name="address"
              id="address-input"
              value={formValues.address}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
              placeholder="Start typing an address..."
            />
          </div>

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

          <div>
            <label className="block text-gray-700">Current Price</label>
            <div className="flex items-center">
              <input
                type="text"
                name="current_price"
                value={formValues.current_price}
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

          {historicalPrices.map((price, index) => (
            <div key={index} className="space-y-2">
              <label className="block text-gray-700">{price.month}</label>
              <input
                type="text"
                value={price.price}
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

          <button
            type="button"
            onClick={handleAddPrice}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            + Add Previous Month Price
          </button>

          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Add New Listing
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default ModifyListings;
