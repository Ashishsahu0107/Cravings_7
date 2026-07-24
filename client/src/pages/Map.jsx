import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

// Ensure L is on window for leaflet-routing-machine to work properly with Vite
window.L = window.L || L;
import "leaflet-routing-machine";

// Fix for default marker icons in Leaflet with Vite/Webpack
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const RoutingControl = ({ start, end }) => {
  const map = useMap();

  useEffect(() => {
    if (!start || !end) return;

    const routingControl = L.Routing.control({
      waypoints: [L.latLng(start[0], start[1]), L.latLng(end[0], end[1])],
      routeWhileDragging: true,
      lineOptions: {
        styles: [{ color: "#3b82f6", weight: 4 }], // Tailwind blue-500
      },
      show: false, // hide the text itinerary by default if it takes up too much space
      addWaypoints: false,
      fitSelectedRoutes: true,
      showAlternatives: false,
    }).addTo(map);

    return () => {
      try {
        if (map && routingControl) {
          map.removeControl(routingControl);
        }
      } catch (e) {
        console.error("Error removing routing control", e);
      }
    };
  }, [map, start, end]);

  return null;
};

const LocationSelector = ({ setDestination }) => {
  useMapEvents({
    click(e) {
      setDestination([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
};

const Map = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [destination, setDestination] = useState(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.error("Error getting location:", error);
          // Fallback location if user denies geolocation (e.g. New Delhi)
          setCurrentLocation([28.6139, 77.2090]);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      // Geolocation not supported
      setCurrentLocation([28.6139, 77.2090]);
    }
  }, []);

  if (!currentLocation) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-lg font-medium text-gray-600">Loading Map & Getting Location...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full relative z-0">
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-white px-6 py-3 rounded-full shadow-lg border border-gray-100">
        <p className="font-semibold text-gray-800 text-sm flex items-center gap-2">
          {destination ? (
            <>
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>
              Showing route to destination
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-blue-500 inline-block"></span>
              Click anywhere on the map to get directions
            </>
          )}
        </p>
      </div>
      
      <MapContainer
        center={currentLocation}
        zoom={13}
        className="h-full w-full z-0"
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Only show default marker if routing is not active, because routing control adds its own markers */}
        {!destination && (
          <Marker position={currentLocation}>
            <Popup>You are here</Popup>
          </Marker>
        )}

        <LocationSelector setDestination={setDestination} />

        {destination && (
          <RoutingControl start={currentLocation} end={destination} />
        )}
      </MapContainer>
    </div>
  );
};

export default Map;