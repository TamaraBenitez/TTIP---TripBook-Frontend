import React, { useEffect, useState, useContext } from "react";
import { jwtDecode } from "jwt-decode";
import StoreContext from "../../store/storecontext";
import {
  Avatar,
  Box,
  Typography,
  Grid,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

const Profile = () => {
  const [userInfo, setUserInfo] = useState(null);
  const { services } = useContext(StoreContext);
  const [loading, setLoading] = useState(true);

  const getInitials = (name, surname) => {
    return `${name.charAt(0).toUpperCase()}${surname.charAt(0).toUpperCase()}`;
  };

  useEffect(() => {
    const token = sessionStorage.getItem("token");

    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log("Contenido del token:", decoded);

        const userId = decoded.id;

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
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    } else {
      console.error("No token found in sessionStorage");
    }
  }, [services]);

  if (loading) {
    return <CircularProgress />;
  }

  if (!userInfo) {
    return <Typography>Error loading profile</Typography>;
  }

  const handleNull = (value) => value || "Sin información aun";

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start", // Posiciona a la izquierda
        marginLeft: 5,
      }}
    >
      {/* Avatar, Nombre y Validación en la misma fila */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Avatar sx={{ bgcolor: "#226668", width: 70, height: 70, mr: 2 }}>
          {getInitials(userInfo.name, userInfo.surname)}
        </Avatar>
        <Typography variant="h4" sx={{ display: "flex", alignItems: "center" }}>
          {userInfo.name} {userInfo.surname}{" "}
          {userInfo.isValidated ? (
            <Tooltip title="Validado">
              <CheckCircleIcon
                color="success"
                sx={{ ml: 1 }} // Margen entre texto e ícono
              />
            </Tooltip>
          ) : (
            <Tooltip title="No validado">
              <CancelIcon
                color="error"
                sx={{ ml: 1 }} // Margen entre texto e ícono
              />
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
