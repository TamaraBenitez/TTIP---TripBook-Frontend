import React, { useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  CircularProgress,
  Button,
  Alert,
} from "@mui/material";
import StoreContext from "../../store/storecontext";

const VerifyEmail = () => {
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("Verifying your email...");
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const store = useContext(StoreContext);
  useEffect(() => {
    const verifyEmailToken = async () => {
      if (!token) {
        setStatus("error");
        setMessage("Invalid or missing verification token.");
        return;
      }

      try {
        const response = await store.services.authService.verifyEmail(token);
        if (response.data) {
          setStatus("success");
          setMessage("¡Tu correo electrónico ha sido verificado exitosamente!");
        } else {
          setStatus("error");
          setMessage(response.data.message || "Email verification failed.");
        }
      } catch (error) {
        console.error("Verification error:", error);
        setStatus("error");
        setMessage("El token no es válido o ha expirado.");
      }
    };

    verifyEmailToken();
  }, [token]);

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        {status === "loading" && (
          <>
            <CircularProgress />
            <Typography variant="h6" mt={2}>
              {message}
            </Typography>
          </>
        )}

        {status === "success" && (
          <Alert severity="success">
            <Typography variant="h6">{message}</Typography>
            <Button variant="contained" color="primary" href="/" sx={{ mt: 2 }}>
              Ir al inicio
            </Button>
          </Alert>
        )}

        {status === "error" && (
          <Alert severity="error">
            <Typography variant="h6">{message}</Typography>
            <Button variant="contained" color="primary" href="/" sx={{ mt: 2 }}>
              Ir al inicio
            </Button>
          </Alert>
        )}
      </Box>
    </Container>
  );
};

export default VerifyEmail;
