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
import { Visibility, VisibilityOff } from "@mui/icons-material";
import StoreContext from "../../store/storecontext";

const Login = () => {
  const [data, setData] = useState({ email: "", password: "" });
  const store = useContext(StoreContext);
  const [showAlert, setShowAlert] = useState(false);
  const [msgError, setMsgError] = useState("");
  const navigate = useNavigate();
  const [isShowPassword, setIsShowPassword] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    store.services.authService
      .login(data)
      .then((response) => {
        console.log(response.data);
        sessionStorage.setItem("token", response.data);
        navigate("/mytrips");
      })
      .catch((error) => {
        setMsgError(error.response.data);
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 3000);

        console.log(error.response.data);
      });
  };

  const handleInputChange = (event) => {
    setData({ ...data, [event.target.name]: event.target.value });
  };

  const changeVisualization = () => {
    setIsShowPassword(!isShowPassword);
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

  const puedeIngresar = () => {
    return data.email.trim() !== "" && data.password.trim() !== "";
  };

  return (
    <>
      {" "}
      <Grid container component="main">
        <CssBaseline />

        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
            onSubmit={handleSubmit}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box component="form" noValidate sx={{ mt: 1 }}>
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

              {showAlert ? (
                <Fade in={showAlert} timeout={500}>
                  <Alert severity="error">
                    {msgError} Por favor, volver a intentarlo.
                  </Alert>
                </Fade>
              ) : (
                ""
              )}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={!puedeIngresar()}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item>
                  <Link href="/register" variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
              <Copyright sx={{ mt: 5 }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default Login;
