import { Avatar, Box, Center, Divider, Flex, Grid, GridItem, HStack, Heading, Image, Spacer, Spinner, Stack, StackDivider, Text, VStack, useMediaQuery, useToast } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import server from '../../networking'
import configureShowToast from '../../components/showToast'
import placeholderImage from '../../assets/placeholderImage.svg'
import ReserveCard from '../../components/orders/ReserveCard'
import { useDispatch, useSelector } from 'react-redux'
import { reloadAuthToken } from '../../slices/AuthState'

function ExpandedListingGuest() {
    const navigate = useNavigate()
    const toast = useToast()
    const showToast = configureShowToast(toast)

    const backendAPIURL = import.meta.env.VITE_BACKEND_URL
    const [searchParams] = useSearchParams()
    const [isLargerThan700] = useMediaQuery('(min-width: 700px)')
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
        slotsTaken: null,
        datetime: null,
        published: null,
        hostID: null
    })
    const [hostData, setHostData] = useState({
        userID: null,
        username: null,
        foodRating: 0.0,
        hygieneGrade: 0.0
    })
    const { user, loaded, error, authToken } = useSelector(state => state.auth)
    const dispatch = useDispatch();

    const [listingID, setListingID] = useState(searchParams.get("id"))
    const imgBackendURL = (imgName) => `${backendAPIURL}/cdn/getImageForListing/?listingID=${listingData.listingID}&imageName=${imgName}`

    useEffect(() => {
        if (loaded == true) {
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
    }, [loaded])

    useEffect(() => {
        if (listingData.hostID) {
            if (user && listingData.hostID == user.userID) {
                console.log("Logged in user is host of listing; redirecting to host view...")
                navigate(`/expandedListingHost`)
                history.pushState({ listingID: listingData.listingID }, "")
                return
            } else {
                fetchHostData()
            }
        }
    }, [listingData, user])

    const processListingData = (data) => {
        let datetime = new Date(data.datetime)
        let formattedString = datetime.toLocaleString('en-US', { day: 'numeric', month: 'short', year: 'numeric', weekday: 'short' })
        data.datetime = formattedString

        data.images = data.images.split("|")

        var slotsTaken = 0;
        if (data.guests) {
            data.guests.forEach((guest) => {
                slotsTaken += guest.Reservation.portions
            })
        }

        data.slotsTaken = slotsTaken;

        return data
    }

    const processHostData = (data) => {
        const { userID, username, foodRating, hygieneGrade } = data
        return { userID, username, foodRating, hygieneGrade }
    }

    const fetchListingDetails = (id) => {
        server.get(`/cdn/getListing?id=${id}&includeReservations=true`)
            .then(response => {
                dispatch(reloadAuthToken(authToken));
                if (response.status == 200) {
                    const processedData = processListingData(response.data)
                    if (processedData.published == false && processedData.hostID != user.userID) { console.log("Attempt to access unpublished listing blocked; redirecting..."); navigate("/"); return; }
                    setListingData(processedData)
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
                dispatch(reloadAuthToken(authToken));
                showToast("Error", "Failed to retrieve listing details", 5000, true, "error")
                console.log("EXPANDEDLISTINGGUEST: Failed to retrieve listing details, redirecting to home. Response below.")
                console.log(err)
                navigate("/")
                return
            })
    }

    const fetchHostData = () => {
        server.get(`/cdn/accountInfo?userID=${listingData.hostID}`)
            .then(response => {
                dispatch(reloadAuthToken(authToken));
                if (response.status == 200) {
                    const processedData = processHostData(response.data)
                    setHostData(processedData)
                    setLoading(false)
                } else if (response.status == 404) {
                    console.log("EXPANDEDLISTINGGUEST: Host not found, re-directing to home. Server response: " + response.data)
                    navigate("/")
                    showToast("Someting went wrong", "That listing doesn't seem to have a host. Try again later.", 5000, true, 'error')
                } else {
                    console.log("EXPANDEDLISTINGGUEST: Failed to retrieve host details, redirecting to home. Server response: " + response.data)
                    navigate("/")
                    showToast("Something went wrong", "Couldn't retrieve required information. Try again later.", 5000, true, "error")
                }
            })
            .catch(err => {
                dispatch(reloadAuthToken(authToken));
                console.log("EXPANDEDLISTINGGUEST: Failed to retrieve host details, redirecting to home. Error: " + err)
                navigate("/")
                showToast("Something went wrong", "Couldn't retrieve required information. Try again later.", 5000, true, "error")
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
            <GridItem colSpan={isLargerThan700 ? 2 : 3}>
                <Flex direction={'row'} width={'100%'} justifyContent={'space-between'}>
                    <VStack textAlign={'left'} alignItems={'flex-start'} spacing={0}>
                        <Text fontWeight={'bold'} fontSize={'1.5em'}>{hostData.foodRating}</Text>
                        <Text>Food Rating</Text>
                    </VStack>

                    <Divider borderColor={'black'} orientation="vertical" />

                    <VStack textAlign={'left'} alignItems={'flex-start'} spacing={0} ml={"5%"}>
                        <Text fontWeight={'bold'} fontSize={'1.5em'}>108</Text>
                        <Text>Guests Served</Text>
                    </VStack>

                    <Divider borderColor={'black'} orientation="vertical" />

                    <VStack textAlign={'left'} alignItems={'flex-start'} spacing={0} ml={"5%"}>
                        <Text fontWeight={'bold'} fontSize={'1.5em'}>73</Text>
                        <Text>Reviews</Text>
                    </VStack>

                    <Spacer />
                </Flex>

                <Flex direction={'row'} width={'100%'} justifyContent={'space-between'} mt={'5%'}>
                    <HStack>
                        <Avatar size={'md'} name={hostData.username} />
                        <VStack height={'100%'} p={'10px'} alignItems={'flex-start'} spacing={0}>
                            <Text fontWeight={'bold'}>Hosted by {hostData.username}</Text>
                            <Text color={'gray.500'}>2 years hosting</Text>
                        </VStack>
                    </HStack>

                    <Spacer />

                    <Center bg={'green'} w={'fit-content'} p={'20px'} rounded={'10px'}>
                        <Text color={'white'}>{hostData.hygieneGrade}</Text>
                    </Center>

                    <Spacer />
                </Flex>

                <Divider mt={'3%'} />

                <VStack textAlign={'left'} alignItems={'flex-start'} spacing={2} mt={'20px'}>
                    <Heading size={'md'}>Description</Heading>
                    <Text>{listingData.longDescription}</Text>
                </VStack>
            </GridItem>

            {/* Reservation card */}
            <GridItem colSpan={isLargerThan700 ? 1 : 3}>
                {!isLargerThan700 && (
                    <Divider my={'10%'} />
                )}
                <ReserveCard hostData={hostData} listingData={listingData} />
            </GridItem>
        </Grid>
    )
}

export default ExpandedListingGuest