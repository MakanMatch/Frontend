import { useEffect } from 'react'
import { Box, Button, useToast } from '@chakra-ui/react';
import { BiTrash } from 'react-icons/bi';
import configureShowToast from '../../showToast';
import server from '../../../networking';
import { useDispatch, useSelector } from 'react-redux';
import { reloadAuthToken } from '../../../slices/AuthState';

function DeleteReviewButton({
    reviewID,
    refreshState,
    stateRefresh
}) {
    const toast = useToast();
    const showToast = configureShowToast(toast);
    const { user, authToken } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const handleDelete = async () => {
        try {
            await server.delete(`/manageReviews`, {
                data: {
                    reviewID: reviewID
                }
            }).then((deleteReview) => {
                dispatch(reloadAuthToken(authToken))
                if (deleteReview.status === 200) {
                    showToast("Review deleted", "", 3000, false, "success");
                    refreshState(!stateRefresh)
                } else {
                    showToast("Error deleting review", "", 3000, false, "error");
                }
            })
        } catch (error) {
            dispatch(reloadAuthToken(authToken))
            showToast("Error deleting review", "", 3000, false, "error");
            console.log("Error deleting review:", error);
        }
    }

    useEffect(() => {
        if (!user) {
            showToast("Please log in", "Login to a MakanMatch account to like and submit reviews!", 3000, true, "info");
        }
    }, [user])

    return (
        <Box>
            <Button
                onClick={handleDelete}
                colorScheme="red"
                ml={2}
                size="md">
                <BiTrash />
            </Button>
        </Box>
    );
}

export default DeleteReviewButton