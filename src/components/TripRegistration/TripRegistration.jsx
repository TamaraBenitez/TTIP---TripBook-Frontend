import React, { useContext, useEffect, useState } from "react";
import MapComponent from "../MapComponent/MapComponent";
import { useNavigate, useParams } from "react-router-dom";
import StoreContext from "../../store/storecontext";
import { useUser } from "../../user/UserContext";
import { Button } from "@mui/material";
import { MapContainer } from "react-leaflet";

export default function TripRegistration() {
  const [trip, setTrip] = useState({tripCoordinates:null});
  const [pickupPoint, setPickupPoint] = useState();
  const [loading, setLoading] = useState(true);
  const confirmMsg = "¿Esta seguro que desea inscribirse a este viaje?";
  const [modalMsg, setModalMsg] = useState(confirmMsg);
  const successMsg = "Te registraste correctamente";
  const [isRegistered, setIsRegistered] = useState(false);
  const { id } = useParams();
  const { user } = useUser();
  const store = useContext(StoreContext);
  const navigate = useNavigate();

  const goToMyTripsButton = (
    <Button onClick={() => navigate(`/trips/${tripToSuscribe}`)}>
      Ver detalles
    </Button>
  );

  const suscribe = () => {
    setLoading(true);
    store.services.tripService
      .RegisterUserToTrip(user.id, tripToSuscribe)
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
  useEffect(() => {
    if(!trip.tripCoordinates){
        store.services.tripService
        .GetTrip(id)
        .then((res) => {
          setTrip(res.data);
          const alreadyRegistered = res.data.participants.find(
            (p) => p.id == user.id
          );
          if(alreadyRegistered)
          setIsRegistered(true);
          setLoading(false);
        })
        .catch((e) => {
          console.log(e);
          setLoading(false);
        });
    }
  }, [trip]);
  return (
    <>
     {trip.tripCoordinates &&
        <MapContainer
        >
         <MapComponent coordinates={trip.tripCoordinates} registeringToTrip={true}/>
        </MapContainer>
        }
  </>
  )
}
