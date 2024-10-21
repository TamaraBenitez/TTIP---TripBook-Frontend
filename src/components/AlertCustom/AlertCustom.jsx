import { TaskAlt } from "@mui/icons-material";
import { Alert, Fade } from "@mui/material";
import React from "react";

export default function AlertCustom({
  inProp,
  timeout,
  onClose,
  msg,
  icon,
  severity,
}) {
  return (
    <Fade in={inProp} timeout={timeout}>
      <Alert
        sx={{
          maxWidth: 500,
          position: "fixed",
          bottom: "30px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 2,
        }}
        onClose={onClose}
        variant="standard"
        icon={icon ? icon : <TaskAlt fontSize="inherit" />}
        severity={severity}
      >
        {msg}
      </Alert>
    </Fade>
  );
}
