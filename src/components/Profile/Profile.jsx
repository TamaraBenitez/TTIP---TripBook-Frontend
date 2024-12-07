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
  TextField,
  Autocomplete,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { useUser } from "../../user/UserContext";
import VerificationSteps from "./VerificationSteps";
import AlertCustom from "../AlertCustom/AlertCustom";
import RibbonHeading from "../RibbonHeading/RibbonHeading";
import MyVehicles from "../MyVehicles/MyVehicles";
import DialogCustom from "../DialogCustom/DialogCustom";
import { Edit, ErrorOutline } from "@mui/icons-material";
import { getProvinces } from "../../utility/Utility";
import StoreContext from "../../store/storecontext";

const Profile = () => {
  const [verifyingUser, setVerifyingUser] = useState(false);
  const [isAccountVerified, setIsAccountVerified] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState("success");
  const [tabIndex, setTabIndex] = useState(0);
  const [vehicles, setVehicles] = useState([]);
  const [alertMsg, setAlertMsg] = useState("Su cuenta ha sido verificada con exito")
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { user, userDataLoading, setUser } = useUser();
  const [editedProvince, setEditedProvince] = useState("");
  const [editedLocality, setEditedLocality] = useState("");
  const store = useContext(StoreContext);

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
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false)
    }, 5000);
    setVehicles([...vehicles, vehicle]);
  }

  const handleEdit = () => {
    store.services.userService
        .UpdateUser(user.id, {locality:editedLocality, province:editedProvince})
        .then((res)=>setUser({...user, locality:editedLocality, province:editedProvince}))
        .catch((error)=>{
          setAlertMsg(error.response.data.message);
          setAlertSeverity("error")
          setShowAlert(true);
          setTimeout(() => {
            setAlertSeverity("success");
            setShowAlert(false)
          }, 5000);
        })
    setIsDialogOpen(false);
  };
  
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
            <Box display={"flex"} flexDirection={"column"} alignItems="center" p={3}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: 2,
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
                  flexWrap: "nowrap",
                  justifyContent: "space-evenly",
                  padding: 2,
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
                    {handleNull(
                      user.gender === null
                        ? "Sin información aun"
                        : user.gender === "F"
                        ? "Femenino"
                        : "Masculino"
                    )}
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

              <Button sx={{maxWidth:"max-content"}} variant="outlined" onClick={() => setIsDialogOpen(true)}>Editar {<Edit sx={{ml:1}} fontSize="22"/>}</Button>
            </Box>
            </Paper>
          )}
          {tabIndex === 1 && (
            <Paper sx={{ mr: 5, minWidth: 600, padding: 3 }}>
               
                <MyVehicles
                  vehicles={vehicles}
                  onSave={(vehicle)=>handleCreateVehicle(vehicle)}
                  userId={user.id}
                  profile={true}
                  setVehicles={setVehicles}    
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
          setSuccessAlert={setShowAlert}
        />
      )}
      {
        <AlertCustom
          inProp={showAlert}
          timeout={500}
          msg={alertMsg}
          icon={alertSeverity === "success" ? <CheckCircleIcon /> : <ErrorOutline />}
          severity={alertSeverity}
        />
      }
      {
        <DialogCustom
        open={isDialogOpen}
        handleClose={() => setIsDialogOpen(false)}
        title="Editar Provincia y Localidad"
        dialogContent={
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt:1}}>
            <Autocomplete
              options={getProvinces()}
              value={editedProvince}
              onChange={(event, newValue) => setEditedProvince(newValue)}
              renderInput={(params) => (
                <TextField {...params} label="Provincia" fullWidth />
              )}
            />
            <TextField
              fullWidth
              label="Localidad"
              value={editedLocality}
              onChange={(e) => setEditedLocality(e.target.value)}
            />
          </Box>
        }
        handleConfirm={handleEdit}
        showCancelButton={true}
      />
      }
    </>
  );
};

export default Profile;
