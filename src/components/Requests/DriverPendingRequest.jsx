import {
  Box,
  SvgIcon,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  FormControlLabel,
  Checkbox,
  TextField,
} from "@mui/material";
import { useSearchParams, useNavigate } from "react-router-dom";
import RibbonHeading from "../RibbonHeading/RibbonHeading";
import TripDetails from "../TripDetails/TripDetails";
import markerUser from "../../assets/user-location.svg";
import StoreContext from "../../store/storecontext";
import { useContext, useState } from "react";
import AlertCustom from "../AlertCustom/AlertCustom";
import { TaskAlt } from "@mui/icons-material";

export default function DriverPendingRequest() {
  let [searchParams, setSearchParams] = useSearchParams();
  const tripUserId = searchParams.get("tripUserId");
  const tripId = searchParams.get("tripId");
  const store = useContext(StoreContext);
  const [openDialog, setOpenDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isReasonEnabled, setIsReasonEnabled] = useState(false);
  const [alert, setAlert] = useState({
    inProp: false,
    msg: "",
    severity: "success",
    icon: null,
  });
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  const handleOpenConfirmDialog = () => {
    setConfirmDialogOpen(true);
  };

  const handleCloseConfirmDialog = () => {
    setConfirmDialogOpen(false);
  };

  const handleConfirmRequest = async () => {
    try {
      await store.services.tripService.AcceptRequest(tripUserId);
      setAlert({
        inProp: true,
        msg: "Solicitud procesada con éxito... Pronto seras redirigido",
        severity: "success",
        icon: <TaskAlt fontSize="inherit" />,
      });

      handleCloseConfirmDialog();

      setTimeout(() => {
        setAlert((prev) => ({ ...prev, inProp: false }));
        navigate("/mytrips");
      }, 3000);
    } catch (error) {
      console.error("Error al confirmar la solicitud:", error);
      setAlert({
        inProp: true,
        msg: "Algo falló en el proceso de la solicitud",
        severity: "error",
        icon: <TaskAlt fontSize="inherit" style={{ color: "red" }} />,
      });

      setTimeout(() => {
        setAlert((prev) => ({ ...prev, inProp: false }));
      }, 3000);
    }
  };

  const navigate = useNavigate();

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setRejectionReason("");
    setIsReasonEnabled(false);
  };

  const handleCheckboxChange = (event) => {
    setIsReasonEnabled(event.target.checked);
    if (!event.target.checked) {
      setRejectionReason("");
    }
  };

  const handleRejectRequest = async () => {
    try {
      await store.services.tripService.RejectRequest(tripUserId, {
        rejectionReason,
      });
      setAlert({
        inProp: true,
        msg: "Solicitud procesada con éxito... Pronto seras redirigido",
        severity: "success",
        icon: <TaskAlt fontSize="inherit" />,
      });

      handleCloseDialog();

      setTimeout(() => {
        setAlert((prev) => ({ ...prev, inProp: false }));
        navigate("/mytrips");
      }, 3000);
    } catch (error) {
      console.error("Error al rechazar la solicitud:", error);
      setAlert({
        inProp: true,
        msg: "Algo falló en el proceso de la solicitud",
        severity: "error",
        icon: <TaskAlt fontSize="inherit" style={{ color: "red" }} />,
      });

      setTimeout(() => {
        setAlert((prev) => ({ ...prev, inProp: false }));
      }, 3000);
    }
  };

  return (
    <Box paddingInline={5}>
      <RibbonHeading
        heading={"Solicitud de pasajero"}
        component={"h2"}
        variant={"h2"}
      />

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          maxWidth: 400,
          marginLeft: 5,
        }}
      >
        <SvgIcon
          sx={{
            marginRight: 1,
            fontSize: 50,
          }}
        >
          <image href={markerUser} height="100%" />
        </SvgIcon>
        <Typography
          variant="body2"
          color="textSecondary"
          fontSize="1rem"
          sx={{
            whiteSpace: "normal",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          El punto de partida de la solicitud está marcado con el siguiente
          marcador
        </Typography>
      </Box>

      <TripDetails
        pendingSolicitudes={true}
        tripIdParam={tripId}
        tripUserId={tripUserId}
      />

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          margin: 5,
          gap: 2,
        }}
      >
        <Button color="error" variant="contained" onClick={handleOpenDialog}>
          Denegar
        </Button>
        <Button variant="contained" onClick={handleOpenConfirmDialog}>
          Confirmar
        </Button>
      </Box>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Rechazar solicitud</DialogTitle>
        <DialogContent>
          <FormControlLabel
            control={
              <Checkbox
                checked={isReasonEnabled}
                onChange={handleCheckboxChange}
                color="primary"
              />
            }
            label="Agregar motivo de rechazo"
          />
          <TextField
            label="Motivo"
            fullWidth
            multiline
            rows={3}
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            disabled={!isReasonEnabled}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancelar
          </Button>
          <Button
            onClick={handleRejectRequest}
            color="primary"
            variant="contained"
          >
            Enviar respuesta de solicitud
          </Button>
        </DialogActions>
      </Dialog>
      <AlertCustom
        inProp={alert.inProp}
        timeout={500}
        onClose={() => setAlert((prev) => ({ ...prev, inProp: false }))}
        msg={alert.msg}
        icon={alert.icon}
        severity={alert.severity}
      />

      <Dialog open={confirmDialogOpen} onClose={handleCloseConfirmDialog}>
        <DialogTitle>Confirmar solicitud</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro que quieres confirmar esta solicitud?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog} color="secondary">
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmRequest}
            color="primary"
            variant="contained"
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
