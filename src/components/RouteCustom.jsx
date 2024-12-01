import { jwtDecode } from "jwt-decode";
import { Box, Typography, Paper } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const RouteCustom = ({ children }) => {
  const token = localStorage.getItem("token");

  // Validar token
  const isValidToken = () => {
    if (!token || token.split(".").length !== 3) {
      return false; // Token no existe o tiene formato inválido
    }

    try {
      const decoded = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);
      return !(decoded.exp && decoded.exp < currentTime);
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      return false;
    }
  };

  const isTokenValid = isValidToken();

  if (!isTokenValid) {
    setTimeout(() => {
      window.location.href = "/login";
    }, 2000);
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        bgcolor="rgba(255, 0, 0, 0.1)"
      >
        <Paper
          elevation={3}
          sx={{
            padding: "24px",
            maxWidth: "400px",
            textAlign: "center",
            borderRadius: "12px",
            boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
            border: "1px solid rgba(255, 0, 0, 0.3)",
          }}
        >
          <ErrorOutlineIcon color="error" sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant="h6" color="error" sx={{ mb: 1 }}>
            Su sesión ha expirado
          </Typography>
          <Typography>Serás redirigido a iniciar sesion en breve...</Typography>
        </Paper>
      </Box>
    );
  }

  return children;
};

export default RouteCustom;
