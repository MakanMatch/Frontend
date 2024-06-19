import { extendTheme } from "@chakra-ui/react";

const colors = {
    primaryButton: "#6f06f5"
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
                    bg: 'primaryButton',
                    borderRadius: '10px',
                    color: 'white',
                    fontWeight: 'bold',
                    _hover: {
                        bg: 'purple.700'
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