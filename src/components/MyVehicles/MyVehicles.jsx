import React, { useEffect, useState } from 'react';
import { Box, Typography, List, ListItem, ListItemText, ListItemButton, Button, IconButton } from '@mui/material';
import CarCrashIcon from "@mui/icons-material/CarCrash";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import VehicleCreation from '../VehicleCreation/VehicleCreation';


const MyVehicles = ({vehicles, onSave, userId, isSelecting}) => {
    const [showCreateCar, setShowCreateCar] = useState(false);
    const [selectedVehicleId, setSelectedVehicleId] = useState(null);

    const handleAddVehicle = () =>{
        setShowCreateCar(true)
    }
    const handleSelectVehicle = (vehicleId) => {
        setSelectedVehicleId(vehicleId);
      };
    const getVehicleBorder=(selectedVehicleId, currentId) =>{
        return selectedVehicleId === currentId ? "2px solid green" : "1px solid transparent"
    }

  return (
    <>
    {vehicles.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <CarCrashIcon sx={{ fontSize: 50, color: "gray", mb: 2 }} />
          <Typography variant="h6">
            No tienes ningún vehículo registrado aún
          </Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={handleAddVehicle}
          >
            Agregar Vehículo
          </Button>
        </Box>
      ) :
    (<Box sx={{ maxWidth: 400, margin: "0 auto", padding: 2 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Vehículos
        </Typography>
        <List sx={{ bgcolor: "background.paper", borderRadius: 1 }}>
          {vehicles?.map((vehicle, i) => (
            <ListItem
              key={vehicle.id || "vehicle_" + i}
              disablePadding
              sx={{
                bgcolor: selectedVehicleId === vehicle.id ? "green.50" : "grey.100",
                borderRadius: 1,
                border: getVehicleBorder(selectedVehicleId, vehicle.id),
                marginBottom: 1,
                "&:hover": { bgcolor: selectedVehicleId === vehicle.id ? "green.100" : "grey.200" },
              }}
            >
              <ListItemButton onClick={() => handleSelectVehicle(vehicle.id)}>
                <ListItemText
                  primary={
                    <Typography fontWeight="bold" variant="body1">
                      {vehicle.model}
                    </Typography>
                  }
                  secondary={vehicle.color}
                />
                {selectedVehicleId === vehicle.id && (
                  <IconButton disableRipple sx={{ color: "green" }}>
                    <CheckCircleIcon />
                  </IconButton>
                )}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Button
          variant="text"
          startIcon={<AddCircleOutlineIcon />}
          onClick={() => setShowCreateCar(true)}
          sx={{ color: "primary.main", textTransform: "none", fontWeight: "bold" }}
        >
          Agrega un auto
        </Button>
      </Box>)}
    <VehicleCreation showCreateCar={showCreateCar} handleClose={()=>setShowCreateCar(false)} onSave={onSave} userId={userId}/>
    </>

  );
};

export default MyVehicles;