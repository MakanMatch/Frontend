import React, { useState } from "react";
import {
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter,
    Image, Button, Text, Box, useToast
} from "@chakra-ui/react";

const EditPicture = ({ isOpen, onClose, onSubmit, currentAvatar }) => {
    const [newPicture, setNewPicture] = useState(currentAvatar);
    const toast = useToast();

    const handleChangePicture = () => {
        // Logic to handle picture change
        console.log("Clicked change picture")
    };

    const handleSaveChanges = () => {
        onSubmit(newPicture);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Edit Picture</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Box display="flex" flexDirection="column" alignItems="center">
                        <Image
                            boxSize="150px"
                            borderRadius="full"
                            src={newPicture}
                            mb={4}
                        />
                        <Button colorScheme="teal" onClick={handleChangePicture} mb={5}>
                            Upload new image
                        </Button>
                    </Box>
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme='blue' mr={3} onClick={handleSaveChanges}>
                        Save Changes
                    </Button>
                    <Button variant='ghost' onClick={onClose}>
                        Cancel
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default EditPicture;
