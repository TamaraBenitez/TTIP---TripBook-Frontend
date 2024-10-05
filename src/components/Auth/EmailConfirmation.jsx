import React, { useContext, useEffect, useState } from 'react';
import { Box, Typography, Button, Container } from "@mui/material";
import { MailOutline } from "@mui/icons-material";
import StoreContext from '../../store/storecontext';
import { useNavigate } from 'react-router-dom';

const EmailConfirmation = ({ userId }) => {
  const store = useContext(StoreContext);
  const navigate = useNavigate()
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const handleSendEmail = () => {
    store.services.authService.sendVerificationEmail({ userId });
    setIsButtonDisabled(true);
    setCountdown(30);
  };

  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      setIsButtonDisabled(false);
    }
  }, [countdown]);

  useEffect(() => {
    handleSendEmail();
  }, [userId]);

  const handleGoBack = () => {
    navigate('/login');
  };

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
          onClick={handleSendEmail}
          disabled={isButtonDisabled}
          sx={{ marginTop: 2 }}
        >
          {isButtonDisabled ? `Reenviar en ${countdown}s` : 'Reenviar correo de confirmación'}
        </Button>
        <Button
          variant="text"
          color="primary"
          onClick={handleGoBack}
          sx={{ marginTop: 2 }}
        >
          Volver a la página de inicio de sesión
        </Button>
      </Box>
    </Container>
  );
};

export default EmailConfirmation;
