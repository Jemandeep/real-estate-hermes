"use client";
import AddOrEditProperty from '../../components/AddOrEditProperty'; // Ensure this path is correct

const AddPropertyPage = ({ params }) => {
  const { propertyId } = params;  // This will extract the dynamic propertyId from the URL

  return (
    <div>
      {/* Render your AddOrEditProperty component, passing propertyId */}
      <AddOrEditProperty propertyId={propertyId} />
    </div>
  );
};

export default AddPropertyPage;
