/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Loader } from "@googlemaps/js-api-loader";
import { useToast } from "@chakra-ui/react";
import configureShowToast from "../../components/showToast";
import axios from "axios";

const MarkeredGMaps = ({
    addresses,
    listings,
    userID,
    isSmallerThan1095,
    getImageLink,
}) => {
    const toast = useToast();
    const showToast = configureShowToast(toast);
    const navigate = useNavigate();
    const mapRef = useRef(null);

    useEffect(() => {
        const fetchCoordinates = async (address) => {
            const encodedAddress = encodeURIComponent(String(address));
            const apiKey = import.meta.env.VITE_GMAPS_API_KEY;
            const url = `https://maps.googleapis.com/maps/api/geocode/json?address="${encodedAddress}"&key=${apiKey}`;
            try {
                const response = await axios.get(url);
                return response.data.results[0].geometry.location;
            } catch (error) {
                showToast(
                    "An error occured",
                    "Failed to generate maps coordinates",
                    "error",
                    3000
                );
                return null;
            }
        };

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

                if (addresses.length === 0 || validCoordinates.length === 0) {
                    return map;
                } else {
                    validCoordinates.forEach(({ lat, lng }, index) => {
                        const images = listings[index].images.map((imageName) =>
                            getImageLink(listings[index].listingID, imageName)
                        );
                        const marker = new AdvancedMarkerElement({
                            position: { lat, lng },
                            map: map,
                        });
                        marker.addListener("click", () => {
                            const listing = listings[index];
                            navigate(
                                `/targetListing?latitude=${lat}&longitude=${lng}&listingID=${
                                    listing.listingID
                                }&userID=${userID}&images=${encodeURIComponent(
                                    JSON.stringify(images)
                                )}&title=${listing.title}&shortDescription=${
                                    listing.shortDescription
                                }&approxAddress=${
                                    listing.approxAddress
                                }&portionPrice=${
                                    listing.portionPrice
                                }&totalSlots=${listing.totalSlots}`
                            );
                        });
                    });
                }
            } else return;
        };

        Promise.all(addresses.map(fetchCoordinates))
        .then((coordinatesList) => {
            const validCoordinates = coordinatesList.filter(
                ({ lat, lng }) =>
                    lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180
            );
            InitializeMap(validCoordinates);
        })
        .catch(() => {
            showToast("An error occured", "Failed to render Google Maps", 3000, false, "error");
        });
    }, [addresses]);

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