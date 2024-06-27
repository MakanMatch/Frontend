import React, { useEffect, useState } from 'react';
import withAuth from '../../components/identity/withAuth';
import server from '../../networking';

const MyAccount = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await server.get('/cdn/MyAccount', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('jwt')}`
                    }
                });
                setUserInfo(response.data);
            } catch (err) {
                console.log(err)
                setError('Failed to fetch user information.');
                console.log("Fail to fetch")
            } finally {
                setLoading(false);
            }
        };

        fetchUserInfo();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!userInfo) {
        return <div>No user information available.</div>;
    }

    return (
        <div>
            <h1>My Account</h1>
            <p>Username: {userInfo.username}</p>
            <p>Email: {userInfo.email}</p>
        </div>
    );
};

export default withAuth(MyAccount);