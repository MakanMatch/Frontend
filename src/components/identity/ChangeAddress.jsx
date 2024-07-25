import React, { useState } from 'react';
import {
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter,
    ModalBody, ModalCloseButton, Button, FormControl, FormLabel,
    Input, useToast, Text, HStack, FormErrorMessage, VStack
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const ChangeAddress = ({ isOpen, onClose, address, onSave }) => {
    const toast = useToast();
    
    const formik = useFormik({
        initialValues: {
            street: address?.street || '',
            postalCode: address?.postalCode || '',
            blkNo: address?.blkNo || '',
            unitNum: address?.unitNum || '',
        },
        validationSchema: Yup.object({
            street: Yup.string().required('Street is required'),
            postalCode: Yup.string().required('Postal Code is required'),
            blkNo: Yup.string(),
            unitNum: Yup.string(),
        }),
        onSubmit: (values) => {
            if (!values.street.trim() || !values.postalCode.trim()) {
                toast({
                    title: 'Invalid input',
                    description: 'Required fields cannot be empty.',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
                return;
            }

            onSave(values);
            onClose();
        },
    });

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Change Address</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Text fontSize="15px" mb={4}>{address}</Text>
                    <form onSubmit={formik.handleSubmit}>
                        <VStack spacing={4} mb={4}>
                            <FormControl isRequired isInvalid={formik.errors.street && formik.touched.street} flex={1}>
                                <FormLabel fontSize='15px'>Street</FormLabel>
                                <Input
                                    name="street"
                                    placeholder='Eg. Madagascar Lane'
                                    borderColor='black'
                                    size='md'
                                    borderRadius='5px'
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.street}
                                />
                                <FormErrorMessage fontSize='12px'>{formik.errors.street}</FormErrorMessage>
                            </FormControl>
                            <FormControl isRequired isInvalid={formik.errors.postalCode && formik.touched.postalCode} flex={1}>
                                <FormLabel fontSize='15px'>Postal Code</FormLabel>
                                <Input
                                    name="postalCode"
                                    placeholder='Eg. 542301'
                                    borderColor='black'
                                    size='md'
                                    borderRadius='5px'
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.postalCode}
                                />
                                <FormErrorMessage fontSize='12px'>{formik.errors.postalCode}</FormErrorMessage>
                            </FormControl>

                            <FormControl isInvalid={formik.errors.blkNo && formik.touched.blkNo} flex={1}>
                                <FormLabel fontSize='15px'>Block Number</FormLabel>
                                <Input
                                    name="blkNo"
                                    placeholder='Eg. 301A'
                                    borderColor='black'
                                    size='md'
                                    borderRadius='5px'
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.blkNo}
                                />
                                <FormErrorMessage fontSize='12px'>{formik.errors.blkNo}</FormErrorMessage>
                            </FormControl>
                            <FormControl isInvalid={formik.errors.unitNum && formik.touched.unitNum} flex={1}>
                                <FormLabel fontSize='15px'>Unit Number</FormLabel>
                                <Input
                                    name="unitNum"
                                    placeholder='Eg. 07-15'
                                    borderColor='black'
                                    size='md'
                                    borderRadius='5px'
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.unitNum}
                                />
                                <FormErrorMessage fontSize='12px'>{formik.errors.unitNum}</FormErrorMessage>
                            </FormControl>
                        </VStack>
                    </form>
                </ModalBody>
                <ModalFooter>
                    <Button variant='ghost' onClick={onClose}>
                        Cancel
                    </Button>
                    <Button colorScheme='blue' type="submit" onClick={formik.handleSubmit}>
                        Save
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default ChangeAddress;
