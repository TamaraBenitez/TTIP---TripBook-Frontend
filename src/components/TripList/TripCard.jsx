import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Container,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Groups, LocationOn } from "@mui/icons-material";
import "./TripStyles.css";
import { NavLink } from "react-router-dom";

export default function TripCard({
  name,
  description,
  startDate,
  destination,
  participantsNumber,
  to,
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      <Card
        variant="outlined"
        className="tripCard"
        component={NavLink}
        to={`/trips/${to}`}
        sx={{
          textDecoration: "none",
          width: 345,
          transition: "transform 0.3s ease-in-out",
          "&:hover": {
            transform: "scale(1.05)",
            cursor: "pointer",
          },
          position: "relative",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => handleClick}
      >
        <CardMedia
          sx={{ height: 140, position: "relative" }}
          image="/images/road.jpg"
          title="green iguana"
        >
          {isHovered && (
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "30%",
                bgcolor: "rgba(255, 255, 255, 0.7)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Container sx={{ display: "flex", justifyContent: "center" }}>
                <LocationOn />
                <Typography variant="h6">{destination}</Typography>
              </Container>
            </Box>
          )}
        </CardMedia>
        <CardContent
          sx={{
            maxHeight: 300,
            overflow: "hidden",
          }}
        >
          <Container sx={{ display: "flex", paddingLeft: "0px !important" }}>
            <Typography variant="h5" component="div">
              {name}
            </Typography>
            {isHovered && (
              <Container
                sx={{
                  display: "flex",
                  paddingRight: "0px !important",
                  width: "20%",
                  marginRight: "0px",
                }}
              >
                <Groups className="groupIcon" />
                {participantsNumber}
              </Container>
            )}
          </Container>

          <Typography>{startDate}</Typography>

          {isHovered && (
            <Typography
              className={isHovered ? "less-width" : ""}
              variant="body2"
              sx={{
                color: "text.secondary",
                display: "-webkit-box", 
                WebkitLineClamp: 3, 
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {description}
            </Typography>
          )}
        </CardContent>
      </Card>
    </>
  );
}
