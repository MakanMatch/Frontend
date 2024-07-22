/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader } from "@googlemaps/js-api-loader";
import { Skeleton, useToast } from "@chakra-ui/react";
import configureShowToast from "../showToast";

const StaticGMaps = ({
    coordinates,
    style
}) => {
    const mapRef = useRef(null);
    const [mapLoaded, setMapLoaded] = useState(false);
    const toast = useToast();
    const showToast = configureShowToast(toast)

    useEffect(() => {
        const InitializeMap = async (validCoordinates) => {
            const loader = new Loader({
                apiKey: import.meta.env.VITE_GMAPS_API_KEY,
                version: "weekly",
                libraries: ["places"],
            });
            const { Map } = await loader.importLibrary("maps");
            const { AdvancedMarkerElement } = await window.google.maps.importLibrary("marker");

            if (mapRef.current) {
                var coords = {};
                if (!validCoordinates) {
                    // Centre of Singapore
                    coords.lat = 1.3621
                    coords.lng = 103.8198
                } else {
                    // Centre as marker location
                    coords.lat = validCoordinates.lat
                    coords.lng = validCoordinates.lng
                }

                const map = new Map(mapRef.current, {
                    center: coords,
                    zoom: 15,
                    mapId: import.meta.env.VITE_GMAPS_MAPID,
                    mapTypeControl: false,
                    streetViewControl: false,
                });

                const marker = new AdvancedMarkerElement({
                    position: coords,
                    map: map
                });
                setMapLoaded(true);
            }
        };

        try {
            InitializeMap(coordinates);
        } catch (error) {
            showToast("An error occurred", "Failed to render Google Maps", "error", 3000, false);
            console.log("Failed to render Static Single Marker GMaps; error: " + error)
        }
    }, [coordinates, showToast]);

    return (
        <>
            <Skeleton isLoaded={mapLoaded} fadeDuration={1} style={{ borderRadius: "10px" }}>
                <div
                    ref={mapRef}
                    style={style}
                />
            </Skeleton>
        </>
    );
};

export default StaticGMaps;