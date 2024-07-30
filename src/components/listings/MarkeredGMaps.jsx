/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader } from "@googlemaps/js-api-loader";
import { Skeleton, useToast, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Card, CardBody, Text, Button } from "@chakra-ui/react";

const MarkeredGMaps = ({
    coordinatesList,
    listings,
    isSmallerThan1095
}) => {
    const navigate = useNavigate();
    const mapRef = useRef(null);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [activeMarker, setActiveMarker] = useState(null);
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

    function getImageLink(listingID, imageName) {
        return `${import.meta.env.VITE_BACKEND_URL}/cdn/getImageForListing?listingID=${listingID}&imageName=${imageName}`;
    }

    const navigateToListing = (listing, lat, lng) => {
        navigate("/targetListing", {
            state: {
                listingID: listing.listingID,
                hostID: listing.hostID,
                images: listing.images.map((image) => getImageLink(listing.listingID, image)),
                title: listing.title,
                shortDescription: listing.shortDescription,
                approxAddress: listing.approxAddress,
                portionPrice: listing.portionPrice,
                totalSlots: listing.totalSlots,
                latitude: lat,
                longitude: lng,
            },
        });
    };

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
                                if (markerGroup.length === 1) {
                                    const listing = listings[index];
                                    navigateToListing(listing, lat, lng);
                                } else {
                                    // Set active marker state for the modal
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
                        borderRadius: "10px"
                    }}
                />
            </Skeleton>
            {activeMarker && (
                <Modal isOpen={true} onClose={() => setActiveMarker(null)} size="xl">
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader color="#323437">This address has multiple listings! Select one to view</ModalHeader>
                        <ModalBody>
                            {activeMarker.listings.map((listing, idx) => (
                                <Card
                                mb={3}
                                key={idx}
                                sx={{ cursor: "pointer" }}
                                onClick={() => {
                                    navigateToListing(listing, activeMarker.lat, activeMarker.lng);
                                    setActiveMarker(null);
                                }}>
                                    <CardBody>
                                        <Text>{listing.title}</Text>
                                        <Text>{listing.approxAddress}</Text>
                                    </CardBody>
                                </Card>
                            ))}
                        </ModalBody>
                        <ModalFooter>
                            <Button colorScheme='red' mr={3} onClick={() => setActiveMarker(null)}>
                                Close
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            )}
        </>
    );
};

export default MarkeredGMaps;