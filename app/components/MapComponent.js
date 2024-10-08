import { ComposableMap, Geographies, Geography } from 'react-simple-maps';

const MapComponent = ({ data, onSelectCommunity, selectedCommunity }) => {
  const geoUrl = '/community-district-boundaries.geojson'; // Ensure this file is accessible

  return (
    <ComposableMap
      projection="geoAlbers"
      projectionConfig={{ scale: 60000, center: [-114.07, 51.05] }} // Center the map on Calgary
      width={800}
      height={600}
    >
      <Geographies geography={geoUrl}>
        {({ geographies, loading, error }) => {
          // Add logs for debugging
          console.log('Geographies:', geographies);
          console.log('Loading:', loading);
          console.log('Error:', error);

          if (loading) return <div>Loading geographies...</div>;
          if (error) {
            console.error('Error loading geographies:', error);
            return <div>Error loading geographies</div>;
          }
          if (!geographies || geographies.length === 0) {
            console.error('No geographies found');
            return <div>No geographies available</div>;
          }

          return geographies.map((geo) => (
            <Geography
              key={geo.rsmKey}
              geography={geo}
              style={{
                default: { fill: '#D6D6DA', outline: 'none' },
                hover: { fill: '#F53', outline: 'none' },
                pressed: { fill: '#E42', outline: 'none' },
              }}
            />
          ));
        }}
      </Geographies>
    </ComposableMap>
  );
};

export default MapComponent;
