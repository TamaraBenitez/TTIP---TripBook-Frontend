import { useState, useEffect, useContext } from "react";
import {
  Skeleton,
  Card,
  CardContent,
  Alert,
  Button,
  Slide,
  Box
} from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";
import Trips from "../TripList/Trips";
import StoreContext from "../../store/storecontext";
import DialogCustom from "../DialogCustom/DialogCustom";
import { TaskAlt } from "@mui/icons-material";
import RibbonHeading from "../RibbonHeading/RibbonHeading";

export default function AllTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [tripToSuscribe, setTripToSuscribe] = useState(null);
  const store = useContext(StoreContext);
  const navigate = useNavigate();
  const confirmMsg = "¿Esta seguro que desea inscribirse a este viaje?";
  const successMsg = "Te registraste correctamente";
  const [modalMsg, setModalMsg] = useState(confirmMsg);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");

  const suscribe = () => {
    setLoading(true);
    store.services.tripService
      .RegisterUserToTrip("testid1", tripToSuscribe)
      .then(() => {
        setLoading(false);
        setModalMsg(successMsg);
        setModalConfirmBtn(goToMyTripsButton);
      })
      .catch((e) => {
        setAlertMsg(e.response.data.message);
        setOpen(false);
        setLoading(false);
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 3000);
      });
  };

  const suscribeButton = <Button onClick={suscribe}>confirmar</Button>;

  const goToMyTripsButton = (
    <Button onClick={() => navigate(`/trips/${tripToSuscribe}`)}>
      Ver detalles
    </Button>
  );

  const [modalConfirmBtn, setModalConfirmBtn] = useState(suscribeButton);

  useEffect(() => {
    store.services.tripService
      .GetAllTrips()
      .then((res) => {
        setTrips(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, [store.services.tripService]);

  const handleClickOpenModal = (e, to) => {
    setTripToSuscribe(to);
    e.stopPropagation();
    setOpen(true);
  };
  useEffect(() => {
    if (tripToSuscribe) {
      setModalConfirmBtn(suscribeButton);
    }
  }, [tripToSuscribe]);

  const handleCloseModal = () => {
    setOpen(false);
    setTripToSuscribe(null);
    setModalMsg(confirmMsg);
    setModalConfirmBtn(suscribeButton);
  };

  return (
    <>
    <Box sx={{display:"flex", flexDirection:"column", alignItems:"center"}}>
    <RibbonHeading heading={"Viajes Disponibles"} component="h2" variant="h2"/>
      {loading ? (
        // Show 5 Skeleton cards while loading
        [...Array(5)].map((_, index) => (
          <Card key={index} style={{ marginBottom: "1rem" }}>
            <Skeleton variant="rectangular" height={140} />
            <CardContent>
              <Skeleton variant="text" />
              <Skeleton variant="text" width="60%" />
            </CardContent>
          </Card>
        ))
      ) : (
        <>
          <Trips
            trips={trips}
            action={"unirme"}
            handleAction={handleClickOpenModal}
          />
          <DialogCustom
            open={open}
            handleClose={handleCloseModal}
            confirmButton={modalConfirmBtn}
            title={"Inscripcion al viaje"}
            textParagraph={modalMsg}
            showCancelButton={true}
          />
        </>
      )}
      {showAlert && (
        <Slide direction="left" in={showAlert} mountOnEnter unmountOnExit>
          <Alert
            sx={{
              maxWidth: 500,
              position: "fixed",
              top: "130px",
              right: "10px",
            }}
            onClose={() => setShowAlert(false)}
            variant="standard"
            icon={<TaskAlt fontSize="inherit" />}
            severity="error"
          >
            {alertMsg}
          </Alert>
        </Slide>
      )}
      <Outlet />
    </Box>
    </>
  );
}
