import React from 'react';
import { Input, InputGroup, InputLeftElement, IconButton, useBreakpointValue } from '@chakra-ui/react';
import { SearchIcon, CloseIcon } from '@chakra-ui/icons';

const SearchBar = ({ searchQuery, setSearchQuery, basePlaceholder, mdPlaceholder }) => {
    const placeholder = useBreakpointValue({
        base: basePlaceholder,
        md: mdPlaceholder,
    });

    return (
        <InputGroup mb={4}>
            <InputLeftElement
                pointerEvents="none"
                children={<SearchIcon color="gray.300" />}
            />
            <Input
                type="text"
                placeholder={placeholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
                <IconButton
                    mt={1}
                    ml={2}
                    icon={<CloseIcon />}
                    size="sm"
                    onClick={() => setSearchQuery('')}
                />
            )}
        </InputGroup>
    );
};

export default SearchBar;
