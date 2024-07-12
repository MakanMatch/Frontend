/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { useToast } from "@chakra-ui/react";
import configureShowToast from "../../components/showToast";

const ExpandedGoogleMaps = ({ lat, long }) => {
    const mapRef = useRef(null);
    const toast = useToast()
    const showToast = configureShowToast(toast)

    useEffect(() => {
        if (!lat || !long) {
            showToast("No coordinates found", "Failed to show Host's location on map", 3000, false, "info");
            return null;
        }
        const initializeMap = async () => {
            const loader = new Loader({
                apiKey: import.meta.env.VITE_GMAPS_API_KEY,
                version: "weekly",
                libraries: ["places"],
            });
            const { Map } = await loader.importLibrary("maps");
            const { AdvancedMarkerElement } = await window.google.maps.importLibrary("marker");
            const LatLong = { lat: lat, lng: long };
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
        };

        initializeMap().catch(() => {
            showToast("An error occured", "Failed to render Google Maps", 3000, false, "error");
            return;
        });
    }, [lat, long]);

    return (
        <div
            ref={mapRef}
            style={{ height: "83vh", width: "100%", borderRadius: "10px" }}
        />
    );
};

export default ExpandedGoogleMaps;
