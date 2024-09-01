import React, { useContext, useEffect, useState } from "react";
import StoreContext from "../../store/storecontext";
import { Container } from "@mui/material";
import TripCard from "./TripCard";

export default function Trips() {
  const [trips, setTrips] = useState([]);
  const store = useContext(StoreContext);

  useEffect(() => {
    const data = store.services.tripService.GetAllTrips();
    // .then((data)=>{
    //   console.log("success");
    // })
    // .catch((error)=>{
    //   console.log(error)
    // })
    setTrips(data);
  }, []);

  return (
    <>
      <Container className="tripsContainer" sx={{display:"flex", justifyContent:"center", flexWrap:"wrap"}}>
        {trips.map((trip, i) => {
          return (
            <TripCard
              key={"trip-"+ i}
              name={trip.nombre}
              description={trip.descripcion}
              startDate={trip.fechaInicio}
              destination={trip.destino}
              startingPoint={trip.origen}
              participantsNumber={trip.participantes.length}
              totalCapacity={trip.capacidadMaxima}
            />
          );
        })}
      </Container>
    </>
  );
}
