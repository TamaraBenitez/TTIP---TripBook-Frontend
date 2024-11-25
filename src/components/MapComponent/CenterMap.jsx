import { useEffect } from "react";
import { useMap } from "react-leaflet";

export default function CenterMap({coordinates}) {
    if(coordinates && coordinates.length){

        const map = useMap();
        
        useEffect(() => {
            if (coordinates !== null && coordinates.length) {
                map.setView(coordinates);
            }
        }, [map, coordinates]);
        
        return null;
    }
}
