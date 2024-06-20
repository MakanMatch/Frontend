// FoodListingsPage.jsx
import { useState, useEffect } from "react";
import server from "../../networking";
import FoodListings from "../../components/listings/FoodListings";
import {
  Button,
  Heading,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
  useDisclosure,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  SimpleGrid
} from "@chakra-ui/react";

const FoodListingsPage = () => {
  const [listings, setListings] = useState([]);
  const [hostName, setHostName] = useState("");
  const [hostRating, setHostRating] = useState(0);

  const fetchListings = async () => {
    try {
      console.log("Fetching food listings...");
      const response = await server.get("/listings");
      console.log("Food listings fetched:", response.data);
      setListings(response.data);
    } catch (error) {
      console.error("Error fetching food listings:", error);
    }
  };

  useEffect(() => {
    const fetchHostInfo = async () => {
      try {
        console.log("Fetching host info...");
        const response = await server.get("/listings/hostInfo");
        console.log("Host name fetched:", response.data.username);
        console.log("Host rating fetched:", response.data.foodRating);
        setHostName(response.data.username);
        setHostRating(response.data.foodRating);
      } catch (error) {
        console.error("Error fetching host info:", error);
      }
    };

    fetchListings();
    fetchHostInfo();
  }, []);

  const toggleFavourite = (listingID) => {
    setListings((prevListings) =>
      prevListings.map((listing) =>
        listing.listingID === listingID
          ? { ...listing, isFavourite: !listing.isFavourite }
          : listing
      )
    );
  };
  
  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [longDescription, setLongDescription] = useState("");
  const [portionPrice, setPortionPrice] = useState(1);
  const [totalSlots, setTotalSlots] = useState(1);
  const [datetime, setDatetime] = useState("");
  const [images, setImages] = useState(null);

  const handleSubmitListing = async () => {
    var addedListingID = null;
    var imageUrl = null;
    try {
      console.log("Submitting listing...");
      const newListing = {
        title,
        images: "",
        shortDescription,
        longDescription,
        portionPrice,
        totalSlots,
        datetime,
      }
      console.log("New listing:", newListing);
      const response = await server.post("/listings/addListing", newListing);
      console.log("Listing submitted:", response.data);
      addedListingID = response.data.ID;
      fetchListings();
    } catch (error) {
      console.error("Error submitting listing:", error);
    }

    try {
      const formData = new FormData();
      formData.append("images", images);
      formData.append("listingID", addedListingID);
      const response = await server.post("/listings/addImage", formData);
      console.log("Listing image uploaded", response.data.url);
      addedListingID = response.data.ID;
      imageUrl = response.data.url;
      server.put("/listings/updateListingImageUrl", { listingID: addedListingID, url: imageUrl })

    } catch (error) {
      console.error("Error uploading listing image:", error);
    }
    onClose();
  };

  const handleFileChange = (event) => {
    setImages(event.target.files[0]);
  };

  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <div>
      <Heading as={"h1"} mb={4}>Food Listings</Heading>
      <SimpleGrid spacing={4} templateColumns="repeat(auto-fill, minmax(200px, 1fr))">
      {listings.map((listing) => (
        <FoodListings
        key={listing.listingID}
        title={listing.title}
        hostName={hostName}
        portionPrice={listing.portionPrice}
        hostFoodRating={hostRating}
        isFavourite={listing.isFavourite}
        onToggleFavourite={() => toggleFavourite(listing.listingID)}
        />
      ))}
    </SimpleGrid>
      <Button onClick={onOpen}variant={"MMPrimary"} mt={4}>
        Add Listing
      </Button>
      <Modal
        blockScrollOnMount={true}
        isOpen={isOpen}
        onClose={onClose}
        size={"lg"}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Host a meal</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={4} isRequired>
              <FormLabel>What is the name of your dish?</FormLabel>
              <Input
                type="text"
                placeholder="E.g Pani Puri"
                onChange={(event) => setTitle(event.target.value)}
              />
            </FormControl>
            <FormControl mb={4} isRequired>
              <FormLabel>What is this dish?</FormLabel>
              <Input
                type="text"
                placeholder="E.g Popular Indian Street Food"
                onChange={(event) => setShortDescription(event.target.value)}
              />
            </FormControl>

            <FormControl mb={4} isRequired>
              <FormLabel>Give a detailed description of this dish</FormLabel>
              <Input
                type="text"
                placeholder="E.g Pani Puri offers a burst of flavors and textures in every bite. It is made of a crispy shell, a mixture of potato, onion, peas and chickpea."
                onChange={(event) => setLongDescription(event.target.value)}
              />
            </FormControl>

            <FormControl mb={4} isRequired>
              <FormLabel>Portion Fee (in SGD)</FormLabel>
              <NumberInput
                step={1}
                defaultValue={1}
                min={1}
                max={10}
                mb={4}
                onChange={(valueAsString, valueAsNumber) =>
                  setPortionPrice(valueAsNumber)
                }
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>

            <FormControl mb={4} isRequired>
              <FormLabel>How many guests are you inviting?</FormLabel>
              <NumberInput
                step={1}
                defaultValue={1}
                min={1}
                max={5}
                mb={4}
                onChange={(valueAsString, valueAsNumber) =>
                  setTotalSlots(valueAsNumber)
                }
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>

            <FormControl mb={4} isRequired>
              <FormLabel>When will you be hosting this dish?</FormLabel>
              <Input type='date' onChange={event => setDatetime(event.target.value)}/>
            </FormControl>

            <FormControl mb={4} isRequired>
              <FormLabel>
                Upload a previously taken image of your dish
              </FormLabel>
              <Input
                type="file"
                size="sm"
                onChange={handleFileChange}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmitListing} variant="MMPrimary">
              Host it!
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default FoodListingsPage;
