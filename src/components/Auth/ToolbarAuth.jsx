import Compass from "../../assets/5796.svg";
import { SvgIcon } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

const ToolbarAuth = ({ titleButton, navigateTo }) => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="relative" sx={{ zIndex: 1000, marginBottom:10}}>
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <SvgIcon sx={{ fill: "white" }}>
              <image href={Compass} height="100%" />
            </SvgIcon>
            <Typography
              variant="h6"
              noWrap
              sx={{
                ml: 1, // Margen izquierdo para espaciar el logo y el texto
                display: { xs: "none", md: "flex" },
                fontFamily: "monospace",
                fontWeight: 700,
                color: "inherit",
                textDecoration: "none",
              }}
            >
              TripBook
            </Typography>
          </Box>
          <Button color="inherit" onClick={()=>window.location.href = navigateTo}>
            {titleButton}
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default ToolbarAuth;
