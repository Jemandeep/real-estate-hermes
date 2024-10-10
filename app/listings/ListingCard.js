// listings/ListingCard.js
import Link from 'next/link';
import { FaBed, FaBath, FaHome } from 'react-icons/fa'; // Import icons

const ListingCard = ({ id, address, neighborhood, propertyType, currentPrice, bedCount, bathroomCount }) => {
  return (
    <Link href={`/viewListings/detailedListing?id=${id}`}>
      <div className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transform hover:scale-105 transition duration-200 cursor-pointer">
        <div className="mb-4">
          <p className="text-lg font-bold text-gray-800 mb-2">
            {address}
          </p>
        </div>
        <div className="mb-4">
          <p className="text-sm text-gray-700 mb-2 flex items-center">
            <FaBed className="mr-2 text-gray-600" />
            {bedCount} Bedrooms
          </p>
          <p className="text-sm text-gray-700 mb-2 flex items-center">
            <FaBath className="mr-2 text-gray-600" />
            {bathroomCount} Bathrooms
          </p>
          <p className="text-sm text-gray-700 mb-2 flex items-center">
            <FaHome className="mr-2 text-gray-600" />
            {propertyType}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold">Current Price:</p>
          <p className="text-lg font-semibold text-gray-800">
            ${currentPrice ? currentPrice.toLocaleString() : 'No price available'}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default ListingCard;
