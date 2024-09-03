import React, { useContext, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Trips from "../TripList/Trips";
import StoreContext from "../../store/storecontext";

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
      <Trips trips={trips} />
      <Outlet />
    </>
  );
}
