import { PlusSquareIcon, SmallAddIcon, ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { Box, Button, Card, CardBody, CardFooter, CardHeader, Center, Container, EditableTextarea, Flex, Grid, GridItem, HStack, Heading, Image, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Spacer, Spinner, Text, Textarea, VStack, useToast } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import ReservationSettingsCard from '../../components/orders/ReservationSettingsCard'
import server from '../../networking';
import axios from 'axios'

function ExpandedListing() {
    // const Universal = useSelector(state => state.universal)
    const toast = useToast()

    const backendAPIURL = import.meta.env.VITE_BACKEND_URL
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
    const [loading, setLoading] = useState(true)

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

    const showComingSoon = () => { showToast("Coming soon", "This feature is not complete yet.", 3000) }
    const imgBackendURL = (imgName) => `${backendAPIURL}/img/${imgName}`

    const processData = (data) => {
        let datetime = new Date(data.datetime)
        let formattedString = datetime.toLocaleString('en-US', { day: 'numeric', month: 'short', year: 'numeric', weekday: 'short' })
        data.datetime = formattedString

        data.images = data.images.split("|")

        return data
    }

    useEffect(() => {
        server.get("/listingDetails")
        .then(response => {
            if (response.status == 200) {
                console.log(response.data)
                setListingData(processData(response.data))
                setLoading(false)
                return
            } else {
                showToast("Error", "Failed to retrieve listing details", 5000, true, "error")
                console.log(response.data)
                return
            }
        })
        .catch(err => {
            showToast("Error", "Failed to retrieve listing details", 5000, true, "error")
            console.log(err)
            return
        })
    }, [])

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
        <Grid
            h={"100%"}
            templateColumns='repeat(3, 1fr)'
            gap={4}
            p={"10px"}
        >
            <GridItem colSpan={3} mb={"20px"}>
                <VStack alignItems={"flex-start"}>
                    <Text>{listingData.datetime}</Text>
                    <Heading>{listingData.title}</Heading>

                    <HStack spacing={"10px"} overflowX={"auto"} height={"250px"}>
                        {listingData.images.map(imgName => {
                            return (
                                <Image maxH={"100%"} objectFit={"cover"} display={"block"} rounded={"10px"} src={imgBackendURL(imgName)} />
                            )
                        })}
                        <Center h={"100%"} aspectRatio={"1"} bg={"gray.300"} textAlign={"center"} onClick={showComingSoon}>
                            <SmallAddIcon boxSize={"10"} />
                        </Center>
                    </HStack>
                </VStack>
            </GridItem>
            <GridItem colSpan={2}>
                <VStack alignItems={"flex-start"} spacing={{ base: "10px", md: "20px", lg: "30px" }}>
                    <VStack alignItems={"flex-start"} width={"100%"}>
                        <Text fontWeight={"bold"} mb={"10px"}>Description</Text>
                        <Textarea placeholder='Describe your dish here' value={listingData.longDescription} />
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
                <ReservationSettingsCard listingPublished={listingPublished} setListingPublished={setListingPublished} pricePerPortion={pricePerPortion} setPricePerPortion={setPricePerPortion} />
            </GridItem>
        </Grid>
    )
}

export default ExpandedListing