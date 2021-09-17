import { extendTheme } from "@chakra-ui/react"
import { mode } from '@chakra-ui/theme-tools'

// custom theme
const theme = extendTheme({
    styles: {
        global: props => ({
            body: {
                bg: null
            }
        }),
    }
})

export default theme;