import React from 'react'
import { Box, Button, Icon, useToast } from '@chakra-ui/react';
import { BiTrash } from 'react-icons/bi';
import configureShowToast from '../showToast';
import server from '../../networking';

function DeleteReviewButton({
    reviewID,
    refreshState,
    stateRefreshReview
}) {
    const toast = useToast();
    const showToast = configureShowToast(toast);

    const handleDelete = async () => {
        try {
            const deleteReview = await server.delete(`/manageReviews`, {
                data: {
                    reviewID: reviewID
                }
            })
            if (deleteReview.status === 200) {
                showToast("Review deleted", "", 3000, false, "success");
                refreshState(!stateRefreshReview)
            } else {
                showToast("Error deleting review", "", 3000, false, "error");
            }
        } catch (error) {
            showToast("Error deleting review", "", 3000, false, "error");
            console.log("Error deleting review:", error);
        }
    }

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