/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Loader } from "@googlemaps/js-api-loader";
import { useToast } from "@chakra-ui/react";
import configureShowToast from "../../components/showToast";

const MarkeredGMaps = ({
    coordinatesList,
    listings,
    isSmallerThan1095
}) => {
    const toast = useToast();
    const showToast = configureShowToast(toast);
    const navigate = useNavigate();
    const mapRef = useRef(null);

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
                    return map;
                } else {
                    validCoordinates.forEach(({ lat, lng }, index) => {
                        const marker = new AdvancedMarkerElement({
                            position: { lat, lng },
                            map: map,
                        });
                        // hostID, images, title, shortDescription, approxAddress, portionPrice, totalSlots, latitude, longitude
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
                }
            } else return;
        };
        try {
            const validCoordinates = coordinatesList.filter(
                ({ lat, lng }) =>
                    lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180
            );
            InitializeMap(validCoordinates);
        } catch (error) {
            showToast("An error occured", "Failed to render Google Maps", 3000, false, "error");
            console.error(error);
        }
    }, [coordinatesList]);

    return (
        <div
            ref={mapRef}
            style={{
                height: isSmallerThan1095 ? "45vh" : "83vh",
                width: "100%",
                borderRadius: "10px",
            }}
        />
    );
};

export default MarkeredGMaps;