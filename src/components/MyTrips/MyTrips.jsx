import React, { useContext, useEffect, useState } from "react";
import Trips from "../TripList/Trips";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  Skeleton,
  Typography,
} from "@mui/material";
import StoreContext from "../../store/storecontext";
import RibbonHeading from "../RibbonHeading/RibbonHeading";
import { useUser } from "../../user/UserContext";
import TripsSkeleton from "../TripList/TripsSkeleton";

export default function MyTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const store = useContext(StoreContext);
  const { user, userDataLoading, setUser } = useUser();
  const navigate = useNavigate();
  useEffect(() => {
    if(!userDataLoading){
    store.services.userService
      .GetMyTrips(user.id)
      .then((res) => {
        console.log("TRIPS LOADED");
        setTrips(res.data);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });
    }
  }, [userDataLoading]);
  const redirectToTrip = (e, to) => {
    navigate(`/trips/${to}`);
  };

  return (
    <>
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <RibbonHeading heading={"Mis Viajes"} component="h2" variant="h2" />
        {loading || userDataLoading ? (
          <TripsSkeleton />
        ) : (
          <Trips
            trips={trips}
            action={"detalles"}
            handleAction={redirectToTrip}
          />
        )}
      </Box>
    </>
  );
}
