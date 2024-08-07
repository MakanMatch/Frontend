import React, { useEffect } from 'react';
import {
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter,
    ModalBody, ModalCloseButton, Button, FormControl, FormLabel,
    Input, useToast, Text, HStack, FormErrorMessage, VStack,
    Spinner,
    Box
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import server from '../../networking';
import configureShowToast from '../showToast';

const ChangeAddress = ({ isOpen, onClose, accountInfo, setAccountInfo, setOriginalAccountInfo }) => {
    const toast = useToast();
    const showToast = configureShowToast(toast);

    const handleChangeAddress = (values) => {
        server.put("/identity/myAccount/changeAddress", {
            blkNo: values.blkNo,
            street: values.street,
            postalCode: values.postalCode,
            unitNum: values.unitNum,
        })
            .then((res) => {
                if (res.status === 200 && res.data.startsWith("SUCCESS")) {
                    var newData = {}
                    showToast("Address changed", "Your address has been updated!", 3000, true, "success");
                    setAccountInfo((prev) => {
                        var newObj = {}
                        for (const key of Object.keys(prev)) {
                            newObj[key] = key === "address" ? `${values.blkNo ? "Block " + values.blkNo + " " : ""}${values.street} ${values.postalCode} ${values.unitNum ? "#" + values.unitNum : ""}`.trim() : prev[key];
                        }
                        newData = newObj
                        return newObj;
                    });
                    setOriginalAccountInfo(newData);
                    onClose();
                } else {
                    showToast("ERROR", res.data, 3000, true, "error");
                }
            })
            .catch((err) => {
                if (err.response && err.response.status === 400) {
                    if (err.response.data.startsWith("UERROR: ")) {
                        console.log("User error occured in changing address: ", err.response.data);
                        showToast("Invalid Input", err.response.data.substring("UERROR: ".length), 3000, true, "error");
                    } else {
                        console.log("Unexpected error occured in changing address: ", err.response.data);
                        showToast("ERROR", "Failed to change address.", 3000, true, "error");
                    }
                } else {
                    console.error("Error changing address:", err);
                    showToast("ERROR", "Failed to change address.", 3000, true, "error");
                }
            })
    }

    const formik = useFormik({
        initialValues: {
            street: '',
            postalCode: '',
            blkNo: '',
            unitNum: '',
        },
        validationSchema: Yup.object({
            street: Yup.string().required('Street is required').trim(),
            postalCode: Yup.string().required('Postal Code is required').trim(),
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

            handleChangeAddress(values);
        },
    });

    useEffect(() => {
        if (!isOpen) {
            formik.resetForm();
        }
    }, [isOpen]);

    if (!accountInfo) {
        return (
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalBody>
                        <Box p={"20px"} textAlign={"center"}>
                            <Spinner />
                        </Box>
                    </ModalBody>
                </ModalContent>
            </Modal>
        )
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Change Address</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Text fontSize="15px" mb={4}>{accountInfo.address}</Text>
                    <form onSubmit={formik.handleSubmit}>
                        <VStack spacing={4} mb={4}>
                            
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
                        </VStack>
                    </form>
                </ModalBody>
                <ModalFooter>
                    <Button variant='ghost' onClick={onClose}>
                        Cancel
                    </Button>
                    <Button variant={"MMPrimary"} type="submit" onClick={formik.handleSubmit} ml={"20px"}>
                        Save
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default ChangeAddress;
