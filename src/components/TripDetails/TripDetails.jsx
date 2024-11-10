import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import StoreContext from "../../store/storecontext";
import {
  Card,
  CardContent,
  Typography,
  Divider,
  Box,
  Button,
  Accordion,
  AccordionSummary,
  ListItemIcon,
  AccordionDetails,
  Skeleton,
  Alert,
  SvgIcon,
  Tooltip,
} from "@mui/material";
import { AccountCircle, Cancel, CheckCircle, TaskAlt } from "@mui/icons-material";
import DialogCustom from "../DialogCustom/DialogCustom";
import { formatDate, mapTripCoordinates, sortedCoords } from "../../utility/Utility";
import MapComponent from "../MapComponent/MapComponent";
import { useUser } from "../../user/UserContext";
import whatsapp from "../../assets/Whatsapp.svg";

export default function TripDetails({
  pendingSolicitudes,
  tripIdParam = null,
  tripUserId = null,
}) {
  var id;
  if (!tripIdParam) {
    const idObj = useParams();
    id = idObj.id;
  } else {
    id = tripIdParam;
  }
  const store = useContext(StoreContext);
  const [trip, setTrip] = useState({});
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const { user } = useUser();
  const navigate = useNavigate();
  const handleClickOpen = (e) => {
    e.stopPropagation();
    setOpen(true);
  };
  const handleCloseModal = () => {
    setOpen(false);
  };

  const handleSuscribe = (e) => {
    setLoading(true);
    handleCloseModal();
    navigate(`/trip/suscribe/${id}`);
  };
  const setTripDetails = (res) => {
    let startPoint = res.data.tripCoordinates.find((point) => {
      return point.isStart});
    let route = mapTripCoordinates(res.data.tripCoordinates.filter((coord)=>!coord.isStart));
    //if it's a pending solicitude view, include the requester marker on map
    if(pendingSolicitudes){
      route.push([res.data.requesterCoordinates[0].latitude,res.data.requesterCoordinates[0].longitude])
    }
    let orderedRoute = sortedCoords([startPoint.latitude, startPoint.longitude], route);
    res.data.tripCoordinates = orderedRoute;
    setTrip(res.data);
    if (!pendingSolicitudes) {
      const alreadyRegistered = res.data.participants.find(
        (p) => p.id == user.id
      );
      if (alreadyRegistered) setIsRegistered(true);
    }
    setLoading(false);
  };
  const showMap = () => {
    return trip.tripCoordinates;
  };

  const getCoordinates = () => {
      return trip.tripCoordinates;
    
  };

  const getUserMarker = () => {
    if (pendingSolicitudes) {
      return [trip.requesterCoordinates[0].latitude, trip.requesterCoordinates[0].longitude];
    } else return null;
  };

  useEffect(() => {
    //If is a pending solicitude, show the pending coordinates
    if (pendingSolicitudes) {
      store.services.tripService
        .GetRequest(tripUserId, id)
        .then(setTripDetails)
        .catch((e) => {
          console.log(e);
          setLoading(false);
        });
    } else {
      store.services.tripService
        .GetTrip(id)
        .then(setTripDetails)
        .catch((e) => {
          console.log(e);
          setLoading(false);
        });
    }
  }, [id, store.services.tripService, isRegistered]);

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
        <Card sx={{ maxWidth: 600, margin: "20px auto", padding: "20px" }}>
          <CardContent>
            {loading ? (
              <>
                <Skeleton variant="text" height={40} width="60%" />
                <Skeleton variant="text" width="40%" />
                <Skeleton variant="text" />
                <Skeleton variant="text" />
                <Skeleton variant="rectangular" height={118} />
              </>
            ) : (
              <>
                <Typography variant="h4" component="h1" gutterBottom>
                  Viaje a {trip.destination}
                </Typography>
                <Divider />
                <Typography variant="body1" color="textSecondary">
                  <strong>Fecha de salida:</strong>{" "}
                  {formatDate(trip.startDate, true)}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  <strong>Desde:</strong> {trip.origin}
                </Typography>
                {!pendingSolicitudes && (
                  <Typography variant="body1" color="textSecondary">
                    <strong>Descripción:</strong> {trip.description}
                  </Typography>
                )}
                {!pendingSolicitudes && (
                  <Typography variant="body1" color="textSecondary">
                    <strong>Costo estimado:</strong> ${trip.estimatedCost}
                  </Typography>
                )}

                {!pendingSolicitudes && (
                  <>
                    <Divider sx={{ margin: "20px 0" }} />

                    <Typography variant="h5" component="h2" gutterBottom>
                      Participantes
                    </Typography>
                    {trip.participants?.length > 0 ? (
                      trip.participants.map((user) => (
                        <Accordion key={user.id} sx={{ maxWidth: 250 }}>
                          <AccordionSummary
                            sx={{ justifyContent: "flex-start" }}
                            aria-controls="panel1-content"
                            id="panel1-header"
                          >
                            <ListItemIcon sx={{ minWidth: 40 }}>
                              <AccountCircle />
                            </ListItemIcon>
                            <Typography variant="body1">
                              {user.name} {user.surname}
                            </Typography>
                          </AccordionSummary>
                          <AccordionDetails
                            sx={{
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: "vertical",
                            }}
                          >
                            <Box>
                              <Typography
                                variant="body2"
                                color="textSecondary"
                                sx={{
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                Email: {user.email}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="textSecondary"
                                sx={{
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                Localidad: {user.locality}, {user.province}
                              </Typography>
                            </Box>
                          </AccordionDetails>
                        </Accordion>
                      ))
                    ) : (
                      <Typography variant="body1">
                        No hay participantes registrados aún.
                      </Typography>
                    )}
                    {!isRegistered && (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          marginTop: "20px",
                        }}
                      >
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={handleClickOpen}
                        >
                          Unirme al viaje
                        </Button>
                      </Box>
                    )}
                  </>
                )}
                {pendingSolicitudes && (
                  <>
                    <Divider sx={{ margin: "20px 0" }} />
                    <Accordion sx={{ maxWidth: 250 }}>
                      <AccordionSummary
                        sx={{ justifyContent: "flex-start" }}
                        aria-controls="panel1-content"
                        id="panel1-header"
                      >
                        <ListItemIcon sx={{ minWidth: 40 }}>
                          <AccountCircle />
                        </ListItemIcon>
                        <Typography variant="body1">
                          {trip.name} {trip.surname}
                        </Typography>
                        <Tooltip
                          title={
                            trip.isUserVerified
                              ? "User Verified"
                              : "User Not Verified"
                          }
                          placement="right"
                        >
                          {trip.isUserVerified ? (
                            <CheckCircle
                              sx={{ color: "green", marginLeft: "10px" }}
                            />
                          ) : (
                            <Cancel sx={{ color: "red", marginLeft: "10px" }} />
                          )}
                        </Tooltip>
                      </AccordionSummary>
                      <AccordionDetails
                        sx={{
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        <Box>
                          <Typography
                            variant="body2"
                            color="textSecondary"
                            sx={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            Email: {trip.email}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="textSecondary"
                            sx={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            Localidad: {trip.locality}, {trip.province}
                          </Typography>
                          {pendingSolicitudes && (
                            <Box sx={{display:"flex", flexDirection:"row", alignItems:"center"}}>
                            <SvgIcon>
                              <image href={whatsapp} height="100%" />
                            </SvgIcon>
                            <Typography variant="body2"
                            color="textSecondary"
                            sx={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}>{trip.contact}</Typography>
                            </Box>
                          )}
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                  </>
                )}
              </>
            )}
          </CardContent>
        </Card>
        {showMap() && (
          <MapComponent
            coordinates={getCoordinates()}
            userMarkerParam={getUserMarker()}
            width={"65%"}
          />
        )}
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          marginTop: "10px",
          justifyContent: "space-around",
        }}
      >
       {pendingSolicitudes && 
       <>
        <Button color="error" variant="contained">
          Denegar
        </Button>
        <Button variant="contained">Confirmar</Button>
       </> }
      </Box>
      <DialogCustom
        open={open}
        handleClose={handleCloseModal}
        handleConfirm={handleSuscribe}
        title={"Inscripcion al viaje"}
        textParagraph={"¿Esta seguro que desea inscribirse a este viaje?"}
        showCancelButton={true}
      />
      {showAlert && (
        <Alert
          sx={{
            maxWidth: 500,
            position: "fixed",
            left: 600,
            bottom: 300,
            zIndex: 3,
          }}
          onClose={() => setShowAlert(false)}
          variant="outlined"
          icon={<TaskAlt fontSize="inherit" />}
          severity="success"
        >
          Te has inscripto exitosamente a este viaje
        </Alert>
      )}
    </>
  );
}
