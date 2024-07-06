/* eslint-disable react/prop-types */
import GoogleMaps from "../../components/listings/GoogleMaps";
import DetailedListingCard from "../../components/listings/DetailedListingCard";
import { useSearchParams } from "react-router-dom";
import { Box } from "@chakra-ui/react";

const GoogleMapsPage = () => {
    const [searchParams] = useSearchParams();
    const latitude = Number(searchParams.get("latitude"));
    const longitude = Number(searchParams.get("longitude"));
    return (
        <>
            <Box position="relative" height="100%">
                <GoogleMaps lat={latitude} long={longitude} />
                <Box
                    position="absolute"
                    top="50%"
                    left="10px"
                    transform="translateY(-50%)"
                    zIndex="1">
                    <DetailedListingCard />
                </Box>
            </Box>
        </>
    );
};

export default GoogleMapsPage;
