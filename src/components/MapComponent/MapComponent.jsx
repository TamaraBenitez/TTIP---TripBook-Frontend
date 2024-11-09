import React, { useEffect, useState } from "react";
import { Circle, MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import "leaflet-geometryutil";
import RoutingMachine from "./RoutingMachine";
import MapClickHandler from "./MapClickHandler";
import { Box, Button, Typography } from "@mui/material";
import CenterMap from "./CenterMap";
import L from "leaflet"; // Import Leaflet for icon creation
import location from "../../assets/greenLocation.svg";


// Utility function to calculate distance between two points
const calculateDistance = (map, latlng1, latlng2) => {
  return map.distance(latlng1, latlng2); // distance in meters
};

// Utility function to find nearest route segment
const findNearestRouteSegment = (mapInstance, route, point) => {
  let minDistance = Infinity;
  for (let i = 0; i < route.length - 1; i++) {
    const closestPointOnSegment = L.GeometryUtil.closestOnSegment(mapInstance, point, route[i], route[i + 1]);
    const segmentPointDistance = calculateDistance(mapInstance, closestPointOnSegment, point);

    if (segmentPointDistance < minDistance) {
      minDistance = segmentPointDistance;
    }
  }
  return minDistance;
};

//returns true if point1 is nearest to objective
const isNearest = (point1, point2, objective, map) => {
  return calculateDistance(map, point1, objective) < calculateDistance(map, point2, objective);
};

const MapComponent = ({ width, coordinates, maxToleranceDistance = 2000, isRegistering = false, proposeNewRoute, userMarkerParam = null }) => {
  const [coords, setCoords] = useState(null);
  const [route, setRouteCoordinates] = useState([]);
  const [userMarker, setUserMarker] = useState(userMarkerParam);
  const [mapInstance, setMapInstance] = useState(null);
  const [routeCalculated, setRouteCalculated] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [isPointInRange, setIsPointInRange] = useState(true);
  // Create a green icon
  const greenIcon = new L.Icon({
    iconUrl: location,
    iconSize: [45, 75], // Use array format for icon size
    iconAnchor: [22.5, 75], // Set anchor point at the bottom center
    shadowUrl: null,
    shadowAnchor: null,
    className: "start-point-icon",
  });

  // Handle map clicks to set departure point
  const handleMapClick = (handleNewMarker) => {
    return <MapClickHandler handleNewMarker={handleNewMarker} />;
  };

  // Helper component to capture map instance
  const MapHelper = ({ onMapLoad }) => {
    const map = useMap();
    useEffect(() => {
      onMapLoad(map);
    }, [map, onMapLoad]);
    return null;
  };

  const handleRouteCoordinates = (coordinates) => {
    setRouteCoordinates(coordinates);
  };

  // Map list of trip-coordinates entities to array of coordinates
  const mapTripCoordinates = (tripCoords) => {
    let start, end;
    let stops = [];
    if (tripCoords !== undefined) {
      for (let i = 0; i < tripCoords.length; i++) {
        const coord = coordinates[i];
        if (coord.isStart) start = [parseFloat(coord.latitude), parseFloat(coord.longitude)];
        else if (coord.isEnd) end = [parseFloat(coord.latitude), parseFloat(coord.longitude)];
        else stops.push([parseFloat(coord.latitude), parseFloat(coord.longitude)]);
      }
      return [start, ...stops, end];
    }
  };

  const editPoint = () => {
    setUserMarker(null);
    setRouteCalculated(false);
  };

  const calculateNewRoute = () => {
    // Add the point and re-sort.
    // Take always from original 'coordinates' to avoid stacking markers on coords state
    setCalculating(true);
    const [startPoint, ...tail] = mapTripCoordinates(coordinates);
    const updatedCoords = sortedCoords(startPoint, userMarker, tail);
    setCoords(updatedCoords);
  };

  const sortedCoords = (start, newPoint, route) => {
    var sorted = [];
    var newPointAdded = false;
    for (let point = 0; point < route.length; point++) {
      const currentPoint = route[point];
      if (isNearest(currentPoint, newPoint, start, mapInstance)) {
        sorted.push(currentPoint);
      } else if (!newPointAdded) {
        sorted.push(newPoint);
        newPointAdded = true;
        // Add the remaining points and break out of the loop
        sorted.push(...route.slice(point));
        break;
      }
    }
    return [start, ...sorted];
  };

  const showMarker = () => coords && userMarker;
  
  const canAddMarker = () => isRegistering && coords && !routeCalculated;

  const getMarkerPosition = () => userMarker;
  
  useEffect(() => {
    if (coordinates !== undefined) {
      setCoords(mapTripCoordinates(coordinates));
    }
  }, [coordinates]);

  useEffect(() => {
    if (userMarker && mapInstance && route.length > 0) {
      const distanceToRoute = findNearestRouteSegment(mapInstance, route, userMarker);
      setIsPointInRange(distanceToRoute <= maxToleranceDistance);
    }
  }, [userMarker, mapInstance, route]);

  const handleNewMarker = (newPoint) => {
    setUserMarker(newPoint);
  };


  return (
    <>
      <MapContainer
        center={coords ? coords[0] : [51.505, -0.09]}
        zoom={5}
        style={{ height: "400px", width: width ? width : "80%" }}
      >
        <MapHelper onMapLoad={setMapInstance} />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <TileLayer
          url="http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
          subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
        />
        {showMarker() && (
          <>
            <Marker position={getMarkerPosition()} icon={greenIcon}/>
            {isRegistering && <Circle
              center={userMarker}
              radius={maxToleranceDistance}
              pathOptions={{color: isPointInRange ? "green" : "red"}}
              fillOpacity={0.2}
            />}
            <CenterMap coordinates={userMarker} />
          </>
        )}
        {canAddMarker() && handleMapClick(handleNewMarker)}
        {coords && (
          <RoutingMachine
            coordinates={coords}
            setRouteCoordinates={handleRouteCoordinates}
            setCalculating={setCalculating}
            setRouteCalculated={setRouteCalculated}
            manualCalculation={calculating}
            customCoordinate={userMarker}
          />
        )}
      </MapContainer>
      {isRegistering && (
        <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-around", width: "100%", marginTop: 5 }}>
          {routeCalculated && <Button onClick={editPoint}>Editar Punto</Button>}
          <Button
            variant="contained"
            onClick={routeCalculated ? () => proposeNewRoute(userMarker) : calculateNewRoute}
            disabled={calculating || userMarker == null || !isPointInRange}
          >
            {routeCalculated ? "Proponer" : "Calcular"} Ruta
          </Button>
        </Box>
      )}
      {!isPointInRange && (
        <Typography variant="body2" color="error" sx={{ textAlign: "center", marginTop: 2 }}>
          El punto está fuera de la distancia máxima tolerable.
        </Typography>
      )}
    </>
  );
};

export default MapComponent;