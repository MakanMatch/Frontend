import React, { useEffect, useState } from "react";
import {
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter,
    Image, Button, Text, Box, useToast, Input,
    Avatar
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { reloadAuthToken } from "../../slices/AuthState";
import server from "../../networking";
import configureShowToast from "../showToast";

const EditPicture = ({ isOpen, onClose, onSubmit, onRemove, currentProfilePicture }) => {
    const toast = useToast();
    const dispatch = useDispatch();
    const showToast = configureShowToast(toast);
    const [isUploading, setIsUploading] = useState(false)
    const [file, setFile] = useState(null);
    const { user, loaded, error, authToken } = useSelector((state) => state.auth);

    const handleFileSubmission = (e) => {
        if (e.target.files.length > 0) {
            setFile(e.target.files[0])
        }
    }

    const handleClose = () => {
        onClose()
        setFile(null)
    }

    const handleChangePicture = (e) => {
        e.preventDefault();
        setIsUploading(true)

        if (file == null) {
            showToast("Error", "No file selected", 2500, true, "error")
            setIsUploading(false)
            return
        }

        const formData = new FormData()

        formData.append('file', file)
        formData.append('fileName', file.name)
        const config = {
            'Content-Type': 'multipart/form-data'
        }

        server.post("/identity/myAccount/uploadProfilePicture", formData, { headers: config, transformRequest: formData => formData })
            .then(res => {
                dispatch(reloadAuthToken(authToken))
                if (res.status == 200 && res.data.startsWith("SUCCESS")) {
                    showToast("Success", "Profile picture uploaded successfully", 2500, true, "success");
                    setIsUploading(false);
                    onSubmit();
                    handleClose();
                    return
                } else {
                    showToast("Error", "Failed to upload image", 5000, true, "error");
                    setIsUploading(false);
                    return
                }
            })
            .catch(err => {
                dispatch(reloadAuthToken(authToken))
                console.log("Failed to upload image; error: " + err);
                showToast("Error", "Failed to upload image", 5000, true, "error");
                setIsUploading(false)
                return
            })
    }

    const handleRemovePicture = () => {
        server.post("/identity/myAccount/removeProfilePicture")
            .then(res => {
                if (res.status == 200 && res.data.startsWith("SUCCESS")) {
                    showToast("Success", "Image removed successfully", 2500, true, "success");
                    dispatch(reloadAuthToken(authToken));
                    onRemove();
                    handleClose();
                    return
                } else {
                    showToast("Error", "Failed to remove image", 5000, true, "error")
                    return
                }
            })
            .catch (err => {
                dispatch(reloadAuthToken(authToken))
                console.log("Failed to remove image; error: " + err);
                showToast("Error", "Failed to remove image", 5000, true, "error");
                return
            })
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Edit Picture</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Box display="flex" flexDirection="column" alignItems="center">
                        <Avatar
                            boxSize="150px"
                            borderRadius="full"
                            mb={4}
                            src={currentProfilePicture}
                        />
                        <Input type={"file"} p={"10px"} h={"20%"} accept='image/*' onChange={handleFileSubmission} mb={5} mt={5}/>
                    </Box>
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme='red' mr={3} borderRadius={'10px'} onClick={handleRemovePicture}>
                        Remove Picture
                    </Button>
                    <Button variant={isUploading ? "" : "MMPrimary"} isLoading={isUploading} loadingText="Uploading..." mr={3} onClick={handleChangePicture}>
                        Save Changes
                    </Button>
                    <Button onClick={onClose}>
                        Cancel
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default EditPicture;