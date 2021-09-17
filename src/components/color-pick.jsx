// import { Popover, PopoverTrigger } from '@chakra-ui/react'
import { Button } from '@chakra-ui/button'
import { Grid, SimpleGrid, Box } from '@chakra-ui/layout'
import { Popover, PopoverArrow, PopoverContent, PopoverTrigger, PopoverBody } from '@chakra-ui/popover'
import { Portal } from '@chakra-ui/portal'
import { Tooltip } from '@chakra-ui/react'
import React from 'react'

const _colors = [
    "gray", "red", "orange", "yellow", "green", "teal",
    "blue", "cyan", "purple", "pink"
]

export default ({ color, size = "xs", onChange = () => {} }) => {
    const [isOpen, setIsOpen] = React.useState(false)
    const open = () => setIsOpen(!isOpen)
    const close = () => setIsOpen(false)
    return <Popover isOpen={isOpen} onClose={close} size="sm">
        <PopoverTrigger>
            <Tooltip label="Change primary color">
                <Button onClick={open} size={size} colorScheme={color} />
            </Tooltip>
        </PopoverTrigger>
        <Portal>
            <PopoverContent style={{width: "max-content"}}>
                <PopoverArrow />
                <PopoverBody style={{width: "max-content"}}>
                    {/* Wrap */}
                    <SimpleGrid columns="3" gap="2">
                        {_colors.map((c) => <Box key={c}>
                            <Button p="0"
                                onClick={() => {onChange(c); close()}}
                                variant={c===color?"outline":"solid"}
                                children={c===color&&<Box borderRadius="full"
                                    h="1rem" w="1rem" bg={`${c}.500`} />}
                                size={size} colorScheme={c} />
                        </Box>)}
                    </SimpleGrid>
                </PopoverBody>
            </PopoverContent>
        </Portal>
    </Popover>
}