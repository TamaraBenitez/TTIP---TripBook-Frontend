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

export const sortedCoords = (start, route, mapInstance, newPoint = null) => {
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

export const calculateDistance = (map, latlng1, latlng2) => {
  return map.distance(latlng1, latlng2); // distance in meters
};

export const isNearest = (point1, point2, objective, map) => {
  return (
    calculateDistance(map, point1, objective) <
    calculateDistance(map, point2, objective)
  );
};

  // Map list of trip-coordinates entities to array of coordinates
  // returns array of coordinates sorted by start point cercany
export const mapTripCoordinates = (tripCoords) => {
    let start, end;
    let stops = [];
    if (tripCoords !== undefined) {
      for (let i = 0; i < tripCoords.length; i++) {
        const coord = coordinates[i];
        if (coord.isStart) start = [parseFloat(coord.latitude), parseFloat(coord.longitude)];
        else if (coord.isEnd) end = [parseFloat(coord.latitude), parseFloat(coord.longitude)];
        else stops.push([parseFloat(coord.latitude), parseFloat(coord.longitude)]);
      }
      return [start, ...stops, end];
    }
};
