import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const DialogCustom = ({
  open,
  handleClose,
  title,
  textParagraph,
  handleConfirm,
  confirmButton,
  showCancelButton,
  dialogContent,
}) => {
  return (
    <>
      {" "}
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
        sx={{
          "& .MuiDialog-paper": {
            padding: "10px",
            boxShadow: `0px 4px 10px 2px rgba(34, 102, 104, 0.5)`,
          },
        }}
      >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          {dialogContent ? (
            dialogContent
          ) : (
            <DialogContentText id="alert-dialog-slide-description">
              {textParagraph}
            </DialogContentText>
          )}
        </DialogContent>
        <DialogActions sx={{ paddingBlock: 3 }}>
          {confirmButton ? (
            confirmButton
          ) : (
            <Button onClick={handleConfirm} color="primary" variant="contained">Confirmar</Button>
          )}
          {showCancelButton && <Button onClick={handleClose}>Cancelar</Button>}
        </DialogActions>
      </Dialog>
    </>
  );
};
export default DialogCustom;
