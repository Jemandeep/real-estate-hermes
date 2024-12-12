"use client";
import { useState, useEffect } from 'react';
import { db, storage } from '../../firebase'; // Import storage for image upload
import { collection, addDoc, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth'; 
import { useRouter } from 'next/navigation'; 
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'; // Import functions for image upload
import Layout from '../components/Layout';

// Nominatim API URL
const NominatimAPIURL = "https://nominatim.openstreetmap.org/search";

// Function to fetch geolocation data from Nominatim API
const fetchGeolocationData = async (address) => {
  try {
    const response = await fetch(`${NominatimAPIURL}?q=${encodeURIComponent(address)}&format=json&addressdetails=1&limit=1`);
    const data = await response.json();
    if (data && data.length > 0) {
      const result = data[0];
      const { lat, lon } = result;
      const { postcode, neighbourhood } = result.address;

      return {
        latitude: lat,
        longitude: lon,
        postal_code: postcode || '',
        neighborhood: neighbourhood || ''
      };
    }
  } catch (error) {
    console.error("Error fetching geolocation data: ", error);
  }
  return null;
};

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
    property_type: '',
    agent_name: '',
    summary: '',
    images: [], // For storing image URLs
  });

  const [monthlyPrices, setMonthlyPrices] = useState(Array(12).fill({ month: '', price: '' })); // Initialize with 12 months

  // New state variables for image upload
  const [imageFiles, setImageFiles] = useState([]); // Holds selected image files
  const [uploadProgress, setUploadProgress] = useState({}); // Tracks upload progress for images

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (loggedUser) => {
      if (loggedUser) {
        setUser(loggedUser);
        setFormValues((prevValues) => ({
          ...prevValues,
          agent_name: loggedUser.displayName || loggedUser.email, // Automatically set agent's name
        }));
      } else {
        router.push('/login');
      }
    });
    return () => unsubscribe();
  }, [auth, router]);

  const handleAddressChange = async (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });

    if (name === 'address' && value.trim() !== '') {
      const geolocationData = await fetchGeolocationData(value);
      if (geolocationData) {
        setFormValues((prevValues) => ({
          ...prevValues,
          ...geolocationData, // Update latitude, longitude, postal code, neighborhood
        }));
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handlePriceChange = (e) => {
    const priceValue = e.target.value.replace(/,/g, '');
    setFormValues({ ...formValues, current_price: priceValue });
  };

  const handleMonthlyPriceChange = (index, e) => {
    const newPrices = [...monthlyPrices];
    newPrices[index].price = e.target.value;
    setMonthlyPrices(newPrices);
  };

  // Function to auto-generate random variations for the 12 months' prices with 70% chance of increase
  const autoCompleteMonthlyPrices = () => {
    const randomPrices = [...monthlyPrices];
    randomPrices[0] = { month: "Last month", price: formValues.current_price }; // First month based on current price

    for (let i = 1; i < 12; i++) {
      // 70% chance to increase, 30% chance to decrease
      const shouldIncrease = Math.random() < 0.7;
      const randomPercentage = (Math.random() * 5) / 100; // Variation between 0% and 5%
      const previousPrice = parseFloat(randomPrices[i - 1].price);

      // Apply increase or decrease
      const newPrice = shouldIncrease
        ? previousPrice * (1 + randomPercentage)
        : previousPrice * (1 - randomPercentage);

      randomPrices[i] = { 
        month: `Last ${i + 1} month`, // Corrected template literal
        price: newPrice.toFixed(2) 
      };
    }

    setMonthlyPrices(randomPrices);
  };

  // Function to handle file selection
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
  
    // Filter files to ensure size limit of 3MB
    const validFiles = files.filter((file) => file.size <= 3 * 1024 * 1024);
  
    if (files.length > validFiles.length) {
      alert("Some files exceed the 3MB size limit and were not added.");
    }
  
    if (validFiles.length > 5) {
      alert("You can upload up to 5 images only.");
      return;
    }
  
    setImageFiles(validFiles);
  };
  

  const uploadImages = async (listingId) => {
    try {
      const uploadPromises = imageFiles.map((file) => {
        const fileRef = ref(storage, `listings/${listingId}/${Date.now()}_${file.name}`);
        const uploadTask = uploadBytesResumable(fileRef, file);
  
        return new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setUploadProgress((prev) => ({
                ...prev,
                [file.name]: progress,
              }));
            },
            (error) => {
              console.error("Upload error: ", error);
              reject(error);
            },
            async () => {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              resolve(downloadURL);
            }
          );
        });
      });
  
      // Wait for all uploads to finish and get their URLs
      const uploadedImageURLs = await Promise.all(uploadPromises);
      return uploadedImageURLs;
    } catch (error) {
      console.error("Error uploading images: ", error);
      throw new Error("Failed to upload images");
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    try {
      // Add the listing without images initially
      const docRef = await addDoc(collection(db, 'listings'), {
        ...formValues,
        prices: monthlyPrices.map((item) => ({
          month: item.month,
          price: item.price.toString(), // Ensure prices are stored as strings
        })),
        agent_name: formValues.agent_name, // Include the agent's name
        images: [], // Temporarily set images to empty array
        summary: formValues.summary,
      });

      const listingId = docRef.id;

      // Upload images and get their URLs
      const uploadedImages = await uploadImages(listingId);

      // Update the listing with image URLs and listing_id
      await updateDoc(docRef, {
        listing_id: listingId,
        images: uploadedImages,
      });

      // Update the user's document to include the new listing
      const userDocRef = doc(db, 'users', user.email);
      await updateDoc(userDocRef, {
        listings: arrayUnion(listingId),
      });

      alert(`Listing added successfully with ID: ${listingId}`);
      router.push('/viewListings');
    } catch (error) {
      console.error('Error adding listing: ', error);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <Layout>
      {/* Main Container with Royal Navy Blue Background */}
      <div className="container mx-auto p-6 bg-royal-navy-blue text-white">
        <h2 className="text-3xl font-bold mb-6">Add New Listing</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Address */}
          <div className="bg-white p-4 rounded shadow">
            <label className="block text-gray-700">Address</label>
            <input
              type="text"
              name="address"
              id="address-input"
              value={formValues.address}
              onChange={handleAddressChange}
              required
              className="w-full p-2 mt-1 bg-light-gray border border-gray-300 rounded text-gray-900"
              placeholder="Start typing an address..."
            />
          </div>

        {/* Image Upload */}
<div className="bg-white p-4 rounded shadow">
  <label className="block text-gray-700">Upload Images (JPG or PNG, max 5, 3MB each)</label>
  <input
    type="file"
    accept="image/jpeg, image/png"
    multiple
    onChange={handleFileChange}
    className="w-full p-2 mt-1 bg-light-gray border border-gray-300 rounded text-gray-900"
  />
  <div className="mt-2 space-y-2">
    {imageFiles.map((file, index) => (
      <div key={index} className="flex items-center space-x-4">
        {/* File Name */}
        <p className="text-sm truncate w-1/3">{file.name}</p>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-300 rounded h-2">
          <div
            className="bg-blue-500 h-2 rounded"
            style={{ width: `${uploadProgress[file.name] || 0}%` }}
          ></div>
        </div>

        {/* Remove Button */}
        <button
          onClick={() => removeFile(file.name)}
          className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-700"
        >
          Remove
        </button>
      </div>
    ))}
  </div>
</div>


          {/* Property Type */}
          <div className="bg-white p-4 rounded shadow">
            <label className="block text-gray-700">Property Type</label>
            <select
              name="property_type"
              value={formValues.property_type}
              onChange={handleChange}
              className="w-full p-2 mt-1 bg-light-gray border border-gray-300 rounded text-gray-900"
              required
            >
              <option value="" disabled>
                Select property type
              </option>
              <option value="Mansion">Mansion</option>
              <option value="Apartment">Apartment</option>
              <option value="Condo">Condo</option>
              <option value="Townhouse">Townhouse</option>
              <option value="Detached House">Detached House</option>
              <option value="Bungalow">Bungalow</option>
            </select>
          </div>

          {/* Postal Code, Latitude, Longitude, Neighborhood */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Postal Code */}
            <div className="bg-white p-4 rounded shadow">
              <label className="block text-gray-700">Postal Code</label>
              <input
                type="text"
                name="postal_code"
                value={formValues.postal_code}
                onChange={handleChange}
                readOnly
                className="w-full p-2 mt-1 bg-light-gray border border-gray-300 rounded text-gray-900"
              />
            </div>
            {/* Neighborhood */}
            <div className="bg-white p-4 rounded shadow">
              <label className="block text-gray-700">Neighborhood</label>
              <input
                type="text"
                name="neighborhood"
                value={formValues.neighborhood}
                onChange={handleChange}
                className="w-full p-2 mt-1 bg-light-gray border border-gray-300 rounded text-gray-900"
              />
            </div>
            {/* Latitude */}
            <div className="bg-white p-4 rounded shadow">
              <label className="block text-gray-700">Latitude</label>
              <input
                type="text"
                name="latitude"
                value={formValues.latitude}
                onChange={handleChange}
                readOnly
                className="w-full p-2 mt-1 bg-light-gray border border-gray-300 rounded text-gray-900"
              />
            </div>
            {/* Longitude */}
            <div className="bg-white p-4 rounded shadow">
              <label className="block text-gray-700">Longitude</label>
              <input
                type="text"
                name="longitude"
                value={formValues.longitude}
                onChange={handleChange}
                readOnly
                className="w-full p-2 mt-1 bg-light-gray border border-gray-300 rounded text-gray-900"
              />
            </div>
          </div>

          {/* Bathrooms and Bedrooms */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Bathrooms */}
            <div className="bg-white p-4 rounded shadow">
              <label className="block text-gray-700">Bathrooms</label>
              <select
                name="bathroom_count"
                value={formValues.bathroom_count}
                onChange={handleChange}
                className="w-full p-2 mt-1 bg-light-gray border border-gray-300 rounded text-gray-900"
                required
              >
                {[...Array(6).keys()].map((num) => (
                  <option key={num + 1} value={num + 1}>
                    {num + 1} Bathroom(s)
                  </option>
                ))}
              </select>
            </div>
            {/* Bedrooms */}
            <div className="bg-white p-4 rounded shadow">
              <label className="block text-gray-700">Bedrooms</label>
              <select
                name="bed_count"
                value={formValues.bed_count}
                onChange={handleChange}
                className="w-full p-2 mt-1 bg-light-gray border border-gray-300 rounded text-gray-900"
                required
              >
                {[...Array(6).keys()].map((num) => (
                  <option key={num + 1} value={num + 1}>
                    {num + 1} Bedroom(s)
                  </option>
                ))}
              </select>
            </div>
          </div>

                {/* Summary */}
            <div className="bg-white p-4 rounded shadow">
            <label className="block text-gray-700">Listing Summary</label>
            <textarea
              name="summary"
              value={formValues.summary || ''}
              onChange={handleChange}
              className="w-full p-2 mt-1 bg-light-gray border border-gray-300 rounded text-gray-900"
              placeholder="Provide a brief summary of the listing..."
              rows={4}
            ></textarea>
          </div>


          {/* Current Price */}
          <div className="bg-white p-4 rounded shadow">
            <label className="block text-gray-700">Current Price</label>
            <div className="flex items-center mt-1">
              <input
                type="text"
                name="current_price"
                value={formValues.current_price}
                onChange={handlePriceChange}
                className="w-1/3 p-2 bg-light-gray border border-gray-300 rounded mr-4 text-gray-900"
                required
              />
              <input
                type="range"
                min="50000"
                max="20000000"
                step="50000"
                value={formValues.current_price}
                onChange={handlePriceChange}
                className="w-2/3"
                required
              />
            </div>
          </div>

          {/* Monthly Price Inputs */}
          <div className="space-y-6">
            {monthlyPrices.map((price, index) => (
              <div key={index} className="bg-white p-4 rounded shadow space-y-2">
                <label className="block text-gray-700">
                  {price.month || `Last ${index + 1} Month(s)`}
                </label>
                <input
                  type="text"
                  value={price.price}
                  onChange={(e) => handleMonthlyPriceChange(index, e)}
                  className="w-full p-2 mt-1 bg-light-gray border border-gray-300 rounded text-gray-900"
                  required
                />
                <input
                  type="range"
                  min="50000"
                  max="20000000"
                  step="50000"
                  value={price.price}
                  onChange={(e) => handleMonthlyPriceChange(index, e)}
                  className="w-full"
                  required
                />
              </div>
            ))}
          </div>

          {/* Auto Complete Button */}
          <button
            type="button"
            onClick={autoCompleteMonthlyPrices}
            className="mt-2 px-4 py-2 bg-accent-green hover:bg-green-700 text-white rounded"
          >
            Auto Complete Monthly Prices
          </button>

          {/* Submit Button */}
          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-royal-navy-blue hover:bg-blue-800 text-white rounded"
          >
            Add New Listing
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default ModifyListings;
