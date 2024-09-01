import { Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Trips from "./components/TripList/Trips";
import Header from "./components/Header/Header";
import { Toolbar } from "@mui/material";

export default function App() {
  

  return (
    <>
        <Header />
        <Toolbar sx={{height: "70px"}}/>
        <Routes>
          <Route path="/" element={Home()} />
          <Route path="/trips" element={Trips()} />
        </Routes>
    </>
  );
}
