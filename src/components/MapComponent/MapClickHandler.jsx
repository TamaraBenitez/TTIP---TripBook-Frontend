import { useMapEvents } from "react-leaflet";

export default function MapClickHandler({ handleNewMarker }) {
  useMapEvents({
      click: (e) => {
          const newPoint = [e.latlng.lat, e.latlng.lng];
          handleNewMarker(newPoint);
      },
  });
  return null;
}
  