import React, { useContext, useEffect, useState } from "react";
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  TextField,
  IconButton,
  Box,
  FormHelperText,
  CircularProgress,
  Typography,
  Alert,
  AlertTitle,
  Grid2,
  Tooltip,
  Paper,
} from "@mui/material";
import dayjs from "dayjs";
import {
  CloudUpload,
  HelpOutline,
  SwapVert as SwapVertIcon,
} from "@mui/icons-material";

import "leaflet/dist/leaflet.css";
import licenseHelp from "/images/licenseHelp.png";
import StoreContext from "../../store/storecontext";
import { useUser } from "../../user/UserContext";
import { StaticDateTimePicker } from "@mui/x-date-pickers";
import RibbonHeading from "../RibbonHeading/RibbonHeading";
import { useBlocker, useNavigate } from "react-router-dom";
import DialogCustom from "../DialogCustom/DialogCustom";
import AlertCustom from "../AlertCustom/AlertCustom";
import { ErrorOutline } from "@mui/icons-material";
import CustomRouteMap from "../MapComponent/CustomRouteMap";
import { ThemeContext } from "@emotion/react";
import "./TripCreation.css"
import MapWithGeocoding from "../MapComponent/MapWithGeocoding";
const TripCreation = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [departureDate, setDepartureDate] = useState(dayjs());
  const [seats, setSeats] = useState(1);
  const [estimatedCost, setEstimatedCost] = useState(0);
  const [notes, setNotes] = useState("");
  const [maxTolerableDistance, setMaxTolerableDistance] = useState(2500);
  const [fileMessage, setFileMessage] = useState("");
  const [licenseError, setLicenseError] = useState(null);
  const [departure, setDeparture] = useState({coords:[-34.6037, -58.3816], address:"San Nicolas"});
  const [destination, setDestination] = useState({coords:[
    -34.6037, -58.3816,
  ], address: "San Nicolas"});
  const [verifyingLicense, setVerifyingLicense] = useState(false);
  const [stepValid, setStepValid] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [photo, setPhoto] = useState();
  const [tripConfirmed, setTripConfirmed] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const store = useContext(StoreContext);
  const { user } = useUser();
  const navigate = useNavigate();
  const [errorTrip, setErrorTrip] = useState("");
  const [isErrorTrip, setIsErrorTrip] = useState(false);
  const [route, setRoute] = useState([departure, destination]);
  const theme = useContext(ThemeContext);

  //Prevent user from leaving
  let blocker = useBlocker(({ currentLocation, nextLocation }) => {
    return (
      currentLocation.pathname == "/trip" &&
      !tripConfirmed &&
      nextLocation.pathname !== "/trip"
    );
  });

  const handleChangeDate = (newDate) => {
    setDepartureDate(newDate);
  };

  const handleUploadPhoto = (event) => {
    setPhoto(event.target.files[0]);
    setLicenseError(null);
  };

  // Function to handle step validation
  const validateStep = () => {
    switch (activeStep) {
      case 0:
        setStepValid(departure.address.length > 0 && departure.coords !== null);
        break;
      case 1:
        setStepValid(
          departureDate !== null && dayjs(departureDate).isAfter(dayjs())
        );
        break;
      case 2:
        const sameCoords = destination.coords[0] == departure.coords[0] && destination.coords[1] == departure.coords[1]; 
        setStepValid(destination.address.length > 0 && destination.coords !== null && !sameCoords);
        break;
      case 3:
        setStepValid(seats > 0 && estimatedCost && estimatedCost >= 0);
        break;
      case 4:
        setStepValid(photo !== undefined);
        break;
      default:
        setStepValid(true);
    }
  };


  // Function to handle step navigation
  const handleNext = () => {
    if (activeStep === 4) {
      setVerifyingLicense(true);
      setLicenseError(null);
      const formDataToSend = new FormData();
      formDataToSend.append("userId", user.id);
      formDataToSend.append("file", photo);
      store.services.authService
        .verifyLicense(formDataToSend)
        .then((response) => {
          setVerifyingLicense(false);
          if (response.data.valid) {
            setShowConfirmation(true);
          } else {
            setLicenseError({
              title: "License Validation Failed",
              message: `Discrepancies found: ${response.discrepancies.join(
                ", "
              )}`,
            });
          }
        })
        .catch((error) => {
          setVerifyingLicense(false);
          setLicenseError({
            title: "License Expired",
            message: "The license might be expired or invalid.",
          });
        });
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => setActiveStep((prevStep) => prevStep - 1);

  const createTrip = async () => {
    setTripConfirmed(true);
    try {
      await store.services.tripService.CreateTrip({
        coordinates:route.map((point) =>{return {latitude:point.coords[0], longitude:point.coords[1]}}),
        startDate: departureDate,
        description: notes,
        maxPassengers: parseInt(seats),
        estimatedCost: parseInt(estimatedCost),
        origin: departure.address,
        destination: destination.address,
        userId: user.id,
        maxTolerableDistance: parseInt(maxTolerableDistance)
      });

      setShowSuccessModal(true); // Mostrar modal de éxito
    } catch (error) {
      setIsErrorTrip(true);
      console.error("Error al crear el viaje:", error);
      setErrorTrip(error.response.data.message);
    }
  };

  const handleSwitchPoints = () => {
    const temp = departure.address;
    const tempCoords = departure.coords;
    setDeparture({address:destination.address, coords:destination.coords});
    setDestination({address: temp, coords:tempCoords});
  };
  const handleSuccessModal = () => {
    navigate("/mytrips");
  };
  const steps = [
    "Elija el punto de salida",
    "Elija la fecha de salida",
    "Elija el punto de destino",
    "Establecer asientos y notas",
    "Verificar licencia de conducir",
  ];
  useEffect(() => {
    validateStep(); // Run validation when any relevant state changes
  }, [
    activeStep,
    departure,
    departureDate,
    destination,
    seats,
    estimatedCost,
    photo,
  ]);
  useEffect(()=>{
    let newRoute = route;
    newRoute[newRoute.length-1] = destination; 
    setRoute(newRoute)
  },[destination])
  useEffect(()=>{
    var newRoute = route;
    newRoute[0] = departure;
    setRoute(newRoute); 
  },[departure])
  return (
    <>
        <RibbonHeading heading={"Nuevo Viaje"} component="h2" variant="h2" />
         {!showConfirmation ? (
          <Box paddingInline={3}>
            <Stepper activeStep={activeStep} sx={{ marginBottom: 3 }}>
              {steps.map((label, index) => (
                <Step key={index}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            {activeStep === 0 && (
              <Grid2 container spacing={2} padding={10}>
                <MapWithGeocoding  point={{address:departure.address, coords:departure.coords, setPoint:setDeparture}} subtitle={"¿Dónde comienza tu viaje?"}/>
              </Grid2>
            )}

            {activeStep === 1 && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: 5,
                }}
              >
                <Typography variant="h3">Cuándo te vas?</Typography>
                <Paper sx={{ width: "max-content" }}>
                  <StaticDateTimePicker
                    sx={{ width: "50vw" }}
                    label="Fecha de salida"
                    value={departureDate}
                    onChange={handleChangeDate}
                    slotProps={{
                      actionBar: { actions: [] },
                    }}
                  />
                </Paper>
              </Box>
            )}

            {activeStep === 2 && (
              <Grid2 container spacing={2} padding={10}>
                <MapWithGeocoding  point={{address:destination.address, coords:destination.coords, setPoint:setDestination}} subtitle={"¿A dónde vas?"}/>
              </Grid2>
            )}

            {activeStep === 3 && (
              <Grid2 container spacing={2} padding={10}>
                <Grid2 size={12}>
                  <Typography variant="h3">Detalles de tu viaje</Typography>
                </Grid2>
                <Paper sx={{ width: "100%", height: "100%" }}>
                  <Grid2 container size={12} spacing={5} padding={5}>
                    <Grid2
                      size={4}
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        label="Cantidad de asientos"
                        type="number"
                        variant="outlined"
                        fullWidth
                        value={seats}
                        onChange={(e) => setSeats(e.target.value)}
                        sx={{ marginRight: 2 }}
                      />
                      <Tooltip
                        title="Asientos disponibles en tu vehiculo"
                        placement="right"
                      >
                        <HelpOutline />
                      </Tooltip>
                    </Grid2>
                    <Grid2
                      size={4}
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        label="Costo estimado"
                        type="number"
                        variant="outlined"
                        fullWidth
                        value={estimatedCost}
                        onChange={(e) => setEstimatedCost(e.target.value)}
                        sx={{ marginRight: 2 }}
                      />
                      <Tooltip
                        title="Costo estimado por pasajero"
                        placement="right"
                      >
                        <HelpOutline />
                      </Tooltip>
                    </Grid2>
                    <Grid2
                      size={4}
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        label="Tolerancia maxima"
                        type="number"
                        variant="outlined"
                        fullWidth
                        value={maxTolerableDistance}
                        onChange={(e) => setMaxTolerableDistance(e.target.value)}
                        sx={{ marginRight: 2 }}
                      />
                      <Tooltip
                        title="Cuánto estas dispuesto a desviarte? (metros)"
                        placement="right"
                      >
                        <HelpOutline />
                      </Tooltip>
                    </Grid2>
                    <Grid2 size={12}>
                      <TextField
                        label="Notas adicionales"
                        variant="outlined"
                        fullWidth
                        multiline
                        rows={4}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                      />
                    </Grid2>
                  </Grid2>
                </Paper>
              </Grid2>
            )}

            {activeStep === 4 && (
              <Box
                mb={2}
                textAlign="center"
                justifyContent={"center"}
                padding={10}
                display={"flex"}
                flexDirection={"column"}
              >
                {verifyingLicense ? (
                  <>
                    <CircularProgress />
                    <Typography variant="h6">
                      Verificando tu licencia...
                    </Typography>
                  </>
                ) : (
                  <>
                    <Typography variant="h3" marginBottom={5}>
                      Valida tu licencia
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      fontSize={18}
                      marginBottom={3}
                    >
                      Como último paso, necesitamos asegurarnos que tenés
                      permiso para conducir.
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignSelf: "center",
                        alignItems: "center",
                      }}
                    >
                      <Paper
                        sx={{
                          display: "flex",
                          alignSelf: "center",
                          flexDirection: "row",
                          justifyContent: "center",
                          alignItems: "center",
                          maxWidth: "500px",
                          height: "60px",
                          marginRight: 2,
                        }}
                      >
                        <Typography>
                          Por favor, subí una foto del CODIGO DE BARRAS de tu
                          carnet DIGITAL
                        </Typography>
                        <Button
                          className="boton"
                          component="label"
                          role={undefined}
                          variant="contained"
                          tabIndex={-1}
                          startIcon={<CloudUpload />}
                        >
                          Subir foto
                          <TextField
                            type="file"
                            sx={{ display: "none" }}
                            onChange={(e) => {
                              handleUploadPhoto(e);
                              if (e.target.files.length > 0) {
                                setFileMessage(
                                  `Archivo seleccionado: ${e.target.files[0].name}`
                                );
                              } else {
                                setFileMessage("");
                              }
                            }}
                          />
                        </Button>
                      </Paper>
                      <Tooltip
                        title={
                          <img
                            src={licenseHelp}
                            style={{ width: "-webkit-fill-available" }}
                          />
                        }
                        placement="right"
                      >
                        <HelpOutline fontSize="large" color="action" />
                      </Tooltip>
                    </Box>
                    <FormHelperText sx={{ alignSelf: "center" }}>
                      {fileMessage}
                    </FormHelperText>
                    {licenseError && (
                      <Alert
                        severity="error"
                        sx={{
                          mt: 2,
                          width: "20vw",
                          alignSelf: "center",
                          textAlign: "start",
                        }}
                      >
                        <AlertTitle sx={{ alignSelf: "start" }}>
                          Licencia Invalida
                        </AlertTitle>
                        {licenseError.message}
                      </Alert>
                    )}
                  </>
                )}
              </Box>
            )}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 3,
                marginBottom:3
              }}
            >
              <Button disabled={activeStep === 0} onClick={handleBack}>
                Atras
              </Button>

              <Button
                variant="contained"
                onClick={handleNext}
                disabled={!stepValid}
              >
                Siguiente
              </Button>
            </Box>
          </Box>
        ) : ( 
           <Grid2 container size={12} columnSpacing={0} rowSpacing={4} sx={{flexDirection:"row-reverse", paddingInline:4, justifyContent: "space-around", alignItems: "center"}}> 
            <Grid2 size={4} >
              <Typography variant="h3" gutterBottom>
                Confirmacion del viaje
              </Typography>
              <Paper
              sx={{
                display: "flex",
                flexDirection: "column",
                height:"70%",  
                alignItems: "flex-start",
                alignSelf: "center",
                padding:5
              }}
            >
              <Box display={"flex"}>
                <Box display={"flex"} flexDirection={"column"}>
                  <Box className="summaryRow" display={"flex"}>
                    <Typography variant="h4">
                      <strong>Origen:</strong> {departure.address}
                    </Typography>
                  </Box>
                  <Typography variant="h4">
                    <strong>Destino:</strong> {destination.address}
                  </Typography>
                </Box>
                <IconButton onClick={handleSwitchPoints} width="50px">
                  <SwapVertIcon fontSize="large" />
                </IconButton>
              </Box>
              <Typography variant="h4">
                <strong>Fecha de salida:</strong>{" "}
                {dayjs(departureDate).format("MMM D, YYYY")}
              </Typography>
              <Typography variant="h4">
                <strong>Asientos:</strong> {seats}
              </Typography>
              <Typography variant="h4">
                <strong>Costo estimado:</strong> {estimatedCost}
              </Typography>
              <Typography variant="h4">
                <strong>Notas:</strong> {notes || "No hay notas adicionales"}
              </Typography>

              <Box sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={createTrip}
                >
                  Confirmar viaje
                </Button>
                <Button
                  sx={{ ml: 2 }}
                  onClick={() => setShowConfirmation(false)}
                >
                  Editar viaje
                </Button>
              </Box>
            </Paper>
            </Grid2>
            <Grid2 size={8} sx={{minWidth:"fit-content", width:"50vw"}}>
            <div className="folder">

            <Box sx={{height:"fit-content", minWidth:267, marginLeft:2}}>
              <Typography variant="h4" sx={{color:theme.palette.common.white}}>Edita tu ruta</Typography>
            </Box>
            <Box sx={{backgroundColor:theme.palette.primary.main, paddingInline:2,paddingBottom:2,paddingTop:1, minWidth:267}}>

            {route && <CustomRouteMap startCoord={departure.coords} route={route} setRoute={setRoute}/>} 
            </Box>
            </div>
            </Grid2>
          </Grid2> 
        )}

      {
        <DialogCustom
          title="Seguro que quieres salir?"
          textParagraph="Perderás todo tu progreso"
          open={blocker.state == "blocked"}
          handleConfirm={() => blocker.proceed()}
          showCancelButton={true}
          handleClose={() => blocker.reset()}
        />
      }
      {
        <DialogCustom
          open={showSuccessModal}
          handleClose={handleSuccessModal}
          handleConfirm={handleSuccessModal}
          title={"Viaje Creado"}
          textParagraph={"Serás redirigido a Mis Viajes"}
        />
      }

      <AlertCustom
        inProp={isErrorTrip}
        timeout={500}
        onClose={() => setIsErrorTrip(false)}
        msg={errorTrip}
        icon={<ErrorOutline />}
        severity={"error"}
      />
    </>
  );
};

export default TripCreation;
