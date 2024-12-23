import React, { useContext, useEffect, useState } from "react";
import MapComponent from "../MapComponent/MapComponent";
import { useNavigate, useParams } from "react-router-dom";
import StoreContext from "../../store/storecontext";
import { useUser } from "../../user/UserContext";
import { Box, CircularProgress, Typography } from "@mui/material";
import DialogCustom from "../DialogCustom/DialogCustom";
import RibbonHeading from "../RibbonHeading/RibbonHeading";
import { mapTripCoordinates, sortedCoords } from "../../utility/Utility";

export default function TripRegistration() {
  const [trip, setTrip] = useState({ tripCoordinates: null });
  const { id } = useParams();
  const { user, userDataLoading } = useUser();
  const store = useContext(StoreContext);
  const [departureCoords, setDepartureCoords] = useState(null);
  const [open, setOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("Propuesta enviada");
  const [modalMsg, setModalMsg] = useState("Hemos notificado al conductor.");
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

  useEffect(() => {
    if (!trip.tripCoordinates) {
      store.services.tripService
        .GetTrip(id)
        .then((res) => {
          let startPoint = res.data.tripCoordinates.find((point) => {
            return point.isStart});
          let route = mapTripCoordinates(res.data.tripCoordinates.filter((coord)=>!coord.isStart));
          let orderedRoute = sortedCoords([startPoint.latitude, startPoint.longitude], route);
          res.data.tripCoordinates = orderedRoute;
          setTrip(res.data);
          setDepartureCoords([
            res.data.tripCoordinates[0].latitude,
            res.data.tripCoordinates[0].longitude,
          ]);
          const alreadyRegistered = res.data.participants.find((p) => {
            return p.id == user.id;
          });
          if (alreadyRegistered) setIsRegistered(true);
          setLoading(false);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [trip]);
  return (
    <Box sx={{display:"flex", flexDirection:"column", alignItems:"center"}}>
    <RibbonHeading heading={"Unirse a un viaje"} component="h2" variant="h2"/>
    <Typography variant="h3">Elige dónde quieres unirte</Typography>    
      {userDataLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", height: "100%" }}>
          <CircularProgress />
        </Box>
      ) : (
        departureCoords &&
        trip.tripCoordinates && (
          <MapComponent
            isRegistering={true}
            proposeNewRoute={proposeNewRoute}
            coordinates={trip.tripCoordinates}
            maxToleranceDistance={trip.maxTolerableDistance}
          />
        )
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
