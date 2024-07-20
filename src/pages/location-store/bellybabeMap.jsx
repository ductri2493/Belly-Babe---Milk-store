import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import exampleIcon from "../../assets/img/location.png"; // Adjust the path as necessary

const bellybabeMap = () => {
  // Define an icon using the imported image
  const exampleIconMarker = L.icon({
    iconUrl: exampleIcon, // Use the imported image
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  return (
    <MapContainer
      center={[10.841074902549295, 106.81011903097779]}
      zoom={13}
      style={{ height: "500px", width: "650px" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* Marker 1: Example address */}
      <Marker
        position={[10.841074902549295, 106.81011903097779]}
        icon={exampleIconMarker}
      >
        <Popup>
          Address 1✨✨
          <br />
          FPT University HCMC
        </Popup>
      </Marker>

      {/* Marker 2: Another example address */}
      <Marker
        position={[10.875106797838704, 106.80071711170355]}
        icon={exampleIconMarker}
      >
        <Popup>
          Address 2✨✨
          <br />
          VNUHCM Student Cultural House
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default bellybabeMap;
