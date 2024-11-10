import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L, { icon } from "leaflet";
import { sortedCoordsWithNewPoint } from "../../utility/Utility";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.js";
import greenMarker from "../../assets/greenMarker.svg"
const MapHelper = ({ onMapLoad }) => {
  const map = useMap();
  useEffect(() => {
    onMapLoad(map);
  }, [map, onMapLoad]);
  return null;
};

const RoutingControl = ({ mapInstance, coords, setRoute }) => {

  useEffect(() => {
    // Check if there's already a routing control layer and remove it
    if (mapInstance._routingControl) {
      mapInstance.removeControl(mapInstance._routingControl);
    }

    // Create a new routing control and assign it to the map
    const routingControl = L.Routing.control({
      waypoints: coords,
      routeWhileDragging: true,
      geocoder: L.Control.Geocoder.nominatim(),
      lineOptions: {
        styles: [{ color: "blue", weight: 2 }], // Style of the route line
      },
      router: L.Routing.osrmv1({
        serviceUrl: `https://router.project-osrm.org/route/v1`, // OSRM public routing service
      }),
      createMarker: (i, waypoint) => {
        const customMarker = new L.Icon({
          iconUrl: greenMarker,
          iconSize: [45, 75],
          iconAnchor: [22.5, 75],
          shadowUrl: null,
          shadowAnchor: null,
          className: "start-point-icon",
        });
        const staticMarker = L.marker(waypoint.latLng,{draggable: false, icon:customMarker})
        const draggableMarker = L.marker(waypoint.latLng, { draggable: true})
        var marker;
        const container = L.DomUtil.create("div");
        if(i!==0 && i !== (coords.length - 1)){
          marker = draggableMarker;
          const deleteBtn = L.DomUtil.create("button", "", container);
          deleteBtn.innerHTML = "Borrar";
          deleteBtn.onclick = () => {
          // Remove this marker's coordinates from the route
          const newRoute = coords.filter((_, index) => index !== i);
          setRoute(newRoute);

          // Remove marker from map
          mapInstance.removeLayer(marker);
        };


        } else{
          const staticMarkerText = L.DomUtil.create("p", "", container);
          staticMarkerText.innerHTML = "Para cambiar este punto haz click en 'EDITAR VIAJE'";
          marker = staticMarker;
        }
        marker.bindPopup(container);
        
        return marker;
      },
    }).addTo(mapInstance);

    routingControl.on("routesfound", (e) => {
      // Update the route state only when the user interacts, not during initial render
      if (mapInstance._userInteracted) {
        const newWaypoints = e.routes[0].waypoints.map((wp) => [
          wp.latLng.lat,
          wp.latLng.lng,
        ]);
        setRoute(newWaypoints);
      }
    });

    mapInstance._routingControl = routingControl;
    mapInstance._userInteracted = false;

    return () => {
      // Clean up the routing control when the component unmounts or dependencies change
      if (mapInstance._routingControl) {
        mapInstance.removeControl(mapInstance._routingControl);
        mapInstance._routingControl = null;
      }
    };
  }, [coords]);

  useEffect(() => {
    if (mapInstance && mapInstance._routingControl) {
      mapInstance._routingControl.on("waypointschanged", () => {
        mapInstance._userInteracted = true;
      });
    }
  }, [coords]);

  return null;
};


const CustomRouteMap = ({
  startCoord,
  endCoord,
  route,
  setRoute
}) => {
  const [mapInstance, setMapInstance] = useState(null);
  const [coordToAdd, setCoordToAdd] = useState();

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
        const container = L.DomUtil.create("div");
        const addPinBtn = createButton("Agregar pin", container);
        L.popup().setContent(container).setLatLng(e.latlng).openOn(mapInstance);

        L.DomEvent.on(addPinBtn, "click", () => {
          setCoordToAdd([e.latlng.lat, e.latlng.lng]);
        });
      });
    }
  }, [mapInstance]);

  useEffect(() => {
    if (coordToAdd) {
      recalculateRoute(coordToAdd);
    }
  }, [coordToAdd]);

  return (
    <MapContainer center={startCoord} zoom={9} style={{ height: "50vh", width:"100%"}}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <MapHelper onMapLoad={setMapInstance} />
      {mapInstance && (
        <>
          <RoutingControl
            mapInstance={mapInstance}
            setRoute={setRoute}
            coords={route}
          />
        </>
      )}
    </MapContainer>
  );
};

export default CustomRouteMap;
