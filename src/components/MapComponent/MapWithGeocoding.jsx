import React, { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet-control-geocoder";
import L from "leaflet";
import {
  TextField,
  Tooltip,
  InputAdornment,
  IconButton,
  Typography,
  Autocomplete,
  Paper,
  List,
  ListItem,
  ListItemButton,
  Box,
  Grid2,
} from "@mui/material";
import MyLocation from "@mui/icons-material/MyLocation";
import MapClickHandler from "./MapClickHandler";
import MapHelper from "./MapHelper";
import CenterMap from "./CenterMap";
import AlertCustom from "../AlertCustom/AlertCustom";
import { Search } from "@mui/icons-material";
import { reverseGeocode } from "../../utility/Utility";

const MapWithGeocoding = ({ point, action }) => {
  const { address, coords, setPoint } = point;
  const [mapInstance, setMapInstance] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const suggestionsRef = useRef(null);
  const alertMsg =
    "No pudimos encontrar la ubicacion. Intenta nuevamente con mas zoom";

  const handleReverseGeocode = (lat, lng) => {
    const geocoder = L.Control.Geocoder.nominatim();
    reverseGeocode(geocoder,lat,lng,
      (point)=>{
        setPoint(point);
        if(!point.address){
          setShowAlert(true);
          setTimeout(() => {
            setShowAlert(false);
          }, 6000);
        }
      }
    )
  };

  const handleMapClick = (point) => {
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
            if(result.properties?.address?.city){
              label = result.properties.address.city
            } else if(result.properties.address.state_district){
              label = `${result.properties.address.state_district}, ${result.properties.address.state}`
            }
            return {
              address: result.name,
              label: label, 
              coords: [result.center.lat, result.center.lng],
            }
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
    setSuggestions([]); // Clear suggestions
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


  return (
    <>
      <Grid2 container size={12} sx={{ alignItems: "center" }}>
        <Grid2 item size={5} sx={{minWidth:""}}>
          <Typography variant="h3" sx={{wordWrap:"break-word"}}>¿Dónde {action} tu viaje?</Typography>
        </Grid2>
        <Grid2 item size={6} position={"relative"} alignSelf={"flex-end"}>
          <TextField
            label="Especifica una ubicación"
            variant="outlined"
            fullWidth
            value={address}
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
        <Grid2 item size={1} sx={{ paddingLeft: "2%", alignSelf:"flex-end", marginBottom:"5px" }}>
          <Tooltip title="Usar ubicacion actual" placement="top">
          <IconButton
            color="primary"
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
      <MapContainer
        center={[-34.6037, -58.3816]}
        zoom={13}
        style={{ height: "400px", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapHelper onMapLoad={setMapInstance} />
        {coords && (
          <>
            <MapClickHandler handleNewMarker={handleMapClick} />
            <Marker position={coords} />
            <CenterMap coordinates={coords} />
          </>
        )}
      </MapContainer>
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
