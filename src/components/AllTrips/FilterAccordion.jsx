import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Button,
  Box,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useState } from "react";

function FilterAccordion({ filters, setFilters, applyFilters, resetFilters }) {
  const [open, setOpen] = useState(false);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  const handleReset = () => {
    resetFilters();
    setOpen(false);
  };

  const handleApplyFilters = () => {
    applyFilters();
    setOpen(false);
  };

  return (
    <>
      <Accordion expanded={open}>
        <AccordionSummary
          expandIcon={
            <Button onClick={() => setOpen(!open)}>
              <ExpandMoreIcon sx={{ color: "#226668" }} />
            </Button>
          }
          aria-controls="filters-content"
          id="filters-header"
        >
          <Typography sx={{ color: "#226668", fontWeight: 500 }}>
            Administrar filtros
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Origen"
              name="origin"
              value={filters.origin}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Destino"
              name="destination"
              value={filters.destination}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Fecha de Inicio"
              name="startDate"
              type="date"
              value={filters.startDate}
              onChange={handleInputChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Button variant="outlined" onClick={handleReset}>
                Restablecer Filtros
              </Button>
              <Button variant="contained" onClick={handleApplyFilters}>
                Aplicar Filtros
              </Button>
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>{" "}
    </>
  );
}

export default FilterAccordion;
