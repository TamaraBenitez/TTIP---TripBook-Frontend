import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Container,
  Grid2,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { Groups } from "@mui/icons-material";
import "./TripStyles.css";
import { NavLink } from "react-router-dom";
import { formatDate } from "../../utility/Utility";

function mapStatusToSpanish(status) {
  const statusMap = {
    pending: "Pendiente",
    confirmed: "Confirmado",
    cancelled: "Cancelado",
    rejected: "Rechazado",
  };
  return statusMap[status] || "";
}

export default function TripCard({
  description,
  startDate,
  startingPoint,
  destination,
  participantsNumber,
  maxPassengers,
  to,
  estimatedCost,
  action,
  handleAction,
  status,
}) {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = (e) => {
    e.stopPropagation();
  };
  function cleanString(input) {
    // Remove spaces and replace accented vowels
    return input
      .replace(/\s+/g, "") // Remove all spaces
      .replace(/[áÁ]/g, "a")
      .replace(/[éÉ]/g, "e")
      .replace(/[íÍ]/g, "i")
      .replace(/[óÓ]/g, "o")
      .replace(/[úÚ]/g, "u")
      .toLowerCase();
  }
  return (
    <>
      <Card
        variant="outlined"
        className="tripCard"
        sx={{
          textDecoration: "none",
          height: "fit-content",
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
            image={`/images/${cleanString(destination)}.jpg`}
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
                  <Typography variant="h6">
                    {"Sale de " + startingPoint}
                  </Typography>
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
            <Grid2
              container
              size={12}
              sx={{ display: "flex", paddingLeft: "0px !important" }}
            >
              <Grid2 size={6} width={"55%"}>
                <Typography variant="h5" component="div">
                  {destination}
                </Typography>
              </Grid2>
              {isHovered && (
                <Grid2
                  size={6}
                  sx={{
                    display: "flex",
                    width: "45%",
                    marginRight: "0px",
                    justifyContent: "flex-end",
                  }}
                >
                  <Groups className="groupIcon" />
                  <Typography>
                    {participantsNumber} / {maxPassengers}
                  </Typography>
                </Grid2>
              )}
            </Grid2>

            <Typography>{formatDate(startDate)}</Typography>
            {status && (
              <Typography variant="body2" color="text.secondary">
                Estado: {mapStatusToSpanish(status)}
              </Typography>
            )}

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
            <Button
              size="small"
              color="primary"
              onClick={(e) => handleAction(e, to)}
            >
              {action}
            </Button>
          </CardActions>
        )}
      </Card>
    </>
  );
}
