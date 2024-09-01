import React, { useContext, useEffect, useState } from "react";
import StoreContext from "../../store/storecontext";
import { Grid2 } from "@mui/material";
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
      <Grid2 container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
        {trips.map((trip, i) => {
          return (
            <TripCard
              key={"trip-"+i}
              name={trip.name}
              description={trip.descripcion}
              startDate={trip.fechaInicio}
              destination={trip.destino}
              startingPoint={trip.origen}
              currentParticipants={trip.participantes.length}
              totalCapacity={trip.capacidadMaxima}
            />
          );
        })}
      </Grid2>
    </>
  );
}
