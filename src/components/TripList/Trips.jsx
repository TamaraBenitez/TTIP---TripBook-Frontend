import React from "react";
import { Box, Container, IconButton, useTheme } from "@mui/material";
import TripCard from "./TripCard";
import {  AddOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export default function Trips(props) {
  const theme = useTheme();
  const navigate = useNavigate();
  return (
    <>
      <Container
        className="tripsContainer"
        sx={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        {props.trips.map((trip) => {
          return (
            <TripCard
              key={trip.id}
              to={trip.id}
              description={trip.description}
              startDate={trip.startDate}
              destination={trip.destination}
              startingPoint={trip.origin}
              participantsNumber={trip.registrants}
              maxPassengers={trip.maxPassengers}
              estimatedCost={trip.estimatedCost}
              action={props.action}
              handleAction={props.handleAction}
            />
          );
        })}
        <Box sx={{width:345, display:"flex", justifyContent:"center", alignItems:"center", height:250}}>
          <IconButton
            sx={{
              height: "100px",
              width: "100px",
              color: theme.palette.primary.light,
              ":hover": {
                bgcolor: theme.palette.secondary.light,
                color: "white",
              },
            }}
            onClick={()=>navigate("/trip")}
          >
            <AddOutlined sx={{ fontSize: "-webkit-xxx-large" }} />
          </IconButton>
        </Box>
      </Container>
    </>
  );
}
