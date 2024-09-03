import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'

export default function TripDetails() {
    const { id } = useParams();
    useEffect(()=>{
        console.log(id)
    },[id])

  return (
    <div>TripDetails</div>
  )
}
