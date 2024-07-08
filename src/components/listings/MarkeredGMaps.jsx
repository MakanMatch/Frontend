/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { useToast } from "@chakra-ui/react";
import configureShowToast from "../../components/showToast";
import server from "../../networking";

const MarkeredGMaps = ({ addresses }) => {
    const mapRef = useRef(null);
    const toast = useToast()
    let coordinatesList = [];
    const showToast = configureShowToast(toast)

    useEffect(() => {
        if (addresses.length > 0) {
            console.log("Addresses received: ", addresses);
            addresses.forEach(async (address) => {
                const encodedAddress = encodeURIComponent(String(address));
                const apiKey = import.meta.env.VITE_GMAPS_API_KEY;
                const url = `https://maps.googleapis.com/maps/api/geocode/json?address="${encodedAddress}"&key=${apiKey}`;
                try {
                    const response = await server.get(url);
                    const location = response.data.results[0].geometry.location;
                    console.log("Address converted to coordinates: ", location)
                    coordinatesList.push(location);
                    console.log("Coordinates list: ", coordinatesList); // testing
                    return;
                } catch (error) {
                    showToast("An error occured", "Failed to generate maps coordinates", "error", 3000);
                    return null;
                }
            });

            const initializeMap = async () => {
                const loader = new Loader({
                    apiKey: import.meta.env.VITE_GMAPS_API_KEY,
                    version: "weekly",
                    libraries: ["places"],
                });
                const { Map } = await loader.importLibrary("maps");
                const { AdvancedMarkerElement } = await window.google.maps.importLibrary("marker");
                const validCoordinates = coordinatesList.filter(({ lat, lng }) => { 
                    if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
                        console.log("Valid coordinates: ", lat, lng)
                        return true
                    } else {
                        console.log("Invalid coordinates: ", lat, lng)
                        return false
                    }
                });
                console.log("Consolidated valid coordinates:", validCoordinates)
                if (validCoordinates.length === 0) {
                    console.log("No valid coordinates found")
                    new Map(mapRef.current, {
                        center: { lat: 1.3521, lng: 103.8198 },
                        zoom: 11,
                        mapId: "DEMO_MAP_ID",
                        mapTypeControl: false,
                        streetViewControl: false,
                    });
                } else {
                    console.log(validCoordinates.length, " valid coordinates found")
                    const map = new Map(mapRef.current, {
                        center: validCoordinates[0],
                        zoom: 11,
                        mapId: "DEMO_MAP_ID",
                        mapTypeControl: false,
                        streetViewControl: false,
                    });
                    const demoCoordinates = { lat: 1.4284751, lng: 103.8359705 }
                    const markerElement = new AdvancedMarkerElement({
                        position: demoCoordinates,
                        map: map
                    })
                    console.log(markerElement)
                    validCoordinates.forEach(({ lat, lng }) => {
                        new AdvancedMarkerElement({
                            position: { lat, lng },
                            map: map,
                        });
                    });
                }
            };

            initializeMap().catch((e) => {
                console.error("Error loading Google Maps", e);
            });
        }
    }, [addresses]);

    return (
        <div
            ref={mapRef}
            style={{ height: "83vh", width: "100%", borderRadius: "10px" }}
        />
    );
};

export default MarkeredGMaps;