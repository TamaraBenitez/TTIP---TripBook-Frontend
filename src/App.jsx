import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./components/Home";
import Header from "./components/Header/Header";
import { Toolbar } from "@mui/material";
import MyTrips from "./components/MyTrips/MyTrips";
import AllTrips from "./components/AllTrips/AllTrips";
import TripDetails from "./components/TripDetails/TripDetails";
import Login from "./components/Auth/Login";
import RouteCustom from "./components/RouteCustom";
import Register from "./components/Auth/Register";
import VerifyEmail from "./components/Auth/VerifyEmail";
import Profile from "./components/Profile/Profile";

export default function App() {
  const location = useLocation();
  const showHeader =
    location.pathname !== "/login" && location.pathname !== "/register";

  const routes = [
    { path: "/", component: <Home /> },
    { path: "/trips", component: <AllTrips /> },
    { path: "/trips/:id", component: <TripDetails /> },
    { path: "/mytrips", component: <MyTrips /> },
    { path: "/verify-email", component: <VerifyEmail /> },
    { path: "/profile", component: <Profile /> },
  ];

  return (
    <>
      <Header />
      <Toolbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {routes.map(({ path, component }) => (
          <Route
            key={path}
            path={path}
            element={<RouteCustom>{component}</RouteCustom>}
          />
        ))}
      </Routes>
    </>
  );
}
