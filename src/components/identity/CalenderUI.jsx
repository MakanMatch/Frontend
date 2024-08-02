import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import server from "../../networking";
import { useState, useEffect } from "react";
import { useToast, Box, Button, Text, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, 
    ModalFooter, ModalBody, ModalCloseButton, Image, Skeleton, Heading, Icon, HStack } from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons"
import { BsFillPeopleFill } from "react-icons/bs";
import { FaWallet } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import configureShowToast from '../../components/showToast';

export default function CalenderUI() {
    const [events, setEvents] = useState([]);
    const toast = useToast();
    const showToast = configureShowToast(toast);
    const { user, authToken, loaded } = useSelector((state) => state.auth);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedListing, setSelectedListing] = useState(null);
    const [imageLoaded, setImageLoaded] = useState(false);

    const navigate = useNavigate();

    function getImageLink(listingID, imageName) {
        return `${import.meta.env.VITE_BACKEND_URL}/cdn/getImageForListing?listingID=${listingID}&imageName=${imageName}`;
    }

    const processListingData = (data) => {
        var slotsTaken = 0;
        var revenue = 0.0;
        for (var guest of data.guests) {
            slotsTaken += guest.Reservation.portions;
            revenue += guest.Reservation.totalPrice;
        }
        data.slotsTaken = slotsTaken;
        data.revenue = revenue;

        return data;
    }

    const fetchListings = async () => {
        try {
            const response = await server.get(`/cdn/listings?hostID=${user.userID}&includeReservations=true`);
            const listings = response.data.map(listing => processListingData(listing));

            // Transform listings into events
            const transformedEvents = listings.map(listing => {
                const dateObj = new Date(listing.datetime);

                // Extract hours, minutes, and AM/PM
                let hours = dateObj.getHours();
                const minutes = dateObj.getMinutes();
                const amOrPm = hours >= 12 ? 'PM' : 'AM';
                hours = hours % 12;
                hours = hours ? hours : 12;
                const minutesStr = minutes < 10 ? '0' + minutes : minutes;

                const timeStr = `${hours}:${minutesStr} ${amOrPm}`;
                let titleWithTime = `${timeStr}, ${listing.title}`;

                if (titleWithTime.length > 18) {
                    titleWithTime = titleWithTime.substring(0, 18) + '...';
                }

                return {
                    title: titleWithTime,
                    start: listing.datetime,
                    image: getImageLink(listing.listingID, String(listing.images[0])),
                    fullTitle: listing.title,
                    slotsTaken: listing.slotsTaken,
                    revenue: listing.revenue,
                    totalSlots: listing.totalSlots,
                    listingID: listing.listingID,
                    datetime: new Date(listing.datetime)
                };
            });

            setEvents(transformedEvents);
        } catch (error) {
            console.log("Failed to fetch listings: " + error);
            showToast("Error fetching food listings", "Please try again later.", 3000, false, "error");
        }
    };

    function closeListingDetailModal() {
        setSelectedListing(null);
        onClose();
    }

    function renderEventContent(eventInfo) {
        const handleScheduleClick = () => {
            setSelectedListing(eventInfo.event.extendedProps);
            onOpen();
        };

        return (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div style={{ overflow: "hidden", padding: "5px", fontSize: "11px", cursor: "pointer" }} onClick={handleScheduleClick}>
                    <i>{eventInfo.event.title}</i>
                </div>
            </motion.div>
        );
    }

    useEffect(() => {
        if (loaded) {
            fetchListings();
        }
    }, [loaded]);

    function formatDate(dateObj) {
        const day = dateObj.getDate();
        const month = dateObj.toLocaleString('en-US', { month: 'long' });
        const year = dateObj.getFullYear();
        const dayOfWeek = dateObj.toLocaleString('en-US', { weekday: 'long' });

        return `${day} ${month} ${dayOfWeek} ${year}`;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div>
                <FullCalendar
                    plugins={[dayGridPlugin]}
                    initialView="dayGridMonth"
                    weekends={true}
                    events={events}
                    eventContent={renderEventContent}
                    height={"660px"}
                    eventOverlap={false}
                    eventDisplay="block"
                    nextDayThreshold="23:59:59"
                />
                {selectedListing && (
                    <Modal isOpen={isOpen} onClose={closeListingDetailModal} size={"sm"}>
                        <ModalOverlay />
                        <ModalContent>
                            <ModalCloseButton />
                            <ModalBody>
                                <Skeleton isLoaded={imageLoaded} width="100%" borderRadius="lg" fadeDuration={1} p={5}>
                                    <Image
                                        height="200px"
                                        src={selectedListing.image}
                                        onLoad={() => setImageLoaded(true)}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = "/placeholderImage.png";
                                        }}
                                        borderRadius="lg"
                                        width={"100%"}
                                        objectFit="cover"
                                        style={{ pointerEvents: "none" }}
                                        mt={3}
                                    />
                                </Skeleton>
                                
                                <Box display="flex" justifyContent={"center"}  fontWeight="bold">
                                    <Text fontSize="25px">{selectedListing.fullTitle}</Text>
                                </Box>

                                <Box display="flex" justifyContent="center" mt={3}>
                                    <Text fontWeight={"bold"} fontSize="15px">{formatDate(selectedListing.datetime)}</Text>
                                </Box>

                                <HStack display="flex" justifyContent="center" spacing={10} mt={5}>
                                    <Box display="flex" alignItems="center" p="5px">
                                        <FaWallet fill="#515F7C" size="30px" />
                                        <Text fontSize="20px" ml="10px" mt={1}>${selectedListing.revenue}</Text>
                                    </Box>

                                    <Box display="flex" alignItems="center">
                                        <BsFillPeopleFill size="30px" color="#515F7C"/>
                                        <Text fontSize="20px" ml="10px" mt={1}>{selectedListing.slotsTaken}/{selectedListing.totalSlots}</Text>
                                    </Box>
                                </HStack>

                            </ModalBody>
                            <ModalFooter display="flex" justifyContent="center">
                                <Button variant="MMPrimary" onClick={() => navigate("/expandedListingHost", { state: { listingID: selectedListing.listingID } })}>
                                    View details
                                </Button>
                            </ModalFooter>
                        </ModalContent>
                    </Modal>
                )}
            </div>
        </motion.div>
    );
}