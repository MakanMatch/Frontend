/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader } from "@googlemaps/js-api-loader";
import { Skeleton, useToast } from "@chakra-ui/react";

const MarkeredGMaps = ({
    coordinatesList,
    listings,
    isSmallerThan1095
}) => {
    const navigate = useNavigate();
    const mapRef = useRef(null);
    const [mapLoaded, setMapLoaded] = useState(false);
    const toast = useToast();

    function displayToast(title, description, status, duration, isClosable) {
        toast({
            title: title,
            description: description,
            status: status,
            duration: duration,
            isClosable: isClosable
        });
    }

    function getImageLink(listingID, imageName) {
        return `${import.meta.env.VITE_BACKEND_URL}/cdn/getImageForListing?listingID=${listingID}&imageName=${imageName}`;
    }

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
                const map = new Map(mapRef.current, {
                    center: { lat: 1.3621, lng: 103.8198 },
                    zoom: 11,
                    mapId: import.meta.env.VITE_GMAPS_MAPID,
                    mapTypeControl: false,
                    streetViewControl: false,
                });

                if (coordinatesList.length === 0 || validCoordinates.length === 0) {
                    setMapLoaded(true); // Mark map as loaded if no valid coordinates
                    return map;
                } else {
                    validCoordinates.forEach(({ lat, lng }, index) => {
                        const marker = new AdvancedMarkerElement({
                            position: { lat, lng },
                            map: map,
                        });
                        marker.addListener("click", () => {
                            const listing = listings[index];
                            navigate("/targetListing", {
                                state: {
                                    listingID: listing.listingID,
                                    hostID: listing.hostID,
                                    images: listing.images.map((image) => getImageLink(listing.listingID, image)),
                                    title: listing.title,
                                    shortDescription: listing.shortDescription,
                                    approxAddress: listing.address,
                                    portionPrice: listing.portionPrice,
                                    totalSlots: listing.totalSlots,
                                    latitude: lat,
                                    longitude: lng,
                                },
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
                        borderRadius: "10px"
                    }}
                />
            </Skeleton>
        </>
    );
};

export default MarkeredGMaps;