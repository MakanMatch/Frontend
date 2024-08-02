/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from "react";
import { CheckCircleIcon, CloseIcon } from "@chakra-ui/icons";
import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, Input, useDisclosure, FormControl, FormLabel, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, FormHelperText, Text, Box, InputGroup, InputLeftAddon, AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter, Card, Switch, useToast } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { reloadAuthToken } from "../../slices/AuthState";
import { useNavigate } from "react-router-dom";
import server from "../../networking";

const AddListingModal = ({ isOpen, onOpen, onClose, closeSidebar }) => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    const toast = useToast();

    const [title, setTitle] = useState("");
    const [shortDescription, setShortDescription] = useState("");
    const [longDescription, setLongDescription] = useState("");
    const [portionPrice, setPortionPrice] = useState(1);
    const [totalSlots, setTotalSlots] = useState(1);
    const [datetime, setDatetime] = useState(today.toISOString().slice(0, 16));
    const [isChecked, setIsChecked] = useState(false);
    const [images, setImages] = useState([]);
    const authToken = useSelector((state) => state.auth.authToken);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [fileFormatError, setFileFormatError] = useState("");
    const [modalError, setModalError] = useState(false);
    const [validListing, setValidListing] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const cancelRef = useRef();
    const {
        isOpen: isAlertOpen,
        onOpen: onAlertOpen,
        onClose: onAlertClose,
    } = useDisclosure();

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
        setIsChecked(false);
    }

    function checkDate(date) {
        if (new Date(date) > new Date()) {
            setDatetime(date);
        } else {
            displayToast(
                "Invalid Date/Time",
                "Please select a date-time that's greater than today's date-time",
                "error",
                3000,
                true
            );
            return;
        }
    }

    const handleSubmitListing = async () => {
        closeSidebar();
        setIsSubmitting(true);
        const formData = new FormData();
        formData.append("title", title);
        formData.append("shortDescription", shortDescription);
        formData.append("longDescription", longDescription);
        formData.append("portionPrice", portionPrice);
        formData.append("totalSlots", totalSlots);
        formData.append("datetime", new Date(datetime).toISOString());
        formData.append("publishInstantly", isChecked);
        images.forEach((image) => {
            formData.append("images", image);
        });

        try {
            const addListingResponse = await server.post("/listings/addListing", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                transformRequest: formData => formData
            })
            dispatch(reloadAuthToken(authToken));
            if (addListingResponse.status == 200) {
                onClose();
                setDefaultState();
                setIsSubmitting(false);
                if (addListingResponse.data.listingDetails.published === false) {
                    navigate("/expandedListingHost", {
                        state: {
                            listingID: addListingResponse.data.listingDetails.listingID
                        } 
                    });
                    displayToast("Listing created successfully", "You can manage your listing here", "success", 3000, true);
                } else {
                    localStorage.setItem("published", "true");
                    window.location.href = "/";
                }
            }
        } catch (error) {
            dispatch(reloadAuthToken(authToken));
            setIsSubmitting(false);
            if (error.response && error.response.data && typeof error.response.data == "string") {
                console.log("Failed to add listing; response: " + error.response.data)
                if (error.response.data.startsWith("UERROR")) {
                    displayToast(
                        "Uh-oh!",
                        error.response.data.substring("UERROR: ".length),
                        "info",
                        3500,
                        true
                    )
                } else {
                    onClose();
                    setDefaultState();
                    displayToast(
                        "Something went wrong",
                        "Failed to add listing. Please try again",
                        "error",
                        3500,
                        true
                    )
                }
            } else {
                onClose();
                setDefaultState();
                console.log("Unknown error occurred when adding listing; error: " + error)
                displayToast(
                    "Something went wrong",
                    "Failed to add listing. Please try again",
                    "error",
                    3500,
                    true
                )
            }
        }
    };

    const handlePublishToggle = () => {
        setIsChecked(!isChecked);
    };

    const handleKeyDown = (event) => {
        console.log(event.key);
        if (event.key === "Enter" ) {
            if (validListing && !isSubmitting && !modalError) {
                handleSubmitListing();
            } else {
                displayToast(
                    "Uh-oh!",
                    "Please fill in all the required fields before submitting",
                    "error",
                    3000,
                    true
                );
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
        setDefaultState();
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
                displayToast(
                    "That's too many images!",
                    "You can upload a maximum of 5 images",
                    "error",
                    2500,
                    true
                );
            }
        } else {
            setModalError(false);
            setValidListing(true);
        }
    }, [title, shortDescription, longDescription, images]);

    useEffect(() => {
        if (portionPrice > 10) {
            displayToast(
                "Woah, that's too expensive!",
                "Fee cannot exceed $10",
                "error",
                2500,
                true
            );
        }
    }, [portionPrice]);

    useEffect(() => {
        if (totalSlots > 10) {
            displayToast(
                "Too many Slots!",
                "You can prepare for a maximum of 10 slots",
                "error",
                2500,
                true
            );
        }
    }, [totalSlots]);
    return (
        <div>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                size={"lg"}
                scrollBehavior="inside"
                closeOnOverlayClick={false}
                isCentered
            >
                <ModalOverlay
                    backdropFilter="brightness(1)"
                />
                <ModalContent>
                    <ModalHeader>Host your next meal!</ModalHeader>
                    <ModalBody>
                        <FormControl mb={5} isRequired>
                            <FormLabel>
                                What is the name of your dish?
                            </FormLabel>
                            <Input
                                type="text"
                                placeholder="E.g Pani Puri"
                                onKeyDown={handleKeyDown}
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
                                onKeyDown={handleKeyDown}
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
                                onKeyDown={handleKeyDown}
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
                                        min={1}
                                        max={10}
                                        value={portionPrice}
                                        inputMode="numeric"
                                        onKeyDown={handleKeyDown}
                                        onChange={(valueAsString, valueAsNumber) => {
                                            const isValid = /^[0-9]*$/.test(valueAsString);
                                            if (!isValid) {
                                                return;
                                            }
                                            if (valueAsString === "") {
                                                setPortionPrice("");
                                            } else {
                                                setPortionPrice(valueAsNumber);
                                            }
                                        }}
                                        onBlur={() => {
                                            if (portionPrice === "") {
                                                setPortionPrice(0);
                                            } else if (portionPrice < 0) {
                                                setPortionPrice(0);
                                            } else if (portionPrice > 10) {
                                                setPortionPrice(10);
                                            }
                                        }}
                                    >
                                        <NumberInputField borderRadius={"0px 6px 6px 0px"} />
                                        <NumberInputStepper>
                                            <NumberIncrementStepper />
                                            <NumberDecrementStepper />
                                        </NumberInputStepper>
                                    </NumberInput>
                                </InputGroup>
                            </FormControl>

                            <FormControl flex="1" ml={2} isRequired>
                                <FormLabel>No. of Slots (Max: 10)</FormLabel>
                                    <NumberInput
                                        step={1}
                                        min={1}
                                        max={10}
                                        value={totalSlots}
                                        inputMode="numeric"
                                        onKeyDown={handleKeyDown}
                                        onChange={(valueAsString, valueAsNumber) => {
                                            const isValid = /^[0-9]*$/.test(valueAsString);
                                            if (!isValid) {
                                                return;
                                            }
                                            if (valueAsString === "") {
                                                setTotalSlots("");
                                            } else {
                                                setTotalSlots(valueAsNumber);
                                            }
                                        }}
                                        onBlur={() => {
                                            if (totalSlots === "") {
                                                setTotalSlots(0);
                                            } else if (totalSlots < 0) {
                                                setTotalSlots(0);
                                            } else if (totalSlots > 10) {
                                                setTotalSlots(10);
                                            }
                                        }}
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

                        <FormControl mb={5} isRequired>
                            <FormLabel>Upload photos of your dish (Max: 5 images)</FormLabel>
                            <Input
                                key={Date.now()}
                                type="file"
                                size="sm"
                                onKeyDown={handleKeyDown}
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
                                                    <CloseIcon boxSize={3} />
                                                </Button>
                                            </Card>
                                        ))}
                                    </>
                                )}
                            </Box>
                        </FormControl>
                        <FormControl display='flex' alignItems='center'>
                            <FormLabel mb='0'>
                                Publish instantly?
                            </FormLabel>
                            <Switch isChecked={isChecked} onChange={handlePublishToggle} />
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
                <AlertDialogOverlay>
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
