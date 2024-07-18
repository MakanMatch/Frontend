/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { useToast } from "@chakra-ui/react";
import configureShowToast from "../../components/showToast";

const ExpandedGoogleMaps = ({ lat, long }) => {
    const mapRef = useRef(null);
    const toast = useToast();
    const showToast = configureShowToast(toast);

    useEffect(() => {
        const initializeMap = async () => {
            if (!mapRef.current || !lat || !long) {
                // Check if mapRef or coordinates are not available
                showToast("Invalid coordinates", "Failed to show Host's location on map", 3000, false, "info");
                return;
            }

            const loader = new Loader({
                apiKey: import.meta.env.VITE_GMAPS_API_KEY,
                version: "weekly",
                libraries: ["places"],
            });

            try {
                const { Map } = await loader.importLibrary("maps");
                const { AdvancedMarkerElement } = await window.google.maps.importLibrary("marker");

                const LatLong = { lat: lat, lng: long };

                // Check for valid latitude and longitude range
                if (lat < -90 || lat > 90 || long < -180 || long > 180) {
                    showToast("Invalid coordinates", "Failed to show Host's location on map", 3000, false, "info");
                    return;
                }

                const map = new Map(mapRef.current, {
                    center: LatLong,
                    zoom: 17,
                    mapId: import.meta.env.VITE_GMAPS_MAPID,
                    mapTypeControl: false,
                    streetViewControl: false,
                });

                new AdvancedMarkerElement({
                    position: LatLong,
                    map: map,
                    title: "Host's location",
                });
            } catch (error) {
                showToast("An error occurred", "Failed to render Google Maps", 3000, false, "error");
                console.error(error);
            }
        };

        initializeMap();
    }, [lat, long, showToast]);

    return (
        <div
            ref={mapRef}
            style={{ height: "83vh", width: "100%", minWidth: "371px", borderRadius: "10px" }}
        />
    );
};

export default ExpandedGoogleMaps;