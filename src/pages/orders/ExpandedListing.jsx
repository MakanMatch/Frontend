import { PlusSquareIcon, SmallAddIcon, ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { Box, Button, Card, CardBody, CardFooter, CardHeader, Center, Container, EditableTextarea, Flex, Grid, GridItem, HStack, Heading, Image, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Spacer, Spinner, Text, Textarea, VStack, useToast, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, StatUpArrow, Input, SlideFade, CloseButton, Tooltip } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import ReservationSettingsCard from '../../components/orders/ReservationSettingsCard'
import server from '../../networking';
import axios from 'axios'
import { useNavigate, useSearchParams } from 'react-router-dom'
import DeleteImageAlert from '../../components/orders/DeleteImageAlert'

function ExpandedListing() {
    // const Universal = useSelector(state => state.universal)
    const toast = useToast()
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
    const [changesMade, setChangesMade] = useState(false)
    const [loading, setLoading] = useState(true)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { isOpen: deleteImageDialogOpen, onOpen: openDeleteImageDialog, onClose: closeDeleteImageDialog } = useDisclosure()
    const [imageToBeDeleted, setImageToBeDeleted] = useState(null)
    const [file, setFile] = useState(null);

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
    const handleDescriptionChange = (e) => {
        setLongDescription(e.target.value);
        if (e.target.value != listingData.longDescription) {
            setChangesMade(true)
        } else {
            setChangesMade(false)
        }
    }
    const handleDeleteImage = (imageName) => {
        openDeleteImageDialog()
    }
    const togglePublished = (newValue) => {
        setListingPublished(newValue)
        console.log("Updating to: " + newValue)
        handleSaveChanges(newValue, true)
    }

    const showComingSoon = () => { showToast("Coming soon", "This feature is not complete yet.", 3000) }
    const imgBackendURL = (imgName) => `${backendAPIURL}/cdn/getImageForListing/?listingID=${listingData.listingID}&imageName=${imgName}`
    const showToast = (title, description, duration = 5000, isClosable = true, status = 'info', icon = null) => {
        if (!["success", "warning", "error", "info"].includes(status)) {
            status = "info"
        }

        const toastConfig = {
            title: title,
            description: description,
            duration: duration,
            isClosable: isClosable,
            status: status
        }
        if (icon != null) {
            toastConfig.icon = icon
        }

        toast(toastConfig)
    }
    const processData = (data) => {
        let datetime = new Date(data.datetime)
        let formattedString = datetime.toLocaleString('en-US', { day: 'numeric', month: 'short', year: 'numeric', weekday: 'short' })
        data.datetime = formattedString

        data.images = data.images.split("|")

        return data
    }

    useEffect(() => {
        if (!listingID) {
            navigate("/")
            return
        }
        fetchListingDetails()
    }, [])

    const fetchListingDetails = () => {
        server.get(`/cdn/getListing?id=${listingID}`)
            .then(response => {
                if (response.status == 200) {
                    const processedData = processData(response.data)
                    setListingData(processedData)
                    setLongDescription(processedData.longDescription)
                    setListingPublished(processedData.published)
                    setLoading(false)
                    return
                } else if (response.status == 404) {
                    console.log("Listing not found, re-directing to home.")
                    navigate("/")
                    return
                } else {
                    showToast("Error", "Failed to retrieve listing details", 5000, true, "error")
                    console.log("EXPANDEDLISTING: Failed to retrieve listing details, redirecting to home. Response below.")
                    console.log(response.data)
                    navigate("/")
                    return
                }
            })
            .catch(err => {
                showToast("Error", "Failed to retrieve listing details", 5000, true, "error")
                console.log("EXPANDEDLISTING: Failed to retrieve listing details, redirecting to home. Response below.")
                console.log(err)
                navigate("/")
                return
            })
    }

    const uploadImage = (e) => {
        e.preventDefault();
        if (file == null) {
            showToast("Error", "No file selected", 2500, true, "error")
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
                if (res.status == 200 && res.data.startsWith("SUCCESS")) {
                    showToast("Success", "Image uploaded successfully", 2500, true, "success")
                    handleClose()
                    fetchListingDetails()
                    return
                } else {
                    showToast("Error", "Failed to upload image", 5000, true, "error")
                    console.log(res.data)
                    return
                }
            })
            .catch(err => {
                showToast("Error", "Failed to upload image", 5000, true, "error")
                console.log(err)
                return
            })
    }

    const handleSaveChanges = (value, fromPublishToggle) => {
        const data = {
            listingID: listingData.listingID,
            longDescription: longDescription
        }
        if (fromPublishToggle) {
            data.published = value
        }

        server.post("/updateListing", data)
            .then(res => {
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
                        <Heading>{listingData.title}</Heading>
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
                                        <Box key={index} position={"relative"} height={"100%"}>
                                            <Image key={index} maxH={"100%"} objectFit={"cover"} display={"block"} rounded={"10px"} src={imgBackendURL(imgName)} />
                                            <Tooltip hasArrow label={"Delete image"} placement={"top"}>
                                                <CloseButton size={"md"} position={"absolute"} top={"0"} right={"0"} m={"2"} bgColor={"red"} color={"white"} onClick={() => { handleDeleteImage(imgName) }} />
                                            </Tooltip>
                                        </Box>
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
                            <Text fontWeight={"bold"} mb={"10px"}>Description</Text>
                            <Textarea placeholder='Describe your dish here' value={longDescription} onChange={handleDescriptionChange} />
                        </VStack>

                        <Spacer />

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
                    <ReservationSettingsCard listingPublished={listingPublished} togglePublished={togglePublished} pricePerPortion={pricePerPortion} setPricePerPortion={setPricePerPortion} />
                </GridItem>
            </Grid>
            <Modal onClose={handleClose} isOpen={isOpen} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Upload New Image</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <VStack textAlign={"left"} spacing={"25px"} p={"10px"}>
                            <Text width={"100%"}>Upload a new image for your dish!</Text>
                            <Text>Please be reminded that images must not contain explicit content; the images you upload should be real-life pictures of your dish only.</Text>
                            <Input type={"file"} p={"10px"} h={"20%"} accept='image/*' onChange={handleFileSubmission} />
                        </VStack>
                    </ModalBody>
                    <ModalFooter>
                        <HStack spacing={"20px"}>
                            <Button onClick={handleClose}>Close</Button>
                            <Button colorScheme={"blue"} onClick={uploadImage}>Upload</Button>
                        </HStack>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <DeleteImageAlert isOpen={deleteImageDialogOpen} onClose={handleDeleteImageDialogClosure} listingID={listingData.listingID} imageName={imageToBeDeleted} />
        </>
    )
}

export default ExpandedListing