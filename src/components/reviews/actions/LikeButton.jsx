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
    likeCount,
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
            toast({
                title: "Please log in",
                description: "You need to log in before liking a review",
                status: "info",
                duration: 3000,
                isClosable: true,
            });
            navigate('/auth/login');
        } else {
            toggleLike();
        }
    };

    const toggleLike = async () => {
        try {
            await server.post('/likeReview', {
                headers: {
                    'Content-Type': 'application/json',
                },
                reviewID: reviewID,
            }).then((postLikeResponse) => {
                dispatch(reloadAuthToken(authToken))
                if (postLikeResponse.status === 400 || postLikeResponse.status === 500) {
                    showToast("An error occurred", "Please try again later.", 3000, true, "error");
                    return
                } else {
                    const { liked, likeCount } = postLikeResponse.data;
                    setLiked(liked);
                    setCurrentLikeCount(likeCount);
                }
            })
        } catch (error) {
            dispatch(reloadAuthToken(authToken))
            showToast("An error occurred", "Please try again later.", 3000, true, "error");
            console.log("Error liking review:", error);
            return
        }
    }

    useEffect(() => {
        if (!user) {
            showToast("Please log in", "Login to a MakanMatch account to like and submit reviews!", 3000, true, "info");
        }
    }, [user])

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
        >
            <Text>{currentLikeCount}</Text>
        </Button>
    )
}

export default LikeButton;