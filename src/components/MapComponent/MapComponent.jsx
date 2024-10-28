import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, useMapEvent } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import RoutingMachine from "./RoutingMachine";



// Create a component to handle the routing logic


const MapComponent = ({ coordinates, registeringToTrip, maxDeviation = 5 }) => { // maxDeviation in kilometers
  const [coords, setCoords] = useState(null);

  useEffect(() => {
    let start;
    let end;
    let pickPoints = [];

    if (coordinates !== undefined) {
      for (const coord of coordinates) {
        if (coord.isStart) {
          start = [parseFloat(coord.latitude), parseFloat(coord.longitude)];
        } else if (coord.isEnd) {
          end = [parseFloat(coord.latitude), parseFloat(coord.longitude)];
        } else {
          pickPoints.push([parseFloat(coord.latitude), parseFloat(coord.longitude)]);
        }
      }
      setCoords([start, ...pickPoints, end]);
    }
  }, [coordinates]);

  const addPickupPoint = (latlng) => {
    debugger;
    if (isWithinDistance(latlng, coords, maxDeviation)) {
      setCoords((prevCoords) => {
        const updatedCoords = [...prevCoords];
        updatedCoords.splice(updatedCoords.length - 1, 0, [latlng.lat, latlng.lng]);
        return updatedCoords;
      });
    } else {
      alert(`Pickup point is too far from the route. Maximum deviation is ${maxDeviation} km.`);
    }
  };

  const isWithinDistance = (point, routeCoords, maxDist) => {
    for (let i = 0; i < routeCoords.length - 1; i++) {
      const dist = calculateDistanceFromLineSegment(routeCoords[i], routeCoords[i + 1], [point.lat, point.lng]);
      if (dist <= maxDist) return true;
    }
    return false;
  };

  // Calculate distance from a point to a line segment in kilometers
  const calculateDistanceFromLineSegment = ([lat1, lng1], [lat2, lng2], [lat, lng]) => {
    // Your distance calculation logic goes here
    // Can use the haversine formula for distances between the route and the click point
    return calculatedDistance;
  };

  return (
    <MapContainer
      center={coords ? coords[0] : [51.505, -0.09]}
      zoom={5}
      style={{ height: '400px', width: '60%' }}
      whenReady={(map) => {
        if (registeringToTrip) {
          useMapEvent('click', (e) => addPickupPoint(e.latlng));
        }
      }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {coords && <RoutingMachine coordinates={coords} />}
    </MapContainer>
  );
};

export default MapComponent;