import { Button, HStack, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, VStack } from '@chakra-ui/react'
import React from 'react'

function UploadNewImageModal({ handleClose, isOpen, handleFileSubmission, isUploading, uploadImage }) {
    return (
        <Modal onClose={handleClose} isOpen={isOpen} isCentered>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Upload New Image</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <VStack textAlign={"left"} spacing={"25px"} p={"10px"}>
                        <Text width={"100%"}>Upload a new image for your dish!</Text>
                        <Text>Please be reminded that images must not contain explicit content; the images you upload should be real-life pictures of your dish only.</Text>
                        <Input type={"file"} p={"10px"} h={"20%"} accept='image/*' onChange={handleFileSubmission} />
                    </VStack>
                </ModalBody>
                <ModalFooter>
                    <HStack spacing={"20px"}>
                        <Button onClick={handleClose}>Close</Button>
                        <Button variant={isUploading ? "" : "MMPrimary"} isLoading={isUploading} loadingText="Uploading..." onClick={uploadImage}>Upload</Button>
                    </HStack>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default UploadNewImageModal