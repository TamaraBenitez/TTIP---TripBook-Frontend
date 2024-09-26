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

export default function App() {
  const location = useLocation();
  const showHeader =
    location.pathname !== "/login" && location.pathname !== "/register";
  return (
    <>
      {showHeader && <Header />}
      <Toolbar sx={{ height: "90px" }} />
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<AllTrips />} />
        <Route
          path="/trips"
          element={
            <RouteCustom>
              <AllTrips />
            </RouteCustom>
          }
        />
        <Route
          path="/trips/:id"
          element={
            <RouteCustom>
              <TripDetails />
            </RouteCustom>
          }
        />
        <Route path="/register" element={<Register />} />

        <Route
          path="/mytrips"
          element={
            <RouteCustom>
              <MyTrips />
            </RouteCustom>
          }
        />
      </Routes>
    </>
  );
}
