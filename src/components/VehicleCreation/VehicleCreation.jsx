import React, { useContext, useEffect, useState } from "react";
import {
  Autocomplete,
  TextField,
  Button,
  Box,
  CircularProgress,
} from "@mui/material";
import DialogCustom from "../DialogCustom/DialogCustom"; // Adjust the import path
import StoreContext from "../../store/storecontext";
import { getCarColors } from "../../utility/Utility";

const VehicleCreation = ({ showCreateCar, handleClose, onSave, userId }) => {
  const [loading, setLoading] = useState(true);
  const [vehicleData, setVehicleData] = useState([]);
  const [makes, setMakes] = useState([]);
  const [models, setModels] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedMake, setSelectedMake] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [licensePlate, setLicensePlate] = useState("");
  const [color, setColor] = useState();
  const store = useContext(StoreContext);
  useEffect(() => {
    if (showCreateCar) {
      fetchVehicleData();
    }
  }, [showCreateCar]);

  const fetchVehicleData = async () => {
    setLoading(true);
    try {
      const response  = await store.services.vehicleService.GetVehicleData();
      const records = response.data.records || [];

      const uniqueMakes = Array.from(
        new Set(records.map((record) => record.fields.make))
      ).map((make) => ({ label: make }));
      setMakes(uniqueMakes);

      setVehicleData(records); 
    } catch (error) {
      console.error("Error fetching vehicle data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMakeChange = (event, value) => {
    setSelectedMake(value);
    setSelectedModel(null); 
    setSelectedYear(null);

    if (value) {
      const filteredModels = Array.from(
        new Set(
          vehicleData
            .filter((record) => record.fields.make === value.label)
            .map((record) => record.fields.model)
        )
      ).map((model) => ({ label: model }));
      setModels(filteredModels);

      const filteredYears = Array.from(
        new Set(
          vehicleData
            .filter((record) => record.fields.make === value.label)
            .map((record) => record.fields.year)
        )
      ).map((year) => ({ label: year }));
      setYears(filteredYears);
    } else {
      setModels([]);
      setYears([]);
    }
  };

  const handleSave = () => {
    setLoading(true);
    const vehicleData = {
      model: selectedMake.label + " " + selectedModel?.label,
      year: parseInt(selectedYear.label),
      plateNumber: licensePlate,
      color: color.label,
      ownerId: userId
    };
    // store.services.vehicleService.CreateVehicle(vehicleData)
    // .then(()=>{
        onSave(vehicleData);
        setLoading(false);
        handleClose();
      // });
  };

  const dialogContent = (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2}}>
      {loading ? (
        <CircularProgress sx={{alignSelf:"center"}}/>
      ) : (
        <>
          <Autocomplete
            options={makes}
            getOptionLabel={(option) => option.label || ""}
            renderInput={(params) => (
              <TextField {...params} label="Marca" variant="outlined" />
            )}
            value={selectedMake}
            onChange={handleMakeChange}
            isOptionEqualToValue={(option, value) => option.label === value.label}
          />
          <Autocomplete
            options={models}
            getOptionLabel={(option) => option.label || ""}
            renderInput={(params) => (
              <TextField {...params} label="Modelo" variant="outlined" />
            )}
            value={selectedModel}
            onChange={(event, value) => setSelectedModel(value)}
            isOptionEqualToValue={(option, value) => option.label === value.label}
            disabled={!selectedMake}
          />
          <Autocomplete
            options={years}
            getOptionLabel={(option) => option.label || ""}
            renderInput={(params) => (
              <TextField {...params} label="Año" variant="outlined" />
            )}
            value={selectedYear}
            onChange={(event, value) => setSelectedYear(value)}
            isOptionEqualToValue={(option, value) => option.label === value.label}
            disabled={!selectedMake}
          />
          <TextField
            label="Placa"
            variant="outlined"
            value={licensePlate}
            onChange={(e) => setLicensePlate(e.target.value)}
          />
          <Autocomplete
            options={getCarColors()}
            getOptionLabel={(option) => option.label || ""}
            renderInput={(params) => (
              <TextField {...params} label="Color" variant="outlined" />
            )}
            renderOption={(props, option) => (
              <li {...props} style={{ display: 'flex', alignItems: 'center' }}>
                {/* Colored square */}
                <span
                  style={{
                    width: 16,
                    height: 16,
                    backgroundColor: option?.hex || "white",
                    borderRadius: 2,
                    marginRight: 8,
                    border: '1px solid #ccc',
                  }}
                ></span>
                {option.label}
              </li>
            )}
            value={color}
            onChange={(event, value) => setColor(value)}
            isOptionEqualToValue={(option, value) => option.label === value.label}
            disabled={!selectedMake}
          />
        </>
      )}
    </Box>
  );

  return (
    <DialogCustom
      open={showCreateCar}
      handleClose={handleClose}
      title="Registrar Vehículo"
      dialogContent={dialogContent}
      confirmButton={
        <Button
          onClick={handleSave}
          color="primary"
          variant="contained"
          disabled={
            loading ||
            !selectedMake ||
            !selectedModel ||
            !selectedYear ||
            !licensePlate
          }
        >
          Guardar
        </Button>
      }
      showCancelButton={true}
    />
  );
};

export default VehicleCreation;
