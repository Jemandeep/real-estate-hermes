import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase"; // Ensure the path to your Firebase config is correct

const Header = () => {
  const [userName, setUserName] = useState(null); // State to track user's name

  // Function to capitalize the first letter of the name
  const capitalizeFirstLetter = (name) => {
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  };

  // Monitor the user's authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Get the first part of displayName or email
        let firstName = user.displayName
          ? user.displayName.split(" ")[0] // Split by space if there's a displayName
          : user.email.split("@")[0];      // Split by '@' if using email
          
        // Capitalize the first letter of the first name
        setUserName(capitalizeFirstLetter(firstName));
      } else {
        // If no user is logged in, clear the state
        setUserName(null);
      }
    });

    return () => unsubscribe(); // Cleanup the listener on unmount
  }, []);

  return (
    <div className="bg-stone-500 text-white px-40 py-40 text-center">
      <h1 className="text-4xl font-bold mb-4">
        {userName ? `Welcome, ${userName}` : "Discover Your Dream Home"}
      </h1>
      <p className="text-lg mb-6">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum.
      </p>
      
      {/* Action Buttons */}
      <div className="space-x-4">
        <a href="/listings" className="bg-white text-stone-600 font-semibold px-6 py-3 rounded-md hover:bg-gray-100">Browse Listings</a>
      </div>
    </div>
  );
}

export default Header;
