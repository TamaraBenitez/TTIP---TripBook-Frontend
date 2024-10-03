import { Navigate } from "react-router-dom";

const RouteCustom = ({ children }) => {
  const existToken = !!localStorage.getItem("token");

  console.log("existToken", existToken);

  return existToken ? children : <Navigate to="/login" />;
};

export default RouteCustom;
