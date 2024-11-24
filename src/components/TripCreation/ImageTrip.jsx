import React, { useState } from "react";
import { Button, Grid, Typography } from "@mui/material";

const mockImages = [
  "https://placekitten.com/150/150",
  "https://via.placeholder.com/150/92c952",
  "https://via.placeholder.com/150/771796",
  "https://via.placeholder.com/150/d32776",
  "https://via.placeholder.com/150/24f355",
];

export default function ImageSelectionStep() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [selectedMockImage, setSelectedMockImage] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      setUploadedImage(file);
      console.log(file.name);
      setSelectedMockImage(null);
    }
  };

  // Manejar selección/deselección de imagen mockeada
  const handleMockImageSelect = (url) => {
    if (selectedMockImage === url) {
      setSelectedMockImage(null); // Deseleccionar imagen
      console.log("a", uploadedImage);
      console.log("a", selectedMockImage);
    } else {
      setSelectedMockImage(url); // Seleccionar nueva imagen
      setUploadedImage(null); // Limpiar imagen subida
    }
  };

  const getFinalImageValue = () => {
    if (uploadedImage) {
      return uploadedImage.name; // Mostrar nombre del archivo subido
    } else if (selectedMockImage) {
      return selectedMockImage; // Mostrar URL de imagen seleccionada
    }
    return null; // Si no hay nada seleccionado
  };

  return (
    <div>
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
            disabled={!!selectedMockImage} // Deshabilitar si hay una imagen mockeada seleccionada
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

        {/* Listado de imágenes mockeadas */}
        <Grid item xs={12}>
          <Typography variant="body1" gutterBottom>
            O elegir una imagen del listado
          </Typography>
          <Grid container spacing={2}>
            {mockImages.map((url) => (
              <Grid item key={url}>
                <img
                  src={url}
                  alt="mock"
                  width={100}
                  height={100}
                  style={{
                    border:
                      selectedMockImage === url
                        ? "3px solid #3f51b5"
                        : "1px solid #ccc",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                  onClick={() => handleMockImageSelect(url)}
                />
              </Grid>
            ))}
          </Grid>
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
    </div>
  );
}
