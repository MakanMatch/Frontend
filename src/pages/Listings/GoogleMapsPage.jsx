/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import ExpandedGoogleMaps from "../../components/listings/ExpandedGoogleMaps";
import ListingCardOverlay from "../../components/listings/ListingCardOverlay";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, useToast, Spinner } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import configureShowToast from "../../components/showToast";

const GoogleMapsPage = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const showToast = configureShowToast(toast);
    const location = useLocation();
    const { user, authToken, loaded } = useSelector((state) => state.auth);

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
            showToast("Invalid Listing", "Please select a valid listing", 3000, false, "error");
        }, 200);
    }

    useEffect(() => {
        if (!authToken || !user) {
            navigate('/auth/login');
            setTimeout(() => {
                showToast("You're not logged in", "Please Login first", 3000, false, "info");
            }, 200);
            return;
        }
    }, []);
    return (
        <Box position="relative" height="100%">
            <ExpandedGoogleMaps lat={latitude} long={longitude} />
            <Box
                position="absolute"
                top="50%"
                left="10px"
                transform="translateY(-50%)"
                zIndex="1">
                <ListingCardOverlay listingID={listingID} userID={user.userID} userType={user.userType} hostID={hostID} images={images} title={title} shortDescription={shortDescription} approxAddress={approxAddress} portionPrice={portionPrice} totalSlots={totalSlots} />
            </Box>
        </Box>
    );
};

export default GoogleMapsPage;
