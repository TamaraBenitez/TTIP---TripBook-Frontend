import { Card, CardContent, CardMedia, Container, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Group, Groups } from "@mui/icons-material";
import "./TripStyles.css";

export default function TripCard({
  name,
  description,
  startDate,
  destination,
  startingPoint,
  participantsNumber,
  totalCapacity,
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      <Card
        variant="outlined"
        className="tripCard"
        sx={{
          width: 345,
          transition: "transform 0.3s ease-in-out",
          "&:hover": {
            transform: "scale(1.05)",
          },
        }}
        onMouseEnter={()=>setIsHovered(true)}
        onMouseLeave={()=>setIsHovered(false)}
      >
        <CardMedia
          sx={{ height: 140 }}
          image="/images/road.jpg"
          title="green iguana"
        />
        <CardContent>
          <Typography variant="h5" component="div">
            {name}
          </Typography>
          <Container sx={{paddingLeft: "0px !important", display:"flex"}}>
          <Typography className={isHovered ? "less-width" : ""} variant="body2" sx={{ color: "text.secondary" }}>
            {description}
          </Typography>
          { isHovered && 
            <Container sx={{display:"flex", paddingRight:"0px !important", width:"20%", marginRight:"0px"}}>
            <Groups className="groupIcon"/>
            {participantsNumber}/{totalCapacity}
            </Container>
          }
          </Container>
        </CardContent>
       
      </Card>
    </>
  );
}
