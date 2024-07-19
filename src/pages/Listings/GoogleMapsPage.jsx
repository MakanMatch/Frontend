/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import ExpandedGoogleMaps from "../../components/listings/ExpandedGoogleMaps";
import ListingCardOverlay from "../../components/listings/ListingCardOverlay";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, useToast } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { useEffect } from "react";

const GoogleMapsPage = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const location = useLocation();
    const { user, authToken, loaded } = useSelector((state) => state.auth);

    function displayToast(title, description, status, duration, isClosable) {
        toast({
            title: title,
            description: description,
            status: status,
            duration: duration,
            isClosable: isClosable
        });
    }

    if (!location.state) {
        if (window.location.pathname !== "/") {
            window.location.href = "/*";
        }
    }

    const { listingID, hostID, images, title, shortDescription, approxAddress, portionPrice, totalSlots, latitude, longitude } = location.state;
    // if location.state doesnt have the required data, navigate back to homepage and show a toast
    if (!listingID || !hostID || !images || !title || !shortDescription || !approxAddress || !portionPrice || !totalSlots || !latitude || !longitude) {
        navigate("/");
        setTimeout(() => {
            displayToast("Invalid Listing", "Please select a valid listing", "error", 3000, false);
        }, 200);
    }
    return (
        <>
            {loaded && (
                <Box position="relative" height="100%">
                <ExpandedGoogleMaps lat={latitude} long={longitude} displayToast={displayToast} />
                <Box
                    position="absolute"
                    top="50%"
                    left="10px"
                    transform="translateY(-50%)"
                    zIndex="1">
                    <ListingCardOverlay listingID={listingID} hostID={hostID} images={images} title={title} shortDescription={shortDescription} approxAddress={approxAddress} portionPrice={portionPrice} totalSlots={totalSlots} displayToast={displayToast} />
                </Box>
            </Box>)}
        </>
    );
};

export default GoogleMapsPage;
