import React, { useEffect, useState } from "react";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import "leaflet-geometryutil";
import RoutingMachine from "./RoutingMachine";
import CenterMap from "./CenterMap";
import L from "leaflet";
import location from "../../assets/greenLocation.svg";
import MapHelper from "./MapHelper";



const MapComponent = ({ width, coordinates, maxToleranceDistance = 2000, isRegistering = false, proposeNewRoute, userMarkerParam = null }) => {
  const [coords, setCoords] = useState(null);//marcadores
  const [route, setRouteCoordinates] = useState([]); //rutas calculadas por rmachine
  const [userMarker, setUserMarker] = useState(userMarkerParam);
  const [mapInstance, setMapInstance] = useState(null);

  const greenIcon = new L.Icon({
    iconUrl: location,
    iconSize: [45, 75], 
    iconAnchor: [22.5, 75],
    shadowUrl: null,
    shadowAnchor: null,
    className: "start-point-icon",
  });

  const handleRouteCoordinates = (coordinates) => {
    setRouteCoordinates(coordinates);
  };

  const showMarker = () => coords && userMarker;
  

  const getMarkerPosition = () => userMarker;
  
  useEffect(() => {
    if (coordinates !== undefined) {
      setCoords(coordinates)
    }
  }, [coordinates]);


  const handleNewMarker = (newPoint) => {
    setUserMarker(newPoint);
  };


  return (
    <>
      {coords && coords[0] && 
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
            <CenterMap coordinates={userMarker} />
          </>
        )}
        {coords && (
          <RoutingMachine
            coordinates={coords}
            setRouteCoordinates={handleRouteCoordinates}
            customCoordinate={userMarker}
          />
        )}
      </MapContainer>}
      
    </>
  );
};

export default MapComponent;