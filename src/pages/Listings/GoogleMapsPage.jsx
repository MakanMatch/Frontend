/* eslint-disable react/prop-types */
import ExpandedGoogleMaps from "../../components/listings/ExpandedGoogleMaps";
import ListingCardOverlay from "../../components/listings/ListingCardOverlay";
import { useSearchParams } from "react-router-dom";
import { Box } from "@chakra-ui/react";

const GoogleMapsPage = () => {
    const [searchParams] = useSearchParams();
    const latitude = Number(searchParams.get("latitude"));
    const longitude = Number(searchParams.get("longitude"));
    const listingID = searchParams.get("listingID");
    const userID = searchParams.get("userID");
    const imagesString = searchParams.get("images");
    const images = imagesString ? JSON.parse(decodeURIComponent(imagesString)) : [];
    const title = searchParams.get("title");
    const shortDescription = searchParams.get("shortDescription");
    const approxAddress = searchParams.get("approxAddress");
    const portionPrice = searchParams.get("portionPrice");
    const totalSlots = searchParams.get("totalSlots");
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
