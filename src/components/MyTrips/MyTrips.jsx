import { useContext, useEffect, useState } from "react";
import Trips from "../TripList/Trips";
import { useNavigate } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";
import StoreContext from "../../store/storecontext";
import RibbonHeading from "../RibbonHeading/RibbonHeading";
import { useUser } from "../../user/UserContext";
import TripsSkeleton from "../TripList/TripsSkeleton";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItem";
import FilterAccordion from "../AllTrips/FilterAccordion";

export default function MyTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const store = useContext(StoreContext);
  const { user, userDataLoading, setUser } = useUser();
  const navigate = useNavigate();
  const [value, setValue] = useState(0);
  const [pendingPassengers, setPendingPassengers] = useState([]);
  const [filters, setFilters] = useState({
    origin: "",
    destination: "",
    startDate: "",
    status: "",
  });
  const [filtersApplied, setFiltersApplied] = useState(false);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (!userDataLoading) {
      setLoading(true);

      if (value === 2) {
        // Llama al endpoint de pasajeros pendientes
        store.services.tripService
          .GetPendingPassengers(user.id)
          .then((res) => {
            setPendingPassengers(res.data);
            setLoading(false);
          })
          .catch((e) => {
            console.log(e);
            setLoading(false);
          });
      } else {
        const role = value === 0 ? "passenger" : "driver";

        store.services.userService
          .GetMyTrips(user.id, role)
          .then((res) => {
            setTrips(res.data);
            setLoading(false);
          })
          .catch((e) => {
            console.log(e);
            setLoading(false);
          });
      }
    }
  }, [userDataLoading, value]);

  // Función para aplicar filtros
  const applyFilters = () => {
    setLoading(true);
    setFiltersApplied(true);
    const role = value === 0 ? "passenger" : "driver";

    const filteredFilters = {};
    for (let key in filters) {
      if (filters[key]) {
        // Solo agregar los filtros con valor
        filteredFilters[key] = filters[key];
      }
    }

    store.services.userService
      .GetMyTrips(user.id, role, filteredFilters)
      .then((res) => {
        setTrips(res.data);
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
      });
  };

  const resetFilters = () => {
    const newFilters = {
      origin: "",
      destination: "",
      startDate: "",
      status: "",
    };
    setFilters(newFilters);
    setLoading(true);
    setFiltersApplied(false);

    const role = value === 0 ? "passenger" : "driver";

    store.services.userService
      .GetMyTrips(user.id, role, {})
      .then((res) => {
        setTrips(res.data);
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
      });
  };

  const redirectToTrip = (e, to) => {
    navigate(`/trips/${to}`);
  };

  const handleViewRequest = (tripUserId, tripId) => {
    navigate(`/request?tripUserId=${tripUserId}&tripId=${tripId}`);
  };

  function EmptyMessage({ message }) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100px",
          textAlign: "center",
        }}
      >
        <Typography variant="h6" color="textSecondary">
          {message}
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <RibbonHeading heading={"Mis Viajes"} component="h2" variant="h2" />

        {value != 2 && (
          <FilterAccordion
            filters={filters}
            setFilters={setFilters}
            applyFilters={applyFilters}
            resetFilters={resetFilters}
            showStatusFilter
          />
        )}

        <Box
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            width: "50%",
            mx: "auto",
            mt: 2,
          }}
        >
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab label="Como Pasajero" />
            <Tab label="Como Conductor" />
            <Tab label="Solicitudes Pendientes" />
          </Tabs>
        </Box>

        {/* Panel de contenido para cada pestaña */}
        {loading || userDataLoading ? (
          <TripsSkeleton />
        ) : (
          <>
            <TabPanel value={value} index={0}>
              {trips.length === 0 ? (
                filtersApplied ? (
                  <EmptyMessage message="No se encontraron viajes con los filtros aplicados." />
                ) : (
                  <EmptyMessage
                    message={`Aún no tienes viajes como pasajero.`}
                  />
                )
              ) : (
                <Trips
                  trips={trips}
                  action={"detalles"}
                  handleAction={redirectToTrip}
                  role={value}
                />
              )}
            </TabPanel>
            <TabPanel value={value} index={1}>
              {trips.length === 0 ? (
                filtersApplied ? (
                  <EmptyMessage message="No se encontraron viajes con los filtros aplicados." />
                ) : (
                  <EmptyMessage
                    message={`Aún no tienes viajes como conductor.`}
                  />
                )
              ) : (
                <Trips
                  trips={trips}
                  action={"detalles"}
                  handleAction={redirectToTrip}
                />
              )}
            </TabPanel>
            <TabPanel value={value} index={2}>
              {pendingPassengers.length === 0 ? (
                <EmptyMessage message="Aún no hay solicitudes de viajes pendientes." />
              ) : (
                <List>
                  {pendingPassengers.map((trip) => (
                    <Box
                      key={trip.tripId}
                      sx={{
                        border: "1px solid #ccc",
                        borderRadius: "8px",
                        p: 2,
                        mb: 2,
                      }}
                    >
                      <Typography variant="h6" sx={{ color: "#226668" }}>
                        {trip.origin} ➔ {trip.destination}
                      </Typography>
                      <List>
                        {trip.pendingPassengers.map((passenger) => (
                          <Box key={passenger.tripUserId} sx={{ ml: 2, mt: 1 }}>
                            <Typography variant="body1" color="textSecondary">
                              Solicita: {passenger.name} {passenger.surname}
                            </Typography>
                            <ListItemText
                              primary={passenger.email}
                              sx={{ ml: 2, mb: 1 }}
                            />
                            <Button
                              variant="outlined"
                              onClick={() =>
                                handleViewRequest(
                                  passenger.tripUserId,
                                  trip.tripId
                                )
                              }
                            >
                              Ver más detalles de solicitud
                            </Button>
                          </Box>
                        ))}
                      </List>
                    </Box>
                  ))}
                </List>
              )}
            </TabPanel>
          </>
        )}
      </Box>
    </>
  );
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  value: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
};
