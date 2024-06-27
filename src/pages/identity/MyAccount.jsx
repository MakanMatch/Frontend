import React, { useEffect, useState, useContext } from 'react';
import {
    Box, Heading, Input, Button, Text, VStack, FormControl, FormLabel, FormErrorMessage, useToast, InputGroup, InputRightElement, IconButton,
    Spinner
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import withAuth from '../../components/identity/withAuth';
import UserContext from '../../context/UserContext';
import server from '../../networking';
import { useNavigate } from 'react-router-dom';

const MyAccount = () => {
    // const [userInfo, setUserInfo] = useState(null);
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user, setUser, loaded } = useContext(UserContext);

    // useEffect(() => {
    //     const fetchUserInfo = async () => {
    //         try {
    //             const response = await server.get('/cdn/MyAccount', {
    //                 headers: {
    //                     Authorization: `Bearer ${localStorage.getItem('jwt')}`
    //                 }
    //             });
    //             // setUserInfo(response.data);
    //         } catch (err) {
    //             console.log(err)
    //             setError('Failed to fetch user information.');
    //             console.log("Fail to fetch")
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     fetchUserInfo();
    // }, []);

    const handleLogout = () => {
        setUser(null)
        localStorage.clear()
        navigate("/login")
        return
    }

    useEffect(() => {
        if (loaded === true) {
            setLoading(false)
            if (user == null) {
                navigate("/login")
            }
        }
    }, [loaded])

    if (loading) {
        return <Spinner />
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h1>My Account</h1>
            <p>Username: {user.username}</p>
            <p>Email: {user.email}</p>
            <Button
                colorScheme='purple'
                type='submit'
                width='150px'
                onClick={handleLogout}
                mt={10}
                mb={5}
            >
                Logout
            </Button>
        </div>
    );
};

export default MyAccount;