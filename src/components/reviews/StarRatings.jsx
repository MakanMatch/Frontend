import React, { useState } from 'react';
import { HStack, IconButton } from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';

const StarRating = ({ maxStars = 5, size = '20px', color = 'yellow.400', onChange }) => {
    const [rating, setRating] = useState(1);
    const [hoverRating, setHoverRating] = useState(0);

    const handleMouseEnter = (index) => setHoverRating(index);
    const handleMouseLeave = () => setHoverRating(0);
    const handleClick = (index) => {
        const newRating = (rating === index) ? 1 : index;
        setRating(newRating);
        if (onChange) onChange(newRating);
    };

    return (
        <HStack spacing={3}>
            {[...Array(maxStars)].map((_, index) => {
                const starIndex = index + 1;
                return (
                    <IconButton
                        key={starIndex}
                        icon={<StarIcon boxSize={size} />}
                        variant="unstyled"
                        aria-label={`${starIndex} star`}
                        size={size}
                        color={(hoverRating || rating) >= starIndex ? color : 'gray.300'}
                        onMouseEnter={() => handleMouseEnter(starIndex)}
                        onMouseLeave={handleMouseLeave}
                        onClick={() => handleClick(starIndex)}
                    />
                );
            })}
        </HStack>
    );
};

export default StarRating;
