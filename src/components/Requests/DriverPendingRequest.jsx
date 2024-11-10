import { Box } from '@mui/material'
import React from 'react'
import { useSearchParams } from 'react-router-dom'
import RibbonHeading from '../RibbonHeading/RibbonHeading';
import TripDetails from '../TripDetails/TripDetails';

export default function DriverPendingRequest() {
  let [searchParams, setSearchParams] = useSearchParams();
  const tripUserId = searchParams.get("tripUserId")
  const tripId = searchParams.get("tripId")

  return (
    <Box paddingInline={5}>
        <RibbonHeading heading={"Solicitud Pendiente"} component={"h2"} variant={"h2"}/>

        <TripDetails pendingSolicitudes={true} tripIdParam={tripId} tripUserId={tripUserId}/>
    </Box>
  )
}
