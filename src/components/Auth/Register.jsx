import { useContext, useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  FormControl,
  Link,
  FormHelperText,
  LinearProgress,
} from "@mui/material";
import StoreContext from "../../store/storecontext";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { CloudUpload, ErrorOutline } from "@mui/icons-material";
import AlertCustom from "../AlertCustom/AlertCustom";
import DialogCustom from "../DialogCustom/DialogCustom";
import EmailConfirmation from "./EmailConfirmation";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Stack from "@mui/material/Stack";

const Register = () => {
  const emptyForm = {
    name: "",
    surname: "",
    email: "",
    birthDate: "",
    password: "",
    confirmPassword: "",
    dniFile: null,
    phoneNumber: "",
  };
  const [formData, setFormData] = useState(emptyForm);

  const [errors, setErrors] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
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
        if (!value) error = "Nombre es requerido";
        break;
      case "surname":
        if (!value) error = "Apellido es requerido";
        break;
      case "email":
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = "Email invalido";
        break;
      case "password":
        if (value.length < 4)
          error = "La contraseña debe tener al menos 4 caracteres";
        break;
      case "confirmPassword":
        if (value !== formData.password) error = "Las contraseñas no coinciden";
        break;
      case "phoneNumber":
        if (!/^\d{13}$/.test(value))
          error =
            "El número de teléfono debe tener 13 dígitos (por ejemplo, 5491109876543)";
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
      formDataToSend.append("dniPhoto", formData.dniFile);
      formDataToSend.append("phoneNumber", formData.phoneNumber);
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
    <DialogCustom
      open={isDataLoading}
      handleClose={() => {}}
      title="Procesando rostro"
      dialogContent={
        <>
          <p
            style={{
              fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
            }}
          >
            Este proceso puede demorar ya que se está procesando su rostro. Sea
            paciente.
          </p>
          <LinearProgress />
        </>
      }
      hideConfirmButton={true}
      showCancelButton={false}
      confirmButton={null}
    />
  ) : success ? (
    <EmailConfirmation userId={userId} />
  ) : (
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
          px: 4,
          py: 8,
        }}
      >
        <Typography variant="h4" gutterBottom>
          Registro
        </Typography>
        <form onSubmit={handleSubmit}>
          <FormControl fullWidth>
            <TextField
              label="Nombre"
              name="name"
              onChange={handleChange}
              error={Boolean(errors.name)}
              helperText={errors.name}
              margin="normal"
            />
          </FormControl>
          <FormControl fullWidth>
            <TextField
              label="Apellido"
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
              label="Fecha de nacimiento"
              name="birthDate"
              disableFuture
              minDate={minDate}
              format="DD/MM/YYYY"
              onChange={(newDate) =>
                setFormData({ ...formData, birthDate: newDate })
              }
            />
          </FormControl>
          <FormControl fullWidth>
            <TextField
              label="Contraseña"
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
              label="Confirmar contraseña"
              name="confirmPassword"
              type="password"
              onChange={handleChange}
              error={Boolean(errors.confirmPassword)}
              helperText={errors.confirmPassword}
              margin="normal"
            />
            <FormControl fullWidth>
              <TextField
                label="Número de Teléfono"
                name="phoneNumber"
                type="text"
                onChange={handleChange}
                error={Boolean(errors.phoneNumber)}
                helperText={errors.phoneNumber}
                margin="normal"
                placeholder="54911..."
              />
            </FormControl>
          </FormControl>

          <Typography
            variant="body2"
            color="textSecondary"
            sx={{ marginBottom: "8px" }}
          >
            La foto solicitada se utilizará para verificar su identidad al
            iniciar sesión, comparándola con una imagen tomada en tiempo real.
            Esto garantiza su seguridad y la integridad de su cuenta.
          </Typography>
          <FormControl fullWidth margin="normal">
            <Button
              className="boton"
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
              startIcon={<CloudUpload />}
            >
              Subir foto
              <TextField
                type="file"
                sx={{ display: "none" }}
                onChange={(e) => {
                  setFormData({ ...formData, dniFile: e.target.files[0] });
                  if (e.target.files.length > 0) {
                    setFileMessage(`Archivo subido: ${e.target.files[0].name}`);
                  } else {
                    setFileMessage("");
                  }
                }}
                multiple
              />
            </Button>
            <FormHelperText>{fileMessage}</FormHelperText>
          </FormControl>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Registrarse
          </Button>
          <Box display={"flex"} justifyContent={"center"} marginTop={"10px"}>
            <Link href="/login" variant="body2">
              Ya tienes una cuenta? Inicia sesion
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
            severity={"error"}
          />
        }
        {
          <DialogCustom
            open={showModal}
            title={"Registro Exitoso"}
            textParagraph={
              "Te enviaremos un mail para verificar tu correo electronico"
            }
            handleClose={handleCloseModal}
            confirmButton={okButton}
          />
        }
      </Box>
    </>
  );
};

export default Register;
