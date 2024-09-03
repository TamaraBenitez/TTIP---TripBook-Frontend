import { Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Header from "./components/Header/Header";
import { Toolbar } from "@mui/material";
import MyTrips from "./components/MyTrips/MyTrips";
import AllTrips from "./components/AllTrips/AllTrips";
import TripDetails from "./components/TripDetails/TripDetails";

export default function App() {
  

  return (
    <>
        <Header />
        <Toolbar sx={{height: "90px"}}/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/trips" element={<AllTrips />} />
          <Route path="/trips/:id" element={<TripDetails />} />
          <Route path="/mytrips" element={<MyTrips/>} />
        </Routes>
    </>
  );
}
