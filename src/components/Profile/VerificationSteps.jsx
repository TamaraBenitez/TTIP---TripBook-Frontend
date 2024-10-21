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
  CircularProgress,
  Typography,
  Box,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useUser } from "../../user/UserContext";
import StoreContext from "../../store/storecontext";
import { CheckCircleOutline } from "@mui/icons-material";

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
    if (verifiedDni) {
      store.services.userService.GetUser(user.id).then((updatedUser) => {
        setUser(updatedUser.data);
      });
    }
  }, []);
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
      setDniError("DNI must be exactly 8 digits long and numeric.");
    }
  };

  const handleTramiteChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,11}$/.test(value)) {
      setTramite(value);
      setTramiteError("");
    } else {
      setTramiteError("Tramite must be exactly 11 digits long and numeric.");
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
  };

  const handleUploadPhoto = (event) => {
    setPhoto(event.target.files[0]);
  };
  const handleClose = () =>{
    if(user.isEmailVerified && user.isUserVerified){
      setSuccessAlert(true)
      setTimeout(()=>{
        setSuccessAlert(false);
      },5000);
    }
    onClose();
  }

  const verifyDniData = (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append("userId", user.id);
    formDataToSend.append("file", photo);
    store.services.authService.verifyDNI(formDataToSend).then(() => {
      setVerifiedDni(true);
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
  const validColor = () => {
    return !verifiedDni ? "#ffffff" : "#d4edda";
  };
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Verification Steps</DialogTitle>
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
            <Typography>Email Verification</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {user.isEmailVerified ? (
              <Box display="flex">
                <Typography>Email verified!</Typography>
                <CheckCircleOutline color="success" sx={{ ml: 1 }} />
              </Box>
            ) : (
              <>
                <Button
                  variant="contained"
                  onClick={handleSendEmailVerification}
                  disabled={emailButtonDisabled}
                >
                  Send Verification Email
                </Button>
                {emailButtonDisabled && (
                  <Typography variant="body2" color="textSecondary">
                    You didn't receive any email? Try again in {countdown}{" "}
                    seconds.
                  </Typography>
                )}
              </>
            )}
          </AccordionDetails>
        </Accordion>
        <Accordion
          defaultExpanded
          style={{
            backgroundColor: validColor(),
          }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>DNI Verification</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {verifiedDni ? (
              <Box display="flex">
                <Typography>Dni verified!</Typography>
                <CheckCircleOutline color="success" sx={{ ml: 1 }} />
              </Box>
            ) : (
              <>
                <Stepper activeStep={step} sx={{ mb: 3 }}>
                  <Step>
                    <StepLabel>Input DNI Info</StepLabel>
                  </Step>
                  <Step>
                    <StepLabel>Barcode Photo</StepLabel>
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
                      Next
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
                      Submit
                    </Button>
                    <Button variant="outlined" onClick={handlePreviousStep}>
                      Back
                    </Button>
                  </>
                )}
              </>
            )}
          </AccordionDetails>
        </Accordion>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default VerificationSteps;
