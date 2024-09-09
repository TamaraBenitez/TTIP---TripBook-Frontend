import React, { useContext, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Trips from "../TripList/Trips";
import StoreContext from "../../store/storecontext";
import { Typography } from "@mui/material";

export default function AllTrips() {
  const [trips, setTrips] = useState([]);
  const store = useContext(StoreContext);

  useEffect(() => {
    store.services.tripService
      .GetAllTrips()
      .then((res) => {
        setTrips(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <>
      <Typography variant="h4">Todos los viajes</Typography>
      <Trips trips={trips} action={"unirme"} />
      <Outlet />
    </>
  );
}
