import { Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Trips from "./components/TripList/Trips";
import Header from "./components/Header/Header";

export default function App() {
  return (<>
  <Header />
    <Routes>
      <Route path="/" element={Home()}/>
      <Route path="/trips" element={Trips()} />
    </Routes>
  </>)
}