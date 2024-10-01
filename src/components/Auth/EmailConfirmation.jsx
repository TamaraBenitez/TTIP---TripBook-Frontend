import React, { useContext, useEffect } from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import { MailOutline } from "@mui/icons-material";
import StoreContext from "../../store/storecontext";

const EmailConfirmation = ({ userId }) => {
  const store = useContext(StoreContext);
  const handleResendEmail = () => {
    store.services
        .authService.sendVerificationEmail({ userId: userId });
  }
  useEffect(() => {
    store.services
        .authService.sendVerificationEmail({ userId: userId });
  }, [userId]);

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          textAlign: "center",
        }}
      >
        <MailOutline sx={{ fontSize: 150 }} />
        <Typography variant="h4" gutterBottom>
          Confirme su correo electrónico
        </Typography>
        <Typography variant="body1" gutterBottom>
          Hemos enviado un correo electrónico de confirmación a su dirección.
          Por favor, revise su bandeja de entrada y confirme su correo
          electrónico.
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          Si no ha recibido el correo, haga clic en el botón de abajo para
          reenviarlo.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleResendEmail}
          sx={{ marginTop: 2 }}
        >
          Reenviar correo de confirmación
        </Button>
      </Box>
    </Container>
  );
};

export default EmailConfirmation;
