import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import { useState, useEffect, memo } from "react";
import { db } from "../../firebase"; // Ensure this points to your Firebase configuration
import { collection, getDocs } from "firebase/firestore";
import "leaflet/dist/leaflet.css";

const MapComponent = memo(() => {
  const [userProperties, setUserProperties] = useState([]);

  useEffect(() => {
    const fetchUserProperties = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "properties")); // Ensure "properties" is the correct collection name
        const fetchedProperties = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        console.log("Fetched Properties:", fetchedProperties); // Debugging log
        setUserProperties(fetchedProperties);
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
    };

    fetchUserProperties();
  }, []);

  return (
    <div
      className="map-layout"
      style={{
        display: "flex",
        gap: "20px",
        justifyContent: "left",
        alignItems: "flex-start",
        width: "100%",
        height: "100%",
        maxHeight: "400px", // Optional: limit the height
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "#fff",
          border: "1px solid #ddd",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <MapContainer
          style={{ width: "100%", height: "100%" }}
          zoom={10}
          center={[51.0447, -114.0719]} // Center on Calgary
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">
              OpenStreetMap
            </a> contributors'
          />

          {/* Display user properties as small blue dots */}
          {userProperties.map((property, index) =>
            property.latitude && property.longitude ? (
              <CircleMarker
                key={`user-property-${index}`}
                center={[property.latitude, property.longitude]}
                radius={6}
                pathOptions={{ color: "black", fillColor: "blue", fillOpacity: 0.7 }}
              >
                <Popup>
                  <strong>{property.address}</strong>
                  <br />
                  {property.neighborhood}
                </Popup>
              </CircleMarker>
            ) : null
          )}
        </MapContainer>
      </div>
    </div>
  );
});

MapComponent.displayName = "MapComponent";
export default MapComponent;
