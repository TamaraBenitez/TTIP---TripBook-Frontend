import React, { useContext, useEffect, useState } from 'react'
import Trips from '../TripList/Trips'
import { useNavigate } from "react-router-dom";
import { Card, CardContent, Skeleton, Typography } from '@mui/material';
import StoreContext from '../../store/storecontext';
import RibbonHeading from '../RibbonHeading/RibbonHeading';
import { useUser } from '../../user/UserContext';

export default function MyTrips() {
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const store = useContext(StoreContext);
    const { user, setUser } = useUser();
    const navigate = useNavigate();
    console.log("mytrips")
    useEffect(()=>{
    store.services.userService.GetMyTrips(user.id)
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
      <RibbonHeading heading={"Mis Viajes"} component="h2" variant="h2"/>
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
