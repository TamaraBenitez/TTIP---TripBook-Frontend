import { MAP_MAX_ZOOM } from "./Constants";

export const formatDate = (date, time) => {
  const dateObj = new Date(date);

  // Check if date is valid
  if (isNaN(dateObj.getTime())) {
    return "Invalid Date";
  }

  const dateOptions = { year: "numeric", month: "long", day: "numeric" };
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

  geocoder.reverse(
    { lat, lng },
    MAP_MAX_ZOOM,
    (results) => {
      if (results.length > 0) {
        const addressObtained = results[0].properties.address; 
         if(specific && addressObtained["display_name"]) {
          callback({ address: addressObtained["display_name"], coords: [lat, lng] });
        } else if(specific){
          var target = addressObtained["neighbourhood"] ? `${addressObtained["neighbourhood"]}, `: " ";
          target += addressObtained["postcode"] ? `${addressObtained["postcode"]}, ` : " ";
          target += addressObtained["suburb"] ? `${addressObtained["suburb"]}, ` : " ";
          target += addressObtained["town"] ? `${addressObtained["town"]}, ` : " ";
          target +=  `${target}${addressObtained["state_district"]}, ${addressObtained["state"]}`;
          callback({ address: target, coords: [lat, lng] });
        }
        
        if(addressObtained["city"]) {
          callback({ address: addressObtained["city"], coords: [lat, lng] });
        }  else if (addressObtained["state_district"]) {
          callback({
            address: `${addressObtained.state_district}, ${addressObtained.state}`,
            coords: [lat, lng],
          });
        }
      } else {
        callback({ address: "", coords: [lat, lng] });
      }
    }
  );
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

