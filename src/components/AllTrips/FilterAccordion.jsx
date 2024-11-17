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

function FilterAccordion({ filters, setFilters, applyFilters, resetFilters }) {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  return (
    <Accordion expanded={true}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="filters-content"
        id="filters-header"
      >
        <Typography>Filtros</Typography>
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
            <Button variant="outlined" onClick={resetFilters}>
              Restablecer Filtros
            </Button>
            <Button variant="contained" onClick={applyFilters}>
              Aplicar Filtros
            </Button>
          </Box>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}

export default FilterAccordion;
