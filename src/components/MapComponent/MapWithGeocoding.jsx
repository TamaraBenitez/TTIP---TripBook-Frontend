import React, { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Circle } from "react-leaflet";
import "leaflet-control-geocoder";
import L from "leaflet";
import {
  TextField,
  Tooltip,
  InputAdornment,
  IconButton,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemButton,
  Grid2,
} from "@mui/material";
import greenMarker from "../../assets/greenLocation.svg";
import MyLocation from "@mui/icons-material/MyLocation";
import MapClickHandler from "./MapClickHandler";
import MapHelper from "./MapHelper";
import CenterMap from "./CenterMap";
import AlertCustom from "../AlertCustom/AlertCustom";
import { Search } from "@mui/icons-material";
import { calculateMapDistance, reverseGeocode } from "../../utility/Utility";
import RoutingMachineGeocoder from "./RoutingMachineGeocoder";
import { DEFAULT_TOLERABLE_DISTANCE } from "../../utility/Constants";

const MapWithGeocoding = ({
  point,
  subtitle,
  //ragistering to trip additions
  isRegistering = false,
  route = null,
  setRoute = () => {},
  userMarker = null,
  maxTolerableDistance = DEFAULT_TOLERABLE_DISTANCE,
  isPointInRange = null,
  setIsPointInRange = () => {},
  routeCalculated = null,
  setCalculating = () => {},
  setMapInstanceProp,
  setIsLoading,
  isLoading,
}) => {
  const { address, coords, setPoint } = point;
  const [mapInstance, setMapInstance] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [
    routingMachineCalulatedCoordinates,
    setRoutingMachineCalulatedCoordinates,
  ] = useState([]);
  const [manualCalculation, setManualCalculation] = useState(isRegistering);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const suggestionsRef = useRef(null);
  const alertMsg =
    "No pudimos encontrar la ubicacion. Intenta nuevamente con mas zoom";
  const greenMarkerIcon = new L.Icon({
    iconUrl: greenMarker,
    iconSize: [45, 75],
    iconAnchor: [22.5, 75],
    shadowUrl: null,
    shadowAnchor: null,
    className: "start-point-icon",
  });
  const handleReverseGeocode = (lat, lng) => {
    const geocoder = L.Control.Geocoder.nominatim();
    reverseGeocode(geocoder, lat, lng, (point) => {
      setPoint(point);
      if (!point.address) {
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 200);
      }
    });
  };
  const handleLoadMap = (map) => {
    setMapInstance(map);
    if (setMapInstanceProp) {
      setMapInstanceProp(map);
    }
  };
  const handleMapClick = (point) => {
    if (isRegistering && routeCalculated) return;
    handleReverseGeocode(point[0], point[1]);
  };

  const handleGeocode = () => {
    if (!address.trim()) return;
    const geocoder = L.Control.Geocoder.nominatim();
    try {
      geocoder.geocode(address, (results) => {
        if (results.length > 0) {
          const formattedResults = results.map((result) => {
            var label = "";
            if (result.properties?.address?.city) {
              label = result.properties.address.city;
            } else if (result.properties.address.state_district) {
              label = `${result.properties.address.state_district}, ${result.properties.address.state}`;
            } else label = result.properties.display_name;
            return {
              address: result.name,
              label: label,
              coords: [result.center.lat, result.center.lng],
            };
          });
          setSuggestions(formattedResults);
        } else {
          setSuggestions([]);
        }
      });
    } catch (error) {
      console.error("Geocoding error:", error);
    }
  };
  const handleSetAddress = (e) => {
    let coords = point.coords;
    setPoint({ coords: coords, address: e.target.value });
  };
  const handleSelectSuggestion = (selected) => {
    setPoint({ address: selected.label, coords: selected.coords });
    setSuggestions([]);
  };
  const handleDragMarker = (event) => {
    setTimeout(() => {
      event.noInertia = false;
      const marker = event.target;
      const position = marker.getLatLng();
      handleReverseGeocode(position.lat, position.lng);
      setPoint({ ...point, coords: [position.lat, position.lng] });
    }, 200);
  };
  // Utility function to find nearest route segment to the given point
  const findNearestRouteSegment = (mapInstance, route, point) => {
    let minDistance = Infinity;
    for (let i = 0; i < route.length - 1; i++) {
      const closestPointOnSegment = L.GeometryUtil.closestOnSegment(
        mapInstance,
        point,
        route[i],
        route[i + 1]
      );
      const segmentPointDistance = calculateMapDistance(
        mapInstance,
        closestPointOnSegment,
        point
      );

      if (segmentPointDistance < minDistance) {
        minDistance = segmentPointDistance;
      }
    }
    return minDistance;
  };

  const canEditPoint = () => {
    return !routeCalculated;
  };
  useEffect(() => {
    //Close the suggestion box with "Escape" or click outside box
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target)
      ) {
        setSuggestions([]);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setSuggestions([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  useEffect(() => {
    if (
      isRegistering &&
      userMarker.length &&
      mapInstance &&
      routingMachineCalulatedCoordinates.length > 0
    ) {
      const distanceToRoute = findNearestRouteSegment(
        mapInstance,
        routingMachineCalulatedCoordinates,
        userMarker
      );
      setIsPointInRange(distanceToRoute <= maxTolerableDistance);
    }
  }, [userMarker, mapInstance, routingMachineCalulatedCoordinates]);

  return (
    <>
      <Grid2 container size={12} sx={{ alignItems: "center" }}>
        <Grid2 item size={5}>
          <Typography variant="h3" sx={{ wordWrap: "break-word" }}>
            {subtitle}
          </Typography>
        </Grid2>
        <Grid2 item size={6} position={"relative"} alignSelf={"flex-end"}>
          <TextField
            label="Especifica una ubicación"
            variant="outlined"
            fullWidth
            value={address}
            disabled={!canEditPoint()}
            onChange={handleSetAddress}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleGeocode();
            }}
            onFocus={() => {
              if (suggestions.length === 0) handleGeocode();
            }}
            InputProps={{
              endAdornment: (
                <Tooltip title="Buscar" placement="top">
                  <InputAdornment position="end">
                    <IconButton
                      color="primary"
                      disabled={!canEditPoint()}
                      onClick={handleGeocode}
                    >
                      <Search />
                    </IconButton>
                  </InputAdornment>
                </Tooltip>
              ),
            }}
          />
          {suggestions.length > 0 && (
            <Paper
              style={{
                position: "absolute",
                zIndex: 1000,
                width: "100%",
                maxHeight: "200px",
                overflowY: "auto",
              }}
              ref={suggestionsRef}
            >
              <List>
                {suggestions.map((suggestion, index) => (
                  <ListItem key={index} disablePadding>
                    <ListItemButton
                      onClick={() => handleSelectSuggestion(suggestion)}
                    >
                      {suggestion.address}
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Paper>
          )}
        </Grid2>
        <Grid2
          item
          size={1}
          sx={{ paddingLeft: "2%", alignSelf: "flex-end", marginBottom: "5px" }}
        >
          <Tooltip title="Usar ubicacion actual" placement="top">
            <IconButton
              color="primary"
              disabled={!canEditPoint()}
              onClick={() => {
                navigator.geolocation.getCurrentPosition((position) => {
                  handleReverseGeocode(
                    position.coords.latitude,
                    position.coords.longitude
                  );
                });
              }}
            >
              <MyLocation />
            </IconButton>
          </Tooltip>
        </Grid2>
      </Grid2>
      {!isLoading && (
        <MapContainer
          center={[-34.6037, -58.3816]}
          zoom={13}
          style={{ height: "400px", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <MapHelper onMapLoad={handleLoadMap} />
          <MapClickHandler handleNewMarker={handleMapClick} />
          {coords.length && (
            <>
              {isRegistering ? (
                <Marker
                  position={coords}
                  draggable={canEditPoint()}
                  eventHandlers={{ dragend: handleDragMarker }}
                  riseOnHover={true}
                  icon={greenMarkerIcon}
                />
              ) : (
                <Marker position={coords} />
              )}

              {isRegistering && (
                <Circle
                  center={userMarker}
                  radius={maxTolerableDistance}
                  pathOptions={{ color: isPointInRange ? "green" : "red" }}
                  fillOpacity={0.2}
                />
              )}
              <CenterMap coordinates={coords} />
            </>
          )}
          {isRegistering && route && mapInstance && !isLoading && (
            <RoutingMachineGeocoder
              mapInstance={mapInstance}
              points={route}
              setRoute={setRoute}
              setCalculating={setCalculating}
              manualCalculation={manualCalculation}
              setManualCalculation={setManualCalculation}
              setCoordToAdd={setPoint}
              isRegistering={isRegistering}
              setRoutingMachineCalulatedCoordinates={
                setRoutingMachineCalulatedCoordinates
              }
              userPickPoint={userMarker}
              isGeocoding={isGeocoding}
              setIsGeocoding={setIsGeocoding}
            />
          )}
        </MapContainer>
      )}
      <AlertCustom
        inProp={showAlert}
        timeout={500}
        msg={alertMsg}
        severity={"error"}
      />
    </>
  );
};

export default MapWithGeocoding;
