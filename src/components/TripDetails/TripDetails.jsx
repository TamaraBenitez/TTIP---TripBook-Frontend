import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import StoreContext from "../../store/storecontext";
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box,
  Button,
  Accordion,
  AccordionSummary,
  ListItemIcon,
  AccordionDetails,
} from "@mui/material";
import { AccountCircle, ExpandMore } from "@mui/icons-material";

export default function TripDetails() {
  const { id } = useParams();
  const store = useContext(StoreContext);
  const [trip, setTrip] = useState({});
  const onHopOnTrip = (e) => {};
  useEffect(() => {
    const trip = store.services.tripService.GetTrip(id);
    // .then((data)=>{
    //     debugger
    setTrip(trip);
    // }).catch((e)=>{
    //     console.log(e)
    // });
  }, []);

  return (
    <Card sx={{ maxWidth: 600, margin: "20px auto", padding: "20px" }}>
      <CardContent>
        <Typography variant="h4" component="h1" gutterBottom>
          Viaje a {trip.endPoint}
        </Typography>
        <Typography variant="body1" color="textSecondary">
          <strong>Fecha de inicio:</strong>{" "}
          {new Date(trip.startDate).toLocaleDateString()}
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
        {trip.tripUsers?.length > 0 ? (
          trip.tripUsers.map((user) => (
            <Accordion key={user.id} sx={{maxWidth:250}}>
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
              <AccordionDetails sx={{WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical"
                  }}>
                <Box>
                  <Typography variant="body2" color="textSecondary"sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis"}} >
                    Email: {user.email}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" x={{
                  overflow: "hidden",
                  textOverflow: "ellipsis"}}>
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
        <Box
          sx={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
        >
          <Button variant="contained" color="primary" onClick={onHopOnTrip}>
            Unirme al viaje
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
