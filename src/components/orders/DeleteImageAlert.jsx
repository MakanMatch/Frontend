import { AlertDialog, AlertDialogBody, AlertDialogCloseButton, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button } from '@chakra-ui/react'
import React from 'react'

function DeleteImageAlert({ isOpen, onClose, listingID, imageName }) {
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
                    Are you sure you want to discard all of your notes? 44 words will be
                    deleted.
                </AlertDialogBody>
                <AlertDialogFooter>
                    <Button onClick={onClose}>
                        No
                    </Button>
                    <Button colorScheme='red' ml={3}>
                        Yes
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default DeleteImageAlert