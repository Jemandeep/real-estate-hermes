import React, { useState } from 'react';

const Filters = ({
  neighborhoods,
  propertyTypes,
  filteredNeighborhood,
  setFilteredNeighborhood,
  filteredPropertyType,
  setFilteredPropertyType,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  minBedrooms,
  setMinBedrooms,
  minBathrooms,
  setMinBathrooms,
}) => {
  return (
    <div className="mb-4 grid grid-cols-2 gap-4">
      {/* Neighborhood Filter */}
      <div>
        <label className="block text-sm font-semibold mb-2" htmlFor="neighborhood-filter">
          Filter by Neighborhood:
        </label>
        <select
          id="neighborhood-filter"
          className="p-2 border rounded w-full"
          value={filteredNeighborhood}
          onChange={(e) => setFilteredNeighborhood(e.target.value)}
        >
          {neighborhoods.map((neighborhood) => (
            <option key={neighborhood} value={neighborhood}>
              {neighborhood}
            </option>
          ))}
        </select>
      </div>
      
      {/* Property Type Filter */}
      <div>
        <label className="block text-sm font-semibold mb-2" htmlFor="property-type-filter">
          Filter by Property Type:
        </label>
        <select
          id="property-type-filter"
          className="p-2 border rounded w-full"
          value={filteredPropertyType}
          onChange={(e) => setFilteredPropertyType(e.target.value)}
        >
          {propertyTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>
      
      {/* Price Range Filter */}
      <div>
        <label className="block text-sm font-semibold mb-2" htmlFor="price-range">
          Filter by Price Range:
        </label>
        <div className="flex space-x-2">
          <input
            type="number"
            className="p-2 border rounded w-full"
            placeholder="Min Price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
          <input
            type="number"
            className="p-2 border rounded w-full"
            placeholder="Max Price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>
      </div>

      {/* Bedrooms Filter */}
      <div>
        <label className="block text-sm font-semibold mb-2" htmlFor="bedrooms-filter">
          Filter by Bedrooms:
        </label>
        <input
          type="number"
          className="p-2 border rounded w-full"
          placeholder="Min Bedrooms"
          value={minBedrooms}
          onChange={(e) => setMinBedrooms(e.target.value)}
        />
      </div>
      
      {/* Bathrooms Filter */}
      <div>
        <label className="block text-sm font-semibold mb-2" htmlFor="bathrooms-filter">
          Filter by Bathrooms:
        </label>
        <input
          type="number"
          className="p-2 border rounded w-full"
          placeholder="Min Bathrooms"
          value={minBathrooms}
          onChange={(e) => setMinBathrooms(e.target.value)}
        />
      </div>
    </div>
  );
};

export default Filters;
