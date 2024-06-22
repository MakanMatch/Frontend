/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from "react";
import server from "../../networking";
import { CheckCircleIcon } from "@chakra-ui/icons";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Input,
  useDisclosure,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  FormHelperText,
  Text,
  Box,
  useToast,
  InputGroup,
  InputLeftAddon,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from "@chakra-ui/react";

const AddListingModal = ({ isOpen, onOpen, onClose, fetchListings }) => {
    const toast = useToast();
    const today = new Date();
    today.setDate(today.getDate() + 1);
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset());

    const [title, setTitle] = useState("");
    const [shortDescription, setShortDescription] = useState("");
    const [longDescription, setLongDescription] = useState("");
    const [portionPrice, setPortionPrice] = useState(1);
    const [totalSlots, setTotalSlots] = useState(1);
    const [datetime, setDatetime] = useState(today.toISOString().slice(0, 16));
    const [images, setImages] = useState(null);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [fileFormatError, setFileFormatError] = useState("");
    const [dateToastActive, setDateToastActive] = useState(false);
    const [modalError, setModalError] = useState(false);
    const [validListing, setValidListing] = useState(false);

    const cancelRef = useRef();
    const {
        isOpen: isAlertOpen,
        onOpen: onAlertOpen,
        onClose: onAlertClose
    } = useDisclosure();

    function ShowToast(title, description, status, duration) {
        toast({
        title: title,
        description: description,
        status: status,
        duration: duration,
        isClosable: false,
        });
    }

    function checkDate(date) {
        if (new Date(date) > new Date()) {
        setDatetime(date);
        } else {
        if (dateToastActive) return;
        ShowToast("WARNING: Invalid Date/Time", "Please select a date-time that's greater than today's date-time", "error", 3000);
        setDateToastActive(true);
        setTimeout(() => {
            setDateToastActive(false);
        }, 3000);
        return;
        }
    }

    const handleSubmitListing = async () => {
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
        addedListingID = addListingResponse.data.listingID;
        try {
            const formData = new FormData();
            formData.append("images", images);
            const addImageResponse = await server.post(`/listings/addImage?id=${addedListingID}`, formData);
            await server.put("/listings/updateListingImageUrl", { listingID: addListingResponse.data.listingID, url: addImageResponse.data.url })
        } catch (error) {
            ShowToast("Error uploading listing image", "Please try again later.", "error", 2500);
            console.error("Error uploading listing image URL:", error);
        }
        fetchListings();
        } catch (error) {
        ShowToast("Error submitting listing", "Please try again later.", "error", 2500);
        console.error("Error submitting listing:", error);
        } finally {
        setTimeout(() => {
            onClose();
            setIsSubmitting(false);
            setFileFormatError("");
            setModalError(true);
            setValidListing(false);
            setTitle("");
            setShortDescription("");
            setLongDescription("");
            setPortionPrice(1);
            setTotalSlots(1);
            setDatetime(today.toISOString().slice(0, 16));
            setImages(null);
            ShowToast("Listing published successfully!", "We'll notify you when all slots have been filled.", "success", 4000);
        }, 1500);
        }
    };

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

    const handleCancelClick = () => {
        onAlertOpen();
    };

    const handleAlertConfirm = () => {
        onAlertClose();
        onClose();
    };

    useEffect(() => {
        if (title.trim() === "" || shortDescription.trim() === "" || longDescription.trim() === "" || !images) {
        setModalError(true);
        setValidListing(false);
        } else {
        setModalError(false);
        setValidListing(true);
        }
    }
    , [title, shortDescription, longDescription, images]);

    useEffect(() => {
        if (portionPrice > 10) {
        setPortionPrice(10);
        ShowToast("WARNING: Woah, that's too expensive!", "Fee cannot exceed $10", "error", 2500);
        }
    }, [portionPrice]);

    useEffect(() => {
        if (totalSlots > 5) {
        setTotalSlots(5);
        ShowToast("WARNING: Too many Guests!", "You can invite a maximum of 5 Guests", "error", 2500);
        }
    }, [totalSlots]);
    return (
        <div>
            <Modal
            blockScrollOnMount={true}
            isOpen={isOpen}
            onClose={onClose}
            size={"lg"}
            scrollBehavior="inside"
            closeOnOverlayClick={false}
            isCentered>
                <ModalOverlay
                    bg="blackAlpha.300"
                    backdropFilter="blur(10px) hue-rotate(90deg)"/>
                <ModalContent overflow={"hidden"} maxH={"90vh"}>
                    <ModalHeader>Host your next meal!</ModalHeader>
                    <ModalBody>
                        <FormControl mb={2} mt={-3} isRequired>
                            <FormLabel>What is the name of your dish?</FormLabel>
                            <Input
                            type="text"
                            placeholder="E.g Pani Puri"
                            onChange={(event) => setTitle(event.target.value)}/>
                        </FormControl>

                        <FormControl mb={3} isRequired>
                            <FormLabel>What is this dish?</FormLabel>
                            <Input
                            type="text"
                            placeholder="E.g Popular Indian Street Food"
                            onChange={(event) => setShortDescription(event.target.value)}/>
                        </FormControl>

                        <FormControl mb={2} isRequired>
                            <FormLabel>Give a detailed description of this dish</FormLabel>
                            <Input
                            type="text"
                            placeholder="E.g Pani Puri offers a burst of flavors and textures in every bite. It is made of a crispy shell, a mixture of potato, onion, peas and chickpea."
                            onChange={(event) => setLongDescription(event.target.value)}/>
                        </FormControl>

                        <Box
                            display="flex"
                            flexDirection="row"
                            justifyContent="space-between"
                            mb={-1}>
                            <FormControl flex="1" mr={2} isRequired>
                                <FormLabel>Portion Fee (Max: $10)</FormLabel>
                                <InputGroup>
                                    <InputLeftAddon>$</InputLeftAddon>
                                    <NumberInput
                                    step={1}
                                    defaultValue={1}
                                    value={portionPrice}
                                    min={1}
                                    max={10}
                                    mb={4}
                                    onChange={(valueAsString, valueAsNumber) =>
                                    setPortionPrice(valueAsNumber || 1)}>
                                    <NumberInputField borderRadius={"0px 6px 6px 0px"} />
                                    <NumberInputStepper>
                                        <NumberIncrementStepper />
                                        <NumberDecrementStepper />
                                    </NumberInputStepper>
                                    </NumberInput>
                                </InputGroup>
                            </FormControl>

                            <FormControl flex="1" ml={2} isRequired>
                                <FormLabel>No. of Guests (Max: 5)</FormLabel>
                                <NumberInput
                                    step={1}
                                    defaultValue={1}
                                    value={totalSlots}
                                    min={1}
                                    max={5}
                                    mb={4}
                                    onChange={(valueAsString, valueAsNumber) =>
                                    setTotalSlots(valueAsNumber || 1)}>
                                    <NumberInputField />
                                    <NumberInputStepper>
                                        <NumberIncrementStepper />
                                        <NumberDecrementStepper />
                                    </NumberInputStepper>
                                </NumberInput>
                            </FormControl>
                        </Box>

                        <FormControl mb={2} isRequired>
                            <FormLabel>When will you be hosting this meal?</FormLabel>
                            <Input
                            type="datetime-local"
                            value={datetime}
                            onChange={(event) => checkDate(event.target.value)}/>
                        </FormControl>

                        <FormControl isRequired>
                            <FormLabel>Upload an image of your dish</FormLabel>
                            <Input type="file" size="sm" onChange={handleFileChange} />
                            {fileFormatError && (
                            <FormHelperText color="red">{fileFormatError}</FormHelperText>)}
                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        <Box flex={"1"} textAlign={"left"}>
                            {modalError && <Text color="red">All fields are required</Text>}
                            {validListing && (
                            <Text color="green">
                                <CheckCircleIcon color="green" mr={2} mb={1} />
                                You are good to go!
                            </Text>
                            )}
                        </Box>
                        <Button
                            colorScheme={"red"}
                            mr={3}
                            borderRadius={"10px"}
                            onClick={handleCancelClick}>
                            Cancel
                        </Button>
                        {modalError ? (
                            <Button
                            borderRadius={"10px"}
                            colorScheme="blue"
                            color="white"
                            fontWeight="bold"
                            isDisabled>
                            Host
                            </Button>
                        ) : (
                            <>
                            {isSubmitting ? (
                                <Button
                                isLoading
                                loadingText="Submitting..."
                                borderRadius={"10px"}
                                >
                                Submitting...
                                </Button>
                            ) : (
                                <Button onClick={handleSubmitListing} variant="MMPrimary">
                                Host
                                </Button>
                            )}
                            </>
                        )}
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <AlertDialog
                isOpen={isAlertOpen}
                leastDestructiveRef={cancelRef}
                onClose={onAlertClose}
                motionPreset='slideInBottom'
                closeOnOverlayClick={false}>
                <AlertDialogOverlay bg='blackAlpha.300' backdropFilter='blur(10px) hue-rotate(90deg)'>
                <AlertDialogContent>
                    <AlertDialogHeader fontSize="lg" fontWeight="bold">
                    Discard changes
                    </AlertDialogHeader>

                    <AlertDialogBody>
                    Are you sure you want to cancel? All your changes will be lost.
                    </AlertDialogBody>

                    <AlertDialogFooter>
                    <Button ref={cancelRef} onClick={onAlertClose}>
                        Go back
                    </Button>
                    <Button colorScheme="red" onClick={handleAlertConfirm} ml={3}>
                        Discard
                    </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </div>
    );
};

export default AddListingModal;
