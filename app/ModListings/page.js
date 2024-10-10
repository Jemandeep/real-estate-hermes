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
    postal_code: '',
    latitude: '',
    longitude: '',
    neighborhood: '',
    prices: [],
  });
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false); // State to track if Google Maps is loaded
  const [historicalPrices, setHistoricalPrices] = useState([{ month: 'Last month', price: 50000 }]);
  const [user, setUser] = useState(null); // Track the signed-in user
  const [redirectMessage, setRedirectMessage] = useState(false); // Track if redirect message is shown
  const router = useRouter(); // Next.js navigation router

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

    return () => unsubscribe();
  }, [router]);


  // Load Google Maps script dynamically
  const loadGoogleMapsScript = (callback) => {
    const existingScript = document.getElementById('googleMaps');
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAkhw-ajGfapfGKUYblHstW85TIm-IjKSU&libraries=places`;
      script.id = 'googleMaps';
      document.body.appendChild(script);
      script.onload = () => {
        setIsGoogleLoaded(true); // Set state to true when Google Maps script is loaded
        if (callback) callback();
      };
    } else {
      setIsGoogleLoaded(true); // If script is already loaded, set the state to true
      if (callback) callback();
    }
  };

  // Initialize Google autocomplete
  const initAutocomplete = () => {
    if (window.google && window.google.maps) {
      const autocomplete = new window.google.maps.places.Autocomplete(
        document.getElementById('address-input'),
        { types: ['geocode'] }
      );
  
      // When the user selects an address, get the coordinates
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (!place.geometry) return;
  
        const { lat, lng } = place.geometry.location;
  
        // Extract postal code
        const postalCodeComponent = place.address_components.find(component => component.types.includes('postal_code'));
        const postalCode = postalCodeComponent ? postalCodeComponent.short_name : '';
  
        // Extract neighborhood or community
        const neighborhoodComponent = place.address_components.find(component => component.types.includes('neighborhood') || component.types.includes('sublocality'));
        const neighborhood = neighborhoodComponent ? neighborhoodComponent.long_name : '';
  
        // Update form values with postal code, coordinates, and neighborhood
        setFormValues({
          ...formValues,
          address: place.formatted_address,
          postal_code: postalCode,
          latitude: lat(),
          longitude: lng(),
          neighborhood: neighborhood // Add neighborhood to form values
        });
      });
    } else {
      console.error("Google Maps is not loaded yet.");
    }
  };
  

  // UseEffect to load the Google Maps script and initialize autocomplete
  useEffect(() => {
    loadGoogleMapsScript(() => {
      if (isGoogleLoaded) {
        initAutocomplete();
      }
    });
  }, [isGoogleLoaded]); // Depend on the state to ensure the script is loaded

  // Handle form input changes

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const unformatPrice = (price) => {
    return price.replace(/,/g, '');
  };

  const handlePriceChange = (e) => {
    const priceValue = unformatPrice(e.target.value);
    setFormValues({ ...formValues, current_price: priceValue });
  };

  const handleAddPrice = () => {
    const lastPriceCount = historicalPrices.length;
    const nextMonth = `Last ${lastPriceCount + 1} month`;
    setHistoricalPrices([...historicalPrices, { month: nextMonth, price: formValues.current_price }]);
  };

  const handleHistoricalChange = (index, e) => {
    const { value } = e.target;
    const newPrices = [...historicalPrices];
    newPrices[index].price = unformatPrice(value);
    setHistoricalPrices(newPrices);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
        {/* Address Input with Autocomplete */}
        <div>
          <label className="block text-gray-700">Address</label>
          <input
            type="text"
            name="address"
            id="address-input"  // Important for initializing the autocomplete
            value={formValues.address}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
            placeholder="Start typing an address..."
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
      </Layout>
    );
  }

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

        {/* Neighborhood/Community (Auto-filled by Geocoding API) */}
<div>
  <label className="block text-gray-700">Neighborhood/Community (Auto-filled)</label>
  <input
    type="text"
    name="neighborhood"
    value={formValues.neighborhood}
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
              name="property_type"
              value={formValues.property_type}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Enter property type"
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
