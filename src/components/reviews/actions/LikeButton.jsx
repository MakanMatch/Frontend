import React, { useState, useEffect } from 'react'
import Like from './LikeIcon';
import Liked from './LikedIcon';
import server from '../../../networking';
import { useToast, Button, Text } from '@chakra-ui/react';
import { useNavigate } from "react-router-dom"
import configureShowToast from '../../showToast';
import { useSelector, useDispatch } from 'react-redux';
import { reloadAuthToken } from '../../../slices/AuthState';

function LikeButton({
    reviewID,
    isLiked,
    likeCount
}) {
    const toast = useToast();
    const showToast = configureShowToast(toast)
    const [liked, setLiked] = useState(isLiked);
    const [currentLikeCount, setCurrentLikeCount] = useState(likeCount);
    const { user, loaded, authToken } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLikeClick = () => {
        if (loaded && (!user || !user.userID)) {
            showToast("You must be logged in to like a review", "Please log in to like this review.", 3000, true, "info");
            navigate('/auth/login');
        } else {
            toggleLike();
        }
    };

    const toggleLike = async () => {
        try {
            const postLikeResponse = await server.post('/likeReview', {
                headers: {
                    'Content-Type': 'application/json',
                },
                reviewID: reviewID,
            })
            dispatch(reloadAuthToken(authToken))
            if (postLikeResponse.status === 200) {
                const { liked, likeCount } = postLikeResponse.data;
                setLiked(liked);
                setCurrentLikeCount(likeCount);
            } else {
                showToast("An error occurred", "Please try again later.", 3000, true, "error");
                return
            }
        } catch (error) {
            dispatch(reloadAuthToken(authToken))
            showToast("An error occurred", "Please try again later.", 3000, true, "error");
            console.log("Error liking review:", error);
            return
        }
    }

    useEffect(() => {
        setLiked(isLiked);
    }, [isLiked]);

    return (
        <Button
            variant='ghost'
            backgroundColor={liked ? 'blue.100' : 'gray.100'}
            leftIcon={liked ? <Liked /> : <Like />}
            _hover={{
                backgroundColor: liked ? 'blue.200' : 'gray.200',
                color: liked ? 'black' : 'gray.800'
            }}
            onClick={handleLikeClick}
            isDisabled={loaded && user && user.userType === 'Host'}
        >
            <Text>{currentLikeCount}</Text>
        </Button>
    )
}

export default LikeButton;