import { Box, Button, Card, CardBody, CardFooter, Center, Heading, HStack, Image, Spinner, Stack, Text, useMediaQuery, useToast, VStack } from '@chakra-ui/react'
import { ChatIcon, StarIcon } from '@chakra-ui/icons';
import { BsFillPeopleFill } from 'react-icons/bs';
import { FaClock } from 'react-icons/fa';

function UpcomingReservationCard({ currentReservation, getFirstImageURL, onClick }) {
    return (
        <Card direction={{ base: 'column', sm: 'row' }} overflow='hidden' variant='outline' maxW={"650px"} onClick={onClick} >
            <Image objectFit='cover' maxW={{ base: '100%', sm: '200px' }} src={getFirstImageURL(currentReservation)} alt={currentReservation.listing.title} />
            <Stack>
                <CardBody>
                    <Heading size='md'>{currentReservation.listing.title}</Heading>

                    <Text py='2'>
                        By <strong>{currentReservation.listing.Host.username}</strong>
                        <ChatIcon ml={"10px"} />
                    </Text>

                    <Text>{currentReservation.listing.longDescription}</Text>
                </CardBody>

                <CardFooter>
                    <HStack display={'flex'} justifyContent={'space-between'}>
                        <StarIcon /><Text>{currentReservation.listing.Host.foodRating}</Text>
                        <BsFillPeopleFill /><Text>{currentReservation.listing.slotsTaken}/{currentReservation.listing.totalSlots}</Text>
                        <FaClock /><Text>{new Date(currentReservation.listing.fullDatetime).toLocaleString('en-US', { dateStyle: "short", timeStyle: 'short' })}</Text>
                    </HStack>
                </CardFooter>
            </Stack>
        </Card>
    )
}

export default UpcomingReservationCard