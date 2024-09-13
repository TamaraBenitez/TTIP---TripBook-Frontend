import React from "react";
import { Container } from "@mui/material";
import TripCard from "./TripCard";

export default function Trips(props) {


  return (
    <>
      <Container className="tripsContainer" sx={{display:"flex", justifyContent:"center", flexWrap:"wrap"}}>
        {props.trips.map((trip) => {
          return (
            <TripCard
              key={trip.id}
              to={trip.id}
              description={trip.description}
              startDate={trip.startDate}
              destination={trip.endPoint}
              startingPoint={trip.startPoint}
              participantsNumber={trip.numberOfRegistrants}
              estimatedCost={trip.estimatedCost}
              action={props.action}
              handleAction={props.handleAction}
            />
          );
        })}
      </Container>
    </>
  );
}
