import { Grid, Typography, Box } from "@mui/material";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Import the carousel CSS
import markersImages from "../assets/markersImage.png";
import people from "../assets/people.webp";
import ahorro from "../assets/ahorro.webp";

const images = [
  {
    imgPath: markersImages,
    title: "Crea / unite a un viaje",
    label:
      "Podras crear o unirte a un viaje desde un punto de partida hacia un punto de destino. Ten en cuenta que para crear un viaje es necesario tener algun vehiculo.",
  },
  {
    imgPath: people,
    title: "Explora nuevas personas",
    label: "Conecta con otros viajeros y explora nuevas amistades.",
  },
  {
    imgPath: ahorro,
    title: "Ahorra dinero",
    label: "Compartir viajes te permite ahorrar costos en combustible y más.",
  },
];

const Home = () => {
  return (
    <Box
      sx={{
        width: "80%",
        margin: "auto",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      {/* Título principal */}
      <Typography
        variant="h3"
        component="h1"
        gutterBottom
        sx={{ fontWeight: "bold", color: "#2c3e50" }}
      >
        ¡Bienvenido a TripBook!
      </Typography>

      {/* Subtítulo */}
      <Typography
        variant="subtitle1"
        gutterBottom
        sx={{ fontSize: "1.2rem", color: "#7f8c8d", marginBottom: "40px" }}
      >
        ¿Qué puede hacer TripBook por vos?
      </Typography>

      {/* Carrusel */}
      <Box
        sx={{
          width: "100%",
          height: "80vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Grid container sx={{ height: "100%" }}>
          <Carousel
            showArrows={true}
            showStatus={false}
            showThumbs={false}
            infiniteLoop
            autoPlay
            interval={3000}
            emulateTouch
            stopOnHover
            dynamicHeight={false}
            showIndicators={true}
          >
            {images.map((step, index) => (
              <Grid container key={index} sx={{ height: "100%" }}>
                <Grid item xs={12} sm={6}>
                  {/* Left side with image */}
                  <Box
                    component="img"
                    sx={{
                      height: "100%",
                      width: "100%",
                      objectFit: "cover", // Ajusta la imagen al contenedor
                    }}
                    src={step.imgPath}
                    alt={step.label}
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 2,
                    backgroundColor: "#f0f0f0",
                  }}
                >
                  {/* Right side with text */}
                  <Typography
                    variant="h5"
                    component="div"
                    align="center"
                    sx={{
                      fontWeight: "bold",
                      color: "#34495e",
                      marginBottom: "16px", // Espacio entre título y descripción
                    }}
                  >
                    {step.title}
                  </Typography>

                  {/* Descripción del paso */}
                  <Typography
                    variant="body1"
                    align="center"
                    sx={{
                      color: "#7f8c8d",
                      lineHeight: 1.6,
                      fontSize: "1.1rem",
                    }}
                  >
                    {step.label}
                  </Typography>
                </Grid>
              </Grid>
            ))}
          </Carousel>
        </Grid>
      </Box>
    </Box>
  );
};

export default Home;
