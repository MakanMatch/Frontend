import React, { useState } from "react";
import {
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter,
    FormControl, FormLabel, Input, FormErrorMessage, Button, IconButton, InputGroup, InputRightElement
} from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

const PasswordChangeModal = ({ isOpen, onClose, onSubmit }) => {
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const validationSchema = Yup.object().shape({
        currentPassword: Yup.string()
            .required("Current Password is required")
            .min(6, "Current Password must be at least 6 characters"),
        newPassword: Yup.string()
            .required("New Password is required")
            .min(6, "New Password must be at least 6 characters"),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
            .required("Confirm Password is required"),
    });

    const handleShowPassword = (passwordField) => {
        switch (passwordField) {
            case 'current':
                setShowCurrentPassword(!showCurrentPassword);
                break;
            case 'new':
                setShowNewPassword(!showNewPassword);
                break;
            case 'confirm':
                setShowConfirmPassword(!showConfirmPassword);
                break;
            default:
                break;
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <Formik
                    initialValues={{
                        currentPassword: "",
                        newPassword: "",
                        confirmPassword: "",
                    }}
                    validationSchema={validationSchema}
                    onSubmit={onSubmit}
                >
                    {({ handleSubmit, isSubmitting }) => (
                        <Form onSubmit={handleSubmit}>
                            <ModalHeader>Change Password</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody>
                                <Field name="currentPassword">
                                    {({ field, form }) => (
                                        <FormControl mb={4} isInvalid={form.errors.currentPassword && form.touched.currentPassword}>
                                            <FormLabel>Current Password</FormLabel>
                                            <InputGroup>
                                                <Input
                                                    {...field}
                                                    type={showCurrentPassword ? "text" : "password"}
                                                />
                                                <InputRightElement width="4.5rem">
                                                    <IconButton
                                                        h="1.5rem"
                                                        size="sm"
                                                        onClick={() => handleShowPassword('current')}
                                                        icon={showCurrentPassword ? <ViewOffIcon /> : <ViewIcon />}
                                                        aria-label={showCurrentPassword ? "Hide current password" : "Show current password"}
                                                    />
                                                </InputRightElement>
                                            </InputGroup>
                                            <FormErrorMessage>{form.errors.currentPassword}</FormErrorMessage>
                                        </FormControl>
                                    )}
                                </Field>
                                <Field name="newPassword">
                                    {({ field, form }) => (
                                        <FormControl mb={4} isInvalid={form.errors.newPassword && form.touched.newPassword}>
                                            <FormLabel>New Password</FormLabel>
                                            <InputGroup>
                                                <Input
                                                    {...field}
                                                    type={showNewPassword ? "text" : "password"}
                                                />
                                                <InputRightElement width="4.5rem">
                                                    <IconButton
                                                        h="1.5rem"
                                                        size="sm"
                                                        onClick={() => handleShowPassword('new')}
                                                        icon={showNewPassword ? <ViewOffIcon /> : <ViewIcon />}
                                                        aria-label={showNewPassword ? "Hide new password" : "Show new password"}
                                                    />
                                                </InputRightElement>
                                            </InputGroup>
                                            <FormErrorMessage>{form.errors.newPassword}</FormErrorMessage>
                                        </FormControl>
                                    )}
                                </Field>
                                <Field name="confirmPassword">
                                    {({ field, form }) => (
                                        <FormControl mb={4} isInvalid={form.errors.confirmPassword && form.touched.confirmPassword}>
                                            <FormLabel>Confirm Password</FormLabel>
                                            <InputGroup>
                                                <Input
                                                    {...field}
                                                    type={showConfirmPassword ? "text" : "password"}
                                                />
                                                <InputRightElement width="4.5rem">
                                                    <IconButton
                                                        h="1.5rem"
                                                        size="sm"
                                                        onClick={() => handleShowPassword('confirm')}
                                                        icon={showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />}
                                                        aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                                                    />
                                                </InputRightElement>
                                            </InputGroup>
                                            <FormErrorMessage>{form.errors.confirmPassword}</FormErrorMessage>
                                        </FormControl>
                                    )}
                                </Field>
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    type="submit"
                                    colorScheme="blue"
                                    mr={3}
                                    isLoading={isSubmitting}
                                    loadingText="Submitting"
                                >
                                    Save Changes
                                </Button>
                                <Button variant="ghost" onClick={onClose}>
                                    Cancel
                                </Button>
                            </ModalFooter>
                        </Form>
                    )}
                </Formik>
            </ModalContent>
        </Modal>
    );
};

export default PasswordChangeModal;
