import { AddOutlined } from '@mui/icons-material'
import { Box, IconButton } from '@mui/material'
import React from 'react'
import { useTheme } from "@emotion/react";
import { useNavigate } from 'react-router-dom';

export default function AddTripButton() {
    const theme = useTheme();
    const navigate = useNavigate();

  return (
    <Box
    sx={{
      width: 345,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: 250,
    }}
  >
    <IconButton
      sx={{
        height: "100px",
        width: "100px",
        color: theme.palette.primary.light,
        ":hover": {
          bgcolor: theme.palette.secondary.light,
          color: "white",
        },
      }}
      onClick={() => navigate("/trip")}
    >
      <AddOutlined sx={{ fontSize: "-webkit-xxx-large" }} />
    </IconButton>
  </Box>
  )
}
