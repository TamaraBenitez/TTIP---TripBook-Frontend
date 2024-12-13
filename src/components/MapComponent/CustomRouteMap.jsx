import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import L, { icon, point } from "leaflet";
import { sortedCoordsWithNewPoint } from "../../utility/Utility";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.js";
import MapHelper from "./MapHelper";
import RoutingMachineGeocoder from "./RoutingMachineGeocoder";
const CustomRouteMap = ({ startCoord, route, setRoute }) => {
  const [mapInstance, setMapInstance] = useState(null);
  const [coordToAdd, setCoordToAdd] = useState({});
  function createButton(label, container, className = "") {
    var btn = L.DomUtil.create("button", className, container);
    btn.setAttribute("type", "button");
    btn.innerHTML = label;
    return btn;
  }
  const recalculateRoute = (newCoord) => {
    const [start, ...tail] = route;
    const sorted = sortedCoordsWithNewPoint(start, tail, mapInstance, newCoord);
    setRoute(sorted);
    mapInstance.closePopup();
  };
  useEffect(() => {
    if (mapInstance) {
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(mapInstance);

      mapInstance.on("click", (e) => {
        const latLng = e.latlng;

        const container = L.DomUtil.create("div");
        const addPinBtn = createButton("Agregar pin", container);

        L.popup().setContent(container).setLatLng(latLng).openOn(mapInstance);

        const geocoder = L.Control.Geocoder.nominatim();
        var mapAdress;
        geocoder.reverse(
          latLng,
          mapInstance.options.crs.scale(mapInstance.getZoom()),
          (results) => {
            if (results.length > 0) {
              const address = results[0].name || "Direccion no disponible";
              mapAdress = address;
            }
          }
        );

        L.DomEvent.on(addPinBtn, "click", () => {
          setCoordToAdd({
            coords: [latLng.lat, latLng.lng],
            address: mapAdress,
          });
        });
      });
    }
  }, [mapInstance]);

  useEffect(() => {
    if (Object.keys(coordToAdd).length > 0) {
      recalculateRoute(coordToAdd);
    }
  }, [coordToAdd]);

  return (
    <MapContainer
      center={startCoord}
      zoom={9}
      style={{ height: "50vh", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <MapHelper onMapLoad={setMapInstance} />
      {mapInstance && (
        <>
          <RoutingMachineGeocoder
            mapInstance={mapInstance}
            setRoute={setRoute}
            points={route}
            setCoordToAdd={setCoordToAdd}
          />
        </>
      )}
    </MapContainer>
  );
};

export default CustomRouteMap;
