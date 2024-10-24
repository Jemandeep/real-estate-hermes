// /app/add-property/page.js
"use client";
import dynamic from 'next/dynamic';

// Dynamically import AddProperty component
const AddProperty = dynamic(() =>
  import('../components/AddProperty'), {  // Correct path to AddProperty.js
    ssr: false,  // Ensure it's client-side rendered
  }
);

const AddPropertyPage = () => {
  return (
    <div>
      <AddProperty />
    </div>
  );
};

export default AddPropertyPage;
