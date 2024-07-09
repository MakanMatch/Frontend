/* eslint-disable react/prop-types */
import ExpandedGoogleMaps from "../../components/listings/ExpandedGoogleMaps";
import ListingCardOverlay from "../../components/listings/ListingCardOverlay";
import { useSearchParams } from "react-router-dom";
import { Box } from "@chakra-ui/react";

const GoogleMapsPage = () => {
    const [searchParams] = useSearchParams();
    const listingID = searchParams.get("listingID");

    const latitude = Number(localStorage.getItem(`latitude-${listingID}`));
    const longitude = Number(localStorage.getItem(`longitude-${listingID}`));
    const userID = localStorage.getItem("userID");
    const images = localStorage.getItem(`images-${listingID}`);
    console.log("Images from GoogleMapsPage: ", images)
    const title = localStorage.getItem(`title-${listingID}`);
    const shortDescription = localStorage.getItem(`shortDescription-${listingID}`);
    const approxAddress = localStorage.getItem(`approxAddress-${listingID}`);
    const portionPrice = localStorage.getItem(`portionPrice-${listingID}`);
    const totalSlots = localStorage.getItem(`totalSlots-${listingID}`);
    return (
        <>
            <Box position="relative" height="100%">
                <ExpandedGoogleMaps lat={latitude} long={longitude} />
                <Box
                    position="absolute"
                    top="50%"
                    left="10px"
                    transform="translateY(-50%)"
                    zIndex="1">
                    <ListingCardOverlay listingID={listingID} userID={userID} images={images} title={title} shortDescription={shortDescription} approxAddress={approxAddress} portionPrice={portionPrice} totalSlots={totalSlots} />
                </Box>
            </Box>
        </>
    );
};

export default GoogleMapsPage;
