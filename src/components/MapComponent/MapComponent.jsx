import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet-routing-machine";
import pin from "/images/pin.svg?url";
import flag from "/images/Flag2.svg?url";
import RoutingMachine from "./RoutingMachine";

// const startPointMarker = new L.Icon({
//   iconUrl: pin,
//   iconAnchor: null,
//   popupAnchor: null,
//   shadowUrl: null,
//   shadowSize: null,
//   shadowAnchor: null,
//   iconSize: new L.Point(45, 75),
//   className: "start-point-icon",
// });

// const endPointMarker = new L.Icon({
//   iconUrl: flag,
//   iconAnchor: null,
//   popupAnchor: null,
//   shadowUrl: null,
//   shadowSize: null,
//   shadowAnchor: null,
//   iconSize: new L.Point(45, 75),
//   className: "end-point-icon",
// });

// Create a component to handle the routing logic


const MapComponent = () => {
  const startPoint = [-38.95, -68.05]; // Example coordinates
  const pickpoint1 = [-38.3, -68.2] 
  const endPoint = [-24.8, -65.4]; // Example coordinates

  return (
    <MapContainer
      center={startPoint}
      zoom={5}
      style={{ height: "400px", width: "60%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {/*
      <Marker icon={startPointMarker} position={startPoint}>
        <Popup>Start</Popup>
      </Marker>
      <Marker icon={endPointMarker} position={endPoint}>
        <Popup>End</Popup>
      </Marker>*/}

      {/* Add the RoutingControl to calculate the fastest route */}
      <RoutingMachine coordenates={[startPoint, pickpoint1, endPoint]}/>
    </MapContainer>
  );
};

export default MapComponent;