import React, { useState } from "react";
import {
  Box,
  IconButton,
  useTheme,
  Pagination,
  Grid2,
  MenuItem,
  Select,
} from "@mui/material";
import TripCard from "./TripCard";
import { useNavigate } from "react-router-dom";
import AddTripButton from "./AddTripButton";

export default function Trips(props) {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6); // Valor por defecto: 6
  const [selectedItems, setSelectedItems] = useState(false); // Controla si el usuario seleccionó una opción

  const totalPages = Math.ceil(props.trips.length / itemsPerPage);

  const currentTrips = props.trips.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (event) => {
    const value = event.target.value;
    setSelectedItems(true); // Marca que el usuario seleccionó algo
    setItemsPerPage(value); // Actualiza la cantidad de elementos por página
    setCurrentPage(1); // Reinicia a la primera página
  };

  return (
    <Box sx={{ paddingBottom: 4, maxWidth: "80vw" }}>
      <Grid2
        className="tripsContainer"
        container
        columnGap={4}
        padding={10}
        rowGap={12}
        sx={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        {currentTrips.map((trip) => (
          <Box
            key={trip.tripUserId}
            sx={{
              position: "relative",
              width: 345,
              height: 250,
              transition: "transform 0.3s ease-in-out",
              "&:hover": {
                transform: "scale(1.05)",
                zIndex: 2,
              },
            }}
          >
            <TripCard
              key={trip.tripUserId}
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
              role={props.role}
              tripUserId={trip.tripUserId}
              imageUrl={trip.imageUrl}
            />
          </Box>
        ))}
        {currentPage === totalPages || currentTrips.length < itemsPerPage ? (
          <AddTripButton />
        ) : null}
      </Grid2>

      <Box sx={{ position: "relative", marginTop: 5 }}>
        {" "}
        <Box
          sx={{ display: "flex", justifyContent: "center", marginBottom: 0 }}
        >
          {" "}
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
        <Box sx={{ position: "absolute", top: 0, right: 0 }}>
          <Select
            value={selectedItems ? itemsPerPage : ""}
            onChange={handleItemsPerPageChange}
            displayEmpty
            sx={{
              minWidth: 100,
              fontSize: "0.85rem",
              marginTop: "-10px",
            }}
            renderValue={(value) =>
              value ? `${value} por página` : "Seleccionar"
            }
          >
            <MenuItem disabled value="">
              Seleccionar
            </MenuItem>
            {[2, 5, 6, 10, 15].map((option) => (
              <MenuItem key={option} value={option}>
                {option} por página
              </MenuItem>
            ))}
          </Select>
        </Box>
      </Box>
    </Box>
  );
}
