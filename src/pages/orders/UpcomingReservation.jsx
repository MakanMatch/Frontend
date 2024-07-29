import { Heading, Spinner, useToast } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import server from '../../networking';
import { useDispatch, useSelector } from 'react-redux';
import configureShowToast from '../../components/showToast';
import { useNavigate } from 'react-router-dom';
import { reloadAuthToken } from '../../slices/AuthState';

function UpcomingReservation() {
    const dispatch = useDispatch();
    const toast = useToast();
    const showToast = configureShowToast(toast);
    const navigate = useNavigate();
    const [reservations, setReservations] = useState([]);
    const [dataLoaded, setDataLoaded] = useState(false);
    const { user, loaded, authToken } = useSelector(state => state.auth)

    const fetchReservations = () => {
        server.get('/getReservations?includeListing=true')
            .then(response => {
                dispatch(reloadAuthToken(authToken));
                if (response.status == 200) {
                    if (Array.isArray(response.data)) {
                        setReservations(response.data);
                        console.log(response.data)
                        setDataLoaded(true);
                    } else {
                        console.log("Unexpected format of reservations response data; response: ", response.data);
                        showToast("Something went wrong", "Failed to load required information. Please try again.", 2000, true, "error");
                        return;
                    }
                } else {
                    console.log("Failed to fetch reservations (Non-200 status code); response: ", response);
                    showToast("Something went wrong", "Failed to load required information. Please try again.", 2000, true, "error");
                    return;
                }
            })
            .catch(err => {
                dispatch(reloadAuthToken(authToken));
                if (err.response && err.response.data && typeof err.response.data == "string") {
                    if (err.response.data.startsWith("UERROR")) {
                        console.log("User error occurred in retrieving reservations; error: " + err.response.data)
                        showToast("Something went wrong", err.response.data.substring("UERROR: ".length), 2000, true, "error");
                    } else {
                        console.log("Error occurred in retrieving reservations; error: " + err.response.data);
                        showToast("Something went wrong", "Failed to load required information. Please try again.", 2000, true, "error");
                    }
                } else {
                    console.log("Error occurred in retrieving reservations; error: " + err);
                    showToast("Something went wrong", "Failed to load required information. Please try again.", 2000, true, "error");
                }
            })
    }

    useEffect(() => {
        if (loaded == true) {
            if (!user) {
                navigate('/auth/login');
                showToast("Sign in first", "Login to your account to view reservations.", 2000, true, "error");
                return;
            }

            fetchReservations();
        }
    }, [loaded, user])

    if (!dataLoaded) {
        return <Spinner />;
    }

    return (
        <Heading>Hello world!</Heading>
    )
}

export default UpcomingReservation;