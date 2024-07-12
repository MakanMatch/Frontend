/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import ExpandedGoogleMaps from "../../components/listings/ExpandedGoogleMaps";
import ListingCardOverlay from "../../components/listings/ListingCardOverlay";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Box, useToast } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import configureShowToast from "../../components/showToast";

const GoogleMapsPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const listingID = searchParams.get("listingID");
    const toast = useToast();
    const showToast = configureShowToast(toast);
    const { user } = useSelector((state) => state.auth);

    const latitude = Number(localStorage.getItem(`ListingExp-latitude-${listingID}`));
    const longitude = Number(localStorage.getItem(`ListingExp-longitude-${listingID}`));
    const hostID = localStorage.getItem("ListingExp-hostID");
    const images = localStorage.getItem(`ListingExp-images-${listingID}`);
    const title = localStorage.getItem(`ListingExp-title-${listingID}`);
    const shortDescription = localStorage.getItem(`ListingExp-shortDescription-${listingID}`);
    const approxAddress = localStorage.getItem(`ListingExp-approxAddress-${listingID}`);
    const portionPrice = localStorage.getItem(`ListingExp-portionPrice-${listingID}`);
    const totalSlots = localStorage.getItem(`ListingExp-totalSlots-${listingID}`);

    useEffect(() => {
        if (!user || !user.userID) {
            navigate('/auth/login');
            setTimeout(() => {
                showToast("You're not logged in", "Please Login first", 3000, false, "info");
            }, 200);
            return;
        }
    }, [user]);
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
                    <ListingCardOverlay listingID={listingID} userID={user.userID} hostID={hostID} images={images} title={title} shortDescription={shortDescription} approxAddress={approxAddress} portionPrice={portionPrice} totalSlots={totalSlots} />
                </Box>
            </Box>
            ) : null }
        </>
    );
};

export default GoogleMapsPage;
