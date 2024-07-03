import { Drawer, extendTheme } from "@chakra-ui/react";

const colors = {
    primaryColour: "#6f06f5"
}

const MainTheme = extendTheme({
    colors,
    components: {
        Button: {
            baseStyle: {
                // textTransform: 'uppercase',
                // _focus: {
                //     boxShadow: 'none'
                // }
            },
            variants: {
                MMPrimary: {
                    bg: 'primaryColour',
                    borderRadius: '10px',
                    color: 'white',
                    fontWeight: 'bold',
                    _hover: {
                        bg: 'purple.700'
                    }
                },
                DrawerButton: {
                    _hover: {
                        bg: '#E3E8E5'
                    }
                }
            }
        },
        Text: {
            baseStyle: {
                fontFamily: 'Sora'
            },
            variants: {
                link: {
                    color: 'blue',
                    textDecoration: 'underline'
                }
            }
        }
    }
})

export default MainTheme;