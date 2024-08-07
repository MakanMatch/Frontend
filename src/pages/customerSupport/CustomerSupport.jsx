import { Box, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, Heading, Button, Text, Spinner } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const CustomerSupport = () => {
    const navigate = useNavigate();
    const { user, loaded } = useSelector((state) => state.auth);
    const guestFaq = [
        {
            question: 'How will payments be like:',
            answer: "After successfully making a reservation, there will be the hosts's PayNow QR code which you have to scan in order to make payment to the host."
        },
        {
            question: 'What if I want to cancel a reservation:',
            answer: "If you decide to cancel 6 hours before the reservation time slot, there will be no cancellation fee, however if you decide to cancel the reservation after this time period you will be charged a cancellation fee."

        },
        {
            question: "How do I leave a review for a Host:",
            answer: "You may proceed to the host's review page in order to make a review for the host!"
        },
        {
            question: "What if I have dietary restrictions or allergies?",
            answer: "Hosts provide detailed descriptions of the meals they offer, including ingredients. You can also communicate directly with the host throught the chat page to discuss any dietary needs or allergies before making a reservation."
        },
        {
            question: 'What happens if a guest cancels a reservation?',
            answer: "If a guest cancels their reservation more than 6 hours before the scheduled time, no cancellation fee is charged. However, if the cancellation occurs within the 6-hour window, a cancellation fee of double the original reseravtion price will apply."
        }
    ]

    const hostFaq = [
        {
            question: 'How do I receive payments?',
            answer: "After successfully hosted a food listing, you should upload your PayNow QR code in the guest management tab. The guest will then scan this payment QR code to complete the payment. Do check your PayNow account to ensure that the payment has been received."
        },
        {
            question: 'How can I manage my reservations?',
            answer: "You can manage your reservations through the guest management dashboard. Here, you can view all reservations for your food listings, check payment status, confirm or cancel reservations, and communicate directly with guests."
        },
        {
            question: 'Where can I view my reviews?',
            answer: "You can see all your reviews on the Makan Reviews page. Positive reviews enhance your reputation, while constructive feedback can help you improve guest dining experience. Maintaining a good hygiene rating is crucial to attract more guests; a poor rating may result in being flagged by the admin."
        },
        {
            question: 'What happens if a guest cancels a reservation?',
            answer: "If a guest cancels their reservation more than 6 hours before the scheduled time, no cancellation fee is charged. However, if the cancellation occurs within the 6-hour window, a cancellation fee of double the original reseravtion price will apply."
        },
        {
            question: 'How can I update my listing details?',
            answer: "You can modify your listing descriptions and reservation settings, such as the maximum number of guests and portion price, through the edit listing dashboard. This ensures guests have the most accurate and up-to-date information about what you offer."
        }
    ]


    if (!loaded) {
        return <Spinner />
    }

    return (
        <>
            <Heading>Frequently asked questions</Heading>
            <Box borderRadius={"lg"} boxShadow={"0 2px 4px 2px rgba(0.1, 0.1, 0.1, 0.1)"} >
                {user && user.userType === "Host" ? (
                    <Accordion allowToggle mt={10} padding={5}>
                        {hostFaq.map((faq, index) => (
                            <AccordionItem key={index}>
                                <h2>
                                    <AccordionButton _expanded={{ bg: 'blue.100', color: 'black' }}>
                                        <Box flex="1" textAlign="left">
                                            <Text>
                                                {faq.question}
                                            </Text>
                                        </Box>
                                        <AccordionIcon />
                                    </AccordionButton>
                                </h2>
                                <AccordionPanel pb={4} textAlign="left" color="grey">
                                    {faq.answer}
                                </AccordionPanel>
                            </AccordionItem>
                        ))}
                    </Accordion>
                ) : (
                    <Accordion allowToggle mt={10} padding={5}>
                        {guestFaq.map((faq, index) => (
                            <AccordionItem key={index}>
                                <h2>
                                    <AccordionButton _expanded={{ bg: 'blue.100', color: 'black' }}>
                                        <Box flex="1" textAlign="left">
                                            <Text>
                                                {faq.question}
                                            </Text>
                                        </Box>
                                        <AccordionIcon />
                                    </AccordionButton>
                                </h2>
                                <AccordionPanel pb={4} textAlign="left" color="grey">
                                    {faq.answer}
                                </AccordionPanel>
                            </AccordionItem>
                        ))}
                    </Accordion>
                )}
            </Box>
            <Box display="flex" justifyContent="center" mt={18}>
                <Button
                    onClick={() => navigate("/makanBot")}
                    height="auto"
                    width="auto"
                    p={5}
                    whiteSpace="normal"
                    variant="MMPrimary"
                >
                    <Text
                        whiteSpace="normal"
                        wordWrap="break-word"
                        textAlign="center"
                    >
                        Need help? Ask MakanBot!
                    </Text>
                </Button>
            </Box>
        </>
    );
};


export default CustomerSupport;