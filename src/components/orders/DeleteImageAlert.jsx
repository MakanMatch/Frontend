import { AlertDialog, AlertDialogBody, AlertDialogCloseButton, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button } from '@chakra-ui/react'
import React, { useState } from 'react'

function DeleteImageAlert({ isOpen, onClose, listingID, imageName }) {
    const [isDeleting, setIsDeleting] = useState(false);

    const deleteImage = () => {
        setIsDeleting(true)
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
                <Button onClick={onClose}>
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