import React, { useState, useEffect } from 'react';
import { Button, Box, Input, Flex, Text, Container, Image, Textarea, Spacer, Icon, Heading, Avatar, useToast, SimpleGrid } from '@chakra-ui/react';
import { Card, CardHeader, CardBody, CardFooter } from '@chakra-ui/react';
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import { BiLike } from 'react-icons/bi';
import { FaUtensils, FaSoap } from "react-icons/fa";
import server from '../../networking'
import CreateReview from './ReviewCards';
import configureShowToast from '../../components/showToast';

const SortReviews = ({
    hostID,
    guestID
}) => {
    const toast = useToast();
    const showToast = configureShowToast(toast);
    const [activeTab, setActiveTab] = useState(0)
    const [reviews, setReviews] = useState([])
    const [likedReviews, setLikedReviews] = useState([])

    function getImageLink(listingID, imageName) {
        if (!listingID || !imageName) {
            return null;
        }
        return `${import.meta.env.VITE_BACKEND_URL}/cdn/getImageForReview?reviewID=${listingID}&imageName=${imageName}`;
    }

    const fetchReviews = async (hostID, sortOrder) => {
        try {

            // Get liked reviews
            const likedResponse = await server.get(`/likeReview/userLiked?guestID=${guestID}`);
            if (likedResponse.status === 200 && Array.isArray(likedResponse.data)) {
                setLikedReviews(likedResponse.data);
            } else {
                setLikedReviews([]);
            }

            // Get reviews
            const response = await server.get(`/cdn/getReviews?hostID=${hostID}&order=${sortOrder}`);
            if (response.status === 200 && Array.isArray(response.data)) {
                const reviews = response.data;
                if (reviews.length == 0) {
                    showToast("No reviews found", "", 3000, false, "info");
                    return;
                }
                const reviewsWithGuestInfo = await Promise.all(reviews.map(async (review) => {
                    try {
                        const guestInfoResponse = await server.get(`/cdn/accountInfo?userID=${review.guestID}`);
                        if (guestInfoResponse.status === 200 && guestInfoResponse.data) {
                            review.guestInfo = guestInfoResponse.data;
                        } else {
                            review.guestInfo = null;
                            console.error(`No guest info found for guestID ${review.guestID}`);
                        }
                    } catch (error) {
                        review.guestInfo = null;
                        console.error(`Error fetching guest info for guestID ${review.guestID}:`, error);
                    }

                    // Check if review is liked
                    review.isLiked = likedReviews.some((likedReview) => likedReview.reviewID === review.reviewID);
                    return review;
                }));
                setReviews(reviewsWithGuestInfo);
            }
        } catch (error) {
            showToast("An error occurred",` Please try again later: ${error}`, 3000, true, "error");
        }
    }

    useEffect(() => {
        let sortOrder = ""
        switch (activeTab) {
            case 0:
                sortOrder = "mostRecent"
                break;
            case 1:
                sortOrder = "highestRating"
                break;
            case 2:
                sortOrder = "lowestRating"
                break;
            case 3:
                sortOrder = "images"
                break;
            default:
                sortOrder = "mostRecent"
                break;
        }
        fetchReviews(hostID, sortOrder);
    }, [activeTab]);

    return (
        <Tabs mt={8} variant="soft-rounded" size='sm' minWidth="310px" onChange={(index) => setActiveTab(index)}>
            <TabList justifyContent='center' >
                <Tab><Text>Most Recent</Text></Tab>
                <Tab><Text>Highest Rating</Text></Tab>
                <Tab><Text>Lowest Rating</Text></Tab>
                <Tab><Text>Images</Text></Tab>
            </TabList>
            <TabPanels>
                <TabPanel>
                    <SimpleGrid columns={{ base: 1, md: 2}} spacing={4}>
                        {Array.isArray(reviews) && reviews.length > 0 ?
                            reviews.map((review) => (
                                <CreateReview
                                    key={review.reviewID}
                                    username={review.guestInfo ? review.guestInfo.username : null}
                                    foodRating={review.foodRating}
                                    hygieneRating={review.hygieneRating}
                                    comments={review.comments}
                                    dateCreated={review.dateCreated}
                                    images={review.images.split("|").map(images => getImageLink(review.reviewID, images))}
                                    likeCount={review.likeCount}
                                    reviewID={review.reviewID}
                                    guestID={guestID}
                                    isLiked={review.isLiked}
                                />
                            )) :
                            null}
                    </SimpleGrid>
                </TabPanel>
                <TabPanel>
                <SimpleGrid columns={{ base: 1, md: 2}} spacing={4}>
                        {Array.isArray(reviews) && reviews.length > 0 ?
                            reviews.map((review) => (
                                <CreateReview
                                    key={review.reviewID}
                                    username={review.guestInfo ? review.guestInfo.username : null}
                                    foodRating={review.foodRating}
                                    hygieneRating={review.hygieneRating}
                                    comments={review.comments}
                                    dateCreated={review.dateCreated}
                                    images={review.images.split("|").map(images => getImageLink(review.reviewID, images))}
                                    likeCount={review.likeCount}
                                    reviewID={review.reviewID}
                                    guestID={guestID}
                                    isLiked={review.isLiked}
                                />
                            )) :
                            null}
                    </SimpleGrid>
                </TabPanel>
                <TabPanel>
                <SimpleGrid columns={{ base: 1, md: 2}} spacing={4}>
                        {Array.isArray(reviews) && reviews.length > 0 ?
                            reviews.map((review) => (
                                <CreateReview
                                    key={review.reviewID}
                                    username={review.guestInfo ? review.guestInfo.username : null}
                                    foodRating={review.foodRating}
                                    hygieneRating={review.hygieneRating}
                                    comments={review.comments}
                                    dateCreated={review.dateCreated}
                                    images={review.images.split("|").map(images => getImageLink(review.reviewID, images))}
                                    likeCount={review.likeCount}
                                    reviewID={review.reviewID}
                                    guestID={guestID}
                                    isLiked={review.isLiked}
                                />
                            )) :
                            null}
                    </SimpleGrid>
                </TabPanel>
                <TabPanel>
                <SimpleGrid columns={{ base: 1, md: 2}} spacing={4}>
                        {Array.isArray(reviews) && reviews.length > 0 ?
                            reviews.map((review) => (
                                <CreateReview
                                    key={review.reviewID}
                                    username={review.guestInfo ? review.guestInfo.username : null}
                                    foodRating={review.foodRating}
                                    hygieneRating={review.hygieneRating}
                                    comments={review.comments}
                                    dateCreated={review.dateCreated}
                                    images={review.images.split("|").map(images => getImageLink(review.reviewID, images))}
                                    likeCount={review.likeCount}
                                    reviewID={review.reviewID}
                                    guestID={guestID}
                                    isLiked={review.isLiked}
                                />
                            )) :
                            null}
                    </SimpleGrid>
                </TabPanel>
            </TabPanels>
        </Tabs>
    )
}

export default SortReviews