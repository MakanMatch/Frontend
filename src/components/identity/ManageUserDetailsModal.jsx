import React, { useState } from "react";
import {
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter,
    Button, Input, useToast, FormControl, FormLabel
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { reloadAuthToken } from "../../slices/AuthState";
import server from "../../networking";
import configureShowToast from "../showToast";

const ManageUserDetails = ({ isOpen, onClose, userID, userType, fname, lname, username, email, contactNum, fetchAllUsers }) => {
    const toast = useToast();
    const dispatch = useDispatch();
    const showToast = configureShowToast(toast);
    const [isUploading, setIsUploading] = useState(false);
    const [formData, setFormData] = useState({ userID, userType, fname, lname, username, email, contactNum });

    const authToken = useSelector((state) => state.auth.authToken);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async () => {
        setIsUploading(true);
        try {
            const response = await server.put("/admin/userManagement/editUserDetails", { ...formData });
            dispatch(reloadAuthToken(authToken));
            if (response.status === 200) {
                showToast("Success", "User details updated successfully", 3000, true, "success");
                fetchAllUsers();
                onClose();
            }
        } catch (error) {
            dispatch(reloadAuthToken(authToken));
            if (error.response && error.response.data && typeof error.response.data == "string") {
                console.log("Failed to update user details; response: " + error.response);
                if (error.response.data.startsWith("UERROR")) {
                    showToast(
                        "Uh-oh!",
                        error.response.data.substring("UERROR: ".length),
                        3500,
                        true,
                        "info"
                    );
                } else {
                    showToast(
                        "Something went wrong",
                        "Failed to update user details. Please try again",
                        3500,
                        true,
                        "error"
                    );
                }
            } else {
                console.log("Unknown error occurred when updating user details; error: " + error);
                showToast(
                    "Something went wrong",
                    "Failed to update user details. Please try again",
                    3500,
                    true,
                    "error"
                );
            }
        }
        setIsUploading(false);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Edit Account Details</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormControl mb={3}>
                        <FormLabel>Username</FormLabel>
                        <Input
                            placeholder="Username"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                        />
                    </FormControl>
                    <FormControl mb={3}>
                        <FormLabel>First Name</FormLabel>
                        <Input
                            placeholder="First Name"
                            name="fname"
                            value={formData.fname}
                            onChange={handleInputChange}
                        />
                    </FormControl>
                    <FormControl mb={3}>
                        <FormLabel>Last Name</FormLabel>
                        <Input
                            placeholder="Last Name"
                            name="lname"
                            value={formData.lname}
                            onChange={handleInputChange}
                        />
                    </FormControl>
                    <FormControl mb={3}>
                        <FormLabel>Email</FormLabel>
                        <Input
                            placeholder="Email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                        />
                    </FormControl>
                    <FormControl mb={3}>
                        <FormLabel>Contact Number</FormLabel>
                        <Input
                            placeholder="Contact Number"
                            name="contactNum"
                            value={formData.contactNum}
                            onChange={handleInputChange}
                        />
                    </FormControl>
                </ModalBody>
                <ModalFooter>
                    <Button
                        variant="MMPrimary"
                        isLoading={isUploading}
                        loadingText="Uploading..."
                        mr={3}
                        onClick={handleSubmit}
                    >
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

export default ManageUserDetails;
