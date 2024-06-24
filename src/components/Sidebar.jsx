import { Button, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, Flex, Image, Input } from '@chakra-ui/react'
import React from 'react'
import Logo from '../assets/Logo.png'

function Sidebar({ isOpen, onClose }) {
    return (
        <Drawer
            isOpen={isOpen}
            placement='left'
            onClose={onClose}
        >
            <DrawerOverlay />
            <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader>
                    <Flex display={"flex"} flexDirection={"center"} flexWrap={"wrap"} >
                        <Image src={Logo} height={"100px"} />
                    </Flex>
                </DrawerHeader>

                <DrawerBody>
                    <Input placeholder='Type here...' />
                </DrawerBody>

                <DrawerFooter>
                    <Button variant='outline' mr={3} onClick={onClose}>
                        Cancel
                    </Button>
                    <Button colorScheme='blue'>Save</Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}

export default Sidebar