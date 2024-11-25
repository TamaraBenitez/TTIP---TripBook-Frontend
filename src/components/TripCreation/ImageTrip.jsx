import { useState, useContext, useEffect } from "react";
import { Button, Grid, Typography, IconButton } from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import Skeleton from "@mui/material/Skeleton";
import StoreContext from "../../store/storecontext";

export default function ImageSelectionStep() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [selectedMockImage, setSelectedMockImage] = useState(null);
  const [images, setImages] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 4;
  const store = useContext(StoreContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    store.services.tripService
      .GetImagesUrls()
      .then((response) => {
        setImages(response.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      setUploadedImage(file);
      setSelectedMockImage(null);
    }
  };

  const handleMockImageSelect = (url) => {
    setSelectedMockImage(url === selectedMockImage ? null : url);
    setUploadedImage(null);
  };

  // Calcular las imágenes para mostrar según la página actual
  const paginatedImages = images.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const getFinalImageValue = () => {
    if (uploadedImage) return uploadedImage.name;
    if (selectedMockImage) return selectedMockImage;
    return null;
  };

  const handleNextPage = () => {
    if ((currentPage + 1) * itemsPerPage < images.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div>
      <Grid justifyContent={"center"} alignItems={"center"}>
        <Typography variant="h6" gutterBottom>
          Selecciona o sube una imagen
        </Typography>

        <Grid container spacing={3}>
          {/* Subida de imagen */}
          <Grid item xs={12}>
            <Typography variant="body1" gutterBottom>
              Subir imagen
            </Typography>
            <Button
              variant="contained"
              component="label"
              disabled={!!selectedMockImage}
            >
              Subir
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageUpload}
              />
            </Button>
            {uploadedImage && (
              <Typography
                variant="body2"
                color="textSecondary"
                style={{ marginTop: "10px" }}
              >
                Imagen subida: {uploadedImage.name}
              </Typography>
            )}
          </Grid>

          {/* Listado de imágenes paginadas */}
          <Grid item xs={12}>
            <Typography variant="body1" gutterBottom>
              O elegir una imagen del listado
            </Typography>
            <Grid container spacing={2} justifyContent="center">
              {loading
                ? Array.from({ length: itemsPerPage }).map((_, index) => (
                    <Grid item key={index}>
                      <Skeleton
                        variant="rectangular"
                        width={100}
                        height={100}
                        style={{ borderRadius: "5px" }}
                      />
                    </Grid>
                  ))
                : paginatedImages.map((image) => (
                    <Grid item key={image.imageUrl}>
                      <img
                        src={image.imageUrl}
                        alt="mock"
                        width={100}
                        height={100}
                        style={{
                          border:
                            selectedMockImage === image.imageUrl
                              ? "3px solid #3f51b5"
                              : "1px solid #ccc",
                          borderRadius: "5px",
                          cursor: "pointer",
                          transition:
                            "transform 0.3s ease, box-shadow 0.3s ease",
                          transform:
                            selectedMockImage === image.imageUrl
                              ? "scale(1.2)"
                              : "scale(1)",
                          boxShadow:
                            selectedMockImage === image.imageUrl
                              ? "0px 4px 15px rgba(0, 0, 0, 0.2)"
                              : "none",
                        }}
                        onClick={() => handleMockImageSelect(image.imageUrl)}
                      />
                    </Grid>
                  ))}
            </Grid>
          </Grid>

          {/* Controles de paginación */}
          <Grid item xs={12} style={{ marginTop: "20px", textAlign: "center" }}>
            <IconButton
              onClick={handlePrevPage}
              disabled={currentPage === 0}
              size="large"
            >
              <ArrowBack />
            </IconButton>
            <Typography
              variant="body2"
              display="inline"
              style={{ margin: "0 10px" }}
            >
              Página {currentPage + 1} de{" "}
              {Math.ceil(images.length / itemsPerPage)}
            </Typography>
            <IconButton
              onClick={handleNextPage}
              disabled={(currentPage + 1) * itemsPerPage >= images.length}
              size="large"
            >
              <ArrowForward />
            </IconButton>
          </Grid>
        </Grid>

        {/* Valor seleccionado */}
        <Grid item xs={12} style={{ marginTop: "20px" }}>
          <Typography variant="body1">
            Imagen seleccionada: {getFinalImageValue() ? "Sí" : "No"}
          </Typography>
          {getFinalImageValue() && (
            <Typography variant="body2">
              {uploadedImage
                ? `Archivo subido: ${uploadedImage.name}`
                : `URL seleccionada: ${selectedMockImage}`}
            </Typography>
          )}
        </Grid>
      </Grid>
    </div>
  );
}
