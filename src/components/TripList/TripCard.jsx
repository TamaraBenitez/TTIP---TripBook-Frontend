import { Card, CardContent, CardMedia, Typography } from '@mui/material'
import React, { useEffect } from 'react'

export default function TripCard({name, description, startDate, destination, startingPoint, currentParticipants, totalCapacity}) {

  return (
    <>
     <Card variant='outlined' sx={{ width: 345 }}>
     <CardMedia
        sx={{ height: 140 }}
        image="/images/road.jpg"
        title="green iguana"
      />
      <CardContent>
        <Typography  variant="h5" component="div">
          {name}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {description}
        </Typography>
      </CardContent>
     </Card>
    </>
  )
}
