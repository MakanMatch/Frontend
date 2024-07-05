/* eslint-disable react/prop-types */
import { useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";

const GoogleMaps = ({ lat, long }) => {
    const mapRef = useRef(null);

    useEffect(() => {
        const initializeMap = async () => {
            const loader = new Loader({
                apiKey: import.meta.env.VITE_GMAPS_API_KEY,
                version: "weekly",
                libraries: ["places"],
            });
            await loader.load().then(async () => {
                const { Map } = await loader.importLibrary("maps");
                const LatLong = { lat: lat, lng: long };
                const map = new Map(mapRef.current, {
                    center: LatLong,
                    zoom: 17,
                });
                new window.google.maps.Marker({
                    position: LatLong,
                    map: map,
                    title: "Hello Singapore!",
                });
            });
        };

        initializeMap().catch((e) => {
            console.error("Error loading Google Maps", e);
        });
    }, [lat, long]);

    return (
        <div
            ref={mapRef}
            style={{ height: "80vh", width: "100%", borderRadius: "10px" }}
        />
    );
};

export default GoogleMaps;
