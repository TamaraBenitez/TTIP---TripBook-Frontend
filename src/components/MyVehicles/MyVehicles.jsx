import React, { useContext, useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Button,
  IconButton,
  Grid2,
} from "@mui/material";
import CarCrashIcon from "@mui/icons-material/CarCrash";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import VehicleCreation from "../VehicleCreation/VehicleCreation";
import { Delete, DirectionsCar, ErrorOutline } from "@mui/icons-material";
import { getCarColors } from "../../utility/Utility";
import DialogCustom from "../DialogCustom/DialogCustom";
import StoreContext from "../../store/storecontext";
import AlertCustom from "../AlertCustom/AlertCustom";

const MyVehicles = ({
  vehicles,
  onSave,
  userId,
  selectedVehicle = {},
  setSelectedVehicle = () => {},
  profile,
  setVehicles,
}) => {
  const [showCreateCar, setShowCreateCar] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [vehicleToRemove, setVehicleToRemove] = useState(null);
  const [alert, setAlert] = useState(null);
  const store = useContext(StoreContext);
  const [alertSeverity, setAlertSeverity] = useState("success");

  const handleTrashClick = (vehicleId) => {
    setVehicleToRemove(vehicleId);
    setShowModal(true);
  };
  const removeVehicle = () => {
    store.services.vehicleService
      .DeleteVehicle(vehicleToRemove)
      .then((res) => {
        let filteredVehicles = vehicles.filter((v) => v.id !== vehicleToRemove);
        setVehicles(filteredVehicles);
        handleCloseModal();
        setAlert("Vehículo eliminado con éxito");
        setAlertSeverity("success");
        setTimeout(() => {
          setAlert(null);
        }, 5000);
      })
      .catch((error) => {
        handleCloseModal();
        setAlert(error.response.data.message);
        setAlertSeverity("error");
        setTimeout(() => {
          setAlert(null);
        }, 5000);
      });
  };
  const handleAddVehicle = () => {
    setShowCreateCar(true);
  };
  const handleSelectVehicle = (vehicle) => {
    setSelectedVehicle(vehicle);
  };
  const handleCloseModal = () => {
    setVehicleToRemove(null);
    setShowModal(false);
  };
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
      ) : (
        <Box sx={{ maxWidth: 400, margin: "0 auto", padding: 2 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Mis Vehículos
          </Typography>
          <List sx={{ bgcolor: "background.paper", borderRadius: 1 }}>
            {vehicles?.map((vehicle, i) => (
              <ListItem
                key={vehicle.id || "vehicle_" + i}
                disablePadding
                sx={{
                  bgcolor:
                    selectedVehicle?.id === vehicle.id
                      ? "green.50"
                      : "grey.100",
                  borderRadius: 1,
                  border:
                    selectedVehicle?.id === vehicle.id
                      ? "2px solid green"
                      : "1px solid transparent",
                  marginBottom: 1,
                  "&:hover": {
                    bgcolor:
                      selectedVehicle?.id === vehicle.id
                        ? "green.100"
                        : "grey.200",
                  },
                }}
              >
                <ListItemButton
                  sx={{ display: "-ms-grid" }}
                  onClick={() => handleSelectVehicle(vehicle)}
                >
                  <Grid2 container size={12} justifyContent={"space-between"}>
                    <Grid2 size={8}>
                      <ListItemText
                        primary={
                          <Typography fontWeight="bold" variant="body1">
                            {vehicle.model}
                          </Typography>
                        }
                        secondary={vehicle.color}
                      />
                    </Grid2>
                    <Grid2 size={1} display={"flex"} alignItems={"center"}>
                      <DirectionsCar
                        sx={{
                          color: getCarColors().find(
                            (colorObj) => vehicle.color === colorObj.label
                          ).hex,
                        }}
                      />
                    </Grid2>
                    <Grid2 item size={1} display={"flex"} alignItems={"center"}>
                      {profile && (
                        <IconButton
                          onClick={() => handleTrashClick(vehicle.id)}
                        >
                          <Delete />
                        </IconButton>
                      )}
                      {selectedVehicle.id === vehicle.id && (
                        <IconButton disableRipple sx={{ color: "green" }}>
                          <CheckCircleIcon />
                        </IconButton>
                      )}
                    </Grid2>
                  </Grid2>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Button
            variant="text"
            startIcon={<AddCircleOutlineIcon />}
            onClick={() => setShowCreateCar(true)}
            sx={{
              color: "primary.main",
              textTransform: "none",
              fontWeight: "bold",
            }}
          >
            Agrega un auto
          </Button>
        </Box>
      )}
      <VehicleCreation
        showCreateCar={showCreateCar}
        handleClose={() => setShowCreateCar(false)}
        onSave={onSave}
        userId={userId}
      />
      <DialogCustom
        open={showModal}
        handleClose={handleCloseModal}
        title={"Eliminar Vehiculo"}
        textParagraph={"Estás seguro que quieres eliminar este vehículo?"}
        handleConfirm={removeVehicle}
        showCancelButton={true}
      />
      {
        <AlertCustom
          inProp={alert !== null}
          timeout={500}
          onClose={() => setAlert(null)}
          msg={alert}
          icon={
            alertSeverity === "success" ? <CheckCircleIcon /> : <ErrorOutline />
          }
          severity={alertSeverity}
        />
      }
    </>
  );
};

export default MyVehicles;
