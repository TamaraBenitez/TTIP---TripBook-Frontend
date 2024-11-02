import React, { useEffect, useState } from "react";
import { Circle, MapContainer, Marker, Polyline, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import "leaflet-geometryutil";
import RoutingMachine from "./RoutingMachine";
import MapClickHandler from "./MapClickHandler";
import { Button } from "@mui/material";
import CenterMap from "./CenterMap";


// Utility function to calculate distance between two points
const calculateDistance = (map,latlng1, latlng2) => {
  return map.distance(latlng1, latlng2); // distance in meters
};

// Utility function to find nearest route segment
const findNearestRouteSegment = (mapInstance, route, point) => {
  let minDistance = Infinity;
  for (let i = 0; i < route.length - 1; i++) {
    const closestPointOnSegment = L.GeometryUtil.closestOnSegment(mapInstance,point, route[i], route[i + 1]);
    const segmentPointDistance = calculateDistance(mapInstance, closestPointOnSegment, point);

    if (segmentPointDistance < minDistance) {
      minDistance = segmentPointDistance;
    }
  }
  return minDistance;
};

//returns true if point1 is nearest to objective
const isNearest = (point1, point2, objective, map)=>{
  return calculateDistance(map, point1, objective) < calculateDistance(map, point2, objective)
}

const MapComponent = ({ coordinates, maxToleranceDistance = 2000, isRegistering = false, proposeNewRoute}) => {
  const [coords, setCoords] = useState(null);
  const [route, setRouteCoordinates] = useState([]);
  const [userMarker, setUserMarker] = useState(null);
  const [mapInstance, setMapInstance] = useState(null);
  const [routeCalculated, setRouteCalculated] = useState(false);
  const [calculating, setCalculating] = useState(false);
  // Handle map clicks to set departure point
  const handleMapClick = (handleNewMarker) =>{
    return <MapClickHandler handleNewMarker={handleNewMarker} />;
  } 
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

  //map list of trip-coordinates entities to array of coordinates
  const mapTripCoordinates = (tripCoords) =>{
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
  }
  const editPoint = () =>{
    setUserMarker(null);
    setRouteCalculated(false)
  }
  const calculateNewRoute = () =>{
        // Add the point and re-sort. 
        //Take always from original 'coordinates' to avoid stacking markers on coords state
        setCalculating(true);
        const [startPoint, ...tail] = mapTripCoordinates(coordinates);
        const updatedCoords = sortedCoords(startPoint, userMarker, tail);
        setCoords(updatedCoords);
  }

  const sortedCoords = (start, newPoint, route)=>{
    var sorted = [];
    var newPointAdded = false;
    for (let point = 0; point < route.length; point++) {
      const currentPoint = route[point];
      if(isNearest(currentPoint, newPoint, start, mapInstance)){
        sorted.push(currentPoint);
      } else if(!newPointAdded){
        sorted.push(newPoint);
        newPointAdded = true;
        // Add the remaining points and break out of the loop
        sorted.push(...route.slice(point));
        break;
      }
    }
    return [start, ...sorted];
  }
  const showMarker = () => {
    return coords && isRegistering && userMarker;
  }
  const canAddMarker = () =>{
    return isRegistering && coords && !routeCalculated
  }
  useEffect(() => {
    if(coordinates !== undefined){
      setCoords(mapTripCoordinates(coordinates));
    }
  }, [coordinates]);

  const handleNewMarker = (newPoint) => {
    // Calculate the distance to the nearest segment
    const distanceToRoute = findNearestRouteSegment(mapInstance, route, newPoint);
    if (distanceToRoute > maxToleranceDistance) {
      alert("El punto esta fuera de la distancia maxima tolerable!");
      return;
    }

    setUserMarker(newPoint);

  };
  const getMarkerPosition = () =>{
   return userMarker;
  }
  return (
    <>
    <MapContainer
      center={coords ? coords[0] : [51.505, -0.09]}
      zoom={5}
      style={{ height: "400px", width: "60%" }}
    >
      <MapHelper onMapLoad={setMapInstance} />
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <TileLayer
        url="http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}" 
        subdomains={['mt0','mt1','mt2','mt3']} 
      />
      {showMarker() && 
      <>
        <Marker position={getMarkerPosition()} /> 
        <Circle center={userMarker} radius={maxToleranceDistance} color="blue" fillOpacity={0.2} />
        <CenterMap coordinates={userMarker} />
      </>
      }
      <CenterMap></CenterMap>
      {canAddMarker() && handleMapClick(handleNewMarker)}
      {coords && <RoutingMachine coordinates={coords} 
                                 setRouteCoordinates={handleRouteCoordinates}
                                 setCalculating={setCalculating}
                                 setRouteCalculated={setRouteCalculated}
                                 manualCalculation={calculating}/>}
      {/* Buffer zone around the route */}
      
    </MapContainer>
    {isRegistering && 
    <>
    <Button 
      onClick={
        routeCalculated ? ()=>proposeNewRoute(userMarker) : calculateNewRoute
      }
      disabled={calculating}
    >
      {routeCalculated ? "Proponer" : "Calcular"} Ruta
    </Button>
    {routeCalculated && <Button onClick={editPoint}>Editar Punto</Button>}
    </>
    }
    </>
  );
};

export default MapComponent;