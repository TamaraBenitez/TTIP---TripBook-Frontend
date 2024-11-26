import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Button,
  Box,
  Typography,
  MenuItem,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useState } from "react";

function FilterAccordion({
  filters,
  setFilters,
  applyFilters,
  resetFilters,
  showStatusFilter = false,
}) {
  const [open, setOpen] = useState(false);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
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
          <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
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
            {showStatusFilter && (
              <TextField
                label="Estado"
                name="status"
                value={filters.status || ""}
                onChange={handleInputChange}
                select
                fullWidth
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="pending">Pendiente</MenuItem>
                <MenuItem value="confirmed">Confirmado</MenuItem>
                <MenuItem value="canceled">Cancelado</MenuItem>
              </TextField>
            )}
            <Box
              sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}
            >
              <Button variant="outlined" onClick={resetFilters}>
                Restablecer Filtros
              </Button>
              <Button variant="contained" onClick={applyFilters}>
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
