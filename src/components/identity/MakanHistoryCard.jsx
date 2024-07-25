import { Card, Image, Stack, CardBody, Avatar, Text, CardFooter, Button, Box, Divider } from "@chakra-ui/react";
import { CalendarIcon } from '@chakra-ui/icons';
import { FaMapMarker, FaMapMarkerAlt, FaMarker, FaUtensilSpoon } from "react-icons/fa";
import { BsMarkerTip } from "react-icons/bs";

function MakanHistoryCard() {
    const handleClickListingTitle = () => {
        console.log("Clicked on listing title");
    }

    return (
        <Card
            direction={{ base: 'column', sm: 'row' }}
            overflow='hidden'
            variant='outline'
            sx={{
                '.clickableText': {
                    _hover: {
                        textDecoration: 'underline',
                        cursor: 'pointer'
                    }
                }
            }}
        >
            
            <Image
                width={"25%"}
                maxW={"25%"}
                height={"30%"}
                maxHeight={"30%"}
                src='https://images.unsplash.com/photo-1667489022797-ab608913feeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw5fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60'
                alt='Caffe Latte'
                borderRadius = "5px"
                margin="20px"
                objectFit={"cover"}
            />
            <CardBody>
                <Box display="flex" justifyContent={"space-between"} width={"100%"} mt={3}>
                    <Stack mr={20}>
                        <Text textAlign={"left"} fontSize={"25px"} className="clickableText" onClick={handleClickListingTitle} mt={-4}>Pani Puri</Text>

                        <Box display="flex" justifyContent={"space-evenly"} mt={2}>
                            <Box display="flex" mr={2}>
                                <FaMapMarkerAlt size={20}/>
                                <Text ml={2}>Block 310A Anchorvale Lane</Text>
                            </Box>
                            <Box display="flex" ml={5}>
                                <FaUtensilSpoon size={20} mr={2} />
                                <Text ml={2}>Western</Text>
                            </Box>
                        </Box>
                        
                        <Box display="flex" ml={1} mt={2}>
                            <CalendarIcon mr={2} mt={1}/>
                            <Text textAlign={"left"} mb={1}>25 July 2024 5:30 PM</Text>
                        </Box>

                        <Box display="flex" mt={2}>
                            <Avatar size={"sm"} mr={2} mt={2}/>
                            <Text textAlign={"left"} ml={2} mt={3}>Jamie Oliver</Text>
                        </Box>
                    </Stack>

                    <Box display="flex" flexDirection={"column"} justifyContent={"space-between"}>
                        <Text fontSize="20px" mt={8}>4.5 ⭐️</Text>
                        <Text fontSize="20px" color="green">$10.00</Text>
                    </Box>
                </Box>
            </CardBody>
        </Card>
    )
}

export default MakanHistoryCard