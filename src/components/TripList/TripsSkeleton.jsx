import { Box, Card, CardContent, Skeleton } from '@mui/material'
import React from 'react'

export default function TripsSkeleton() {
  return (
    <Box sx={{display:"flex", flexDirection:"row", flexWrap:"wrap", justifyContent:"center"}}>
       { // Show 5 Skeleton cards while loading
        [...Array(5)].map((_, index) => (
          <Card key={index} style={{ margin: "1rem", width: 345 }}>
            <Skeleton variant="rectangular" height={140} />
            <CardContent>
              <Skeleton variant="text" />
              <Skeleton variant="text" width="60%" />
            </CardContent>
          </Card>
        ))}
    </Box>
  )
}
