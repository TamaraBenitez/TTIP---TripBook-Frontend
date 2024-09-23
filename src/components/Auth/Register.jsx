import React, { useContext, useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  FormControl,
  CircularProgress,
  Link
} from "@mui/material";
import StoreContext from "../../store/storecontext";
import { useNavigate } from "react-router-dom";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

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
  const [success, setSuccess] = useState(null);
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

  const minDate = dayjs().subtract(120, 'year');

  
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
    
    if (Object.values(errors).every((error) => error === "")
    && Object.values(formData).every((field)=> field !== "")) {
      setIsDataLoading(true);
      store.services.authService
        .register({
          name: formData.name,
          surname: formData.surname,
          email: formData.email,
          password: formData.password,
          birthDate: formData.birthDate.$d
        })
        .then(() => {
          setSuccess(true);
        })
        .catch((e) => {
          setSuccess(false);
        })
        .finally(()=>{
          setIsDataLoading(false);
        });
    }
  };

  const display = () => {
    if (success == null) return register;
    if (success) {
      return successfulRegistration;
    } else return failedRegistration;
  };
  const register = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 2,
        maxWidth: 400,
        margin: "auto",
        border: "1px solid #ccc",
        borderRadius: 2,
        boxShadow: 2,
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
            onChange={(newDate) => setFormData({...formData,birthDate:newDate})}
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
    </Box>
  );
  const spinner = <CircularProgress />;

  const successfulRegistration = (
    <>
      <Typography variant="h1">Registro Exitoso!</Typography>
      <Button>Comenzar a viajar</Button>
    </>
  );

  const failedRegistration = (
    <>
      <Typography variant="h1">Algo salió mal :(</Typography>
      <Button variant="text" onClick={()=>setSuccess(null)}>Volver</Button>
    </>
  );

  return isDataLoading ? spinner : display();
};

export default Register;
