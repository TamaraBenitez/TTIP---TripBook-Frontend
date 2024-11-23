import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L, { icon, point } from "leaflet";
import { areCoordsEqual, calculateMapDistance, sortedCoords,reverseGeocode, sortedCoordsWithNewPoint } from "../../utility/Utility";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.js";
import greenMarker from "../../assets/greenMarker.svg"
import MapHelper from "./MapHelper";
const RoutingControl = ({ mapInstance, points, setRoute, setCoordToAdd }) => {
  const [calculatedRoute, setCalculatedRoute] = useState([]);

  useEffect(() => {
    const geocoder = L.Control.geocoder({
      defaultMarkGeocode: false,
    })
      .on("markgeocode", (e) => {
        const latLng = e.geocode.center;

   
        setCoordToAdd({address:e.geocode.properties.display_name, coords:[latLng.lat, latLng.lng]})


        mapInstance.setView(latLng, 13);
      })
      .addTo(mapInstance);

    if (mapInstance._routingControl) {
      mapInstance.removeControl(mapInstance._routingControl);
    }

    const routingControl = L.Routing.control({
      waypoints: points.map((point)=>point.coords),
      routeWhileDragging: true,
      geocoder: L.Control.Geocoder.nominatim(),
      lineOptions: {
        styles: [{ color: "blue", weight: 2 }], 
      },
      router: L.Routing.osrmv1({
        serviceUrl: `https://router.project-osrm.org/route/v1`, 
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
        const address = points[i].address;

        //all points are draggable except start and end
        if(i!==0 && i !== (points.length - 1)){
          marker = draggableMarker;
          const draggableMarkerText = L.DomUtil.create("p", "", container);
          draggableMarkerText.innerHTML= address;

          const deleteBtn = L.DomUtil.create("button", "", container);
          deleteBtn.innerHTML = "Borrar";

          deleteBtn.onclick = () => {
            const newRoute = points.filter((_, index) => index !== i);
            setRoute(newRoute);
            mapInstance.removeLayer(marker);
          };
          marker.on('drag', (e)=>{
            mapInstance._userInteracted = true
           })
  
      } else{
        const adrdressText = L.DomUtil.create("p", "", container);
        adrdressText.innerHTML =address;
        const disclaimerText = L.DomUtil.create("p", "", container);
        disclaimerText.innerHTML ="Para cambiar este punto haz click en 'EDITAR VIAJE'";
        marker = staticMarker;
      }
      marker.bindPopup(container);
        return marker;
      },
    }).addTo(mapInstance);

    routingControl.on("routesfound", (e) => {
      //Since route recalculation may change a bit the pin positions(if user has placed pin on unreachable place)
      //We get the start point by closeness to the original start point(points[0])
      if (mapInstance._userInteracted) {
        for (let index = 0; index < e.routes[0].waypoints.length; index++) {
          const wp = e.routes[0].waypoints[index];
          let geocoder = L.Control.Geocoder.nominatim();
          let {lat, lng} = wp.latLng;
          var filtered = [];
          reverseGeocode(geocoder,lat,lng,
                  (result) => {
                    ;
                    if(!filtered.find((point)=>areCoordsEqual(point.coords,result.coords))){
                      filtered.push(result);
                    }
   
                    if(index == (e.routes[0].waypoints.length - 1) && filtered.length == e.routes[0].waypoints.length){
                      let start = filtered.reduce((closestPoint, currentPoint) => {
                        const currentDistance = calculateMapDistance(mapInstance, points[0].coords, currentPoint.coords);
                    
                        if (!closestPoint || currentDistance < closestPoint.distance) {
                          return { point: currentPoint, distance: currentDistance };
                        }
                    
                        return closestPoint;
                      }, null)?.point;
                      let tail = filtered.filter((point)=>!areCoordsEqual(start.coords, point.coords,3));
                      const sorted = sortedCoords(start, tail);
                      setRoute(sorted);
                    }
                  },true   
          );
          
        }     
      }
    });

    mapInstance._routingControl = routingControl;
    mapInstance._userInteracted = false;

    return () => {
      if (mapInstance._routingControl) {
        mapInstance.removeControl(mapInstance._routingControl);
        mapInstance._routingControl = null;
      }
      mapInstance.removeControl(geocoder);
    };
  }, [points]);

  useEffect(() => {
    if (mapInstance && mapInstance._routingControl) {
      mapInstance._routingControl.on("waypointschanged", () => {
        mapInstance._userInteracted = true;
      });
    }
  }, [points]);
  useEffect(()=>{
    if(calculatedRoute.length){
      setRoute(calculatedRoute)
    }
  },[calculatedRoute])
  return null;
};


const CustomRouteMap = ({
  startCoord,
  route,
  setRoute
}) => {
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
        geocoder.reverse(latLng, mapInstance.options.crs.scale(mapInstance.getZoom()), (results) => {
          if (results.length > 0) {
            const address = results[0].name || "Direccion no disponible";
            mapAdress = address;
          }
        });
  
        L.DomEvent.on(addPinBtn, "click", () => {
          setCoordToAdd({coords: [latLng.lat, latLng.lng], address:mapAdress});
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
            points={route}
            setCoordToAdd={setCoordToAdd}
          />
        </>
      )}
    </MapContainer>
  );
};

export default CustomRouteMap;
