import { TaskAlt } from '@mui/icons-material'
import { Alert, Fade } from '@mui/material'
import React from 'react'

export default function AlertCustom({inProp, timeout, onClose, msg, icon}) {
  return (
    <Fade in={inProp} timeout={timeout}>
          <Alert
            sx={{
              maxWidth: 500,
              position: "fixed",
              top: "130px",
              right: "10px",
            }}
            onClose={onClose}
            variant="standard"
            icon={icon ? icon : <TaskAlt fontSize="inherit" />}
            severity="error"
          >
            {msg}
          </Alert>
        </Fade>
  )
}
