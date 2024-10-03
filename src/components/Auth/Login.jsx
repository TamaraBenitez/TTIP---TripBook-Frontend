import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { useState, useContext } from "react";
import { useNavigate } from "react-router";
import { Alert, Fade, IconButton, InputAdornment } from "@mui/material";
import { TaskAlt, Visibility, VisibilityOff } from "@mui/icons-material";
import StoreContext from "../../store/storecontext";

const Login = () => {
  const [data, setData] = useState({ email: "", password: "" });
  const [emailError, setEmailError] = useState(false);
  const store = useContext(StoreContext);
  const [showAlert, setShowAlert] = useState(false);
  const [msgError, setMsgError] = useState("");
  const navigate = useNavigate();
  const [isShowPassword, setIsShowPassword] = useState(false);

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    validateEmail(data.email);

    if (!emailError) {
    store.services.authService
      .login(data)
      .then((response) => {
        localStorage.setItem("token", response.data.token);
        navigate("/trips");
      })
      .catch((error) => {
        if(error.status === 401){
          setMsgError("Datos incorrectos.");
        } else {
          setMsgError("Ha ocurrido un error.")
        }
        console.log(error);
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 3000);
      });
      }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setData({ ...data, [name]: value });

    if (name === "email") {
      setEmailError(!validateEmail(value));
    }
  };

  const changeVisualization = () => {
    setIsShowPassword(!isShowPassword);
  };

  const canSubmit = () => {
    return validateEmail(data.email);
  };

  function Copyright(props) {
    return (
      <Typography
        variant="body2"
        color="text.secondary"
        align="center"
        {...props}
      >
        {"Copyright © "}
        {"TripBook "}
        {new Date().getFullYear()}
        {"."}
      </Typography>
    );
  }

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 2,
          maxWidth: 600,
          margin: "auto",
          border: "1px solid #ccc",
          borderRadius: 2,
          boxShadow: 2,
        }}
      >
        <CssBaseline />

        <Box
          sx={{
            my: 8,
            mx: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box
            component="form"
            noValidate
            sx={{ mt: 1 }}
            onSubmit={handleSubmit}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              value={data.email}
              onChange={handleInputChange}
              autoComplete="email"
              autoFocus
              error={emailError}
              helperText={emailError && "Ingrese un email válido"}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={isShowPassword ? "text" : "password"}
              id="password"
              autoComplete="current-password"
              value={data.password}
              onChange={handleInputChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      style={{ padding: "0px" }}
                      onClick={changeVisualization}
                    >
                      {isShowPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {showAlert && (
              <Fade in={showAlert} timeout={500}>
                <Alert
                  sx={{
                    maxWidth: 500,
                    position: "fixed",
                    top: "130px",
                    right: "10px",
                  }}
                  onClose={() => setShowAlert(false)}
                  variant="standard"
                  icon={<TaskAlt fontSize="inherit" />}
                  severity="error"
                >
                  {msgError} Por favor, volver a intentarlo.
                </Alert>
              </Fade>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={!canSubmit()}
              onClick={handleSubmit}
            >
              Sign In
            </Button>
            <Box display={"flex"} justifyContent={"center"}>
              <Link href="/register" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Box>
            <Copyright sx={{ mt: 5 }} />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Login;
