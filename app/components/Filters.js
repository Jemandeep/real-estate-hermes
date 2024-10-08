import React from 'react';

const Filters = ({
  neighborhoods,
  propertyTypes,
  filteredNeighborhood,
  setFilteredNeighborhood,
  filteredPropertyType,
  setFilteredPropertyType,
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
    </div>
  );
};

export default Filters;
