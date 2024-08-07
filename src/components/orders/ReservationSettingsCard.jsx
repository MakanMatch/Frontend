import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { AlertDialog, AlertDialogBody, AlertDialogCloseButton, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button, Card, CardBody, CardFooter, CardHeader, HStack, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Spacer, Text, useDisclosure, useToast, VStack } from '@chakra-ui/react'
import React, { useRef, useState } from 'react'
import server from '../../networking';
import { useDispatch, useSelector } from 'react-redux';
import { reloadAuthToken } from '../../slices/AuthState';
import { useNavigate } from 'react-router-dom';
import configureShowToast from '../showToast';

function ReservationSettingsCard({ listingID, listingPublished, paymentImage, togglePublished, setEditListing, pricePerPortion, guestSlots, minGuests, handleSettingsChange }) {
    const formatAsCurrency = (val) => `$` + val
    const parseCurrencyValue = (val) => val.replace(/^\$/, '')
    
    const { authToken } = useSelector((state) => state.auth);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const toast = useToast();
    const showToast = configureShowToast(toast);
    const [deleting, setDeleting] = useState(false);
    const cancelRef = useRef();

    const handleDeleteListing = () => {
        setDeleting(true)
        server.post("/deleteListing", {
            listingID
        })
        .then(res => {
            dispatch(reloadAuthToken(authToken))
            setDeleting(false)
            if (res.status == 200 && res.data && typeof res.data == "string") {
                if (res.data.startsWith("SUCCESS")) {
                    handleClose()
                    navigate('/')
                    setTimeout(() => {
                        showToast("Listing Deleted", "Your listing has been successfully deleted. Looking forward to new ones in the future!", 4000, true, "success")
                    }, 100)
                    return
                } else {
                    console.log("Unexpected response when deleting listing; response: ", res.data)
                    showToast("Something went wrong", "Failed to delete your listing. Please try again!", 2000, true, "error")
                }
            } else {
                console.log("Failed to delete listing; response: ", res)
                showToast("Something went wrong", "Failed to delete your listing. Please try again!", 2000, true, "error")
            }
        })
        .catch(err => {
            dispatch(reloadAuthToken(authToken))
            setDeleting(false)
            if (err.response && err.response.data && typeof err.response.data == "string") {
                console.log("Failed to delete listing; error: ", err.response.data)
                if (err.response.data.startsWith("UERROR")) {
                    showToast("Something went wrong", err.response.data.substring("UERROR: ".length), 3000, true, "error")
                } else {
                    showToast("Something went wrong", "Failed to delete your listing. Please try again!", 2000, true, "error")
                }
            } else {
                console.log("Failed to delete listing; error: ", err)
                showToast("Something went wrong", "Failed to delete your listing. Please try again!", 2000, true, "error")
            }
        })
    }

    const handleClose = () => {
        setDeleting(false)
        onClose()
    }

    return (
        <>
            <Card maxWidth={"100%"}>
                <CardHeader fontFamily={"Sora"} fontWeight={"bold"}>Reservation Settings</CardHeader>
                <CardBody>
                    <VStack spacing={"10px"} textAlign={"left"}>
                        <HStack width={"100%"}>
                            <Text>Max. Portions</Text>
                            <Spacer />
                            <NumberInput defaultValue={1} min={minGuests > 0 ? minGuests : 1} max={10} value={guestSlots} onChange={(value) => handleSettingsChange(value, "guestSlots")}>
                                <NumberInputField />
                                <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                </NumberInputStepper>
                            </NumberInput>
                        </HStack>

                        <HStack width={"100%"}>
                            <Text>Price Per Portion</Text>
                            <Spacer />
                            <NumberInput defaultValue={'$1.50'} onChange={(valueString) => handleSettingsChange(parseCurrencyValue(valueString), "pricePerPortion")} value={formatAsCurrency(pricePerPortion)}>
                                <NumberInputField />
                            </NumberInput>
                        </HStack>
                    </VStack>
                </CardBody>
                <CardFooter>
                    <VStack width={"100%"}>
                        {!paymentImage ? (
                            <>
                                <Text fontSize={"sm"} color={"red.500"}>Please upload your PayNow QR code to hide/show listing.</Text>
                                <Button fontSize={"sm"} variant={"link"} color={"primaryColour"} onClick={() => setEditListing(false)}>See Manage Guests screen.</Button>
                            </>
                        ) : (
                            <>
                                {listingPublished ?
                                    <Button variant={"MMPrimary"} width={"100%"} leftIcon={<ViewOffIcon />} onClick={() => togglePublished(false)}>Hide Listing</Button> :
                                    <Button variant={"MMPrimary"} width={"100%"} leftIcon={<ViewIcon />} onClick={() => togglePublished(true)}>Publish Listing</Button>
                                }
                            </>
                        )}

                        <Button variant={'ghost'} colorScheme='red' fontWeight={"bold"} borderRadius={"10px"} width={"100%"} onClick={onOpen}>Delete Listing</Button>
                    </VStack>
                </CardFooter>
            </Card>

            {/* Delete listing confirmation dialog */}
            <AlertDialog
                motionPreset='slideInBottom'
                leastDestructiveRef={cancelRef}
                onClose={onClose}
                isOpen={isOpen}
                isCentered
            >
                <AlertDialogOverlay />

                <AlertDialogContent>
                    <AlertDialogHeader>Delete Listing?</AlertDialogHeader>
                    <AlertDialogCloseButton isDisabled={deleting} />
                    <AlertDialogBody>
                        <VStack width={"100%"} alignItems={"flex-start"} spacing={"10px"}>
                            <Text><strong>Are you sure you want to delete your listing?</strong></Text>
                            <Text>All of the listing information, attached images, reservations and other information will be deleted.</Text>
                            <Text>This is highly discouraged, especially if you have active reservations.</Text>
                            <Text>Please note that this action is irreversible, <strong>proceed with caution.</strong></Text>
                        </VStack>
                    </AlertDialogBody>
                    <AlertDialogFooter>
                        <Button ref={cancelRef} isDisabled={deleting} onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button colorScheme='red' ml={3} isLoading={deleting} loadingText="Deleting..." onClick={handleDeleteListing}>
                            Confirm Delete
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}

export default ReservationSettingsCard