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
  SimpleGrid,
  FormHelperText,
} from "@chakra-ui/react";

const FoodListingsPage = () => {
  const [listings, setListings] = useState([]);
  const [hostName, setHostName] = useState("");
  const [hostRating, setHostRating] = useState(0);

  const fetchListings = async () => {
    try {
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
        const response = await server.get("/listings/hostInfo");
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
  const [datetime, setDatetime] = useState(() => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-GB').split('/').reverse().join('-');
    return formattedDate;
  });  
  const [images, setImages] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitListing = async () => {
    if (!title || !shortDescription || !longDescription || !images) {
      window.alert("Please fill in all required fields.");
      return;
    }
    setIsSubmitting(true);
    var addedListingID = null;
    try {
      const newListing = {
        title,
        images: "",
        shortDescription,
        longDescription,
        portionPrice,
        totalSlots,
        datetime,
      }
      const addListingResponse = await server.post("/listings/addListing", newListing);
      console.log("Listing submitted:", addListingResponse.data);
      addedListingID = addListingResponse.data.ID;
      try {
        const formData = new FormData();
        formData.append("images", images);
        formData.append("listingID", addedListingID);
        const addImageResponse = await server.post("/listings/addImage", formData);
        console.log("Listing image uploaded", addImageResponse.data.url);
        await server.put("/listings/updateListingImageUrl", { listingID: addListingResponse.data.ID, url: addImageResponse.data.url })
        .then((response) => {
          if (response.status === 200) {
            console.log("Listing image URL updated:", response.data);
          } else {
            console.error("Error updating listing image URL:", response.data);
          }
        })
      } catch (error) {
        console.error("Error uploading listing image URL:", error);
      }
      fetchListings();
    } catch (error) {
      console.error("Error submitting listing:", error);
    }
    onClose();
    setIsSubmitting(false);
  };

  const [fileFormatError, setFileFormatError] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/svg+xml"];
      if (allowedTypes.includes(file.type)) {
        setImages(file);
        setFileFormatError("");
      } else {
        setImages("");
        setFileFormatError("Invalid file format. Only JPEG, JPG, PNG and SVG are allowed.");
      }
    }
  };

  const { isOpen, onOpen, onClose } = useDisclosure();

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
        images={listing.images}
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
                Upload an image of your dish
              </FormLabel>
              <Input
                type="file"
                size="sm"
                onChange={handleFileChange}
              />
              {fileFormatError && (
                <FormHelperText color="red">{fileFormatError}</FormHelperText>
              )}
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={onClose}>
              Cancel
            </Button>
            {isSubmitting ? <Button isLoading loadingText='Submitting...'/> : <Button onClick={handleSubmitListing} variant="MMPrimary">
              Host
            </Button>}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default FoodListingsPage;
