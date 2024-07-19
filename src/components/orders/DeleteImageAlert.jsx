import { AlertDialog, AlertDialogBody, AlertDialogCloseButton, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button } from '@chakra-ui/react'
import React, { useState } from 'react'
import server from '../../networking'
import { useDispatch, useSelector } from 'react-redux';
import { reloadAuthToken } from '../../slices/AuthState';

function DeleteImageAlert({ isOpen, onClose, listingID, imageName, showToast, refreshPage }) {
    const [isDeleting, setIsDeleting] = useState(false);
    const dispatch = useDispatch();
    const { authToken } = useSelector(state => state.auth);

    const deleteImage = () => {
        setIsDeleting(true)

        server.post("/deleteListingImage", { listingID, imageName }, { headers: { "Content-Type": "application/json" } })
            .then(res => {
                dispatch(reloadAuthToken(authToken));
                if (res && res.status == 200 && res.data.startsWith("SUCCESS")) {
                    showToast("Image deleted successfully!", "Your listing has been updated.", 2500, true, "success")
                    setIsDeleting(false)
                    refreshPage()
                    onClose()
                    return
                } else {
                    console.log(`Failed to delete image ${imageName}. Server response: ${res.data}`)
                    showToast("Failed to delete image", "Please try again later.", 2500, true, "error")
                    setIsDeleting(false)
                    return
                }
            })
            .catch(err => {
                dispatch(reloadAuthToken(authToken));
                console.log(`Failed to delete image ${imageName}. Error: ${err}`)
                showToast("Failed to delete image", "Please try again later.", 2500, true, "error")
                setIsDeleting(false)
                return
            })
    }

    return (
        <AlertDialog
            motionPreset='slideInBottom'
            onClose={onClose}
            isOpen={isOpen}
            isCentered
        >
            <AlertDialogOverlay />

            <AlertDialogContent>
                <AlertDialogHeader>Discard Changes?</AlertDialogHeader>
                <AlertDialogCloseButton />
                <AlertDialogBody>
                    Are you sure you want to delete this image?
                </AlertDialogBody>
                <AlertDialogFooter>
                    <Button onClick={() => { setIsDeleting(false); onClose(); }}>
                        No
                    </Button>
                    <>
                        {isDeleting ? (
                            <Button isLoading loadingText="Deleting..." ml={"10px"} >Delete</Button>
                        ) : (
                            <Button onClick={deleteImage} colorScheme='red' ml={"10px"} >Delete</Button>
                        )}
                    </>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default DeleteImageAlert