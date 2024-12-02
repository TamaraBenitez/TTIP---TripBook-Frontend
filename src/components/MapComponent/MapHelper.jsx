import { useEffect } from "react";
import { useMap } from "react-leaflet";

export default function MapHelper({ onMapLoad }) {
    const map = useMap();
    useEffect(() => {
      onMapLoad(map);
    }, [map, onMapLoad]);
    return null;
};