import React, { useState, useEffect } from 'react';
import { Text, useToast, SimpleGrid } from '@chakra-ui/react';
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import server from '../../networking'
import CreateReview from './ReviewCards';
import configureShowToast from '../../components/showToast';

const SortReviews = ({
    hostID,
    guestID,
    stateRefresh
}) => {
    const toast = useToast();
    const showToast = configureShowToast(toast);
    const [activeTab, setActiveTab] = useState(0)
    const [reviews, setReviews] = useState([])

    function getImageLink(listingID, imageName) {
        if (!listingID || !imageName) {
            return null;
        }
        return `${import.meta.env.VITE_BACKEND_URL}/cdn/getImageForReview?reviewID=${listingID}&imageName=${imageName}`;
    }

    const fetchReviews = async (hostID, sortOrder) => {
        try {
            // Get reviews
            const response = await server.get(`/cdn/getReviews?hostID=${hostID}&guestID=${guestID}&order=${sortOrder}`);
            if (response.status === 200 && Array.isArray(response.data)) {
                const reviews = response.data;
                setReviews(reviews);
            } else if (response.status === 200 && !Array.isArray(response.data) && response.data.length == 0) {
                setReviews([]);
                showToast("No reviews found", "", 3000, false, "info");
            } else {
                showToast("An error occurred", "Please try again later", 3000, true, "error");
                return
            }
        } catch (error) {
            showToast("An error occurred", "Please try again later", 3000, true, "error");
            console.log("Error fetching reviews:", error)
            return
        }
    }

    const fetchSortedData = () => {
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
    }

    useEffect(() => {
        fetchSortedData();
    }, [activeTab, stateRefresh]);

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
                        {reviews.length > 0 ?
                            reviews.map((review) => (
                                <CreateReview
                                    key={review.reviewID}
                                    username={review.reviewPoster.username ? review.reviewPoster.username : null}
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
                        {reviews.length > 0 ?
                            reviews.map((review) => (
                                <CreateReview
                                    key={review.reviewID}
                                    username={review.reviewPoster.username ? review.reviewPoster.username : null}
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
                        {reviews.length > 0 ?
                            reviews.map((review) => (
                                <CreateReview
                                    key={review.reviewID}
                                    username={review.reviewPoster.username ? review.reviewPoster.username : null}
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
                        {reviews.length > 0 ?
                            reviews.map((review) => (
                                <CreateReview
                                    key={review.reviewID}
                                    username={review.reviewPoster.username ? review.reviewPoster.username : null}
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