/* eslint-disable react/prop-types */
import { useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";

const GoogleMaps = ({ lat, long }) => {
    const mapRef = useRef(null);

    useEffect(() => {
        const initializeMap = async () => {
            try {
                const loader = new Loader({
                    apiKey: import.meta.env.VITE_GMAPS_API_KEY,
                    version: "weekly",
                    libraries: ["places"],
                });
                const { Map } = await loader.importLibrary("maps");
                const { AdvancedMarkerElement } = await window.google.maps.importLibrary("marker");
                const LatLong = { lat: lat, lng: long };
                const map = new Map(mapRef.current, {
                    center: LatLong,
                    zoom: 12,
                    mapId: "DEMO_MAP_ID",
                });

                const geocoder = new window.google.maps.Geocoder();
                geocoder.geocode({ location: LatLong }, (results, status) => {
                    if (status === "OK" && results[0]) {
                        new AdvancedMarkerElement({
                            position: LatLong,
                            map: map,
                            title: "Host's location",
                        });
                    } else {
                        // Set default location to Singapore's coordinates
                        const defaultLatLong = { lat: 1.3521, lng: 103.8198 };
                        map.setCenter(defaultLatLong);
                        new AdvancedMarkerElement({
                            position: defaultLatLong,
                            map: map,
                            title: "Default location",
                        });
                    }
                });
            } catch (e) {
                console.error("Error loading Google Maps", e);
            }
        };

        initializeMap();
    }, [lat, long]);

    return (
        <div
            ref={mapRef}
            style={{ height: "80vh", width: "100%", borderRadius: "10px" }}
        />
    );
};

export default GoogleMaps;