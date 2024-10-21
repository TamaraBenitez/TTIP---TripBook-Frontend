import React, { useContext, useEffect, useState } from "react";
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  TextField,
  IconButton,
  Box,
  InputAdornment,
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
  AirportShuttle,
  CloudUpload,
  HelpOutline,
  MyLocation,
  Search as SearchIcon,
  SwapVert as SwapVertIcon,
} from "@mui/icons-material";
import {
  MapContainer,
  TileLayer,
  useMapEvents,
  Marker,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import licenseHelp from "/images/licenseHelp.png";
import StoreContext from "../../store/storecontext";
import { useUser } from "../../user/UserContext";
import { StaticDateTimePicker } from "@mui/x-date-pickers";
import RibbonHeading from "../RibbonHeading/RibbonHeading";
import { useBlocker } from "react-router-dom";
import DialogCustom from "../DialogCustom/DialogCustom";

const TripCreation = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [departure, setDeparture] = useState("");
  const [departureDate, setDepartureDate] = useState(dayjs());
  const [destination, setDestination] = useState("");
  const [seats, setSeats] = useState(1);
  const [estimatedCost, setEstimatedCost] = useState(0);
  const [notes, setNotes] = useState("");
  const [fileMessage, setFileMessage] = useState("");
  const [licenseError, setLicenseError] = useState(null);
  const [departureCoords, setDepartureCoords] = useState([-34.6037, -58.3816]);
  const [destinationCoords, setDestinationCoords] = useState([
    -34.6037, -58.3816,
  ]);
  const [verifyingLicense, setVerifyingLicense] = useState(false);
  const [stepValid, setStepValid] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [photo, setPhoto] = useState();
  const [tripConfirmed, setTripConfirmed] = useState(false);
  const store = useContext(StoreContext);
  const { user } = useUser();

  //Prevent user from leaving
  let blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>{
      return (
        currentLocation.pathname == "/trip" &&
        !tripConfirmed  &&
        nextLocation.pathname !== "/trip") }
  );

  //handle re-center map when the coordenates change
  const CenterMap = (props) => {
    const map = useMap();
    const coordenates = props?.coordenates;
    useEffect(() => {
      if (coordenates !== null) {
        map.setView(coordenates);
      }
    }, [map, coordenates]);

    return null;
  };

  // Handle map clicks to set departure point
  const handleMapClick = (coordsSetter) => {
    return () => {
      const MapClickHandler = () => {
        useMapEvents({
          click: (e) => {
            coordsSetter([e.latlng.lat, e.latlng.lng]);
          },
        });
        return null;
      };
      return <MapClickHandler />;
    };
  };

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
        setStepValid(departure.length > 0 && departureCoords !== null);
        break;
      case 1:
        setStepValid(
          departureDate !== null && dayjs(departureDate).isAfter(dayjs())
        );
        break;
      case 2:
        setStepValid(destination.length > 0 && destinationCoords !== null);
        break;
      case 3:
        setStepValid(seats > 0 && estimatedCost >= 0 && notes);
        break;
      case 4:
        setStepValid(photo !== undefined);
        break;
      default:
        setStepValid(true);
    }
  };

  useEffect(() => {
    validateStep(); // Run validation when any relevant state changes
  }, [
    activeStep,
    departure,
    departureCoords,
    departureDate,
    destination,
    destinationCoords,
    seats,
    estimatedCost,
    photo,
  ]);

  // Function to handle step navigation
  const handleNext = () => {
    if (activeStep === 4) {
      setVerifyingLicense(true);
      setLicenseError(null);
      const formDataToSend = new FormData();
      formDataToSend.append("userId", user.id);
      formDataToSend.append("file", photo);
      store.services.authService
        .verifyDocument(formDataToSend)
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

  const createTrip = () => {
    setTripConfirmed(true)
    store.services.tripService.CreateTrip({
      startPoint: {
        latitude: departureCoords[0],
        longitude: departureCoords[1],
      },
      endPoint: {
        latitude: destinationCoords[0],
        longitude: destinationCoords[1],
      },
      startDate: departureDate,
      description: notes,
      maxPassengers: parseInt(seats),
      estimatedCost: parseInt(estimatedCost),
      origin: departure,
      destination: destination,
      userId: user.id,
    });
  };

  const handleSwitchPoints = () => {
    const temp = departure;
    const tempCoords = departureCoords;
    setDeparture(destination);
    setDepartureCoords(destinationCoords);
    setDestination(temp);
    setDestinationCoords(tempCoords);
  };

  const steps = [
    "Choose Departure Point",
    "Choose Departure Date",
    "Choose Destination Point",
    "Set Seats and Notes",
    "Verify Driver License",
  ];

  return (
    <>
    <Box sx={{ width: "100%", display:"grid", justifyContent:"center"}}>
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
              <Typography variant="h3">
                Donde comienza tu viaje?
              </Typography>
              <Grid2 xs={6}>
                <TextField
                  label="Especifica una ubicacion"
                  variant="outlined"
                  fullWidth
                  value={departure}
                  onChange={(e) => setDeparture(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <Tooltip title="Use current location" placement="right">
                        <InputAdornment position="end">
                          <IconButton
                            color="primary"
                            onClick={() => {
                              navigator.geolocation.getCurrentPosition(
                                (position) => {
                                  const coords = [
                                    position.coords.latitude,
                                    position.coords.longitude,
                                  ];
                                  setDepartureCoords(coords);
                                }
                              );
                            }}
                          >
                            <MyLocation />
                          </IconButton>
                        </InputAdornment>
                      </Tooltip>
                    ),
                  }}
                />
              </Grid2>

              <MapContainer
                center={[51.505, -0.09]}
                zoom={13}
                style={{ height: "400px", width: "100%" }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={departureCoords || [-34.6037, -58.3816]} />
                {handleMapClick(setDepartureCoords)()}
                <CenterMap coordenates={departureCoords} />
              </MapContainer>
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
                />
              </Paper>
            </Box>
          )}

          {activeStep === 2 && (
            <Grid2 container spacing={2} padding={10}>
              <Typography variant="h3">A dónde vas?</Typography>
              <Grid2 xs={6}>
                <TextField
                  label="Especifica una ubicacion"
                  variant="outlined"
                  fullWidth
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  // InputProps={{
                  //   endAdornment: (
                  //     <InputAdornment position="end">
                  //       <SearchIcon />
                  //     </InputAdornment>
                  //   ),
                  // }}
                />
              </Grid2>

              <MapContainer
                center={[51.505, -0.09]}
                zoom={13}
                style={{ height: "400px", width: "100%" }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={destinationCoords || [-34.6037, -58.3816]} />
                {handleMapClick(setDestinationCoords)()}
                <CenterMap coordenates={destinationCoords} />
              </MapContainer>
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
                    size={6}
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
                    size={6}
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
                    Como último paso, necesitamos asegurarnos que tenés permiso para viajar.
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
                        Por favor, subí una foto del CODIGO DE BARRAS de tu carnet DIGITAL
                      </Typography>
                      <Button
                        className="boton"
                        component="label"
                        role={undefined}
                        variant="contained"
                        tabIndex={-1}
                        startIcon={<CloudUpload />}
                      >
                        Upload Photo
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
            }}
          >
            <Button disabled={activeStep === 0} onClick={handleBack}>
              Back
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
        <>
        <Box display={"flex"} justifyContent={"center"}>

        <Typography variant="h3" gutterBottom>
            Confirm Your Trip
          </Typography>
          </Box>
        <Paper
          sx={{
            display: "flex",
            flexDirection: "column",
            
            alignItems: "flex-start",
            alignSelf:"center",
            width:"60vw",
            paddingLeft:4,
            paddingBlock:5
          }}
        >
          <Box display={"flex"}>
            <Box display={"flex"} flexDirection={"column"}>
              <Box className="summaryRow" display={"flex"}>
              <Typography variant="h4">
                <strong>Origen:</strong> {departure}
              </Typography>
                </Box>
              <Typography variant="h4">
                <strong>Destino:</strong> {destination}
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
            <Button variant="contained" color="primary" onClick={createTrip}>
              Confirmar viaje
            </Button>
            <Button sx={{ ml: 2 }} onClick={() => setShowConfirmation(false)}>
              Editar viaje
            </Button>
          </Box>
        </Paper>
        </>
      )}
    </Box>
    { 
        <DialogCustom 
          title="Seguro que quieres salir?"
          textParagraph="Perderás todo tu progreso"
          open={blocker.state == "blocked"}
          handleConfirm={()=> blocker.proceed()}
          showCancelButton={true}
          handleClose={()=>blocker.reset()}
        />
      }
    </>
  );
};

export default TripCreation;
