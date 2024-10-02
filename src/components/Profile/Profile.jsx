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

const Profile = () => {
  const [userInfo, setUserInfo] = useState(null);
  const { services } = useContext(StoreContext);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  

  useEffect(() => {
      const userId = user.id;

      services.userService
        .GetUser(userId)
        .then((response) => {
          console.log("User data:", response.data);
          setUserInfo(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
  }, [user, services]);

  if (loading) {
    return <CircularProgress />;
  }

  if (!userInfo) {
    return <Typography>Error loading profile</Typography>;
  }
  
  const getInitials = (name, surname) => {
    return `${name.charAt(0).toUpperCase()}${surname.charAt(0).toUpperCase()}`;
  };

  const handleNull = (value) => value || "Sin información aun";

  const handleVerify = () => {
    services.userService.verifyUser(userInfo.id)
      .then(() => {
        console.log('User verified successfully');
      })
      .catch((error) => {
        console.error('Error verifying user:', error);
      });
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", marginLeft: 5, marginBottom:5 }}>
      {!userInfo.isUserVerified && (
        <Alert variant="outlined" severity="warning" sx={{alignSelf: "center", width:"20vw"}}>
        Account not verified
        <Typography variant="body1" color="textPrimary">
            Your account is not verified.
          </Typography>
          <Button variant="outlined" color="primary" onClick={handleVerify} sx={{ mt: 1 }}>
            Verify Now
          </Button>
      </Alert>
      )}

      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Avatar sx={{ bgcolor: "#226668", width: 70, height: 70, mr: 2 }}>
          {getInitials(userInfo.name, userInfo.surname)}
        </Avatar>
        <Typography variant="h4" sx={{ display: "flex", alignItems: "center" }}>
          {userInfo.name} {userInfo.surname}{" "}
          {userInfo.isUserVerified ? (
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

      {/* Información del usuario */}
      <Grid container spacing={2} sx={{ maxWidth: 600 }}>
        <Grid item xs={12}>
          <Typography variant="subtitle1">
            <strong>Email:</strong> {handleNull(userInfo.email)}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle1">
            <strong>DNI:</strong> {handleNull(userInfo.nroDni)}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle1">
            <strong>Número de Trámite:</strong>{" "}
            {handleNull(userInfo.nroTramiteDni)}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle1">
            <strong>Fecha de Nacimiento:</strong>{" "}
            {handleNull(new Date(userInfo.birthDate).toLocaleDateString())}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle1">
            <strong>Género:</strong>{" "}
            {handleNull(userInfo.gender === "F" ? "Femenino" : "Masculino")}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle1">
            <strong>Provincia:</strong> {handleNull(userInfo.province)}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle1">
            <strong>Localidad:</strong> {handleNull(userInfo.locality)}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile;
