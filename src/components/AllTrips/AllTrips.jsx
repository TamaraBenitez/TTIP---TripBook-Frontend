import { useState, useEffect, useContext } from "react";
import {
  Skeleton,
  Card,
  CardContent,
  Alert,
  Button,
  Slide,
  Box,
} from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";
import Trips from "../TripList/Trips";
import StoreContext from "../../store/storecontext";
import DialogCustom from "../DialogCustom/DialogCustom";
import { TaskAlt } from "@mui/icons-material";
import RibbonHeading from "../RibbonHeading/RibbonHeading";
import TripsSkeleton from "../TripList/TripsSkeleton";
import FilterAccordion from "./FilterAccordion";

export default function AllTrips() {
  const [trips, setTrips] = useState([]);
  const [open, setOpen] = useState(false);
  const [tripToSuscribe, setTripToSuscribe] = useState(null);
  const store = useContext(StoreContext);
  const navigate = useNavigate();
  const confirmMsg = "¿Esta seguro que desea inscribirse a este viaje?";
  const [loading, setLoading] = useState(true);

  const [modalMsg, setModalMsg] = useState(confirmMsg);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [filters, setFilters] = useState({
    origin: "",
    destination: "",
    startDate: "",
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const applyFilters = () => {
    setLoading(true);
    const filteredFilters = {};
    for (let key in filters) {
      if (filters[key]) {
        // Solo agregar los filtros con valor
        filteredFilters[key] = filters[key];
      }
    }
    store.services.tripService
      .GetAllTrips(filteredFilters) // Pasar filtros a la API
      .then((res) => {
        setTrips(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  };

  const resetFilters = () => {
    setFilters({ origin: "", destination: "", startDate: "" });
    setLoading(true);
    store.services.tripService
      .GetAllTrips()
      .then((res) => {
        setTrips(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  };

  const suscribeButton = (
    <Button onClick={() => navigate(`/trip/suscribe/${tripToSuscribe}`)}>
      confirmar
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
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <RibbonHeading
          heading={"Viajes Disponibles"}
          component="h2"
          variant="h2"
        />

        <Box sx={{ width: "100%", marginBottom: 2 }}>
          <Button
            variant="outlined"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            sx={{ marginBottom: 1 }}
          >
            {isFilterOpen ? "Ocultar Filtros" : "Mostrar Filtros"}
          </Button>
          {isFilterOpen && (
            <FilterAccordion
              filters={filters}
              setFilters={setFilters}
              applyFilters={applyFilters}
              resetFilters={resetFilters}
            />
          )}
        </Box>
        {loading ? (
          <TripsSkeleton />
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
