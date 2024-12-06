import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Container,
  Grid2,
  Typography,
} from "@mui/material";
import { useState, useContext } from "react";
import { Groups } from "@mui/icons-material";
import "./TripStyles.css";
import { NavLink } from "react-router-dom";
import { formatDate } from "../../utility/Utility";
import StoreContext from "../../store/storecontext";
import DialogCustom from "../DialogCustom/DialogCustom";
import AlertCustom from "../AlertCustom/AlertCustom";
import { TaskAlt } from "@mui/icons-material";
import PropTypes from "prop-types";
import defaultImage from "../../assets/tripImage.png";

function mapStatusToSpanish(status) {
  const statusMap = {
    pending: "Pendiente",
    confirmed: "Confirmado",
    cancelled: "Cancelado",
    rejected: "Rechazado",
  };
  return statusMap[status] || "";
}

export default function TripCard({
  description,
  startDate,
  startingPoint,
  destination,
  participantsNumber,
  maxPassengers,
  to,
  estimatedCost,
  action,
  handleAction,
  status,
  role,
  tripUserId,
  imageUrl,
}) {
  const [isHovered, setIsHovered] = useState(false);
  const store = useContext(StoreContext);
  const [openDialog, setOpenDialog] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const handleCancellRequest = () => {
    store.services.tripService
      .CancelRequest(tripUserId)
      .then(() => {
        setAlertMessage("Te diste de baja al viaje con éxito.");
        setShowAlert(true);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      })
      .catch(() => {
        setAlertMessage("Hubo un error al cancelar la inscripción.");
        setShowAlert(true);
      })
      .finally(() => {
        setOpenDialog(false);
      });
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleClick = (e) => {
    e.stopPropagation();
  };
  function cleanString(input) {
    // Remove spaces and replace accented vowels
    return input
      .replace(/\s+/g, "") // Remove all spaces
      .replace(/[áÁ]/g, "a")
      .replace(/[éÉ]/g, "e")
      .replace(/[íÍ]/g, "i")
      .replace(/[óÓ]/g, "o")
      .replace(/[úÚ]/g, "u")
      .toLowerCase();
  }
  return (
    <>
      <Card
        variant="outlined"
        className="tripCard"
        sx={{
          textDecoration: "none",
          height: "fit-content",
          width: 345,
          transition: "transform 0.3s ease-in-out",
          "&:hover": {
            transform: "scale(1.05)",
          },
          position: "relative",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => handleClick}
      >
        <CardActionArea component={NavLink} to={`/trips/${to}`}>
          <CardMedia
            sx={{ height: 190, position: "relative" }}
            image={imageUrl ?? defaultImage}
            title="road"
          >
            {isHovered && (
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "30%",
                  bgcolor: "rgba(255, 255, 255, 0.7)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Container sx={{ display: "flex", justifyContent: "center" }}>
                  <Typography variant="h6">
                    {"Sale de " + startingPoint}
                  </Typography>
                </Container>
              </Box>
            )}
          </CardMedia>
          <CardContent
            sx={{
              maxHeight: 300,
              overflow: "hidden",
            }}
          >
            <Grid2
              container
              size={12}
              sx={{ display: "flex", paddingLeft: "0px !important" }}
            >
              <Grid2 size={6} width={"55%"}>
                <Typography variant="h5" component="div">
                  {destination}
                </Typography>
              </Grid2>
              {isHovered && (
                <Grid2
                  size={6}
                  sx={{
                    display: "flex",
                    width: "45%",
                    marginRight: "0px",
                    justifyContent: "flex-end",
                  }}
                >
                  <Groups className="groupIcon" />
                  <Typography>
                    {participantsNumber} / {maxPassengers}
                  </Typography>
                </Grid2>
              )}
            </Grid2>

            <Typography>{formatDate(startDate)}</Typography>
            {status && (
              <Typography variant="body2" color="text.secondary">
                Estado: {mapStatusToSpanish(status)}
              </Typography>
            )}

            <Typography color="primary" variant="h6">
              ${estimatedCost}
            </Typography>
          </CardContent>
        </CardActionArea>
        {isHovered && (
          <CardActions>
            <Button
              size="small"
              color="primary"
              onClick={(e) => handleAction(e, to)}
            >
              {action}
            </Button>
            {status === "confirmed" && role === 0 && (
              <Button onClick={handleOpenDialog}>Cancelar inscripcion </Button>
            )}
          </CardActions>
        )}
      </Card>
      <DialogCustom
        open={openDialog}
        handleClose={handleCloseDialog}
        title="¿Seguro que quieres cancelar tu inscripción al viaje?"
        textParagraph="Esta acción no se puede deshacer."
        handleConfirm={handleCancellRequest}
        showCancelButton={true}
      />

      <AlertCustom
        inProp={showAlert}
        timeout={3000}
        onClose={() => setShowAlert(false)}
        msg={alertMessage}
        icon={<TaskAlt />}
        severity="success"
      />
    </>
  );
}
TripCard.propTypes = {
  description: PropTypes.string.isRequired,
  startDate: PropTypes.string.isRequired,
  startingPoint: PropTypes.string.isRequired,
  destination: PropTypes.string.isRequired,
  participantsNumber: PropTypes.number.isRequired,
  maxPassengers: PropTypes.number.isRequired,
  to: PropTypes.string.isRequired,
  estimatedCost: PropTypes.number.isRequired,
  action: PropTypes.string.isRequired,
  handleAction: PropTypes.func.isRequired,
  status: PropTypes.string,
  role: PropTypes.string,
  tripUserId: PropTypes.string,
  imageUrl: PropTypes.string,
};
