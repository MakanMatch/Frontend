import { PlusSquareIcon, SmallAddIcon, ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { Box, Button, Card, CardBody, CardFooter, CardHeader, Center, Container, EditableTextarea, Flex, Grid, GridItem, HStack, Heading, Image, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Spacer, Spinner, Text, Textarea, VStack, useToast, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, StatUpArrow, Input, SlideFade, CloseButton, Tooltip, Badge, ScaleFade, Stack } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ReservationSettingsCard from '../../components/orders/ReservationSettingsCard'
import server from '../../networking';
import axios from 'axios'
import { useNavigate, useSearchParams } from 'react-router-dom'
import DeleteImageAlert from '../../components/orders/DeleteImageAlert'
import UploadNewImageModal from '../../components/orders/UploadNewImageModal'
import HostListingImage from '../../components/orders/HostListingImage'
import configureShowToast from '../../components/showToast'
import { reloadAuthToken } from '../../slices/AuthState'

function ExpandedListingHost() {
    // const Universal = useSelector(state => state.universal)
    const toast = useToast()
    const showToast = configureShowToast(toast)
    const navigate = useNavigate()

    const backendAPIURL = import.meta.env.VITE_BACKEND_URL
    const [searchParams, setSearchParams] = useSearchParams()
    const [listingID, setListingID] = useState(searchParams.get("id"))
    const [pricePerPortion, setPricePerPortion] = useState('0.00')
    const [listingPublished, setListingPublished] = useState(false)
    const [listingData, setListingData] = useState({
        listingID: null,
        title: null,
        images: [],
        shortDescription: null,
        longDescription: null,
        portionPrice: null,
        approxAddress: null,
        address: null,
        totalSlots: null,
        datetime: null,
        published: null
    })
    const [longDescription, setLongDescription] = useState(listingData.longDescription)
    const [shortDescription, setShortDescription] = useState(listingData.shortDescription)
    const [guestSlots, setGuestSlots] = useState(1)
    const [changesMade, setChangesMade] = useState(false)
    const [loading, setLoading] = useState(true)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { isOpen: deleteImageDialogOpen, onOpen: openDeleteImageDialog, onClose: closeDeleteImageDialog } = useDisclosure()
    const [imageToBeDeleted, setImageToBeDeleted] = useState(null)
    const [isUploading, setIsUploading] = useState(false)
    const [file, setFile] = useState(null);
    const { user, loaded, error, authToken } = useSelector(state => state.auth)
    const dispatch = useDispatch();

    const handleClose = () => {
        onClose()
        setFile(null)
    }
    const handleDeleteImageDialogClosure = () => {
        closeDeleteImageDialog()
        setImageToBeDeleted(null)
    }
    const handleFileSubmission = (e) => {
        if (e.target.files.length > 0) {
            setFile(e.target.files[0])
        }
    }
    const handleShortDescriptionChange = (e) => { setShortDescription(e.target.value); }
    const handleLongDescriptionChange = (e) => { setLongDescription(e.target.value); }
    const handleDeleteImage = (imageName) => {
        openDeleteImageDialog()
        setImageToBeDeleted(imageName)
    }
    const togglePublished = (newValue) => {
        setListingPublished(newValue)
        handleSaveChanges(newValue, true)
    }

    const handleSettingsChange = (newValue, setting) => {
        if (setting == "guestSlots") {
            setGuestSlots(newValue)
        } else if (setting == "pricePerPortion") {
            setPricePerPortion(newValue)
        }
    }

    const checkForChanges = () => {
        if (shortDescription != listingData.shortDescription ||
            longDescription != listingData.longDescription ||
            guestSlots != listingData.totalSlots ||
            pricePerPortion != listingData.portionPrice
        ) {
            setChangesMade(true)
        } else {
            setChangesMade(false)
        }
    }

    const imgBackendURL = (imgName) => `${backendAPIURL}/cdn/getImageForListing/?listingID=${listingData.listingID}&imageName=${imgName}`
    const processData = (data) => {
        let datetime = new Date(data.datetime)
        let formattedString = datetime.toLocaleString('en-US', { day: 'numeric', month: 'short', year: 'numeric', weekday: 'short' })
        data.datetime = formattedString

        data.images = data.images.split("|")

        return data
    }

    useEffect(() => {
        if (loaded == true) {
            if (!user) {
                console.log("Unauthenticated user attempting to access user-scoped webpage; redirecting...")
                showToast("Error", "Please sign in first.", 3000, true, "error")
                navigate("/")
                return
            }

            if (!history.state.listingID) {
                if (!listingID) {
                    console.log("No listing ID provided to render expanded listing view.")
                    showToast("Something went wrong", "Insufficient information provided.", 1500, true, "error")
                    navigate("/")
                    return
                }
            } else {
                setListingID(history.state.listingID)
            }

            fetchListingDetails(listingID || history.state.listingID)
        }
    }, [loaded, user, authToken])

    useEffect(checkForChanges, [shortDescription, longDescription, guestSlots, pricePerPortion])

    const fetchListingDetails = (id) => {
        server.get(`/cdn/getListing?id=${id || listingID}`)
            .then(response => {
                dispatch(reloadAuthToken(authToken))
                if (response.status == 200) {
                    const processedData = processData(response.data)
                    if (user && processedData.hostID != user.userID) {
                        console.log("Logged in user is unauthorised for listing host view action; redirecting...")
                        navigate("/expandedListingGuest")
                        history.pushState({ listingID: (id || listingID) }, "")
                        return
                    }
                    setListingData(processedData)
                    setShortDescription(processedData.shortDescription || "")
                    setLongDescription(processedData.longDescription || "")
                    setListingPublished(processedData.published || false)
                    setGuestSlots(processedData.totalSlots || 1)
                    setPricePerPortion(processedData.portionPrice || 0.00)
                    setLoading(false)
                    return
                } else if (response.status == 404) {
                    console.log("Listing not found, re-directing to home.")
                    navigate("/")
                    return
                } else {
                    showToast("Error", "Failed to retrieve listing details", 5000, true, "error")
                    console.log("EXPANDEDLISTINGHOST: Failed to retrieve listing details, redirecting to home. Response below.")
                    console.log(response.data)
                    navigate("/")
                    return
                }
            })
            .catch(err => {
                dispatch(reloadAuthToken(authToken))
                console.log("EXPANDEDLISTINGHOST: Failed to retrieve listing details, redirecting to home. Error: " + err)
                showToast("Error", "Failed to retrieve listing details", 5000, true, "error")
                navigate("/")
                return
            })
    }

    const uploadImage = (e) => {
        e.preventDefault();
        setIsUploading(true)

        if (file == null) {
            showToast("Error", "No file selected", 2500, true, "error")
            setIsUploading(false)
            return
        }

        const formData = new FormData()

        formData.append('file', file)
        formData.append('fileName', file.name)
        formData.append('listingID', listingData.listingID)
        const config = {
            'Content-Type': 'multipart/form-data'
        }

        server.post("/uploadListingImage", formData, { headers: config, transformRequest: formData => formData })
            .then(res => {
                dispatch(reloadAuthToken(authToken))
                if (res.status == 200 && res.data.startsWith("SUCCESS")) {
                    showToast("Success", "Image uploaded successfully", 2500, true, "success")
                    setIsUploading(false)
                    handleClose()
                    fetchListingDetails()
                    return
                } else {
                    showToast("Error", "Failed to upload image", 5000, true, "error")
                    console.log(res.data)
                    setIsUploading(false)
                    return
                }
            })
            .catch(err => {
                dispatch(reloadAuthToken(authToken))
                console.log("Failed to upload image; error: " + err)
                showToast("Error", "Failed to upload image", 5000, true, "error")
                setIsUploading(false)
                return
            })
    }

    const handleSaveChanges = (value, fromPublishToggle) => {
        const data = {
            listingID: listingData.listingID,
            shortDescription: shortDescription,
            longDescription: longDescription,
            totalSlots: guestSlots,
            portionPrice: pricePerPortion
        }
        if (fromPublishToggle) {
            data.published = value
        }

        server.post("/updateListing", data)
            .then(res => {
                dispatch(reloadAuthToken(authToken));

                if (res.status == 200 && res.data.startsWith("SUCCESS")) {
                    showToast("Success", "Changes saved successfully", 2500, true, "success")
                    setChangesMade(false)
                    fetchListingDetails()
                    return
                } else {
                    showToast("Error", "Failed to save changes", 5000, true, "error")
                    console.log(res.data)
                    return
                }
            })
            .catch(err => {
                dispatch(reloadAuthToken(authToken))
                console.log("Failed to update listing; error: " + err);
                showToast("Something went wrong", "Failed to update the listing. Try again later.", 1500, true, "error")
            })
    }

    function Statistic({ value, description }) {
        return (
            <VStack alignItems={"flex-start"} spacing={"0px"}>
                <Text fontWeight={"bold"} fontSize={"large"}>{value}</Text>
                <Text>{description}</Text>
            </VStack>
        )
    }

    if (loading) {
        return (<Spinner />)
    }

    return (
        <>
            <Grid
                h={"100%"}
                templateColumns='repeat(3, 1fr)'
                gap={4}
                p={"10px"}
            >
                <GridItem colSpan={2}>
                    <VStack alignItems={"flex-start"}>
                        <Text>{listingData.datetime}</Text>
                        <HStack spacing={5} alignItems={'center'}>
                            <Heading>{listingData.title}</Heading>
                            <ScaleFade initialScale={0.5} in={!listingPublished}>
                                <Badge colorScheme={'purple'} variant={'solid'} px={3} py={1}>HIDDEN</Badge>
                            </ScaleFade>
                        </HStack>
                    </VStack>
                </GridItem>
                <GridItem colSpan={1} alignContent={"flex-end"}>
                    {changesMade && (
                        <SlideFade in={true}>
                            <HStack>
                                <Spacer />
                                <Button variant={"MMPrimary"} onClick={handleSaveChanges}>Save Changes</Button>
                            </HStack>
                        </SlideFade>
                    )}
                </GridItem>
                <GridItem colSpan={3} mb={"20px"}>
                    <VStack alignItems={"flex-start"}>
                        <HStack spacing={"10px"} overflowX={"auto"} height={"250px"}>
                            {listingData.images.map((imgName, index) => {
                                if (imgName) {
                                    return (
                                        <HostListingImage key={index} index={index} listingImages={listingData.images} imgURL={imgBackendURL(imgName)} imgName={imgName} handleDeleteImage={handleDeleteImage} />
                                    )
                                }
                            })}
                            <Center h={"100%"} aspectRatio={"1"} bg={"gray.300"} textAlign={"center"} onClick={onOpen} rounded={"10px"}>
                                <SmallAddIcon boxSize={"10"} />
                            </Center>
                        </HStack>
                    </VStack>
                </GridItem>
                <GridItem colSpan={2}>
                    <VStack alignItems={"flex-start"} spacing={{ base: "10px", md: "20px", lg: "30px" }}>
                        <VStack alignItems={"flex-start"} width={"100%"}>
                            <Text fontWeight={"bold"} mb={"10px"}>Short Description (shown on Home page)</Text>
                            <Input placeholder='Briefly describe your dish' value={shortDescription} onChange={handleShortDescriptionChange} />

                            <Text fontWeight={"bold"} mb={"10px"} mt={5}>Description</Text>
                            <Textarea placeholder='Describe your dish here' value={longDescription} onChange={handleLongDescriptionChange} />
                        </VStack>

                        {/* <Spacer /> */}

                        <VStack alignItems={"flex-start"} width={"100%"}>
                            <Heading size={"md"}>Listing Statistics</Heading>

                            <HStack spacing={"30px"} wrap={"wrap"}>
                                <Statistic value={"2/5"} description={"Reservations"} />
                                <Statistic value={"1000"} description={"Impressions"} />
                                <Statistic value={"45%"} description={"Click-Through Rate"} />
                                <Statistic value={"$7.00"} description={"Revenue"} />
                            </HStack>
                        </VStack>
                    </VStack>
                </GridItem>

                <GridItem colSpan={1}>
                    <ReservationSettingsCard listingPublished={listingPublished} togglePublished={togglePublished} pricePerPortion={pricePerPortion} guestSlots={guestSlots} handleSettingsChange={handleSettingsChange} />
                </GridItem>
            </Grid>
            <UploadNewImageModal isOpen={isOpen} handleClose={handleClose} handleFileSubmission={handleFileSubmission} isUploading={isUploading} uploadImage={uploadImage} />
            <DeleteImageAlert isOpen={deleteImageDialogOpen} onClose={handleDeleteImageDialogClosure} listingID={listingData.listingID} imageName={imageToBeDeleted} showToast={showToast} refreshPage={fetchListingDetails} />
        </>
    )
}

export default ExpandedListingHost