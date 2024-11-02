import { useEffect } from "react";
import { useMap } from "react-leaflet";

export default function CenterMap({coordinates}) {
    if(coordinates){

        const map = useMap();
        
        useEffect(() => {
            if (coordinates !== null) {
                map.setView(coordinates);
            }
        }, [map, coordinates]);
        
        return null;
    }
}
