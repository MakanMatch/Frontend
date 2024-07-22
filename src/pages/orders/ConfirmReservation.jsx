import { Box, Button, Divider, FormControl, FormHelperText, FormLabel, HStack, Heading, Input, ScaleFade, SlideFade, Spacer, Spinner, Text, VStack, useMediaQuery, useToast } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import configureShowToast from '../../components/showToast';
import { CheckIcon } from '@chakra-ui/icons';
import { useDispatch, useSelector } from 'react-redux';
import { reloadAuthToken } from '../../slices/AuthState';
import server from '../../networking';
import ConfirmReservationLayout from '../../components/orders/ConfirmReservationLayout';
import ConfirmReservationSuccess from '../../components/orders/ConfirmReservationSuccess';

function ConfirmReservation() {
    const navigate = useNavigate();
    const { state } = useLocation();
    const toast = useToast();
    const showToast = configureShowToast(toast);
    const [searchParams] = useSearchParams();
    const [listingID, setListingID] = useState(searchParams.get("id"))
    const [listingData, setListingData] = useState({});
    const [hostData, setHostData] = useState({});
    const [userData, setUserData] = useState({});
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    const { user, loaded, authToken, error } = useSelector(state => state.auth)

    const processListingData = (data) => {
        const before = data.datetime;
        let datetime = new Date(data.datetime)
        let formattedString = datetime.toLocaleString('en-US', { day: 'numeric', month: 'short', year: 'numeric', weekday: 'short' })
        data.datetime = formattedString
        data.fullDatetime = before;

        data.images = data.images.split("|")

        var slotsTaken = 0;
        var includesUser = false;
        if (data.guests) {
            data.guests.forEach((guest) => {
                if (user && guest.userID == user.userID) {
                    includesUser = true;
                }
                slotsTaken += guest.Reservation.portions
            })
        }
        if (includesUser) {
            data.alreadyReserved = true;
        }

        data.slotsTaken = slotsTaken;

        return data
    }

    const processHostData = (data) => {
        const { userID, username, foodRating, hygieneGrade } = data
        return { userID, username, foodRating, hygieneGrade }
    }

    const fetchListingDetails = async (id) => {
        try {
            const response = await server.get(`/cdn/getListing?id=${id}&includeReservations=true&includeHost=true`)
            dispatch(reloadAuthToken(authToken));
            if (response.status == 200) {
                const processedData = processListingData(response.data)
                if (user && processedData.hostID == user.userID) { console.log("Attempt to reserve listing blocked; redirecting..."); navigate("/"); return; }
                const processedHostData = processHostData(response.data.Host)
                setListingData(processedData)
                setHostData(processedHostData)
                setLoading(false);
                return
            } else if (response.status == 404) {
                console.log("Listing not found, re-directing to home.")
                navigate("/")
                return
            } else {
                showToast("Error", "Failed to retrieve listing details", 5000, true, "error")
                console.log("LISTING RESERVE: Failed to retrieve listing details, redirecting to home. Response below.")
                console.log(response.data)
                navigate("/")
                return
            }
        } catch (err) {
            dispatch(reloadAuthToken(authToken));
            showToast("Error", "Failed to retrieve listing details", 5000, true, "error")
            console.log("LISTING RESERVE: Failed to retrieve listing details, redirecting to home. Response below.")
            console.log(err)
            navigate("/")
            return
        }
    }

    const fetchUserDetails = () => {
        if (!user || !user.userID) { setLoading(false); return; }
        server.get(`/cdn/accountInfo?userID=${user.userID}`)
            .then(res => {
                dispatch(reloadAuthToken(authToken));
                if (res.status == 200) {
                    const { userID, username, email } = res.data;
                    setUserData({ userID, username, email })
                } else if (res.status == 404) {
                    console.log("User not found, re-directing to home.")
                    navigate("/auth/login")
                    return
                } else {
                    showToast("Error", "Failed to retrieve your details. Please try again.", 3500, true, "error")
                    console.log("LISTING RESERVE: Failed to retrieve user details, redirecting to home. Response below.")
                    console.log(res.data)
                    navigate("/")
                }
            })
            .catch(err => {
                dispatch(reloadAuthToken(authToken));
                showToast("Error", "Failed to retrieve your details. Please try again.", 3500, true, "error")
                console.log("LISTING RESERVE: Failed to retrieve user details, redirecting to home. Response below.")
                console.log(err)
                navigate("/")
            })
    }

    useEffect(() => {
        if (error) {
            console.log("Auth failed to load; error: " + error)
            showToast("Something went wrong", "We failed to load information for you. Please try again.", 3000, true, "error")
        }
    }, [error])

    useEffect(() => {
        if (loaded == true && !error) {
            if (state == null || !state.listingID) {
                if (!listingID) {
                    console.log("No listing ID provided to show confirm reservation.")
                    showToast("Something went wrong", "Insufficient information provided.", 1500, true, "error")
                    navigate("/")
                    return
                }
            } else {
                setListingID(state.listingID)
            }

            fetchListingDetails(listingID || state.listingID)
                .then(() => {
                    fetchUserDetails() // Will only fetch if user is logged in. If not fetched, UI will show "Login or sign up to reserve."
                })
        }
    }, [loaded, user])

    if (loading) {
        return (
            <Spinner />
        )
    }

    return (
        <>
            {listingData.alreadyReserved ? (
                <ScaleFade in={true} transition={{ duration: 2 }} initialScale={0.6}>
                    <ConfirmReservationSuccess listingData={listingData} hostData={hostData} />
                </ScaleFade>
            ) : (
                <ConfirmReservationLayout listingData={listingData} hostData={hostData} userData={userData} fetchListingDetails={fetchListingDetails} />
            )}
        </>
    )
}

export default ConfirmReservation