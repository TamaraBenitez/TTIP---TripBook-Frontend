import React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
} from "react-router-dom";
import AllTrips from "../components/AllTrips/AllTrips";
import TripDetails from "../components/TripDetails/TripDetails";
import TripCreation from "../components/TripCreation/TripCreation";
import MyTrips from "../components/MyTrips/MyTrips";
import VerifyEmail from "../components/Auth/VerifyEmail";
import Profile from "../components/Profile/Profile";
import Register from "../components/Auth/Register";
import RouteCustom from "../components/RouteCustom";
// import App from "../App";
import Login from "../components/Auth/Login";
import Home from "../components/Home";
import Header from "../components/Header/Header";
import { Toolbar } from "@mui/material";
import ToolbarAuth from "../components/Auth/ToolbarAuth";
import TripRegistration from "../components/TripRegistration/TripRegistration";

  const routes = [
    { path: "/home", component: <Home /> },
    { path: "/trips", component: <AllTrips /> },
    { path: "/trips/:id", component: <TripDetails /> },
    { path: "/trip", component: <TripCreation /> },
    { path: "/mytrips", component: <MyTrips /> },
    { path: "/verify-email", component: <VerifyEmail /> },
    { path: "/profile", component: <Profile /> },
    { path: "/trip", component: <TripCreation /> },
    { path: "/trip/suscribe/:id", component: <TripRegistration /> },
  ];

  const authRoutes = [
    { path:"/login", component:<Login />},
    { path:"/register", component:<Register />}
  ]

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        
        {authRoutes.map(({path, component},i)=>(
          <Route
            key={path}
            path={path}
            element={
              <>
              <ToolbarAuth titleButton={i == 0 ? "Registro" : "Iniciar Sesion"} navigateTo={i == 0 ?  "/register" : "/login"}/>
              {component}
              </>
            }/>
        ))}
        <Route path="/" element={<Home />} />
          <Route index element={<Navigate to="/home" />} />
          {routes.map(({ path, component }) => (
            <Route
              key={path}
              path={path}
              element={<RouteCustom>
                <Header />
                <Toolbar sx={{ height: "90px" }} />
                {component}
                </RouteCustom>}
            />
        ))}
          
      </>
    )
  );

  export default router;

