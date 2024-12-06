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
  const [vehicleData, setVehicleData] = useState();
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

  useEffect(() => {
    if (vehicleData) {
      const uniqueMakes = Array.from(
        new Set(vehicleData.map((record) => record.fields.make))
      ).map((make) => ({ label: make }));
      setMakes(uniqueMakes);
    }
  }, [vehicleData]);

  useEffect(() => {
    if (selectedMake) {
      const uniqueModels = Array.from(
        new Set(
          vehicleData
            .filter((record) => record.fields.make === selectedMake.label)
            .map((record) => record.fields.model)
        )
      ).map((model) => ({ label: model }));
      setModels(uniqueModels);
    }
  }, [selectedMake]);

  useEffect(() => {
    if (selectedModel) {
      const sortedYears = Array.from(
        new Set(
          vehicleData
            .filter(
              (record) =>
                record.fields.make === selectedMake.label &&
                record.fields.model === selectedModel.label
            )
            .map((record) => record.fields.year)
        )
      )
        .sort((a, b) => b - a)
        .map((year) => ({ label: year }));
      setYears(sortedYears);
    }
  }, [selectedModel]);

  const fetchVehicleData = async () => {
    setLoading(true);
    try {
      const response = await store.services.vehicleService.GetVehicleData();
      const records = response.data.records || [];

      setVehicleData(records);
    } catch (error) {
      console.error("Error fetching vehicle data:", error);
    } finally {
      setLoading(false);
    }
  };
  const disableBtn = () =>{
    return loading ||
    !selectedMake ||
    !selectedModel ||
    !licensePlate ||
    !color
  }

  const handleMakeChange = (value) =>{
    setSelectedMake(value)
  }
  const handleSave = () => {
    setLoading(true);
    const vehicleData = {
      model: selectedMake.label + " " + selectedModel?.label,
      year: parseInt(selectedYear.label),
      plateNumber: licensePlate,
      color: color.label,
      ownerId: userId,
    };
    store.services.vehicleService.CreateVehicle(vehicleData).then((res) => {
      onSave(res.data);
      setLoading(false);
      handleClose();
    });
  };

  const dialogContent = (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
      {loading ? (
        <CircularProgress sx={{ alignSelf: "center" }} />
      ) : (
        <>
          <Autocomplete
            options={makes}
            getOptionLabel={(option) => option.label || ""}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Marca"
                variant="outlined"
              />
            )}
            
            onChange={(event, value) => handleMakeChange(value)}
            onInputChange={(event, value) => handleMakeChange({label:value})}
            isOptionEqualToValue={(option, value) =>
              option.label === value.label
            }
            freeSolo
          />
          <Autocomplete
            options={models}
            getOptionLabel={(option) => option.label || ""}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Modelo"
                variant="outlined"
              />
            )}
            onChange={(event, value) => setSelectedModel(value)}
            onInputChange={(event, value) => setSelectedModel({label:value})}
            isOptionEqualToValue={(option, value) =>
              option.label === value.label
            }
            freeSolo
          />
          <Autocomplete
            options={years}
            getOptionLabel={(option) => option.label || ""}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Año"
                variant="outlined"
              />
            )}
            onChange={(event, value) => setSelectedYear(value.label)}
            onInputChange={(event, value) => setSelectedYear({label:value})}
            isOptionEqualToValue={(option, value) =>
              option.label === value.label
            }
            freeSolo
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
              <li {...props} style={{ display: "flex", alignItems: "center" }}>
                <span
                  style={{
                    width: 16,
                    height: 16,
                    backgroundColor: option?.hex || "white",
                    borderRadius: 2,
                    marginRight: 8,
                    border: "1px solid #ccc",
                  }}
                ></span>
                {option.label}
              </li>
            )}
            onChange={(event, value) => setColor(value)}
            isOptionEqualToValue={(option, value) =>
              option.label === value.label
            }
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
            disableBtn()
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
