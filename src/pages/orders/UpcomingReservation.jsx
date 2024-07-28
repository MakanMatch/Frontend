import { Heading, Spinner, useToast } from '@chakra-ui/react'
import React from 'react'
import server from '../../networking';
import { useDispatch, useSelector } from 'react-redux';
import configureShowToast from '../../components/showToast';
import { useNavigate } from 'react-router-dom';

function UpcomingReservation() {
    const dispatch = useDispatch();
    const toast = useToast();
    const showToast = configureShowToast(toast);
    const navigate = useNavigate();
    const { user, loaded, authToken } = useSelector(state => state.auth)

    if (!loaded) {
        return <Spinner />;
    }

    return (
        <Heading>Hello world!</Heading>
    )
}

export default UpcomingReservation;