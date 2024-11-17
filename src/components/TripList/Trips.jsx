import React, { useState } from "react";
import { Box, Container, IconButton, useTheme, Pagination, Grid2 } from "@mui/material";
import TripCard from "./TripCard";
import { AddOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export default function Trips(props) {
  const theme = useTheme();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Calculate total pages
  const totalPages = Math.ceil(props.trips.length / itemsPerPage);

  // Get trips for the current page
  const currentTrips = props.trips.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle page change
  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  return (
    <>
      <Grid2
        className="tripsContainer"
        container 
        columnGap={4}
        padding={10}
        rowGap={6}
        sx={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        {currentTrips.map((trip) => (
          <Box
            key={trip.id}
            sx={{
              position: "relative",
              width: 345,
              height: 250, // Ensure consistent space
              transition: "transform 0.3s ease-in-out",
              "&:hover": {
                transform: "scale(1.05)",
                zIndex: 2, // Bring the hovered card above others
              },
            }}
          >
            <TripCard
              to={trip.id}
              description={trip.description}
              startDate={trip.startDate}
              destination={trip.destination}
              startingPoint={trip.origin}
              participantsNumber={trip.registrants}
              maxPassengers={trip.maxPassengers}
              estimatedCost={trip.estimatedCost}
              status={trip.status}
              action={props.action}
              handleAction={props.handleAction}
            />
          </Box>
        ))}
        {/* Show Add Button only on the last page */}
        {currentPage === totalPages && (
          <Box
            sx={{
              width: 345,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: 250,
            }}
          >
            <IconButton
              sx={{
                height: "100px",
                width: "100px",
                color: theme.palette.primary.light,
                ":hover": {
                  bgcolor: theme.palette.secondary.light,
                  color: "white",
                },
              }}
              onClick={() => navigate("/trip")}
            >
              <AddOutlined sx={{ fontSize: "-webkit-xxx-large" }} />
            </IconButton>
          </Box>
        )}
      </Grid2>
      {/* Pagination controls */}
      <Box sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
    </>
  );
}