import L from "leaflet";
import "leaflet-routing-machine";
import "./RoutingMachine.css";
import { useMap } from "react-leaflet";
import { useEffect, useState } from "react";
import location from "../../assets/greenLocation.svg";
const RoutingMachine = ({
  coordinates,
  customCoordinate,
  setRouteCoordinates = () => {},
  // setCalculating = () => {},
  // setRouteCalculated = () => {},
  // manualCalculation = false
}) => {
  const map = useMap(); // Get the map instance from react-leaflet
  const [coords, setCoords] = useState(coordinates);

  useEffect(() => {
    setCoords(coordinates);
  }, [coordinates]);

  useEffect(() => {
    // setCalculating(true);
    if (coords) {
      const greenIcon = new L.Icon({
        iconUrl: location,
        iconSize: [45, 75],
        iconAnchor: [22.5, 75],
        shadowUrl: null,
        shadowAnchor: null,
        className: "start-point-icon",
      });

      const routingControl = L.Routing.control({
        waypoints: coords.map((coord) => L.latLng(coord[0], coord[1])),
        lineOptions: {
          styles: [{ color: "blue", weight: 4 }],
        },
        router: L.Routing.osrmv1({
          serviceUrl: `https://router.project-osrm.org/route/v1`,
        }),
        addWaypoints: false,
        draggableWaypoints: false,
        fitSelectedRoutes: true,
        createMarker: (i, waypoint) => {
          // Check if the current waypoint matches the custom coordinate
          if (customCoordinate && 
              waypoint.latLng.lat == customCoordinate[0] &&
              waypoint.latLng.lng == customCoordinate[1]) {
            // Return custom marker if it matches
            return L.marker(waypoint.latLng, { icon: greenIcon });
          }
          // Otherwise, return the default marker
          return L.marker(waypoint.latLng);
        },
      })
        .on("routesfound", (e) => {
          const route = e.routes[0];
          const routeCoords = route.coordinates.map((coord) => [
            coord.lat,
            coord.lng,
          ]);
          if (setRouteCoordinates) {
            setRouteCoordinates(routeCoords);
            // setCalculating(false);
            // if (manualCalculation) {
            //   setRouteCalculated(true);
            // }
          }
        })
        .addTo(map);

      return () => {
        map.removeControl(routingControl);
      };
    }
  }, [map, coords, customCoordinate]);

  return null; 
};

export default RoutingMachine;