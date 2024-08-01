/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { Skeleton, useToast } from "@chakra-ui/react";

const MarkeredGMaps = ({
    coordinatesList,
    listings,
    isSmallerThan1095,
    setActiveMarker,
    navigateToListing
}) => {
    const mapRef = useRef(null);
    const [mapLoaded, setMapLoaded] = useState(false);
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
        const InitializeMap = async (validCoordinates) => {
            const skipRemount = localStorage.getItem("mapRemountDenyOnModalOpen") ? "mapRemountDenyOnModalOpen" : localStorage.getItem("mapRemountDenyOnModalClose") ? "mapRemountDenyOnModalClose" : null;
            if (skipRemount) {
                localStorage.removeItem(skipRemount);
                console.log("Skipped map remount");
                return;
            }
            console.log("Initialised map");
            const loader = new Loader({
                apiKey: import.meta.env.VITE_GMAPS_API_KEY,
                version: "weekly",
                libraries: ["places"],
            });
            const { Map } = await loader.importLibrary("maps");
            const { AdvancedMarkerElement } = await window.google.maps.importLibrary("marker");

            if (mapRef.current) {
                const map = new Map(mapRef.current, {
                    center: { lat: 1.3621, lng: 103.8198 },
                    zoom: 11,
                    mapId: import.meta.env.VITE_GMAPS_MAPID,
                    mapTypeControl: false,
                    streetViewControl: false,
                });

                if (coordinatesList.length === 0 || validCoordinates.length === 0) {
                    setMapLoaded(true);
                    return map;
                } else {
                    const markers = {};

                    validCoordinates.forEach(({ lat, lng }, index) => {
                        const marker = new AdvancedMarkerElement({
                            position: { lat, lng },
                            map: map,
                        });

                        const key = `${lat},${lng}`;
                        if (!markers[key]) {
                            markers[key] = [];
                        }

                        markers[key].push({ marker, index, lat, lng });
                    });

                    Object.values(markers).forEach((markerGroup) => {
                        markerGroup.forEach(({ marker, index, lat, lng }) => {
                            marker.addListener("click", () => {
                                localStorage.setItem("mapRemountDenyOnModalOpen", true)
                                if (markerGroup.length === 1) {
                                    const listing = listings[index];
                                    navigateToListing(listing, lat, lng);
                                } else {
                                    setActiveMarker({ listings: markerGroup.map(({ index }) => listings[index]), lat, lng });
                                }
                            });
                        });
                    });
                    setMapLoaded(true);
                }
            }
        };

        try {
            const validCoordinates = coordinatesList.filter(
                ({ lat, lng }) =>
                    lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180
            );
            InitializeMap(validCoordinates);
        } catch (error) {
            displayToast("An error occurred", "Failed to render Google Maps", "error", 3000, false);
            console.error(error);
        }
    }, [coordinatesList, listings, displayToast]);

    return (
        <>
            <Skeleton isLoaded={mapLoaded} fadeDuration={1} style={{ borderRadius: "10px" }}>
                <div
                    ref={mapRef}
                    style={{
                        height: isSmallerThan1095 ? "45vh" : "83vh",
                        width: "100%",
                        borderRadius: "22px"
                    }}
                />
            </Skeleton>
        </>
    );
};

export default MarkeredGMaps;