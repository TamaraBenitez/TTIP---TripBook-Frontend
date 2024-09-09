import { useState, useEffect, useContext } from "react";
import { Typography, Skeleton, Card, CardContent } from "@mui/material";
import { Outlet } from "react-router-dom";
import Trips from "../TripList/Trips";
import StoreContext from "../../store/storecontext";
import DialogCustom from "../DialogCustom/DialogCustom";


export default function AllTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const store = useContext(StoreContext);

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

  const handleClickOpenModal = (e) => {
    e.stopPropagation();
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
  };

  return (
    <>
      <Typography variant="h4">Todos los viajes</Typography>
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
        <Trips trips={trips} action={"unirme"} handleAction={handleClickOpenModal}/>
        <DialogCustom
        open={open}
        handleClose={handleCloseModal}
        title={"Inscripcion al viaje"}
        textParagraph={"¿Esta seguro que desea inscribirse a este viaje?"}
      />
        </>
      )}
      <Outlet />
    </>
  );
}
