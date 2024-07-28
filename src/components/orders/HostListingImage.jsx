import { Box, Image, Tooltip, CloseButton } from '@chakra-ui/react'
import React from 'react'
import placeholderImage from '../../assets/placeholderImage.svg'

function HostListingImage({ index, listingImages, imgURL, imgName, handleDeleteImage }) {
    const imageBox = (
        <Box key={index} position={"relative"} height={"100%"} minW={"fit-content"}>
            <Image key={index} maxH={"100%"} objectFit={"cover"} display={"block"} rounded={"10px"} src={imgURL} fallbackSrc={placeholderImage} />
            {listingImages.length > 1 && (
                <Tooltip hasArrow label={"Delete image"} placement={"top"}>
                    <CloseButton size={"md"} position={"absolute"} top={"0"} right={"0"} m={"2"} bgColor={"red"} color={"white"} onClick={() => { handleDeleteImage(imgName) }} />
                </Tooltip>
            )}
        </Box>
    )

    if (listingImages.length == 1) {
        return (
            <Tooltip key={index} hasArrow label={"Add more images to delete"} placement='bottom'>
                {imageBox}
            </Tooltip>
        )
    } else {
        return imageBox
    }
}

export default HostListingImage