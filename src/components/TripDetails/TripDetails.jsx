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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { AccountCircle } from "@mui/icons-material";

export default function TripDetails() {
  const { id } = useParams();
  const store = useContext(StoreContext);
  const [trip, setTrip] = useState({});
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  const handleClickOpen = (e) => {
    e.stopPropagation();
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const formatDate = (startDate) => {
    return new Date(startDate).toLocaleDateString();
  };

  const handleSuscribe=(e)=>{
    setLoading(true);
    handleClose();
    store.services.tripService.RegisterUserToTrip("testid1", id)
      .then((res)=>{
        setLoading(false);
        setIsRegistered(true);
      })
  }

  useEffect(() => {
    store.services.tripService
      .GetTrip(id)
      .then((res) => {
        setTrip(res.data);
        const alreadyRegistered = res.data.participants.find(
          (p) => p.id == "testid1"
        );
        setIsRegistered(alreadyRegistered !== undefined);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });
  }, [id, store.services.tripService, trip.participants]);

  return (
    <>
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
                <strong>Fecha de inicio:</strong> {formatDate(trip.startDate)}
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
      <Dialog
        open={open}
        handleClose={handleClose}
      >
        <DialogTitle>Inscripción al viaje</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Está seguro que desea inscribirse a este viaje?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSuscribe}>confirmar</Button>
          <Button onClick={handleClose}>cancelar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
