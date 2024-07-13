/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import ExpandedGoogleMaps from "../../components/listings/ExpandedGoogleMaps";
import ListingCardOverlay from "../../components/listings/ListingCardOverlay";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, useToast } from "@chakra-ui/react";
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
        navigate('/');
        setTimeout(() => {
            console.error("Listing details were not found in location state");
            showToast("No listing details found", "Please try again later", 3000, false, "info");
        }, 200);
    }

    const { listingID, hostID, images, title, shortDescription, approxAddress, portionPrice, totalSlots, latitude, longitude } = location.state;

    useEffect(() => {
        if (!authToken) {
            navigate('/auth/login');
            setTimeout(() => {
                showToast("You're not logged in", "Please Login first", 3000, false, "info");
            }, 200);
            return;
        }
    }, []);
    return (
        <>
            { user ? (
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
            ) : null }
        </>
    );
};

export default GoogleMapsPage;
