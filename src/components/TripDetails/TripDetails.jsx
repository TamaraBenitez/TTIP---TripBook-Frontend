import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
} from "@mui/material";
import { AccountCircle, TaskAlt } from "@mui/icons-material";
import DialogCustom from "../DialogCustom/DialogCustom";
import { formatDate } from "../../utility/Utility";
import MapComponent from "../MapComponent/MapComponent";

export default function TripDetails() {
  const { id } = useParams();
  const store = useContext(StoreContext);
  const [trip, setTrip] = useState({});
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

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
    store.services.tripService.RegisterUserToTrip("testid1", id)
    .then((res) => {
      setLoading(false);
      setIsRegistered(true);
      setShowAlert(true);
    });
  };

  useEffect(() => {
    store.services.tripService
      .GetTrip(id)
      .then((res) => {
        setTrip(res.data);
        const alreadyRegistered = res.data.participants.find(
          (p) => p.id == "testid1"
        );
        if(alreadyRegistered)
        setIsRegistered(true);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });
  }, [id, store.services.tripService, isRegistered]);

  return (
    <>
    <Box sx={{display:"flex", flexDirection: "row", alignItems:"center"}}>

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
                Viaje a {trip.endPoint}
              </Typography>
              <Typography variant="body1" color="textSecondary">
                <strong>Fecha de salida:</strong> {formatDate(trip.startDate, true)}
              </Typography>
              <Typography variant="body1" color="textSecondary">
                <strong>Desde:</strong> {trip.startPoint}
              </Typography>
              <Typography variant="body1" color="textSecondary">
                <strong>Descripción:</strong> {trip.description}
              </Typography>
              <Typography variant="body1" color="textSecondary">
                <strong>Costo estimado:</strong> ${trip.estimatedCost}
              </Typography>

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
                      sx={{ WebkitLineClamp: 3, WebkitBoxOrient: "vertical" }}
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
        </CardContent>
      </Card>
      <MapComponent />
      <DialogCustom
        open={open}
        handleClose={handleCloseModal}
        handleConfirm={handleSuscribe}
        title={"Inscripcion al viaje"}
        textParagraph={"¿Esta seguro que desea inscribirse a este viaje?"}
        showCancelButton={true}
        />
      {showAlert &&
        <Alert sx={{maxWidth:500}}onClose={()=>setShowAlert(false)} variant="outlined" icon={<TaskAlt fontSize="inherit" />} severity="success">
          Te has Inscripto exitosamente a este viaje
        </Alert>
      }
      </Box>
    </>
  );
}
