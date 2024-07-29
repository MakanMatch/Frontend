import React, { useState, useEffect} from 'react'
import { Image, Spinner, Text, useToast } from '@chakra-ui/react';
import server from '../../networking';
import { useSelector, useDispatch } from 'react-redux';
import { reloadAuthToken } from '../../slices/AuthState';
import configureShowToast from '../../components/showToast';
import placeholderImage from '../../assets/placeholderImage.svg'

function HostPaymentQR({
    hostID
}) {
    const [QRCode, setQRCode] = useState("");
    const [QRCodeImage, setQRCodeImage] = useState("");
    const dispatch = useDispatch();
    const { user, loaded, authToken } = useSelector((state) => state.auth);
    const toast = useToast();
    const showToast = configureShowToast(toast);

    if (!loaded) {
        return <Spinner />
    }
    
    return (
        <>
            <Text fontWeight={"bold"}>Your PayNow QR Code</Text>
            <Image src={import.meta.env.VITE_BACKEND_URL + `/cdn/getHostPaymentQR?hostID=${hostID}`} fallbackSrc={placeholderImage} />
        </>

    )
}

export default HostPaymentQR