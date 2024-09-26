import React, { useContext, useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  FormControl,
  CircularProgress,
  Link,
} from "@mui/material";
import StoreContext from "../../store/storecontext";
import { useNavigate } from "react-router-dom";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { ErrorOutline } from "@mui/icons-material";
import AlertCustom from "../AlertCustom/AlertCustom";
import DialogCustom from "../DialogCustom/DialogCustom";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    birthDate: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isDataLoading, setIsDataLoading] = useState(false);
  const store = useContext(StoreContext);
  const [success, setSuccess] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [msgError, setMsgError] = useState("");
  const navigate = useNavigate();

  const validate = (field, value) => {
    let error = "";

    switch (field) {
      case "name":
        if (!value) error = "Name is required";
        break;
      case "surname":
        if (!value) error = "Surname is required";
        break;
      case "email":
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          error = "Invalid email address";
        break;
      case "password":
        if (value.length < 4) error = "Password must be at least 4 characters";
        break;
      case "confirmPassword":
        if (value !== formData.password) error = "Passwords do not match";
        break;
      default:
        break;
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: error,
    }));
  };

  const minDate = dayjs().subtract(120, "year");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    validate(name, value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    Object.keys(formData).forEach((field) => validate(field, formData[field]));

    if (
      Object.values(errors).every((error) => error === "") &&
      Object.values(formData).every((field) => field !== "")
    ) {
      setIsDataLoading(true);
      store.services.authService
        .register({
          name: formData.name,
          surname: formData.surname,
          email: formData.email,
          password: formData.password,
          birthDate: formData.birthDate.$d,
        })
        .then(() => {
          setSuccess(true);
          setTimeout(() => {
            setSuccess(false);
          }, 3000);
        })
        .catch((error) => {
          setMsgError(error.response.data.message);
          setSuccess(false);
          setShowAlert(true);
          setTimeout(() => {
            setShowAlert(false);
          }, 3000);
        })
        .finally(() => {
          setIsDataLoading(false);
        });
    }
  };

  const spinner = <CircularProgress />;
  const okButton = (
    <Button
      onClick={() => navigate("/login")}
      sx={{
        right: "38%",
      }}
      variant="contained"
    >
      OK
    </Button>
  );

  return isDataLoading ? (
    spinner
  ) : (
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
        px: 4,
        py: 8,
      }}
    >
      <Typography variant="h4" gutterBottom>
        Register
      </Typography>
      <form onSubmit={handleSubmit}>
        <FormControl fullWidth>
          <TextField
            label="Name"
            name="name"
            onChange={handleChange}
            error={Boolean(errors.name)}
            helperText={errors.name}
            margin="normal"
          />
        </FormControl>
        <FormControl fullWidth>
          <TextField
            label="Surname"
            name="surname"
            onChange={handleChange}
            error={Boolean(errors.surname)}
            helperText={errors.surname}
            margin="normal"
          />
        </FormControl>
        <FormControl fullWidth>
          <TextField
            label="Email"
            name="email"
            type="email"
            onChange={handleChange}
            error={Boolean(errors.email)}
            helperText={errors.email}
            margin="normal"
          />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <DatePicker
            label="Birth Date"
            name="birthDate"
            disableFuture
            minDate={minDate}
            onChange={(newDate) =>
              setFormData({ ...formData, birthDate: newDate })
            }
          />
        </FormControl>
        <FormControl fullWidth>
          <TextField
            label="Password"
            name="password"
            type="password"
            onChange={handleChange}
            error={Boolean(errors.password)}
            helperText={errors.password}
            margin="normal"
          />
        </FormControl>
        <FormControl fullWidth>
          <TextField
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            onChange={handleChange}
            error={Boolean(errors.confirmPassword)}
            helperText={errors.confirmPassword}
            margin="normal"
          />
        </FormControl>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
        >
          Register
        </Button>
        <Box display={"flex"} justifyContent={"center"} marginTop={"10px"}>
          <Link href="/login" variant="body2">
            Already have an account? Sign in
          </Link>
        </Box>
      </form>
      {
        <AlertCustom
          inProp={showAlert}
          timeout={500}
          onClose={() => setShowAlert(true)}
          msg={msgError}
          icon={<ErrorOutline/>}
        />
      }
      {
        <DialogCustom
          open={success}
          title={"Registro Exitoso"}
          textParagraph={"Te redirigiremos para loguearte"}
          handleClose={() => navigate("/login")}
          confirmButton={okButton}
        />
      }
    </Box>
  );
};

export default Register;
