import React, { useEffect, useState, useContext } from "react";
import {
  Avatar,
  Box,
  Typography,
  CircularProgress,
  Tooltip,
  Button,
  Alert,
  Paper,
  Tabs,
  Tab,
  Grid2,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { useUser } from "../../user/UserContext";
import VerificationSteps from "./VerificationSteps";
import AlertCustom from "../AlertCustom/AlertCustom";
import RibbonHeading from "../RibbonHeading/RibbonHeading";
import MyVehicles from "../MyVehicles/MyVehicles";

const Profile = () => {
  const [verifyingUser, setVerifyingUser] = useState(false);
  const [isAccountVerified, setIsAccountVerified] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [vehicles, setVehicles] = useState([]);
  
  const [vehicleToAdd, setVehicleToAdd] = useState();
  const [alertMsg, setAlertMsg] = useState("Su cuenta ha sido verificada con exito")
  const { user, userDataLoading } = useUser();

  useEffect(() => {
    if (!userDataLoading) {
      setIsAccountVerified(user.isUserVerified && user.isEmailVerified);
      setVehicles(user.vehicles)
    }
  }, [userDataLoading]);

  useEffect(() => {
    if (user && user.isEmailVerified && user.isUserVerified) {
      setIsAccountVerified(true);
    }
  }, [user]);


  const getInitials = (name, surname) => {
    return `${name.charAt(0).toUpperCase()}${surname.charAt(0).toUpperCase()}`;
  };

  const handleNull = (value) => value || "Sin información aun";

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };
  const handleCreateVehicle = (vehicle) =>{
    setAlertMsg("Vehiculo registrado exitosamente")
    setShowSuccessAlert(true);
    setVehicles([...vehicles, vehicle])
  }

  return (
    <>
      {userDataLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", height: "100%" }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            margin: 5,
            justifyContent: "space-around",
          }}
        >
          <RibbonHeading variant={"h2"} heading={"Profile"} />
          {!isAccountVerified && (
            <Alert
              variant="outlined"
              severity="warning"
              sx={{ alignSelf: "center", width: "20vw" }}
            >
              Cuenta no verificada
              <Typography variant="body1" color="textPrimary">
                Su cuenta no esta verificada
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => setVerifyingUser(true)}
                sx={{ mt: 1 }}
              >
                Verificar ahora
              </Button>
            </Alert>
          )}
          <Tabs
            value={tabIndex}
            onChange={handleTabChange}
            sx={{ marginBottom: 3 }}
            aria-label="profile tabs"
          >
            <Tab label="Información Personal" />
            <Tab label="Mis Vehículos" />
          </Tabs>
          {tabIndex === 0 && (
            <Paper sx={{mr:5, minWidth:600}}>
            <Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding:2,
                  mb: 2,
                  width: "-webkit-fill-available",
                }}
              >
                <Avatar
                  sx={{ bgcolor: "#226668", width: 70, height: 70, mr: 2 }}
                >
                  {getInitials(user.name, user.surname)}
                </Avatar>
                <Typography
                  variant="h4"
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  {user.name} {user.surname}{" "}
                  {isAccountVerified ? (
                    <Tooltip title="Validado">
                      <CheckCircleIcon color="success" sx={{ ml: 1 }} />
                    </Tooltip>
                  ) : (
                    <Tooltip title="No validado" placement="right">
                      <CancelIcon color="error" sx={{ ml: 1 }} />
                    </Tooltip>
                  )}
                </Typography>
              </Box>

              <Grid2
              container
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  width: "100%",
                  flexWrap:"nowrap",
                  justifyContent:"space-evenly",
                  padding:2
                }}
              >
                <Grid2 item xs={6}>
                <Grid2
                  container
                  xs={12}
                  sx={{ justifyContent: "space-between" }}
                >
                  <Typography variant="subtitle1">
                    <strong>Email:</strong>
                  </Typography>
                </Grid2>
                <Grid2
                  container
                  xs={12}
                  sx={{ justifyContent: "space-between" }}
                >
                  <Typography variant="subtitle1">
                    <strong>DNI:</strong>
                  </Typography>
                </Grid2>
                <Grid2
                  container
                  xs={12}
                  sx={{ justifyContent: "space-between" }}
                >
                  <Typography variant="subtitle1">
                    <strong>Número de Trámite:</strong>{" "}
                  </Typography>
                </Grid2>
                <Grid2
                  container
                  xs={12}
                  sx={{ justifyContent: "space-between" }}
                >
                  <Typography variant="subtitle1">
                    <strong>Fecha de Nacimiento:</strong>{" "}
                  </Typography>
                </Grid2>
                <Grid2
                  container
                  xs={12}
                  sx={{ justifyContent: "space-between" }}
                >
                  <Typography variant="subtitle1">
                    <strong>Género:</strong>{" "}
                  </Typography>
                </Grid2>
                <Grid2
                  container
                  xs={12}
                  sx={{ justifyContent: "space-between" }}
                >
                  <Typography variant="subtitle1">
                    <strong>Provincia:</strong>
                  </Typography>
                </Grid2>
                <Grid2
                  container
                  xs={12}
                  sx={{ justifyContent: "space-between" }}
                >
                  <Typography variant="subtitle1">
                    <strong>Localidad:</strong>
                  </Typography>
                </Grid2>
                <Grid2
                  container
                  xs={12}
                  sx={{ justifyContent: "space-between" }}
                >
                  <Typography variant="subtitle1">
                    <strong>Telefono:</strong>
                  </Typography>
                </Grid2>
                </Grid2>
                <Grid2 item xs={6}>
                <Typography variant="subtitle1">
                  {handleNull(user.email)}
                </Typography>
                <Typography variant="subtitle1">
                  {handleNull(user.nroDni)}
                </Typography>
                <Typography variant="subtitle1">
                  {handleNull(user.nroTramiteDni)}
                </Typography>
                <Typography variant="subtitle1">
                  {handleNull(new Date(user.birthDate).toLocaleDateString())}
                </Typography>
                <Typography variant="subtitle1">
                  {handleNull(user.gender === "F" ? "Femenino" : "Masculino")}
                </Typography>
                <Typography variant="subtitle1">
                  {handleNull(user.province)}
                </Typography>
                <Typography variant="subtitle1">
                  {handleNull(user.locality)}
                </Typography>
                <Typography variant="subtitle1">
                  {handleNull(user.phoneNumber)}
                </Typography>
              </Grid2>
              </Grid2>
              
            </Box>
            </Paper>
          )}
          {tabIndex === 1 && (
            <Paper sx={{ mr: 5, minWidth: 600, padding: 3 }}>
               
                <MyVehicles
                  vehicles={vehicles}
                  onSave={(vehicle)=>handleCreateVehicle(vehicle)}
                  userId={user.id}    
                />
              
            </Paper>
          )}
        </Box>
      )}
      {verifyingUser && (
        <VerificationSteps
          onClose={() => setVerifyingUser(false)}
          open={verifyingUser}
          userId={user.id}
          setAccountVerified={setIsAccountVerified}
          setSuccessAlert={setShowSuccessAlert}
        />
      )}
      {
        <AlertCustom
          inProp={showSuccessAlert}
          timeout={500}
          msg={alertMsg}
          icon={<CheckCircleIcon />}
          severity={"success"}
        />
      }
    </>
  );
};

export default Profile;
