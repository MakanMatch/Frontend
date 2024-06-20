/* eslint-disable react/prop-types */
import { 
  Button, 
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
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import server from '../../networking';

const FoodListings = ({ foodListings }) => {
  const [localFoodListings, setLocalFoodListings] = useState([]);
  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [longDescription, setLongDescription] = useState("");
  const [portionPrice, setPortionPrice] = useState(0);
  const [images, setImages] = useState([]);
  const [totalSlots, setTotalSlots] = useState(0);
  const [datetime, setDateTime] = useState("");
  

  useEffect(() => {
    const fetchHostNameAndRating = async () => {
      try {
        console.log('Fetching host info...');
        const response = await server.get('/listings/hostInfo');
        console.log('Host info fetched:', response.data);
        const enhancedListings = foodListings.map(listing => ({
          ...listing,
          hostName: response.data.username,
          hostFoodRating: response.data.foodRating,
          Favourite: false
        }));
        setLocalFoodListings(enhancedListings);
      } catch (error) {
        console.error('Error fetching host info:', error);
      }
    };

    fetchHostNameAndRating();
  }, [foodListings]);

  const handleFavourite = (listingID) => {
    setLocalFoodListings(prevListings =>
      prevListings.map(listing =>
        listing.listingID === listingID ? { ...listing, Favourite: !listing.Favourite } : listing
      )
    );
  };

  const handleSubmitListing = async () => {
    const newListing = {
      title,
      images,
      shortDescription,
      longDescription,
      portionPrice,
      totalSlots,
      datetime
    }
    await server.post('/listings/addListing', newListing)
    .then(response => {
      if (response.status == 200) {
        console.log('New listing posted:', response.data);
        setLocalFoodListings(prevListings => [...prevListings, response.data]);
      }
    })
    .catch(error => {
      console.error('Error posting new listing:', error);
    });
    onClose();
  }

  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
        {localFoodListings.map(listing => (
          <div key={listing.listingID} style={{ width: 'calc(33.33% - 16px)' }}>
            <div style={{ border: '1px solid #ccc', padding: '16px', borderRadius: '4px' }}>
              <h3>{listing.title}</h3>
              <h2>Host: {listing.hostName}</h2>
              <div>Price: ${listing.portionPrice}</div>
              <h2>Rating: {listing.hostFoodRating}</h2>
              <Button onClick={() => handleFavourite(listing.listingID)}>
                {listing.Favourite ? "🩷" : "🤍"}
              </Button>
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'center' }}>
        <Button onClick={onOpen}variant={"MMPrimary"}>
          Add Listing
        </Button>
      </div>
      <Modal blockScrollOnMount={true} isOpen={isOpen} onClose={onClose} size={"lg"}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Host a meal</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
          <FormControl mb={4} isRequired>
            <FormLabel>What is the name of your dish?</FormLabel>
            <Input type='text' placeholder="E.g Pani Puri" onChange={event => setTitle(event.target.value)} />
          </FormControl>

          <FormControl mb={4} isRequired>
            <FormLabel>What is this dish?</FormLabel>
            <Input type='text' placeholder="E.g Popular Indian Street Food" onChange={event => setShortDescription(event.target.value)} />
          </FormControl>

          <FormControl mb={4} isRequired>
            <FormLabel>Give a detailed description of this dish</FormLabel>
            <Input type='text' placeholder="E.g Pani Puri offers a burst of flavors and textures in every bite. It is made of a crispy shell, a mixture of potato, onion, peas and chickpea." onChange={event => setLongDescription(event.target.value)} />
          </FormControl>

          <FormControl mb={4} isRequired>
            <FormLabel>Portion Fee (in SGD)</FormLabel>
            <NumberInput step={1} defaultValue={1} min={1} max={10} mb={4} onChange={(valueAsString, valueAsNumber) => setPortionPrice(valueAsNumber)}>
              <NumberInputField/>
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>

          <FormControl mb={4} isRequired>
            <FormLabel>How many guests are you inviting?</FormLabel>
            <NumberInput step={1} defaultValue={1} min={1} max={5} mb={4} onChange={(valueAsString, valueAsNumber) => setTotalSlots(valueAsNumber)}>
              <NumberInputField/>
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>

          <FormControl mb={4} isRequired>
            <FormLabel>When will you be hosting this dish?</FormLabel>
            <Input type='date' onChange={event => setDateTime(event.target.value)}/>
          </FormControl>
          
          <FormControl mb={4} isRequired>
            <FormLabel>Upload a previously taken image of your dish</FormLabel>
            <Input type='file' size="sm" onChange={event => setImages(event.target.value)}/>
          </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='red' mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmitListing} variant='MMPrimary'>Host it!</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default FoodListings;
