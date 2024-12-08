import { useEffect, useState, useContext } from "react";
import {
  Avatar,
  Box,
  Typography,
  CircularProgress,
  Tooltip,
  Button,
  Alert,
  Paper,
  Tabs,
  Tab,
  Grid2,
  TextField,
  Autocomplete,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { useUser } from "../../user/UserContext";
import VerificationSteps from "./VerificationSteps";
import AlertCustom from "../AlertCustom/AlertCustom";
import RibbonHeading from "../RibbonHeading/RibbonHeading";
import MyVehicles from "../MyVehicles/MyVehicles";
import DialogCustom from "../DialogCustom/DialogCustom";
import { Edit, ErrorOutline } from "@mui/icons-material";
import { getProvinces } from "../../utility/Utility";
import StoreContext from "../../store/storecontext";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

const Profile = () => {
  const [verifyingUser, setVerifyingUser] = useState(false);
  const [isAccountVerified, setIsAccountVerified] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState("success");
  const [tabIndex, setTabIndex] = useState(0);
  const [vehicles, setVehicles] = useState([]);
  const [alertMsg, setAlertMsg] = useState(
    "Su cuenta ha sido verificada con exito"
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { user, userDataLoading, setUser } = useUser();
  const [editedProvince, setEditedProvince] = useState("");
  const [editedLocality, setEditedLocality] = useState("");
  const [editedEmail, setEditedEmail] = useState("");
  const [editedPhoneNumber, setEditedPhoneNumber] = useState("");
  const [changePassword, setChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [errors, setErrors] = useState({
    email: "",
    phoneNumber: "",
    currentPassword: "",
    newPassword: "",
  });
  const store = useContext(StoreContext);

  const validate = (field, value) => {
    let error = "";

    switch (field) {
      case "email":
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = "Email inválido";
        break;
      case "phoneNumber":
        if (!/^\d{13}$/.test(value))
          error =
            "El número de teléfono debe tener 13 dígitos (por ejemplo, 5491109876543)";
        break;
      case "currentPassword":
        if (changePassword && !value)
          error = "La contraseña actual es requerida";
        break;
      case "newPassword":
        if (changePassword && !value)
          error = "La nueva contraseña es requerida";
        else if (changePassword && value.length < 4)
          error = "La nueva contraseña debe tener al menos 4 caracteres";
        break;
      default:
        break;
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: error,
    }));
  };

  const handleChange = (eOrField, value) => {
    let name, newValue;

    if (typeof eOrField === "string") {
      // Caso para Autocomplete (el primer argumento es el nombre del campo)
      name = eOrField;
      newValue = value;
    } else {
      // Caso para TextField (el argumento es un evento)
      name = eOrField.target.name;
      newValue = eOrField.target.value;
    }

    switch (name) {
      case "province":
        setEditedProvince(newValue);
        break;
      case "locality":
        setEditedLocality(newValue);
        break;
      case "email":
        setEditedEmail(newValue);
        break;
      case "phoneNumber":
        setEditedPhoneNumber(newValue);
        break;
      case "currentPassword":
        setCurrentPassword(newValue);
        break;
      case "newPassword":
        setNewPassword(newValue);
        break;
      default:
        break;
    }

    validate(name, newValue);
  };

  useEffect(() => {
    if (!userDataLoading) {
      setIsAccountVerified(user.isUserVerified && user.isEmailVerified);
      setVehicles(user.vehicles);

      setEditedProvince(user.province || "");
      setEditedLocality(user.locality || "");
      setEditedEmail(user.email || "");
      setEditedPhoneNumber(user.phoneNumber || "");
    }
  }, [userDataLoading, user]);

  useEffect(() => {
    if (user && user.isEmailVerified && user.isUserVerified) {
      setIsAccountVerified(true);
    }
  }, [user]);

  const getInitials = (name, surname) => {
    return `${name.charAt(0).toUpperCase()}${surname.charAt(0).toUpperCase()}`;
  };

  const handleNull = (value) => value || "Sin información aun";

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };
  const handleCreateVehicle = (vehicle) => {
    setAlertMsg("Vehiculo registrado exitosamente");
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 5000);
    setVehicles([...vehicles, vehicle]);
  };

  const handleEdit = (e) => {
    e.preventDefault();

    validate("email", editedEmail);
    validate("phoneNumber", editedPhoneNumber);
    if (changePassword) {
      validate("currentPassword", currentPassword);
      validate("newPassword", newPassword);
    }

    const hasErrors = Object.values(errors).some((error) => error !== "");

    if (hasErrors) {
      console.log("estoy entrando al error, errores", errors);
      return; // Evitar que se haga la llamada a la API si hay errores
    }
    const updateData = {
      locality: editedLocality,
      province: editedProvince,
      email: editedEmail,
      phoneNumber: editedPhoneNumber,
    };

    if (changePassword) {
      updateData.currentPassword = currentPassword;
      updateData.password = newPassword;
    }
    store.services.userService
      .UpdateUser(user.id, updateData)
      .then((res) => {
        setUser({
          ...user,
          locality: editedLocality,
          province: editedProvince,
          email: editedEmail,
          phoneNumber: editedPhoneNumber,
        });
        setAlertMsg("Información editada con éxito");
        setAlertSeverity("success");
        setShowAlert(true);

        setTimeout(() => {
          setShowAlert(false);
        }, 3000);
      })
      .catch((error) => {
        setAlertMsg(error.response.data.message);
        setAlertSeverity("error");
        setShowAlert(true);
        setTimeout(() => {
          setAlertSeverity("success");
          setShowAlert(false);
        }, 5000);
      });
    setIsDialogOpen(false);
  };

  return (
    <>
      {userDataLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", height: "100%" }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            margin: 5,
            justifyContent: "space-around",
          }}
        >
          <RibbonHeading variant={"h2"} heading={"Mi perfil"} />
          {!isAccountVerified && (
            <Alert
              variant="outlined"
              severity="warning"
              sx={{ alignSelf: "center", width: "20vw" }}
            >
              Cuenta no verificada
              <Typography variant="body1" color="textPrimary">
                Su cuenta no esta verificada
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => setVerifyingUser(true)}
                sx={{ mt: 1 }}
              >
                Verificar ahora
              </Button>
            </Alert>
          )}
          <Tabs
            value={tabIndex}
            onChange={handleTabChange}
            sx={{ marginBottom: 3 }}
            aria-label="profile tabs"
          >
            <Tab label="Información Personal" />
            <Tab label="Mis Vehículos" />
          </Tabs>
          {tabIndex === 0 && (
            <Paper sx={{ mr: 5, minWidth: 600 }}>
              <Box
                display={"flex"}
                flexDirection={"column"}
                alignItems="center"
                p={3}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    padding: 2,
                    mb: 2,
                    width: "-webkit-fill-available",
                    gap: 1,
                  }}
                >
                  <Avatar
                    sx={{ bgcolor: "#226668", width: 70, height: 70, mr: 2 }}
                  >
                    {getInitials(user.name, user.surname)}
                  </Avatar>
                  <Typography
                    variant="h4"
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    {user.name} {user.surname}{" "}
                    {isAccountVerified ? (
                      <Tooltip title="Validado">
                        <CheckCircleIcon color="success" sx={{ ml: 1 }} />
                      </Tooltip>
                    ) : (
                      <Tooltip title="No validado" placement="right">
                        <CancelIcon color="error" sx={{ ml: 1 }} />
                      </Tooltip>
                    )}
                  </Typography>
                </Box>

                <Grid2
                  container
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    width: "100%",
                    flexWrap: "nowrap",
                    justifyContent: "space-evenly",
                    padding: 2,
                  }}
                >
                  <Grid2 item xs={6}>
                    <Grid2
                      container
                      xs={12}
                      sx={{ justifyContent: "space-between" }}
                    >
                      <Typography variant="subtitle1">
                        <strong>Email:</strong>
                      </Typography>
                    </Grid2>
                    <Grid2
                      container
                      xs={12}
                      sx={{ justifyContent: "space-between" }}
                    >
                      <Typography variant="subtitle1">
                        <strong>DNI:</strong>
                      </Typography>
                    </Grid2>
                    <Grid2
                      container
                      xs={12}
                      sx={{ justifyContent: "space-between" }}
                    >
                      <Typography variant="subtitle1">
                        <strong>Número de Trámite:</strong>{" "}
                      </Typography>
                    </Grid2>
                    <Grid2
                      container
                      xs={12}
                      sx={{ justifyContent: "space-between" }}
                    >
                      <Typography variant="subtitle1">
                        <strong>Fecha de Nacimiento:</strong>{" "}
                      </Typography>
                    </Grid2>
                    <Grid2
                      container
                      xs={12}
                      sx={{ justifyContent: "space-between" }}
                    >
                      <Typography variant="subtitle1">
                        <strong>Género:</strong>{" "}
                      </Typography>
                    </Grid2>
                    <Grid2
                      container
                      xs={12}
                      sx={{ justifyContent: "space-between" }}
                    >
                      <Typography variant="subtitle1">
                        <strong>Provincia:</strong>
                      </Typography>
                    </Grid2>
                    <Grid2
                      container
                      xs={12}
                      sx={{ justifyContent: "space-between" }}
                    >
                      <Typography variant="subtitle1">
                        <strong>Localidad:</strong>
                      </Typography>
                    </Grid2>
                    <Grid2
                      container
                      xs={12}
                      sx={{ justifyContent: "space-between" }}
                    >
                      <Typography variant="subtitle1">
                        <strong>Telefono:</strong>
                      </Typography>
                    </Grid2>
                  </Grid2>
                  <Grid2 item xs={6}>
                    <Typography variant="subtitle1">
                      {handleNull(user.email)}
                    </Typography>
                    <Typography variant="subtitle1">
                      {handleNull(user.nroDni)}
                    </Typography>
                    <Typography variant="subtitle1">
                      {handleNull(user.nroTramiteDni)}
                    </Typography>
                    <Typography variant="subtitle1">
                      {handleNull(
                        new Date(user.birthDate).toLocaleDateString()
                      )}
                    </Typography>
                    <Typography variant="subtitle1">
                      {handleNull(
                        user.gender === null
                          ? "Sin información aun"
                          : user.gender === "F"
                          ? "Femenino"
                          : "Masculino"
                      )}
                    </Typography>
                    <Typography variant="subtitle1">
                      {handleNull(user.province)}
                    </Typography>
                    <Typography variant="subtitle1">
                      {handleNull(user.locality)}
                    </Typography>
                    <Typography variant="subtitle1">
                      {handleNull(user.phoneNumber)}
                    </Typography>
                  </Grid2>
                </Grid2>

                <Button
                  sx={{ maxWidth: "max-content" }}
                  onClick={() => setIsDialogOpen(true)}
                >
                  Editar {<Edit sx={{ ml: 1 }} fontSize="22" />}
                </Button>
              </Box>
            </Paper>
          )}
          {tabIndex === 1 && (
            <Paper sx={{ mr: 5, minWidth: 600, padding: 3 }}>
              <MyVehicles
                vehicles={vehicles}
                onSave={(vehicle) => handleCreateVehicle(vehicle)}
                userId={user.id}
                profile={true}
                setVehicles={setVehicles}
              />
            </Paper>
          )}
        </Box>
      )}
      {verifyingUser && (
        <VerificationSteps
          onClose={() => setVerifyingUser(false)}
          open={verifyingUser}
          userId={user.id}
          setAccountVerified={setIsAccountVerified}
          setSuccessAlert={setShowAlert}
        />
      )}
      {
        <AlertCustom
          inProp={showAlert}
          timeout={500}
          msg={alertMsg}
          icon={
            alertSeverity === "success" ? <CheckCircleIcon /> : <ErrorOutline />
          }
          severity={alertSeverity}
        />
      }
      {
        <DialogCustom
          open={isDialogOpen}
          handleClose={() => setIsDialogOpen(false)}
          title="Editar perfil"
          dialogContent={
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                pt: 1,
                width: "30vw",
              }}
            >
              <Autocomplete
                options={getProvinces()}
                value={editedProvince}
                onChange={(event, newValue) =>
                  handleChange("province", newValue)
                }
                renderInput={(params) => (
                  <TextField {...params} label="Provincia" fullWidth />
                )}
              />
              <TextField
                fullWidth
                label="Localidad"
                value={editedLocality}
                onChange={(e) => handleChange("locality", e.target.value)}
              />
              <TextField
                fullWidth
                label="Email"
                required
                value={editedEmail}
                onChange={(e) => handleChange("email", e.target.value)}
                error={!!errors.email}
                helperText={errors.email}
              />
              <TextField
                fullWidth
                label="Teléfono"
                required
                value={editedPhoneNumber}
                onChange={(e) => handleChange("phoneNumber", e.target.value)}
                error={!!errors.phoneNumber}
                helperText={errors.phoneNumber}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={changePassword}
                    onChange={(e) => setChangePassword(e.target.checked)}
                  />
                }
                label="Cambiar contraseña"
              />
              {changePassword && (
                <>
                  <TextField
                    fullWidth
                    label="Contraseña actual"
                    type="password"
                    value={currentPassword}
                    onChange={(e) =>
                      handleChange("currentPassword", e.target.value)
                    }
                    error={!!errors.currentPassword}
                    helperText={errors.currentPassword}
                  />
                  <TextField
                    fullWidth
                    label="Nueva contraseña"
                    type="password"
                    value={newPassword}
                    onChange={(e) =>
                      handleChange("newPassword", e.target.value)
                    }
                    error={!!errors.newPassword}
                    helperText={errors.newPassword}
                  />
                </>
              )}
            </Box>
          }
          handleConfirm={handleEdit}
          showCancelButton={true}
        />
      }
    </>
  );
};

export default Profile;
