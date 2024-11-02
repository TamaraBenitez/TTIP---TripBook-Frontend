import React, { useContext, useEffect, useState } from "react";
import MapComponent from "../MapComponent/MapComponent";
import { useNavigate, useParams } from "react-router-dom";
import StoreContext from "../../store/storecontext";
import { useUser } from "../../user/UserContext";
import { Box, CircularProgress } from "@mui/material";
import DialogCustom from "../DialogCustom/DialogCustom";


export default function TripRegistration() {
  const [trip, setTrip] = useState({ tripCoordinates: null });
  const { id } = useParams();
  const { user, userDataLoading } = useUser();
  const store = useContext(StoreContext);
  const [departureCoords, setDepartureCoords] = useState(null);
  const [open, setOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("Propuesta enviada")
  const [modalMsg, setModalMsg] = useState("Hemos notificado al conductor.")
  const navigate = useNavigate();
  const proposeNewRoute = (pickPoint) => {
    let requestBody = {
      userId: user.id,
      tripId: trip.id,
      latitude: pickPoint[0],
      longitude: pickPoint[1]
    } 
    store.services.tripService.RegisterUserToTrip(requestBody)
    .then(()=>{
      setOpen(true)
    })
    .catch((error)=>{
      debugger;
      setModalTitle("Error")
      setModalMsg(error.response.data.message);
      setOpen(true)
    })
  }

  useEffect(() => {
    if (!trip.tripCoordinates) {
      store.services.tripService
      .GetTrip(id)
      .then((res) => {
          setTrip(res.data);
          setDepartureCoords([res.data.tripCoordinates[0].latitude, res.data.tripCoordinates[0].longitude]);
          const alreadyRegistered = res.data.participants.find(
            (p) => {
              return p.id == user.id}
          );
          if (alreadyRegistered) setIsRegistered(true);
          setLoading(false);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [trip]);
  return (
    <>{userDataLoading ? (
      <Box sx={{ display: "flex", justifyContent: "center", height: "100%" }}>
        <CircularProgress />
      </Box>
    ) :
      departureCoords && trip.tripCoordinates && ( 
          <MapComponent isRegistering={true} proposeNewRoute={proposeNewRoute} coordinates={trip.tripCoordinates[0]}/>
      )}

      <DialogCustom
            open={open}
            handleConfirm={()=>navigate("/")}
            handleClose={()=>navigate("/")}
            title={modalTitle}
            textParagraph={modalMsg}
      />
    </>
  );
}
