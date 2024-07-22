import { useEffect, useState, useRef } from 'react'
import { Box, Button, useToast } from '@chakra-ui/react';
import { BiTrash } from 'react-icons/bi';
import configureShowToast from '../../showToast';
import server from '../../../networking';
import { useDispatch, useSelector } from 'react-redux';
import { reloadAuthToken } from '../../../slices/AuthState';
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
} from '@chakra-ui/react';

function DeleteReviewButton({
    reviewID,
    refreshState,
    stateRefresh
}) {
    const toast = useToast();
    const showToast = configureShowToast(toast);
    const { user, authToken } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const [isOpen, setIsOpen] = useState(false);
    const onClose = () => setIsOpen(false);
    const cancelRef = useRef();

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
                onClick={() => setIsOpen(true)}
                colorScheme="red"
                ml={2}
                size="md">
                <BiTrash />
            </Button>
            <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={onClose}
                isCentered
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Delete Review
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            Are you sure you want to delete this review? This action cannot be undone.
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onClose}>
                                Cancel
                            </Button>
                            <Button colorScheme="red" onClick={handleDelete} ml={3}>
                                Delete
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </Box>
    );
}

export default DeleteReviewButton