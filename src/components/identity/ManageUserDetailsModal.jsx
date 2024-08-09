import React, { useState } from "react";
import {
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter,
    Button, Input, useToast, FormControl, FormLabel,
    HStack
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
    const [resettingEmailVerification, setResettingEmailVerification] = useState(false);
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

    const handleResetEmailVerification = async () => {
        if (!email) { return; }
        setResettingEmailVerification(true);
        server.post("/admin/userManagement/resetEmailVerification", { userID })
            .then(res => {
                dispatch(reloadAuthToken(authToken));
                setResettingEmailVerification(false);
                if (res.status == 200) {
                    if (res.data && typeof res.data == "string" && res.data.startsWith("SUCCESS")) {
                        showToast("Success", "Email verification reset successfully.", 3000, true, "success");
                    } else {
                        console.log("Failed to reset email verification; response: " + res.data);
                        showToast("Something went wrong", "Failed to reset email verification. Please try again.", 3500, true, "error");
                    }
                } else {
                    console.log("Non-200 status code response received when attempting to reset email verification; response: ", res.data);
                    showToast("Something went wrong", "Failed to reset email verification. Please try again.", 3500, true, "error");
                }
            })
            .catch(err => {
                dispatch(reloadAuthToken(authToken));
                setResettingEmailVerification(false);
                if (err.response && err.response.data && typeof err.response.data == "string") {
                    if (err.response.data.startsWith("UERROR")) {
                        console.log("User error in resetting email verification; error: ", err.response.data);
                        showToast("Something went wrong", err.response.data.substring("UERROR: ".length), 3500, true, "error");
                    } else {
                        console.log("Unexpected error in resetting email verification; error: ", err.response.data);
                        showToast("Something went wrong", "Failed to reset email verification. Please try again.", 3500, true, "error");
                    }
                } else {
                    console.log("Unexpected error in resetting email verification; error: ", err);
                    showToast("Something went wrong", "Failed to reset email verification. Please try again.", 3500, true, "error");
                }
            })
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} size={"xl"}>
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
                    <HStack spacing={"10px"}>
                        <Button onClick={onClose}>
                            Cancel
                        </Button>
                        {email && email.length > 0 && (
                            <Button variant={"MMPrimary"} isLoading={resettingEmailVerification} loadingText={"Resetting..."} onClick={handleResetEmailVerification}>
                                Reset Email Verification
                            </Button>
                        )}
                        <Button
                            variant="MMPrimary"
                            isLoading={isUploading}
                            loadingText="Saving..."
                            mr={3}
                            onClick={handleSubmit}
                        >
                            Save Changes
                        </Button>
                    </HStack>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default ManageUserDetails;
