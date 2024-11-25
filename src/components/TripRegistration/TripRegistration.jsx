import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import StoreContext from "../../store/storecontext";
import { useUser } from "../../user/UserContext";
import { Box, Button, CircularProgress, Grid2, Typography } from "@mui/material";
import DialogCustom from "../DialogCustom/DialogCustom";
import RibbonHeading from "../RibbonHeading/RibbonHeading";
import { mapTripCoordinates, reverseGeocode, sortedCoords, sortedCoordsWithNewPoint } from "../../utility/Utility";
import MapWithGeocoding from "../MapComponent/MapWithGeocoding";
import L from "leaflet";

export default function TripRegistration() {
  const [trip, setTrip] = useState({ tripCoordinates: null });
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const { user, userDataLoading } = useUser();
  const store = useContext(StoreContext);
  const [pickPoint, setPickPoint] = useState({ address: "", coords: [] });
  const [open, setOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("Propuesta enviada");
  const [modalMsg, setModalMsg] = useState("Hemos notificado al conductor.");
  const [route, setRoute] = useState([]);
  const [isPointInRange, setIsPointInRange] = useState(true);
  const [calculating, setCalculating] = useState(false);
  const [routeCalculated, setRouteCalculated] = useState(false);
  const [mapInstance, setMapInstance] = useState(null)
  const navigate = useNavigate();
  const proposeNewRoute = (pickPoint) => {
    let requestBody = {
      userId: user.id,
      tripId: trip.id,
      latitude: pickPoint[0],
      longitude: pickPoint[1],
    };
    store.services.tripService
      .RegisterUserToTrip(requestBody)
      .then(() => {
        setOpen(true);
      })
      .catch((error) => {
        setModalTitle("Error");
        setModalMsg(error.response.data.message);
        setOpen(true);
      });
  };
  const calculateNewRoute = () => {
    // Add the point and re-sort.
    // Take always from original 'coordinates' to avoid stacking markers on coords state
    setCalculating(true);

    const [startPoint, ...tail] = route;
    const updatedCoords = sortedCoordsWithNewPoint(startPoint, tail, mapInstance,  pickPoint);
    setRoute(updatedCoords);
  };
  const reverseRouteGeocode = (routeParam) =>{
    let geocoder = L.Control.Geocoder.nominatim();;
    var geocoded=[];
    routeParam.forEach((coord,i)=>{
      return reverseGeocode(geocoder,coord[0],coord[1],
        (result)=>{
          geocoded.push(result);
          if(i == (routeParam.length-1)){
            setRoute(geocoded);
            setLoading(false);
          }
      })
    })
  }

  const editPoint = () => {
    const filteredRoute = route.filter((point)=>point.coords !== pickPoint.coords); 
    setRoute(filteredRoute);
    setPickPoint({ address: "", coords: [] });
    setRouteCalculated(false);
  };

  const disableCalculate = () =>{
    if(routeCalculated){
      return !isPointInRange 
    } else {
     return !pickPoint.coords.length  
    } 
  }
  useEffect(() => {
    if (!trip.tripCoordinates && !userDataLoading) {
      store.services.tripService
        .GetTrip(id)
        .then((res) => {
          let startPoint = res.data.tripCoordinates.find((point) => {
            return point.isStart;
          });
          let coordinates = mapTripCoordinates(
            res.data.tripCoordinates.filter((coord) => !coord.isStart)
          );
          
          let orderedRoute = sortedCoords(
            [startPoint.latitude, startPoint.longitude],
            coordinates
          );

          reverseRouteGeocode(orderedRoute);
          res.data.tripCoordinates = orderedRoute;
          setTrip(res.data);

          const alreadyRegistered = res.data.participants.find((p) => {
            return p.id == user.id;
          });
          if (alreadyRegistered) setIsRegistered(true);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [trip, userDataLoading]);
  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <RibbonHeading
        heading={"Unirse a un viaje"}
        component="h2"
        variant="h2"
      />
      {userDataLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", height: "100%" }}>
          <CircularProgress />
        </Box>
      ) : 
        !loading && 
        (
        <Grid2 container size={12} spacing={2} padding={8}>
          <MapWithGeocoding
            isRegistering={true}
            subtitle={"Elige dónde quieres unirte"}
            point={{
              address: pickPoint.address,
              coords: pickPoint.coords,
              setPoint: setPickPoint,
            }}
            userMarker={pickPoint.coords}
            maxTolerableDistance={trip.maxTolerableDistance}
            isPointInRange={isPointInRange}
            setIsPointInRange={setIsPointInRange}
            routeCalculated={routeCalculated}
            setRouteCalculated={setRouteCalculated}
            route={route}
            setMapInstanceProp={setMapInstance}
          />

          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-around",
              width: "100%",
              marginTop: 5,
            }}
          >
            {routeCalculated && (
              <Button onClick={editPoint}>Editar Punto</Button>
            )}
            <Button
              variant="contained"
              onClick={
                routeCalculated
                  ? () => proposeNewRoute(pickPoint.coords)
                  : calculateNewRoute
              }
              disabled={disableCalculate()}
            >
              {routeCalculated ? "Proponer" : "Calcular"} Ruta
            </Button>
          </Box>

          {!isPointInRange && (
            <Typography
              variant="body2"
              color="error"
              sx={{ textAlign: "center", marginTop: 2 }}
            >
              El punto está fuera de la distancia máxima tolerable.
            </Typography>
          )}
        </Grid2>
      )}

      <DialogCustom
        open={open}
        handleConfirm={() => navigate("/")}
        handleClose={() => navigate("/")}
        title={modalTitle}
        textParagraph={modalMsg}
      />
    </Box>
  );
}
