import React, { useEffect, useState } from 'react';
import { getDocs, collection, query, where } from 'firebase/firestore'; // Firestore functions
import { db } from '../../firebase'; // Firebase configuration
import { getAuth, onAuthStateChanged } from 'firebase/auth'; // Firebase Auth
import { useRouter } from 'next/navigation'; // Import Next.js router for navigation

const PropertySidebar = () => {
  const [userProperties, setUserProperties] = useState([]);
  const [user, setUser] = useState(null);
  const auth = getAuth();
  const router = useRouter(); // Router for navigation

  useEffect(() => {
    // Listen for auth changes and set the user
    const unsubscribe = onAuthStateChanged(auth, (loggedUser) => {
      if (loggedUser) {
        setUser(loggedUser);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    // Fetch the properties for the logged-in user
    const fetchProperties = async () => {
      if (!user) return;

      try {
        const propertiesQuery = query(
          collection(db, 'properties'),
          where('userEmail', '==', user.email) // Filter by the logged-in user's email
        );
        const querySnapshot = await getDocs(propertiesQuery);
        const properties = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })); // Include document ID
        setUserProperties(properties);
      } catch (error) {
        console.error('Error fetching properties: ', error);
      }
    };

    fetchProperties();
  }, [user]); // Re-run when user changes

  // Remove the automatic redirect here
  // router.push('/add-property/new'); // Comment this out or remove it

  // Redirect to the edit page with the property ID
  const handleEditProperty = (propertyId) => {
    router.push(`/add-property/${propertyId}`); // Navigate to the edit form with the property ID
  };  
  
  return (
    <div style={{ 
      width: '550px', 
      padding: '20px', 
      backgroundColor: '#f4f4f4', 
      border: '1px solid #ddd', 
      borderRadius: '8px', 
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', 
      overflowY: 'auto',
      maxHeight: '400px'
    }}>
      <h3>Your Properties</h3>

      {userProperties.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {userProperties.map((property) => (
            <div key={property.id} style={{ 
              backgroundColor: '#fff', 
              padding: '15px', 
              border: '1px solid #ddd', 
              borderRadius: '8px', 
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center' 
            }}>
              <div>
                <strong>{property.address}</strong><br />
                {property.neighborhood}<br />
                {property.current_price ? `Price: $${property.current_price}` : 'No price available'}
              </div>

              <button 
                style={{
                  padding: '8px 12px',
                  backgroundColor: '#007BFF',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
                onClick={() => handleEditProperty(property.id)} // Navigate to edit page
              >
                Edit
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>No properties added yet.</p>
      )}

      <button
        style={{ 
          marginTop: '20px', 
          padding: '10px', 
          backgroundColor: '#007BFF', 
          color: 'white', 
          border: 'none', 
          borderRadius: '5px', 
          cursor: 'pointer' 
        }}
        onClick={() => router.push('/add-property/new')} // Navigate to add property page when clicked
      >
        Add Property
      </button>
    </div>
  );
};

export default PropertySidebar;
