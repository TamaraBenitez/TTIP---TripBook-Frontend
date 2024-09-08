import React, { useContext, useEffect, useState } from "react";
import StoreContext from "../../store/storecontext";
import { Container } from "@mui/material";
import TripCard from "./TripCard";

export default function Trips(props) {
  const [trips, setTrips] = useState([]);
  const store = useContext(StoreContext);
  const { userID = null } = props || {};

  useEffect(() => {
    if(userID !== null){
      
    } else {
      store.services.tripService.GetAllTrips()
      .then((res)=>{
        debugger;
        setTrips(res.data);
      })
      .catch((error)=>{
        console.log(error)
      })   
    }
  }, []);

  return (
    <>
      <Container className="tripsContainer" sx={{display:"flex", justifyContent:"center", flexWrap:"wrap"}}>
        {trips.map((trip, i) => {
          return (
            <TripCard
              key={trip.id}
              to={i}
              description={trip.description}
              startDate={trip.startDate}
              destination={trip.endPoint}
              startingPoint={trip.startPoint}
              participantsNumber={trip.numberOfRegistrants}
              estimatedCost={trip.estimatedCost}
            />
          );
        })}
      </Container>
    </>
  );
}
