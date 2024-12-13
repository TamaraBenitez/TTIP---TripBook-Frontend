import L from "leaflet";
import "leaflet-routing-machine";
import "./RoutingMachine.css";
import { useEffect, useState } from "react";
import {
  areCoordsEqual,
  calculateMapDistance,
  sortedCoords,
  reverseGeocode,
} from "../../utility/Utility";
import greenMarker from "../../assets/greenMarker.svg";

const RoutingMachineGeocoder = ({
  mapInstance,
  points,
  setRoute,
  setCoordToAdd,
  setCalculating,
  manualCalculation,
  setManualCalculation,
  isRegistering,
  setRoutingMachineCalulatedCoordinates,
  userPickPoint,
}) => {
  useEffect(() => {
    var geocoder;
    if (!isRegistering) {
      if (mapInstance.geocoder) {
        console.log("REMOVING");
        mapInstance.removeControl(geocoder);
      }
      geocoder = L.Control.geocoder({
        defaultMarkGeocode: false,
      })
        .on("markgeocode", (e) => {
          const latLng = e.geocode.center;

          setCoordToAdd({
            address: e.geocode.properties.display_name,
            coords: [latLng.lat, latLng.lng],
          });

          mapInstance.setView(latLng, 13);
        })
        .addTo(mapInstance);
    }
    if (mapInstance._routingControl) {
      mapInstance.removeControl(mapInstance._routingControl);
    }

    const routingControl = L.Routing.control({
      waypoints: points.map((point) => point.coords || point),
      routeWhileDragging: true,
      lineOptions: {
        styles: [{ color: "blue", weight: 2 }],
      },
      router: L.Routing.osrmv1({
        serviceUrl: `https://router.project-osrm.org/route/v1`,
      }),
      createMarker: (i, waypoint) => {
        if (
          isRegistering &&
          waypoint.latLng.lat == userPickPoint[0] &&
          waypoint.latLng.lng == userPickPoint[1]
        ) {
          return;
        } else {
          const customMarker = new L.Icon({
            iconUrl: greenMarker,
            iconSize: [45, 75],
            iconAnchor: [22.5, 75],
            shadowUrl: null,
            shadowAnchor: null,
            className: "start-point-icon",
          });
          const staticMarker = L.marker(waypoint.latLng, {
            draggable: false,
            icon: customMarker,
          });
          const draggableMarker = L.marker(waypoint.latLng, {
            draggable: !isRegistering,
          });
          var marker;
          const container = L.DomUtil.create("div");
          const address = points[i].address;

          //all points are draggable except start and end
          if (i !== 0 && i !== points.length - 1) {
            marker = draggableMarker;
            const draggableMarkerText = L.DomUtil.create("p", "", container);
            draggableMarkerText.innerHTML = address;

            if (!isRegistering) {
              const deleteBtn = L.DomUtil.create("button", "", container);
              deleteBtn.innerHTML = "Borrar";

              deleteBtn.onclick = () => {
                const newRoute = points.filter((_, index) => index !== i);
                setRoute(newRoute);
                mapInstance.removeLayer(marker);
              };
            }
            marker.on("drag", (e) => {
              mapInstance._userInteracted = true;
            });
          } else {
            const disclaimerText = L.DomUtil.create("p", "", container);
            const adrdressText = L.DomUtil.create("p", "", container);
            adrdressText.innerHTML = address;

            if (!isRegistering) {
              disclaimerText.innerHTML =
                "Para cambiar este punto haz click en 'EDITAR VIAJE'";
            } else {
              disclaimerText.innerHTML = `Punto de ${
                i == 0 ? "partida" : "llegada"
              }`;
            }
            marker = staticMarker;
          }
          marker.bindPopup(container);
          return marker;
        }
      },
    }).addTo(mapInstance);

    routingControl.on("routesfound", (e) => {
      //Since route recalculation may change a bit the pin positions(if user has placed pin on unreachable place)
      //We get the start point by closeness to the original start point(points[0])
      if (mapInstance._userInteracted || (isRegistering && manualCalculation)) {
        for (let index = 0; index < e.routes[0].waypoints.length; index++) {
          const wp = e.routes[0].waypoints[index];
          let geocoder = L.Control.Geocoder.nominatim();
          let { lat, lng } = wp.latLng;
          var filtered = [];

          setTimeout(() => {
            reverseGeocode(
              geocoder,
              lat,
              lng,
              (result) => {
                if (
                  !filtered.find((point) =>
                    areCoordsEqual(point.coords, result.coords)
                  )
                ) {
                  filtered.push(result);
                }
                if (
                  index == e.routes[0].waypoints.length - 1 &&
                  filtered.length == e.routes[0].waypoints.length
                ) {
                  let mappedPoints = [];
                  for (let i = 0; i < points.length; i++) {
                    const targetPoint = points[i];
                    let closestPoint = filtered.reduce(
                      (closestPoint, currentPoint) => {
                        const currentDistance = calculateMapDistance(
                          mapInstance,
                          targetPoint.coords || targetPoint,
                          currentPoint.coords
                        );

                        if (
                          !closestPoint ||
                          currentDistance < closestPoint.distance
                        ) {
                          return {
                            point: currentPoint,
                            distance: currentDistance,
                          };
                        }

                        return closestPoint;
                      },
                      null
                    )?.point;
                    mappedPoints.push(closestPoint);
                  }
                  console.log("MAPPED POINTS: ", mappedPoints);
                  setRoute(mappedPoints);
                  if (setCalculating) {
                    setCalculating(false);
                  }
                }
              },
              true
            );
          }, 3000);
        }
      }
      if (setRoutingMachineCalulatedCoordinates) {
        setRoutingMachineCalulatedCoordinates(
          e.routes[0].coordinates.map((coord) => [coord.lat, coord.lng])
        );
      }
    });

    mapInstance._routingControl = routingControl;
    mapInstance._userInteracted = false;
    if (setManualCalculation) {
      setManualCalculation(false);
    }

    return () => {
      if (mapInstance._routingControl) {
        mapInstance.removeControl(mapInstance._routingControl);
        mapInstance._routingControl = null;
      }
      if (!isRegistering) {
        mapInstance.removeControl(geocoder);
      }
      if (setCalculating) {
        setCalculating(false);
      }
    };
  }, [points]);

  useEffect(() => {
    if (mapInstance && mapInstance._routingControl) {
      mapInstance._routingControl.on("waypointschanged", () => {
        mapInstance._userInteracted = true;
      });
    }
  }, [points]);
  return null;
};

export default RoutingMachineGeocoder;
