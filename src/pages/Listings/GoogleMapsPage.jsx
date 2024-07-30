/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import ExpandedGoogleMaps from "../../components/listings/ExpandedGoogleMaps";
import ListingCardOverlay from "../../components/listings/ListingCardOverlay";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, useToast, Center, Fade, Spinner, useMediaQuery, Card, Image, Stack, CardBody, Heading, Text, CardFooter, Button } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

const GoogleMapsPage = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const location = useLocation();
    const loaded = useSelector((state) => state.auth.loaded);

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
            displayToast("Invalid Listing", "Please select a valid listing", "error", 3000, true);
        }, 200);
    }
    if (!loaded) {
        return (
            <div>
                <Center height="100vh">
                    <Fade in={!loaded}>
                        <Spinner size="xl" />
                    </Fade>
                </Center>
            </div>
        );
    }

    return (
        <>
            <Box position="relative" height="100%">
                <ExpandedGoogleMaps title={title} lat={latitude} long={longitude} />
                <Box
                    position="absolute"
                    top="50%"
                    left="10px"
                    transform="translateY(-50%)"
                    zIndex="1">
                    <motion.div
                        initial={{ x: -100 }}
                        animate={{ x: 0 }}
                        transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 20
                        }}
                    >
                        <ListingCardOverlay listingID={listingID} hostID={hostID} images={images} title={title} shortDescription={shortDescription} approxAddress={approxAddress} portionPrice={portionPrice} totalSlots={totalSlots} displayToast={displayToast} />
                    </motion.div>
                </Box>
                {/* <Box display="flex" justifyContent={"center"}>
                    <Card
                        width="98%"
                        direction={{ base: 'column', sm: 'row' }}
                        overflow='hidden'
                        variant='outline'
                        position={"absolute"}
                        top="2%"
                        zIndex={2}
                    >
                        <Image
                            objectFit='cover'
                            maxW={{ base: '100%', sm: '200px' }}
                            src='https://images.unsplash.com/photo-1667489022797-ab608913feeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw5fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60'
                            alt='Caffe Latte'
                        />

                        <Stack>
                            <CardBody>
                            <Heading size='md'>The perfect latte</Heading>

                            <Text py='2'>
                                Caffè latte is a coffee beverage of Italian origin made with espresso
                                and steamed milk.
                            </Text>
                            </CardBody>

                            <CardFooter>
                            <Button variant='solid' colorScheme='blue'>
                                Buy Latte
                            </Button>
                            </CardFooter>
                        </Stack>
                    </Card>
                </Box> */}
            </Box>
        </>
    );
};

export default GoogleMapsPage;
