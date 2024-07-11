import React from 'react'
import { Icon } from '@chakra-ui/react';
import { BiLike } from "react-icons/bi";

function Like() {
    const LikeIcon = () => (
        <Icon boxSize={8} mt={2} color="gray.400">
            <BiLike />
        </Icon>
    );
  return (
    <LikeIcon />
  )
}

export default Like