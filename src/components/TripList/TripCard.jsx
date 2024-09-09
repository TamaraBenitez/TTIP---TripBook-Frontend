import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Container,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { Groups, LocationOn } from "@mui/icons-material";
import "./TripStyles.css";
import { NavLink } from "react-router-dom";

export default function TripCard({
  description,
  startDate,
  startingPoint,
  destination,
  participantsNumber,
  to,
  estimatedCost,
  action
}) {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = (e) => {
    e.stopPropagation();
  };

  return (
    <>
      <Card
        variant="outlined"
        className="tripCard"
        sx={{
          textDecoration: "none",
          width: 345,
          transition: "transform 0.3s ease-in-out",
          "&:hover": {
            transform: "scale(1.05)",
          },
          position: "relative",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => handleClick}
      >
        <CardActionArea component={NavLink} to={`/trips/${to}`}>
          <CardMedia
            sx={{ height: 140, position: "relative" }}
            image="/images/road.jpg"
            title="road"
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
                  <Typography variant="h6">{"Sale de "+startingPoint}</Typography>
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
                {destination}
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
            <Typography color="primary" variant="h6">
              ${estimatedCost}
            </Typography>
          </CardContent>
        </CardActionArea>
        {isHovered && (
          <CardActions>
            <Button size="small" color="primary" onClick={handleClick}>
              {action}
            </Button>
          </CardActions>
        )}
      </Card>
    </>
  );
}
