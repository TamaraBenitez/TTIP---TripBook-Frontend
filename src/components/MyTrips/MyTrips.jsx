import React, { useContext, useEffect, useState } from 'react'
import Trips from '../TripList/Trips'
import { useNavigate } from "react-router-dom";
import { Card, CardContent, Skeleton, Typography } from '@mui/material';
import StoreContext from '../../store/storecontext';

export default function MyTrips() {
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const store = useContext(StoreContext);
    const navigate = useNavigate();
    console.log("mytrips")
    useEffect(()=>{
    store.services.userService.GetMyTrips()
        .then((res)=>{
            setTrips(res.data);
            setLoading(false);
        })
        .catch((e)=>{
            console.log(e);
            setLoading(false);
        })
    },[]);
    const redirectToTrip = (e, to) =>{
      navigate(`/trips/${to}`)
    }

  return (
    <>
      <Typography variant="h4">Mis Viajes</Typography>
      {loading ? (
        // Show 5 Skeleton cards while loading
        [...Array(5)].map((_, index) => (
          <Card key={index} style={{ marginBottom: "1rem" }}>
            <Skeleton variant="rectangular" height={140} />
            <CardContent>
              <Skeleton variant="text" />
              <Skeleton variant="text" width="60%" />
            </CardContent>
          </Card>
        ))
      ) : (
      <Trips trips={trips} action={"detalles"} handleAction={redirectToTrip}/>
      )}
    </>
  );
}
