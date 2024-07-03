import { Box, Divider, Flex, Grid, GridItem, HStack, Heading, Image, Spacer, Spinner, Stack, StackDivider, Text, VStack, useToast } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import server from '../../networking'
import configureShowToast from '../../components/showToast'
import placeholderImage from '../../assets/placeholderImage.svg'

function ExpandedListingGuest() {
    const navigate = useNavigate()
    const toast = useToast()
    const showToast = configureShowToast(toast)

    const backendAPIURL = import.meta.env.VITE_BACKEND_URL
    const [searchParams, setSearchParams] = useSearchParams()
    const [loading, setLoading] = useState(true)
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
    const [hostData, setHostData] = useState({
        userID: null,
        username: null,
        foodRating: 0.0,
        hygieneGrade: 0.0
    })

    const [listingID, setListingID] = useState(searchParams.get("id"))
    const imgBackendURL = (imgName) => `${backendAPIURL}/cdn/getImageForListing/?listingID=${listingData.listingID}&imageName=${imgName}`

    useEffect(() => {
        if (!listingID) {
            navigate("/")
            return
        }
        fetchListingDetails()
    }, [])

    const processData = (data) => {
        let datetime = new Date(data.datetime)
        let formattedString = datetime.toLocaleString('en-US', { day: 'numeric', month: 'short', year: 'numeric', weekday: 'short' })
        data.datetime = formattedString

        data.images = data.images.split("|")

        return data
    }

    const fetchListingDetails = () => {
        server.get(`/cdn/getListing?id=${listingID}`)
            .then(response => {
                if (response.status == 200) {
                    const processedData = processData(response.data)
                    setListingData(processedData)
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
                console.log("EXPANDEDLISTINGGUEST: Failed to retrieve listing details, redirecting to home. Response below.")
                console.log(err)
                navigate("/")
                return
            })
    }

    if (loading) {
        return <Spinner />
    }

    return (
        <Grid
            h={"100%"}
            templateColumns={'repeat(3, 1fr)'}
            gap={4}
            mt={{ base: "10px", md: "20px", lg: "30px" }}
        >
            {/* Images array */}
            <GridItem colSpan={3}>
                <VStack alignItems={"flex-start"} height={'250px'}>
                    <HStack spacing={"10px"} overflowX={"auto"} height={{ base: "150px", md: "200px", lg: "250px" }}>
                        {listingData.images.map((imgName, index) => {
                            if (imgName) {
                                return (
                                    <Box key={index} position={"relative"} height={"100%"} minW={"fit-content"}>
                                        <Image key={index} maxH={"100%"} objectFit={"cover"} display={"block"} rounded={"10px"} src={imgBackendURL(imgName)} fallbackSrc={placeholderImage} />
                                    </Box>
                                )
                            }
                        })}
                    </HStack>
                </VStack>
            </GridItem>

            {/* Listing title, approx address, share and favourite icons */}
            <GridItem colSpan={3}>
                <VStack alignItems={"flex-start"} spacing={2}>
                    <Text>{listingData.datetime}</Text>
                    <VStack spacing={0} alignItems={'flex-start'}>
                        <Heading>{listingData.title}</Heading>
                        <Heading size={"sm"}>{listingData.approxAddress}</Heading>
                    </VStack>
                </VStack>
            </GridItem>

            {/* Listing description, host information, host ratings */}
            <GridItem colSpan={2}>
                <Flex direction={'row'} spacing={4} width={'100%'} justifyContent={'space-between'}>
                    <VStack textAlign={'left'} alignItems={'flex-start'} spacing={0}>
                        <Text fontWeight={'bold'} fontSize={'1.5em'}>{hostData.foodRating}</Text>
                        <Text>Food Rating</Text>
                    </VStack>

                    <Divider borderColor={'black'} orientation="vertical" />

                    <VStack textAlign={'left'} alignItems={'flex-start'} spacing={0} ml={"5%"}>
                        <Text fontWeight={'bold'} fontSize={'1.5em'}>108</Text>
                        <Text>Guests Served</Text>
                    </VStack>

                    <Divider orientation="vertical" />

                    <VStack textAlign={'left'} alignItems={'flex-start'} spacing={0} ml={"5%"}>
                        <Text fontWeight={'bold'} fontSize={'1.5em'}>73</Text>
                        <Text>Reviews</Text>
                    </VStack>

                    <Spacer />
                </Flex>
            </GridItem>

            {/* Reservation card */}
            <GridItem colSpan={1}>

            </GridItem>
        </Grid>
    )
}

export default ExpandedListingGuest