import React, { useContext, useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stepper,
  Step,
  StepLabel,
  Button,
  TextField,
  Typography,
  Box,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useUser } from "../../user/UserContext";
import StoreContext from "../../store/storecontext";
import { CheckCircleOutline, ErrorOutline } from "@mui/icons-material";
import AlertCustom from "../AlertCustom/AlertCustom";

const VerificationSteps = ({ open, onClose, setSuccessAlert }) => {
  const { user, setUser } = useUser();
  const store = useContext(StoreContext);
  const [emailError, setEmailError] = useState(false);
  const [step, setStep] = useState(0);
  const [dni, setDni] = useState("");
  const [tramite, setTramite] = useState("");
  const [genero, setGenero] = useState("");
  const [photo, setPhoto] = useState(null);
  const [countdown, setCountdown] = useState(0);
  const [emailButtonDisabled, setEmailButtonDisabled] = useState(false);
  const [dniError, setDniError] = useState("");
  const [tramiteError, setTramiteError] = useState("");
  const [verifiedDni, setVerifiedDni] = useState(user.isUserVerified);
  const [showBarcodeError, setShowBarcodeError] = useState(false);
  const [barcodeError, setBarcodeError] = useState("");

  useEffect(() => {
    if (!user.isEmailVerified) {
      const interval = setInterval(async () => {
        const updatedUser = await store.services.userService.GetUser(user.id);
        setUser(updatedUser.data);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, []);

  useEffect(() => {
    setUser({ ...user, isUserVerified: verifiedDni }); //Trigger userContext useEffect
  }, [verifiedDni]);

  const handleSendEmailVerification = async () => {
    setEmailButtonDisabled(true);
    setCountdown(30);
    store.services.authService.sendVerificationEmail({ userId: user.id });
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          setEmailButtonDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };
  const handleDniChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,8}$/.test(value)) {
      setDni(value);
      setDniError("");
    } else {
      setDniError(
        "El DNI debe tener exactamente 8 dígitos de largo y ser numérico."
      );
    }
  };

  const handleTramiteChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,11}$/.test(value)) {
      setTramite(value);
      setTramiteError("");
    } else {
      setTramiteError(
        "El numero de trámite debe tener exactamente 11 dígitos y ser numérico."
      );
    }
  };

  const handleNextStep = () => {
    if (step === 0) {
      store.services.userService
        .UpdateUser(user.id, {
          nroDni: dni,
          nroTramiteDni: tramite,
          gender: genero,
        })
        .then(() => {
          setStep((prev) => prev + 1);
        });
    } else {
      setStep((prev) => prev + 1);
    }
  };

  const handlePreviousStep = () => {
    setStep((prev) => prev - 1);
    setBarcodeError("");
  };

  const handleUploadPhoto = (event) => {
    setPhoto(event.target.files[0]);
  };
  const handleClose = () => {
    if (user.isEmailVerified && user.isUserVerified) {
      setSuccessAlert(true);
      setTimeout(() => {
        setSuccessAlert(false);
      }, 5000);
    }
    onClose();
  };

  const verifyDniData = (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append("userId", user.id);
    formDataToSend.append("file", photo);
    store.services.authService
      .verifyDNI(formDataToSend)
      .then(() => {
        setVerifiedDni(true);
      })
      .catch((error) => {
        setBarcodeError(error.response.data.message);
        setShowBarcodeError(true);
        setTimeout(() => {
          setShowBarcodeError(false);
        }, 5000);
      });
  };
  const isEmailAccordionGreen = user.isEmailVerified
    ? "success"
    : emailError
    ? "error"
    : "default";

  const isStepValid = () => {
    if (step === 0) {
      return dni.length === 8 && tramite.length === 11 && genero;
    } else {
      return photo;
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Pasos de verificacion</DialogTitle>
      <DialogContent>
        <Accordion
          defaultExpanded
          style={{
            backgroundColor:
              isEmailAccordionGreen === "success"
                ? "#d4edda"
                : emailError
                ? "#f8d7da"
                : "#ffffff",
          }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Verificacion de email</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {user.isEmailVerified ? (
              <Box display="flex">
                <Typography>Email verificado!</Typography>
                <CheckCircleOutline color="success" sx={{ ml: 1 }} />
              </Box>
            ) : (
              <>
                <Button
                  variant="contained"
                  onClick={handleSendEmailVerification}
                  disabled={emailButtonDisabled}
                >
                  Enviar verificacion de mail
                </Button>
                {emailButtonDisabled && (
                  <Typography variant="body2" color="textSecondary">
                    ¿No has recibido un correo electrónico? Vuelve a intentarlo
                    en {countdown} segundos.
                  </Typography>
                )}
              </>
            )}
          </AccordionDetails>
        </Accordion>
        <Accordion
          defaultExpanded
          style={{
            backgroundColor: verifiedDni
              ? "#d4edda"
              : barcodeError
              ? "#f8d7da"
              : "#ffffff",
          }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Verificacion de DNI</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {verifiedDni ? (
              <Box display="flex">
                <Typography>Dni verificado!</Typography>
                <CheckCircleOutline color="success" sx={{ ml: 1 }} />
              </Box>
            ) : (
              <>
                <Stepper activeStep={step} sx={{ mb: 3 }}>
                  <Step>
                    <StepLabel>Introducir información del DNI</StepLabel>
                  </Step>
                  <Step>
                    <StepLabel>Foto de código de barras</StepLabel>
                  </Step>
                </Stepper>
                {step === 0 && (
                  <>
                    <Box mb={2}>
                      {" "}
                      <TextField
                        label="DNI"
                        value={dni}
                        onChange={handleDniChange}
                        fullWidth
                        error={!!dniError}
                        helperText={dniError}
                      />
                    </Box>
                    <Box mb={2}>
                      <TextField
                        label="Tramite"
                        value={tramite}
                        onChange={handleTramiteChange}
                        fullWidth
                        error={!!tramiteError}
                        helperText={tramiteError}
                      />
                    </Box>
                    <Box mb={2}>
                      <FormControl fullWidth>
                        <Select
                          labelId="genero-label"
                          value={genero}
                          onChange={(e) => setGenero(e.target.value)}
                          displayEmpty
                        >
                          <MenuItem value="">
                            <em>Genero</em>
                          </MenuItem>
                          <MenuItem value="M">M</MenuItem>
                          <MenuItem value="F">F</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                    <Button
                      variant="contained"
                      onClick={handleNextStep}
                      disabled={!isStepValid()}
                    >
                      Siguiente
                    </Button>
                  </>
                )}
                {step === 1 && (
                  <>
                    <Box mb={2}>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleUploadPhoto}
                      />
                    </Box>
                    <Button variant="contained" onClick={verifyDniData}>
                      Enviar
                    </Button>
                    <Button variant="outlined" onClick={handlePreviousStep}>
                      Atras
                    </Button>
                  </>
                )}
              </>
            )}
          </AccordionDetails>
        </Accordion>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cerrar</Button>
      </DialogActions>
      <AlertCustom
        inProp={showBarcodeError}
        timeout={500}
        onClose={() => setShowBarcodeError(false)}
        msg={barcodeError}
        icon={<ErrorOutline />}
        severity={"error"}
      />
    </Dialog>
  );
};

export default VerificationSteps;
