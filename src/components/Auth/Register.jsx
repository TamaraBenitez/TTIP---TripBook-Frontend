import React, { useContext, useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  FormControl,
  CircularProgress,
  Link,
  FormHelperText,
  InputLabel,
} from "@mui/material";
import StoreContext from "../../store/storecontext";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { CloudUpload, ErrorOutline } from "@mui/icons-material";
import AlertCustom from "../AlertCustom/AlertCustom";
import DialogCustom from "../DialogCustom/DialogCustom";
import EmailConfirmation from "./EmailConfirmation";

const Register = () => {
  const emptyForm = {
    name: "",
    surname: "",
    email: "",
    birthDate: "",
    password: "",
    confirmPassword: "",
    dniFile: null,
  };
  const [formData, setFormData] = useState(emptyForm);

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
  const [showModal, setShowModal] = useState(false);
  const [msgError, setMsgError] = useState("");
  const [userId, setUserId] = useState("");
  const [fileMessage, setFileMessage] = useState("");
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
    let date = dayjs(formData.birthDate.$d).toISOString();
    if (
      Object.values(errors).every((error) => error === "") &&
      Object.values(formData).every((field) => field !== "")
    ) {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("surname", formData.surname);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("birthDate", date);
      formDataToSend.append("password", formData.password);
      formDataToSend.append("dniFile", formData.dniFile);
      setIsDataLoading(true);
      store.services.authService
        .register(formDataToSend)
        .then((user) => {
          setUserId(user.data.id);
          setShowModal(true);
          setTimeout(() => {
            handleCloseModal();
          }, 3000);
        })
        .catch((error) => {
          setMsgError(error.response.data.message);
          setSuccess(false);
          setShowAlert(true);
          setFormData(emptyForm);
          setTimeout(() => {
            setShowAlert(false);
          }, 5000);
        })
        .finally(() => {
          setIsDataLoading(false);
        });
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSuccess(true);
  };

  const spinner = <CircularProgress />;
  const okButton = (
    <Button
      onClick={handleCloseModal}
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
  ) : success ? (
    <EmailConfirmation userId={userId} />
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
        <FormControl margin="normal">
          <InputLabel sx={{ position:"relative", marginBottom: "4%"}}>
            DNI Barcode Photo <span style={{ color: "gray" }}>(optional)</span>
          </InputLabel>
          <Button
            className="boton"
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<CloudUpload />}
          >
            Upload Barcode Photo
            <TextField
              type="file"
              sx={{ display: "none" }}
              onChange={(e) => {
                setFormData({ ...formData, dniFile: e.target.files[0] });
                if (e.target.files.length > 0) {
                  setFileMessage(`Selected file: ${e.target.files[0].name}`);
                } else {
                  setFileMessage("");
                }
              }}
              multiple
            />
          </Button>
          <FormHelperText>{fileMessage}</FormHelperText>
          <FormHelperText>
            Upload your barcode photo. If you upload, you will be a verified
            user.
          </FormHelperText>
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
          icon={<ErrorOutline />}
        />
      }
      {
        <DialogCustom
          open={showModal}
          title={"Registro Exitoso"}
          textParagraph={
            "The enviaremos un mail para verificar tu correo electronico"
          }
          handleClose={handleCloseModal}
          confirmButton={okButton}
        />
      }
    </Box>
  );
};

export default Register;
