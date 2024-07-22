/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { useToast } from "@chakra-ui/react";

const ExpandedGoogleMaps = ({ title, lat, long }) => {
    const mapRef = useRef(null);
    const toast = useToast();

    function displayToast(title, description, status, duration, isClosable) {
        toast.closeAll();
        toast({
            title: title,
            description: description,
            status: status,
            duration: duration,
            isClosable: isClosable
        });
    }

    useEffect(() => {
        const initializeMap = async () => {
            if (!mapRef.current || !lat || !long) {
                // Check if mapRef or coordinates are not available
                displayToast("Invalid coordinates", "Failed to show Host's location on map", "info", 3000, false);
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
                    displayToast("Invalid coordinates", "Failed to show Host's location on map", "info", 3000, false);
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
                    title: title,
                });
            } catch (error) {
                displayToast("An error occurred", "Failed to render Google Maps", "error", 3000, false);
                console.error(error);
            }
        };

        initializeMap();
    }, [lat, long, displayToast]);

    return (
        <div
            ref={mapRef}
            style={{ height: "83vh", width: "100%", minWidth: "371px", borderRadius: "10px" }}
        />
    );
};

export default ExpandedGoogleMaps;