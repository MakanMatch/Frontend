import React from 'react';
import { Input, InputGroup, InputLeftElement, IconButton } from '@chakra-ui/react';
import { SearchIcon, CloseIcon } from '@chakra-ui/icons';

const SearchBar = ({ searchQuery, setSearchQuery }) => {
    return (
        <InputGroup mb={4}>
            <InputLeftElement
                pointerEvents="none"
                children={<SearchIcon color="gray.300" />}
            />
            <Input
                type="text"
                placeholder="Search by comment or poster name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
                <IconButton
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