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
    <>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{ color: "#226668" }} />}
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
