import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Box, Heading, Text, Flex, Avatar, Button, Spacer, Spinner 
} from "@chakra-ui/react";
import { logout, fetchUser } from "../../slices/AuthState";

const MyAccount = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isHovered, setIsHovered] = useState(false);
  const { user, loaded, error } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.clear();
    navigate("/login");
  };

  useEffect(() => {
    if (!loaded) {
      dispatch(fetchUser());
    }
  }, [dispatch, loaded]);

  useEffect(() => {
    if (loaded && !user) {
      navigate("/login");
    }
  }, [loaded, user, navigate]);

  if (!loaded) {
    console.log("Not loaded");
    return <Spinner />;
  }

  if (error) {
    console.log(error);
    return <Spinner />;
  }

  const calculateAccountAge = () => {
    const createdAt = new Date(user.createdAt);
    const currentDate = new Date();
    const diffInMilliseconds = currentDate - createdAt;
    const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));
    return diffInDays;
  };

  return (
    <Flex height="100vh">
      {/* Left side box */}
      <Box width="25%" bg="gray.100" p={4} borderRadius={15}>
        <Text>Left Sidebar</Text>
        <Button colorScheme="purple" mb={4} onClick={handleLogout}>
          Logout
        </Button>
      </Box>

      {/* Right side content */}
      <Box width="75%" ml={10} position="relative">
        {/* Profile banner */}
        <Box bg="blue.500" height="25%" position="relative" borderRadius={15}>
          <Flex align="center" justify="flex-end" height="100%" pr={10}>
            <Heading color="white">Guest</Heading>
          </Flex>
          {/* Circle avatar */}
          <Box
            position="absolute"
            bottom="-70px"
            left="20%"
            transform="translateX(-50%)"
            zIndex={1}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            overflow="visible"
          >
            <Avatar
              size="3xl"
              name="User Name"
              src="https://via.placeholder.com/150"
              position="relative"
              bg="white"
              border="4px solid white"
            >
              {isHovered && (
                <Box
                  position="absolute"
                  top={0}
                  left={0}
                  right={0}
                  bottom={0}
                  bg="rgba(0, 0, 0, 0.5)"
                  zIndex={2}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  borderRadius="50%"
                >
                  <Text fontSize="sm" color="white">
                    Edit Picture
                  </Text>
                </Box>
              )}
            </Avatar>
          </Box>
        </Box>

        {/* Account info part */}
        <Flex
          bg="gray.200"
          p={4}
          mt={20}
          justifyContent="space-between"
          width="100%"
        >
          <Box flex="1">
            <Heading size="md" mb={4}>
              Basic Information
            </Heading>
            <Text>Username: {user.username}</Text>
            <Text>Email: {user.email}</Text>
            <Text>Contact: {user.contactNum}</Text>
            <Text>Address: {user.address}</Text>
            <Button
              colorScheme="purple"
              mb={4}
              onClick={() => console.log("Change password clicked")}
            >
              Change Password
            </Button>
          </Box>

          <Box flex="1">
            <Heading size="md" mb={4}>
              Additional Information
            </Heading>
            <Text>Favorite Cuisine: {user.favCuisine}</Text>
            <Text>Meals Matched: {user.mealsMatched}</Text>
            <Text>Account Age: {calculateAccountAge()} days</Text>
            <Spacer />
            <Button
              colorScheme="red"
              onClick={() => console.log("Delete account clicked")}
            >
              Delete Account
            </Button>
          </Box>
        </Flex>
      </Box>
    </Flex>
  );
};

export default MyAccount;
