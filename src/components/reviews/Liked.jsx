import React from 'react';
import { Icon } from '@chakra-ui/react';
import { BiSolidLike } from "react-icons/bi";

function Liked() {
    const LikedIcon = () => (
        <Icon boxSize={8} mt={2} color="blue.500">
            <BiSolidLike />
        </Icon>
    );
    return (
        <LikedIcon />
    )
}

export default Liked;