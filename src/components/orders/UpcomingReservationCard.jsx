import { Box, Button, Card, CardBody, CardFooter, Center, Heading, HStack, Image, Spinner, Stack, Text, useClipboard, useMediaQuery, useToast, useToken, VStack } from '@chakra-ui/react'
import { ChatIcon, StarIcon } from '@chakra-ui/icons';
import { BsFillPeopleFill } from 'react-icons/bs';
import { FaClock } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import configureShowToast from '../showToast';

function UpcomingReservationCard({ currentReservation, getFirstImageURL, onClick, cursor }) {
    const { onCopy, hasCopied } = useClipboard(currentReservation.referenceNum);
    const toast = useToast();
    const showToast = configureShowToast(toast);

    useEffect(() => {
        if (hasCopied) {
            showToast("Referece number copied!", "", 1000)
        }
    }, [hasCopied])

    const handleReferenceCopy = (e) => {
        e.stopPropagation();
        onCopy();
    }

    return (
        <Card direction={{ base: 'column', sm: 'row' }} overflow='hidden' variant='outline' maxW={"650px"} onClick={onClick} cursor={cursor}>
            <Image objectFit='cover' maxW={{ base: '100%', sm: '200px' }} src={getFirstImageURL(currentReservation)} alt={currentReservation.listing.title} />
            <Stack>
                <CardBody>
                    <Heading size='md'>{currentReservation.listing.title}</Heading>

                    <Text py='2'>
                        By <strong>{currentReservation.listing.Host.username}</strong>
                        <Link to={"/chat"}>
                            <ChatIcon ml={"10px"} />
                        </Link>
                    </Text>

                    <Text>{currentReservation.listing.longDescription}</Text>
                </CardBody>

                <CardFooter>
                    <VStack alignItems={"flex-start"}>
                        <HStack display={'flex'} justifyContent={'space-between'}>
                            <StarIcon /><Text>{currentReservation.listing.Host.foodRating}</Text>
                            <BsFillPeopleFill /><Text>{currentReservation.listing.slotsTaken}/{currentReservation.listing.totalSlots}</Text>
                            <FaClock /><Text>{new Date(currentReservation.listing.fullDatetime).toLocaleString('en-US', { dateStyle: "short", timeStyle: 'short' })}</Text>
                        </HStack>
                        <Button variant={'link'} color={'gray.400'} fontSize={"small"} onClick={handleReferenceCopy}>Reference Number: {currentReservation.referenceNum}</Button>
                    </VStack>
                </CardFooter>
            </Stack>
        </Card>
    )
}

export default UpcomingReservationCard