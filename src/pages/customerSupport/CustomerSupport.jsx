import { Box, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, Heading, Button, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const CustomerSupport = () => {
    const navigate = useNavigate();
    const faq = [
        {
            question: 'How will payments be like:',
            answer: "After successfully making a reservation, there will be the hosts's PayNow QR code which you have to scan in order to make payment to the host."
        },
        {
            question: 'What if I want to cancel a reservation:',
            answer: "If you decide to cancel 6 hours before the reservation time slot, there will be no cancellation fee, however if you decide to cancel the reservation after this time period you will be charged a cancellation fee."

        },
        {
            question : "How do I leave a review for a Host:",
            answer: "You may proceed to the host's review page in order to make a review for the host!"
        },
        {
            question: "What if I have dietary restrictions or allergies?",
            answer: "Hosts provide detailed descriptions of the meals they offer, including ingredients. You can also communicate directly with the host throught the chat page to discuss any dietary needs or allergies before making a reservation."
        }
    ]
    return (
        <>
            <Heading>Frequently asked questions</Heading>
            <Box borderRadius={"lg"} boxShadow={"0 2px 4px 2px rgba(0.1, 0.1, 0.1, 0.1)"} >
                <Accordion defaultIndex={[0]} allowMultiple mt={10} padding={5}>
                    {faq.map((faq, index) => (
                        <AccordionItem key={index}>
                            <h2>
                                <AccordionButton>
                                    <Box flex="1" textAlign="left">
                                        {faq.question}
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