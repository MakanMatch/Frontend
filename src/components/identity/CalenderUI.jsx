import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import server from "../../networking";
import { useState, useEffect } from "react";
import { useToast, Box, Button, Text, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton } from "@chakra-ui/react";
import { useSelector } from "react-redux";

export default function DemoApp() {
    const [events, setEvents] = useState([]);
    const toast = useToast();
    const { user, authToken, loaded } = useSelector((state) => state.auth);
    const { isOpen, onOpen, onClose } = useDisclosure()

    const [targetListingID, setTargetListingID] = useState(null)
    

    function displayToast(title, description, status, duration, isClosable) {
        toast({
            title: title,
            description: description,
            status: status,
            duration: duration,
            isClosable: isClosable,
        });
    }

    const fetchListings = async () => {
        try {
            const response = await server.get("/cdn/listings");
            const listings = response.data;

            console.log(listings);
            
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

                if (titleWithTime.length > 15) {
                    titleWithTime = titleWithTime.substring(0, 15) + '...';
                }

                return {
                    title: titleWithTime,
                    start: listing.datetime
                };
            });

            setEvents(transformedEvents);
        } catch (error) {
            console.log("Failed to fetch listings: " + error);
            displayToast(
                "Error fetching food listings",
                "Please try again later.",
                "error",
                2500,
                false
            );
        }
    };

    function renderEventContent(eventInfo) {
        const handleScheduleClick = () => {
            onOpen()
        }
        
        return (
            <>
                <div style={{ overflow: "hidden", padding: "5px" }} onClick={handleScheduleClick}>
                    <i>{eventInfo.event.title}</i>
                </div>
    
                <Modal isOpen={isOpen} onClose={onClose}>
                    <ModalContent>
                    <ModalHeader>Modal Title</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text>Hello world</Text>
                    </ModalBody>
    
                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                    </ModalContent>
                </Modal>
                {isOpen && <div style={backdropStyle} />}
            </>
        );
    }

    useEffect(() => {
        const fetchData = async () => {
            await fetchListings();
        };
        fetchData();
    }, []);

    const backdropStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backdropFilter: 'blur(1px)',
        zIndex: 1,
    };

    return (
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
        </div>
    );
}