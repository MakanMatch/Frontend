import { extendTheme } from "@chakra-ui/react";

const colors = {
    primaryButton: "#6f06f5"
}

const MainTheme = extendTheme({
    colors,
    components: {
        Button: {
            baseStyle: {
                borderRadius: '10px',
                fontWeight: 'bold',
                // textTransform: 'uppercase',
                // _focus: {
                //     boxShadow: 'none'
                // }
            },
            variants: {
                solid: {
                    bg: 'primaryButton',
                    color: 'white',
                    _hover: {
                        bg: 'purple.700'
                    }
                }
            }
        }
    }
})

export default MainTheme;