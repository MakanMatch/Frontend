/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from "react";
import server from "../../networking";
import { CheckCircleIcon, CloseIcon } from "@chakra-ui/icons";
import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, Input, useDisclosure, FormControl, FormLabel, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, FormHelperText, Text, Box, useToast, InputGroup, InputLeftAddon, AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter, Card, Show } from "@chakra-ui/react";

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
    const [images, setImages] = useState([]);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [fileFormatError, setFileFormatError] = useState("");
    const [modalError, setModalError] = useState(false);
    const [validListing, setValidListing] = useState(false);

    const cancelRef = useRef();
    const {
        isOpen: isAlertOpen,
        onOpen: onAlertOpen,
        onClose: onAlertClose,
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

    function setDefaultState() {
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
        setImages([]);
    }

    function checkDate(date) {
        if (new Date(date) > new Date()) {
            setDatetime(date);
        } else {
            toast.closeAll();
            ShowToast(
                "Invalid Date/Time",
                "Please select a date-time that's greater than today's date-time",
                "error",
                3000
            );
            return;
        }
    }

    const handleSubmitListing = async () => {
        setIsSubmitting(true);
        const formData = new FormData();
        try {
            formData.append("title", title);
            formData.append("shortDescription", shortDescription);
            formData.append("longDescription", longDescription);
            formData.append("portionPrice", portionPrice);
            formData.append("totalSlots", totalSlots);
            formData.append("datetime", datetime);
            images.forEach((image, index) => {
                formData.append("images", image);
            });

            const addListingResponse = await server.post("/listings/addListing", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                transformRequest: formData => formData,
                timeout: 10000,
            }
            )
            if (addListingResponse.status === 200) {
                fetchListings();
                setTimeout(() => {
                    onClose();
                    setDefaultState();
                    toast.closeAll();
                    ShowToast(
                        "Listing published successfully!",
                        "We'll notify you when all slots have been filled.",
                        "success",
                        4000
                    );
                }, 1500);
            }
        } catch (error) {
            toast.closeAll();
            if (error.code === "ECONNABORTED") {
                ShowToast(
                    "Request timed out",
                    "Please try again later.",
                    "error",
                    2500
                );
                return;
            } else {
                ShowToast(
                    "Error submitting listing",
                    "Please try again later.",
                    "error",
                    2500
                );
                return;
            }
        }
    };

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        let filesAccepted = false;
        for (const file of files) {
            const allowedTypes = [
                "image/jpeg",
                "image/jpg",
                "image/png",
                "image/svg+xml",
                "image/heic"
            ];
            if (allowedTypes.includes(file.type)) {
                filesAccepted = true;
            } else {
                filesAccepted = false;
                break;
            }
        }
        if (filesAccepted) {
            // set images to previous images + files
            setImages((prevImages) => [...prevImages, ...files]);
            setFileFormatError("");

        } else {
            setFileFormatError("Invalid file format. Only JPEG, JPG, PNG, and SVG are allowed.");
        }
    };    

    const handleRemoveImage = (index) => {
        setImages((prevImages) => prevImages.filter((image, imageIndex) => imageIndex !== index));
    };
    

    const handleCancelClick = () => {
        onAlertOpen();
    };

    const handleAlertConfirm = () => {
        onAlertClose();
        onClose();
    };

    useEffect(() => {
        if (
            title.trim() === "" ||
            shortDescription.trim() === "" ||
            longDescription.trim() === "" ||
            images.length === 0
        ) {
            setModalError(true);
            setValidListing(false);
            if (images.length > 5) {
                ShowToast(
                    "That's too many images!",
                    "You can upload a maximum of 5 images",
                    "error",
                    2500
                );
            }
        } else {
            setModalError(false);
            setValidListing(true);
        }
    }, [title, shortDescription, longDescription, images]);

    useEffect(() => {
        if (portionPrice > 10) {
            setPortionPrice(10);
            toast.closeAll();
            ShowToast(
                "Woah, that's too expensive!",
                "Fee cannot exceed $10",
                "error",
                2500
            );
        }
    }, [portionPrice]);

    useEffect(() => {
        if (totalSlots > 5) {
            setTotalSlots(5);
            toast.closeAll();
            ShowToast(
                "Too many Guests!",
                "You can invite a maximum of 5 Guests",
                "error",
                2500
            );
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
                isCentered
            >
                <ModalOverlay
                    bg="blackAlpha.300"
                    backdropFilter="blur(3px) hue-rotate(90deg)"
                />
                <ModalContent overflow={"hidden"} maxH={"90vh"}>
                    <ModalHeader>Host your next meal!</ModalHeader>
                    <ModalBody>
                        <FormControl mb={5} isRequired>
                            <FormLabel>
                                What is the name of your dish?
                            </FormLabel>
                            <Input
                                type="text"
                                placeholder="E.g Pani Puri"
                                onChange={(event) =>
                                    setTitle(event.target.value)
                                }
                            />
                        </FormControl>

                        <FormControl mb={5} isRequired>
                            <FormLabel>What is this dish?</FormLabel>
                            <Input
                                type="text"
                                placeholder="E.g Popular Indian Street Food"
                                onChange={(event) =>
                                    setShortDescription(event.target.value)
                                }
                            />
                        </FormControl>

                        <FormControl mb={5} isRequired>
                            <FormLabel>
                                Give a detailed description of this dish
                            </FormLabel>
                            <Input
                                type="text"
                                placeholder="E.g Pani Puri offers a burst of flavors and textures in every bite. It is made of a crispy shell, a mixture of potato, onion, peas and chickpea."
                                onChange={(event) =>
                                    setLongDescription(event.target.value)
                                }
                            />
                        </FormControl>

                        <Box
                            display="flex"
                            flexDirection="row"
                            justifyContent="space-between"
                            mb={3}
                        >
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
                                        onChange={(
                                            valueAsString,
                                            valueAsNumber
                                        ) =>
                                            setPortionPrice(valueAsNumber || 1)
                                        }
                                    >
                                        <NumberInputField
                                            borderRadius={"0px 6px 6px 0px"}
                                        />
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
                                        setTotalSlots(valueAsNumber || 1)
                                    }
                                >
                                    <NumberInputField />
                                    <NumberInputStepper>
                                        <NumberIncrementStepper />
                                        <NumberDecrementStepper />
                                    </NumberInputStepper>
                                </NumberInput>
                            </FormControl>
                        </Box>

                        <FormControl mb={5} isRequired>
                            <FormLabel>
                                When will you be hosting this meal?
                            </FormLabel>
                            <Input
                                type="datetime-local"
                                value={datetime}
                                onChange={(event) =>
                                    checkDate(event.target.value)
                                }
                            />
                        </FormControl>

                        <FormControl isRequired>
                            <FormLabel>Upload photos of your dish (Max: 5 images)</FormLabel>
                            <Input
                                type="file"
                                size="sm"
                                onChange={handleFileChange}
                                multiple
                            />
                            {fileFormatError && (
                                <FormHelperText color="red">
                                    {fileFormatError}
                                </FormHelperText>
                            )}
                            <Box mt={2}>
                                {images.length > 0 && (
                                    <>
                                        <FormLabel>Selected images:</FormLabel>
                                        {images.map((image, index) => (
                                            <Card key={index} mb={2} padding={"13px"} display="flex" flexDirection={"row"} justifyContent={"space-between"}>
                                                <Text fontSize={"15px"} color={"green"} mt={2}>
                                                    {image.name}
                                                </Text>
                                                <Button onClick={() => handleRemoveImage(index)}>
                                                    <CloseIcon boxSize={3}/>
                                                </Button>
                                            </Card>
                                        ))}
                                    </>
                                )}
                            </Box>
                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        <Box flex={"1"} textAlign={"left"}>
                            {modalError && (
                                <Text color="red">All fields are required</Text>
                            )}
                            {validListing && (
                                <Text color="green">
                                    <CheckCircleIcon
                                        color="green"
                                        mr={2}
                                        mb={1}
                                    />
                                    You are good to go!
                                </Text>
                            )}
                        </Box>
                        <Button
                            colorScheme={"red"}
                            mr={3}
                            borderRadius={"10px"}
                            onClick={handleCancelClick}
                        >
                            Cancel
                        </Button>
                        {modalError ? (
                            <Button
                                borderRadius={"10px"}
                                colorScheme="blue"
                                color="white"
                                fontWeight="bold"
                                isDisabled
                            >
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
                                    <Button
                                        onClick={handleSubmitListing}
                                        variant="MMPrimary"
                                    >
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
                motionPreset="slideInBottom"
                closeOnOverlayClick={false}
            >
                <AlertDialogOverlay
                    bg="blackAlpha.300"
                    backdropFilter="blur(6px) hue-rotate(90deg)"
                >
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Discard changes
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            Are you sure you want to cancel? All your changes
                            will be lost.
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onAlertClose}>
                                Go back
                            </Button>
                            <Button
                                colorScheme="red"
                                onClick={handleAlertConfirm}
                                ml={3}
                            >
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
