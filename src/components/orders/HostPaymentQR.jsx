import React, { useState, useEffect } from 'react'
import { Image, Spinner, Text, useToast, Box, Input } from '@chakra-ui/react';
import { PiUploadSimpleBold } from "react-icons/pi";
import server from '../../networking';
import { useSelector, useDispatch } from 'react-redux';
import { reloadAuthToken } from '../../slices/AuthState';
import configureShowToast from '../../components/showToast';
import placeholderImage from '../../assets/placeholderImage.svg'
import { transform } from 'framer-motion';

function HostPaymentQR({
    hostID
}) {
    const dispatch = useDispatch();
    const { user, loaded, authToken } = useSelector((state) => state.auth);
    const toast = useToast();
    const showToast = configureShowToast(toast);
    const [imageUpload, setImageUpload] = useState(false); 

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        const allowedTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/svg+xml",
            "image/heic"
        ];        
        console.log(file);
        if (file && allowedTypes.includes(file.type)) {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('hostID', hostID);
            
            try {
                // Uupload QR Code image
                const response = await server.post('/orders/uploadPaymentQR', formData, { headers: { 'Content-Type': 'multipart/form-data' }, transformRequest: formData => formData });
                dispatch(reloadAuthToken(authToken));
                if (response.status === 200) {
                    showToast('Image Uploaded', 'QR Code uploaded successfully', 3000, false, 'success');
                    setImageUpload(true);
                } else {
                    console.error('Error uploading QR Code:', response.data);
                    showToast('Something went wrong', 'An error occurred while uploading the QR Code', 3000, false, 'error');
                    setImageUpload(false);
                }
            } catch (error) {
                dispatch(reloadAuthToken(authToken));
                if (error.response && error.response.data) {
                    if (error.response.data.startsWith("UERROR")) {
                        showToast('Something went wrong', error.response.data.substring("UERROR: ".length), 3000, false, 'error');
                        console.log('User error occurred in uploading QR Code:', error.response.data);
                        setImageUpload(false);
                    } else {
                        showToast('Something went wrong', 'An error occurred while uploading the QR Code', 3000, false, 'error');
                        console.error('Error uploading QR Code:', error.response.data);
                        setImageUpload(false);
                    }
                } else {
                    showToast('Something went wrong', 'An error occurred while uploading the QR Code', 3000, false, 'error');
                    console.error('Error uploading QR Code:', error);
                    setImageUpload(false);
                }
            }
        } else {
            showToast('Invalid file type', 'Please upload a valid image file', 3000, false, 'error');
            setImageUpload(false);
        }
    };

    if (!loaded) {
        return <Spinner />
    }

    return (
        <>
            <Text fontWeight={"bold"}>Your PayNow QR Code</Text>
            <Box
                position="relative"
                display="flex"
                alignItems="center"
                justifyContent="center"
                width="100%"
                height="100%"
                _hover={{
                    '& .qr-code-image': {
                        filter: "grayscale(100%)",
                    },
                    '& .upload-icon': {
                        opacity: 1,
                    },
                }}
            >
                <Image
                    width="80%"
                    height="400px"
                    className="qr-code-image"
                    src={import.meta.env.VITE_BACKEND_URL + `/cdn/getHostPaymentQR?hostID=${hostID}`}
                    fallbackSrc={placeholderImage}
                    transition="filter 0.3s ease"
                    objectFit="contain"
                />
                <Box
                    className="upload-icon"
                    position="absolute"
                    top="50%"
                    left="50%"
                    transform="translate(-50%, -50%)"
                    opacity={0}
                    transition="opacity 0.3s ease"
                >
                    <label htmlFor="file-upload" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: "pointer", }}>
                        <PiUploadSimpleBold size="60px" color="gray" />
                    </label>
                    <Input
                        id="file-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        display="none"
                    />
                </Box>
            </Box>
        </>
    )
}

export default HostPaymentQR