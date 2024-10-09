import L from "leaflet";
import "leaflet-routing-machine";
import "./RoutingMachine.css"
import { useMap } from "react-leaflet";
import { useEffect } from "react";

const RoutingMachine = (props) => {
    const map = useMap(); // Get the map instance from react-leaflet
    const coordenates = props.coordenates;
    useEffect(() => {
      const routingControl = L.Routing.control({
        waypoints: coordenates.map((coord)=>L.latLng(coord[0], coord[1])),
        lineOptions: {
          styles: [{ color: "blue", weight: 4 }], // Style of the route line
        },
        router: L.Routing.osrmv1({
          serviceUrl: `https://router.project-osrm.org/route/v1`, // OSRM public routing service
        }),
        addWaypoints: false,
        draggableWaypoints: false,
        fitSelectedRoutes: true,
      }).addTo(map);
  
      return () => {
        // Remove the routing control when the component is unmounted
        map.removeControl(routingControl);
      };
    }, [map, coordenates[0], coordenates[coordenates.length - 1]]);
  
    return null; // This component doesn't render anything itself
  };

export default RoutingMachine;