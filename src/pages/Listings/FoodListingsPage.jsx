/* eslint-disable react-hooks/exhaustive-deps */
// FoodListingsPage.jsx
import { useState, useEffect } from "react";
import server from "../../networking";
import FoodListings from "../../components/listings/FoodListings";
import GoogleMaps from "../../components/listings/GoogleMaps";
import AddListingModal from "../../components/listings/AddListingModal";
import {
  Button,
  Heading,
  useDisclosure,
  SimpleGrid,
  Text,
  Box,
  useToast,
  Flex,
  SlideFade,
} from "@chakra-ui/react";

const FoodListingsPage = () => {
  const [listings, setListings] = useState([]);
  const [hostName, setHostName] = useState("");
  const [hostRating, setHostRating] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  function ShowToast(title, description, status, duration) {
    toast({
      title: title,
      description: description,
      status: status,
      duration: duration,
      isClosable: false,
    });
  }

  const fetchListings = async () => {
    try {
      const response = await server.get("/listings");
      console.log("Food listings fetched:", response.data);
      setListings(response.data);
    } catch (error) {
      ShowToast("Error fetching food listings", "Please try again later.", "error", 2500);
      console.error("Error fetching food listings:", error);
    }
  };

  const toggleFavourite = (listingID) => {
    setListings((prevListings) =>
      prevListings.map((listing) =>
        listing.listingID === listingID
          ? { ...listing, isFavourite: !listing.isFavourite }
          : listing
      )
    );
  };

  useEffect(() => {
    const fetchHostInfo = async () => {
      try {
        const response = await server.get("/listings/hostInfo");
        setHostName(response.data.username);
        setHostRating(response.data.foodRating);
        console.log("Host name fetched:", response.data.username); // Debugging
      } catch (error) {
        ShowToast("Error fetching required information", "Please try again later.", "error", 2500);
        console.error("Error fetching host info:", error);
      }
    };

    fetchListings();
    fetchHostInfo();
  }, []);

  return (
    <div>
      <Heading as={"h1"} mb={4}>Food Listings</Heading>
      <Box display="flex" justifyContent="center" mb={4}>
        <Button onClick={onOpen} variant="MMPrimary">
          Add Listing
        </Button>
      </Box>
      <Flex display="flex" flexWrap="wrap">
      <Box
        maxH="520px"
        overflowY="auto"
        boxShadow={"0 2px 4px 2px rgba(0.1, 0.1, 0.1, 0.1)"}
        borderRadius={"22px 8px 8px 22px"}
        p="4"
        flex={2}
        css={{
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: '#f1f1f1',
            borderRadius: '8px 8px 8px 8px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#C2C2C2',
            borderRadius: '8px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: '#A1A1A1',
          },
        }}>
        {listings.length > 0 ? (
          <SimpleGrid spacing={4} templateColumns="repeat(auto-fill, minmax(200px, 1fr))">
            {listings.map((listing) => (
              <SlideFade in={true} offsetY="20px" key={listing.listingID}>
                <FoodListings
                  key={listing.listingID}
                  title={listing.title}
                  hostName={hostName}
                  portionPrice={listing.portionPrice}
                  hostFoodRating={hostRating}
                  isFavourite={listing.isFavourite}
                  onToggleFavourite={() => toggleFavourite(listing.listingID)}
                  images={listing.images}/>
              </SlideFade>
            ))}
          </SimpleGrid>) : (
            <Box display="flex" justifyContent="center" alignItems="center" height="65vh">
              <Text textAlign="center" fontSize="lg" color="gray.500" width="50%">
                No listings available
              </Text>
            </Box>
          )}
      </Box>
        <Box flex="1" ml={5}>
          <SlideFade in={true} offsetY="20px">
            <GoogleMaps />
          </SlideFade>
        </Box>
      </Flex>
      <AddListingModal isOpen={isOpen} onClose={onClose} onOpen={onOpen} fetchListings={fetchListings} />
    </div>
  );
};

export default FoodListingsPage;
