import React, { useEffect, useState, useContext } from "react";
import StoreContext from "../../store/storecontext";
import {
  Avatar,
  Box,
  Typography,
  Grid,
  CircularProgress,
  Tooltip,
  Button,
  Alert,
  Grid2,
  Paper,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { useUser } from "../../user/UserContext";
import VerificationSteps from "./VerificationSteps";
import AlertCustom from "../AlertCustom/AlertCustom";
import RibbonHeading from "../RibbonHeading/RibbonHeading";

const Profile = () => {
  const [verifyingUser, setVerifyingUser] = useState(false);
  const { user, setUser, userDataLoading } = useUser();
  const [isAccountVerified, setIsAccountVerified] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const store = useContext(StoreContext);

  useEffect(() => {
    if (!userDataLoading) {
      setIsAccountVerified(user.isUserVerified && user.isEmailVerified);
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
          {/* <Box sx={{display:"flex", flexDirection:"row", marginTop:3}}> */}
          <Paper sx={{ mr: 5, minWidth: 600 }}>
            <Box>
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
            </Box>
          </Paper>

          {/* </Box> */}
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
          msg={"Su cuenta ha sido verificada con exito"}
          icon={<CheckCircleIcon />}
          severity={"success"}
        />
      }
    </>
  );
};

export default Profile;
