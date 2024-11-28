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
import DialogCustom from "../DialogCustom/DialogCustom";

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

      <TripDetails
        pendingSolicitudes={true}
        tripIdParam={tripId}
        tripUserId={tripUserId}
        heading={"Solicitud de pasajero"}
        markerUser={markerUser}
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
      <DialogCustom
        open={openDialog}
        handleClose={handleCloseDialog}
        title={"Rechazar solicitud"}
        dialogContent={<>
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
          </>}
        showCancelButton={true}
        confirmButton={<><Button
          onClick={handleRejectRequest}
          color="primary"
          variant="contained"
        >
          Enviar respuesta de solicitud
        </Button></>}
      />
      <AlertCustom
        inProp={alert.inProp}
        timeout={500}
        onClose={() => setAlert((prev) => ({ ...prev, inProp: false }))}
        msg={alert.msg}
        icon={alert.icon}
        severity={alert.severity}
      />

      <DialogCustom 
                  open={confirmDialogOpen} 
                  handleClose={handleCloseConfirmDialog} 
                  title={"Confirmar solicitud"}
                  textParagraph={"¿Estás seguro que quieres confirmar esta solicitud?"}
                  showCancelButton={true}
                  handleConfirm={handleConfirmRequest}/>
    </Box>
  );
}
