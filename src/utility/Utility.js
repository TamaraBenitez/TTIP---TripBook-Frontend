import { MAP_MAX_ZOOM } from "./Constants";

export const formatDate = (date, time) => {
  const dateObj = new Date(date);

  const dateOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };
  const formattedDate = dateObj.toLocaleDateString(undefined, dateOptions);

  let formattedTime = "";
  if (time) {
    const timeObj = new Date(time);

    // Check if time is valid
    if (isNaN(timeObj.getTime())) {
      return `${formattedDate} - Invalid Time`;
    }
    const timeOptions = { hour: "2-digit", minute: "2-digit", hour12: false };
    formattedTime = timeObj.toLocaleTimeString(undefined, timeOptions);
  }

  return `${formattedDate} ${formattedTime}`.trim();
};

export const sortedCoordsWithNewPoint = (
  start,
  route,
  mapInstance,
  newPoint
) => {
  var sorted = [];
  var newPointAdded = false;
  for (let point = 0; point < route.length; point++) {
    const currentPoint = route[point];
    const currentCoords =
      currentPoint instanceof Array ? currentPoint : currentPoint.coords;
    const startCoords = start instanceof Array ? start : start.coords;
    const newPointCoords =
      newPoint instanceof Array ? newPoint : newPoint.coords;
    if (isNearest(currentCoords, newPointCoords, startCoords, mapInstance)) {
      sorted.push(currentPoint);
    } else if (!newPointAdded) {
      sorted.push(newPoint);
      newPointAdded = true;
      // Add the remaining points and break out of the loop
      sorted.push(...route.slice(point));
      break;
    }
  }
  return [start, ...sorted];
};

export const calculateMapDistance = (map, latlng1, latlng2) => {
  return map.distance(latlng1, latlng2); // distance in meters
};

export const isNearest = (point1, point2, objective, map) => {
  return (
    calculateMapDistance(map, point1, objective) <
    calculateMapDistance(map, point2, objective)
  );
};
export const calculateDistance = (point1, point2) => {
  const latDiff = point1[0] - point2[0];
  const lonDiff = point1[0] - point2[0];
  return Math.sqrt(latDiff * latDiff + lonDiff * lonDiff);
};

export const sortedCoords = (start, route) => {
  const startCoords = Array.isArray(start) ? start : start.coords;
  const sorted = route.slice().sort((a, b) => {
    const coordsA = Array.isArray(a) ? a : a.coords;
    const coordsB = Array.isArray(b) ? b : b.coords;

    const distanceA = calculateDistance(startCoords, coordsA);
    const distanceB = calculateDistance(startCoords, coordsB);

    return distanceA - distanceB; // Sort in ascending order of distance
  });
  return [start, ...sorted];
};
// Map list of trip-coordinate entities to array of coordinates
// returns array of coordinates sorted by start point cercany
export const mapTripCoordinates = (tripCoords) => {
  let start, end;
  let stops = [];
  if (tripCoords !== undefined) {
    for (let i = 0; i < tripCoords.length; i++) {
      const coord = tripCoords[i];
      if (coord.isStart)
        start = [parseFloat(coord.latitude), parseFloat(coord.longitude)];
      else if (coord.isEnd)
        end = [parseFloat(coord.latitude), parseFloat(coord.longitude)];
      else
        stops.push([parseFloat(coord.latitude), parseFloat(coord.longitude)]);
    }
    if (start) {
      return [start, ...stops, end];
    } else return [...stops, end];
  }
};

export const reverseGeocode = (
  geocoder,
  lat,
  lng,
  callback,
  specific = false
) => {
  //Given latitude and longitude will reverse geocode and call the callback function with the result

  geocoder.reverse({ lat, lng }, MAP_MAX_ZOOM, (results) => {
    if (results.length > 0) {
      const addressObtained = results[0].properties.address;
      if (specific && addressObtained["display_name"]) {
        callback({
          address: addressObtained["display_name"],
          coords: [lat, lng],
        });
      } else if (specific) {
        var target = addressObtained["neighbourhood"]
          ? `${addressObtained["neighbourhood"]}, `
          : " ";
        target += addressObtained["postcode"]
          ? `${addressObtained["postcode"]}, `
          : " ";
        target += addressObtained["suburb"]
          ? `${addressObtained["suburb"]}, `
          : " ";
        target += addressObtained["town"]
          ? `${addressObtained["town"]}, `
          : " ";
        target += `${target}${addressObtained["state_district"]}, ${addressObtained["state"]}`;
        callback({ address: target, coords: [lat, lng] });
      }

      if (addressObtained["city"]) {
        callback({ address: addressObtained["city"], coords: [lat, lng] });
      } else if (addressObtained["state_district"]) {
        callback({
          address: `${addressObtained.state_district}, ${addressObtained.state}`,
          coords: [lat, lng],
        });
      }
    } else {
      callback({ address: "", coords: [lat, lng] });
    }
  });
};

export const roundToDecimals = (value, decimals) => {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
};

export const areCoordsEqual = (coord1, coord2, decimals = 4) => {
  const [lat1, lng1] = coord1;
  const [lat2, lng2] = coord2;
  return (
    roundToDecimals(lat1, decimals) === roundToDecimals(lat2, decimals) &&
    roundToDecimals(lng1, decimals) === roundToDecimals(lng2, decimals)
  );
};

export const getCarColors = () => {
  return [
    { label: "Verde claro", hex: "#90ee90" },
    { label: "Verde lima", hex: "#32cd32" },
    { label: "Verde oliva claro", hex: "#c4d600" },

    { label: "Verde oscuro", hex: "#006400" },
    { label: "Verde bosque", hex: "#228b22" },
    { label: "Verde esmeralda", hex: "#50c878" },
    { label: "Verde jade", hex: "#00a86b" },
    { label: "Verde musgo", hex: "#8a9a5b" },

    { label: "Azul claro", hex: "#add8e6" },
    { label: "Azul bebé", hex: "#89cff0" },
    { label: "Azul perla", hex: "#b0e0e6" },
    { label: "Azul hielo", hex: "#f0f8ff" },

    { label: "Azul oscuro", hex: "#00008b" },
    { label: "Azul marino", hex: "#000080" },
    { label: "Azul real", hex: "#4169e1" },
    { label: "Azul zafiro", hex: "#0f52ba" },
    { label: "Azul petróleo", hex: "#004953" },

    { label: "Morado", hex: "#800080" },
    { label: "Lavanda", hex: "#e6e6fa" },
    { label: "Púrpura", hex: "#6a0dad" },
    { label: "Lila", hex: "#c8a2c8" },
    { label: "Orquídea", hex: "#da70d6" },

    { label: "Rosa", hex: "#ffc0cb" },
    { label: "Rosa fuerte", hex: "#ff69b4" },
    { label: "Rosa pastel", hex: "#ffd1dc" },
    { label: "Fucsia", hex: "#ff00ff" },
    { label: "Rosa salmón", hex: "#fa8072" },

    { label: "Blanco", hex: "#ffffff" },
    { label: "Blanco humo", hex: "#f5f5f5" },
    { label: "Blanco marfil", hex: "#fffff0" },

    { label: "Negro", hex: "#000000" },
    { label: "Negro carbón", hex: "#36454f" },

    { label: "Rojo", hex: "#ff0000" },
    { label: "Rojo cereza", hex: "#de3163" },
    { label: "Rojo carmesí", hex: "#dc143c" },
    { label: "Bordó", hex: "#800020" },

    { label: "Amarillo", hex: "#ffff00" },
    { label: "Amarillo oro", hex: "#ffd700" },
    { label: "Amarillo pastel", hex: "#fdfd96" },

    { label: "Naranja", hex: "#ffa500" },
    { label: "Naranja quemado", hex: "#cc5500" },
    { label: "Naranja coral", hex: "#ff7f50" },
    { label: "Naranja melón", hex: "#fca985" },
    { label: "Naranja pastel", hex: "#ffcc99" },

    { label: "Gris", hex: "#808080" },
    { label: "Gris claro", hex: "#d3d3d3" },
    { label: "Gris oscuro", hex: "#2f4f4f" },
    { label: "Gris azulado", hex: "#708090" },
    { label: "Gris pizarra", hex: "#556b2f" },
  ];
};

export const getProvinces = () => {
  return [
    "Buenos Aires",
    "Catamarca",
    "Chaco",
    "Chubut",
    "Córdoba",
    "Corrientes",
    "Entre Ríos",
    "Formosa",
    "Jujuy",
    "La Pampa",
    "La Rioja",
    "Mendoza",
    "Misiones",
    "Neuquén",
    "Río Negro",
    "Salta",
    "San Juan",
    "San Luis",
    "Santa Cruz",
    "Santa Fe",
    "Santiago del Estero",
    "Tierra del Fuego",
    "Tucumán",
  ];
};
