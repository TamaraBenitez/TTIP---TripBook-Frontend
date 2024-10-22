import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet-routing-machine";
import pin from "/images/pin.svg?url";
import flag from "/images/Flag2.svg?url";
import RoutingMachine from "./RoutingMachine";

// const originMarker = new L.Icon({
//   iconUrl: pin,
//   iconAnchor: null,
//   popupAnchor: null,
//   shadowUrl: null,
//   shadowSize: null,
//   shadowAnchor: null,
//   iconSize: new L.Point(45, 75),
//   className: "start-point-icon",
// });

// const destinationMarker = new L.Icon({
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


const MapComponent = ({coordinates}) => {
  const [coords, setCoords] = useState(null);
  console.log(coordinates)
  useEffect(()=>{
    var start;
    var end;
    var pickPoints = [];
    if(coordinates !== undefined){
      for (let i = 0; i < coordinates.length; i++) {
        const coord = coordinates[i];
        if (coord.isStart){
          start = [parseFloat(coord.latitude), parseFloat(coord.longitude)]
        } else if(coord.isEnd){
          end = [parseFloat(coord.latitude),parseFloat(coord.longitude)]
        } else {
          pickPoints.push([parseFloat(coord.latitude),parseFloat(coord.longitude)])
        }
      }
      let res = [start, ...pickPoints, end];
      setCoords(res)
    }
  },[coordinates])
  

  return (
    <MapContainer
      center={coords ? coords[0] : [51.505, -0.09]}
      zoom={5}
      style={{ height: "400px", width: "60%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {/*
      <Marker icon={originMarker} position={origin}>
        <Popup>Start</Popup>
      </Marker>
      <Marker icon={destinationMarker} position={destination}>
        <Popup>End</Popup>
      </Marker>*/}

      {/* Add the RoutingControl to calculate the fastest route */}
      {(coords!==null) && <RoutingMachine coordinates={coords}/>}
    </MapContainer>
  );
};

export default MapComponent;