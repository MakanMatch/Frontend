import React from 'react'
import { IconButton, Icon, useToast } from '@chakra-ui/react';
import { BiTrash } from 'react-icons/bi';
import configureShowToast from '../showToast';
import server from '../../networking';

function DeleteReviewButton({
    reviewID
}) {
    const toast = useToast();
    const showToast = configureShowToast(toast);

    const handleDelete = async () => {
        try {
            const deleteReview = await server.delete(`/manageReviews?reviewID=${reviewID}`);
            if (deleteReview.status === 200) {
                showToast("Review deleted", "", 3000, false, "success");
                window.location.reload();
            } else {
                showToast("Error deleting review", "", 3000, false, "error");
            }
        } catch (error) {
            showToast("Error deleting review", "", 3000, false, "error");
            console.log("Error deleting review:", error);
        }
    }

    return (
        <IconButton
          aria-label="Delete review"
          icon={<Icon as={BiTrash} />}
          onClick={handleDelete}
          colorScheme="red"
          size="lg"
          mt={2}
        />
      );
}

export default DeleteReviewButton