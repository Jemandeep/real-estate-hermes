// Import necessary components and hooks from React-Leaflet and React
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet'; // Leaflet is used for rendering the map and handling geospatial data
import { useEffect, useState, memo } from 'react'; // React hooks for managing side effects and state
import 'leaflet/dist/leaflet.css'; // Import Leaflet's default CSS to style the map

// Component responsible for adjusting the map bounds to fit the provided GeoJSON data
// geoData prop contains GeoJSON data for Calgary communities
const FitBoundsToGeoJSON = ({ geoData }) => {
  const map = useMap(); // Access the Leaflet map instance using React-Leaflet's useMap hook

  // React's useEffect hook triggers side effects when dependencies (geoData, map) change
  useEffect(() => {
    if (geoData) {
      const geoJsonLayer = L.geoJSON(geoData); // Create a Leaflet GeoJSON layer using the provided data
      const bounds = geoJsonLayer.getBounds(); // Get the geographic bounds of the GeoJSON data
      map.fitBounds(bounds); // Adjust the map view to fit within these bounds
    }
  }, [geoData, map]); // Dependency array: Effect will run whenever geoData or map changes

  return null; // This component doesn't render anything, it's purely for managing map bounds
};

// Main MapComponent wrapped with React.memo to prevent unnecessary re-renders when props don't change
// onSelectCommunity is a callback function prop to handle community selection
const MapComponent = memo(({ onSelectCommunity }) => {
  const [geoData, setGeoData] = useState(null); // useState hook for managing GeoJSON data state (initially null)

  // Fetch GeoJSON data once the component is mounted (on the first render)
  useEffect(() => {
    fetch('/community-district-boundaries.geojson') // Path to the GeoJSON file (adjust as needed)
      .then((response) => response.json()) // Parse the JSON data from the response
      .then((data) => setGeoData(data)) // Store the parsed GeoJSON data in state
      .catch((error) => console.error('Error loading GeoJSON:', error)); // Handle any errors in fetching the data
  }, []); // Empty dependency array ensures the effect runs only once after the component mounts

  // Define the style for the GeoJSON layer (community boundaries)
  const style = {
    color: 'green', // Boundary line color
    weight: 2, // Line thickness
    fillColor: 'green', // Fill color for the polygons
    fillOpacity: 0.3, // Opacity for the fill (range from 0 to 1)
  };

  // Function to attach event listeners to each feature (community)
  const onEachFeature = (feature, layer) => {
    layer.on({
      click: () => {
        onSelectCommunity(feature.properties.name); // When a community is clicked, pass its name to the callback
      },
    });
  };

  return (
    // MapContainer sets up the Leaflet map, with height and width specified through inline styles
    <MapContainer
      style={{ height: '600px', width: '100%' }} // Fixed size of the map (600px height and full width)
      zoom={11} // Initial zoom level (11 is good for city-level maps)
      center={[51.0447, -114.0719]} // Initial center of the map, here it's centered on Calgary (lat, lon)
    >
      {/* TileLayer provides the map tiles, in this case from OpenStreetMap */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" // URL pattern for OpenStreetMap tiles
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' // Attribution for using OpenStreetMap tiles
      />
      {/* Conditionally render the GeoJSON data if it's loaded */}
      {geoData && (
        <>
          {/* Render the GeoJSON data as a layer on the map, styled by the 'style' object */}
          <GeoJSON data={geoData} style={style} onEachFeature={onEachFeature} />
          {/* FitBoundsToGeoJSON will adjust the map bounds based on the loaded GeoJSON data */}
          <FitBoundsToGeoJSON geoData={geoData} />
        </>
      )}
    </MapContainer>
  );
});

// Export the MapComponent so it can be imported and used in other parts of the app
export default MapComponent;

