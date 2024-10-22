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
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { useUser } from "../../user/UserContext";
import VerificationSteps from "./VerificationSteps";
import { jwtDecode } from "jwt-decode";
import AlertCustom from "../AlertCustom/AlertCustom";

const Profile = () => {
  // const [userInfo, setUserInfo] = useState(null);
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
        <Box sx={{display:"flex", justifyContent:"center", height:"100%"}}>
        <CircularProgress />
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            marginLeft: 5,
            marginBottom: 5,
          }}
        >
          {!isAccountVerified && (
            <Alert
              variant="outlined"
              severity="warning"
              sx={{ alignSelf: "center", width: "20vw" }}
            >
              Account not verified
              <Typography variant="body1" color="textPrimary">
                Your account is not verified.
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => setVerifyingUser(true)}
                sx={{ mt: 1 }}
              >
                Verify Now
              </Button>
            </Alert>
          )}

          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Avatar sx={{ bgcolor: "#226668", width: 70, height: 70, mr: 2 }}>
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
                <Tooltip title="No validado">
                  <CancelIcon color="error" sx={{ ml: 1 }} />
                </Tooltip>
              )}
            </Typography>
          </Box>

          <Grid container spacing={2} sx={{ maxWidth: 600 }}>
            <Grid item xs={12}>
              <Typography variant="subtitle1">
                <strong>Email:</strong> {handleNull(user.email)}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1">
                <strong>DNI:</strong> {handleNull(user.nroDni)}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1">
                <strong>Número de Trámite:</strong>{" "}
                {handleNull(user.nroTramiteDni)}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1">
                <strong>Fecha de Nacimiento:</strong>{" "}
                {handleNull(new Date(user.birthDate).toLocaleDateString())}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1">
                <strong>Género:</strong>{" "}
                {handleNull(user.gender === "F" ? "Femenino" : "Masculino")}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1">
                <strong>Provincia:</strong> {handleNull(user.province)}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1">
                <strong>Localidad:</strong> {handleNull(user.locality)}
              </Typography>
            </Grid>
          </Grid>
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
