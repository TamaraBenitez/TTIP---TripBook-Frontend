import React, { useContext, useEffect, useState } from 'react'
import Trips from '../TripList/Trips'
import { Typography } from '@mui/material';
import StoreContext from '../../store/storecontext';

export default function MyTrips() {
    const [trips, setTrips] = useState([]);
    const store = useContext(StoreContext);
    console.log("mytrips")
useEffect(()=>{
    const mytrips = store.services.tripService.GetMyTrips()
        // .then((res)=>{
        //     setTrips(res.data);
        // })
        // .catch((e)=>{
        //     console.log(e)
        // })
    setTrips(mytrips)
},[])

  return (
    <>
    <Typography variant='h2'>
        Mis Viajes
    </Typography>
    <Trips trips={trips}/>
    </>
  )
}
