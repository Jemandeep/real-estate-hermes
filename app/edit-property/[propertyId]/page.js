// /app/edit-property/[propertyId]/page.js
"use client";
import dynamic from 'next/dynamic';

// Dynamically import EditProperty component
const EditProperty = dynamic(() =>
  import('../../components/EditProperty'), {  // Correct path to EditProperty.js
    ssr: false,  // Ensure it's client-side rendered
  }
);

const EditPropertyPage = ({ params }) => {
  const { propertyId } = params;  // Extract propertyId from dynamic URL

  return (
    <div>
      <EditProperty propertyId={propertyId} />
    </div>
  );
};

export default EditPropertyPage;
