/* eslint-disable react/prop-types */
import ExpandedGoogleMaps from "../../components/listings/ExpandedGoogleMaps";
import ListingCardOverlay from "../../components/listings/ListingCardOverlay";
import { useSearchParams } from "react-router-dom";
import { Box } from "@chakra-ui/react";

const GoogleMapsPage = () => {
    const [searchParams] = useSearchParams();
    const listingID = searchParams.get("listingID");

    const latitude = Number(localStorage.getItem(`ListingExp-latitude-${listingID}`));
    const longitude = Number(localStorage.getItem(`ListingExp-longitude-${listingID}`));
    const userID = localStorage.getItem("ListingExp-userID");
    const hostID = localStorage.getItem("ListingExp-hostID");
    const images = localStorage.getItem(`ListingExp-images-${listingID}`);
    const title = localStorage.getItem(`ListingExp-title-${listingID}`);
    const shortDescription = localStorage.getItem(`ListingExp-shortDescription-${listingID}`);
    const approxAddress = localStorage.getItem(`ListingExp-approxAddress-${listingID}`);
    const portionPrice = localStorage.getItem(`ListingExp-portionPrice-${listingID}`);
    const totalSlots = localStorage.getItem(`ListingExp-totalSlots-${listingID}`);
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
                    <ListingCardOverlay listingID={listingID} userID={userID} hostID={hostID} images={images} title={title} shortDescription={shortDescription} approxAddress={approxAddress} portionPrice={portionPrice} totalSlots={totalSlots} />
                </Box>
            </Box>
        </>
    );
};

export default GoogleMapsPage;
