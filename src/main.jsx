import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { BrowserRouter as Router } from "react-router-dom";
import TripService from "./services/TripService.jsx";
import App from "./App.jsx";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "./index.css";
import StoreContext from "./store/storecontext.jsx";
import UserService from "./services/UserService.jsx";
import { httpClient } from "./services/httpClient.jsx";
import AuthService from "./services/AuthService.jsx";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#226668",
    },
    secondary: {
      main: "#4E8487",
    },
  },
});
const baseUrl = import.meta.env.VITE_TRIPBOOK_API;

const store = {
  services: {
    tripService: new TripService(httpClient, baseUrl),
    userService: new UserService(httpClient, baseUrl),
    authService: new AuthService(httpClient, baseUrl),
  },
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <StoreContext.Provider value={store}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Router>
            <CssBaseline />
            <App />
          </Router>
        </LocalizationProvider>
      </StoreContext.Provider>
    </ThemeProvider>
  </StrictMode>
);
