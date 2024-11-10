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

export const sortedCoordsWithNewPoint = (start, route, mapInstance, newPoint) => {
  var sorted = [];
  var newPointAdded = false;
  for (let point = 0; point < route.length; point++) {
    const currentPoint = route[point];
    if (isNearest(currentPoint, newPoint, start, mapInstance)) {
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
  // Sort the route based on the distance to the start point
  const sorted = route.slice().sort((a, b) => {
    const distanceA = calculateDistance(start, a);
    const distanceB = calculateDistance(start, b);
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
        if (coord.isStart) start = [parseFloat(coord.latitude), parseFloat(coord.longitude)];
        else if (coord.isEnd) end = [parseFloat(coord.latitude), parseFloat(coord.longitude)];
        else stops.push([parseFloat(coord.latitude), parseFloat(coord.longitude)]);
      }
      if (start){
        return [start, ...stops, end];
      } else return [...stops, end];      
    }
};
