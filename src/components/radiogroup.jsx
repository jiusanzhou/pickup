import { useColorModeValue } from '@chakra-ui/color-mode';
import { Box, HStack } from '@chakra-ui/layout';
import { useRadio, useRadioGroup } from '@chakra-ui/radio';
import React from 'react';


const RadioCard = ({ children, colorScheme, checkboxProps, checkedProps = {}, ...props }) => {

    const { getInputProps, getCheckboxProps } = useRadio(props)
  
    const input = getInputProps()
    const checkbox = getCheckboxProps()

    if (!colorScheme) colorScheme = "teal"
  
    return (
        //  borderWidth="1px" borderLeftWidth="0px"  _first={{ borderLeftWidth: '1px' }}
        <Box as="label">
            <input {...input} />
            <Box borderRadius="full" py="1" px="2" {...checkbox} cursor="pointer"
                transition="all 0.3s ease-out-in"
                _checked={{
                    bg: `${colorScheme}.500`,
                    color: `white`,
                    ...checkedProps
                }} {...checkboxProps}>
            {children}
            </Box>
        </Box>
    )
}

const normalizeItems = (items) => {
    if (Array.isArray(items)) {
        if (items.length === 0) return []

        if (typeof items[0] === "object") {
            return [...items]
        } else {
            return items.map(item => ({
                value: item,
            }))
        }

    } else if (typeof items === "object") {
        return Object.keys(items).map(key => ({
            title: items[key], // display value
            value: key, // use key as value
        }))
    }

    return []
}

export default ({ items, name, onChange, defaultValue = "",
    colorScheme,
    checkboxProps = {}, checkedProps = {}, ...props }) => {

    const { getRootProps, getRadioProps } = useRadioGroup({
        name: name || "radio-group-filter",
        defaultValue,
        onChange,
    })

    const group = getRootProps()

    const data = normalizeItems(items)

    return <Box as={HStack} bgColor={useColorModeValue(`gray.100`, `gray.700`)} borderRadius="full"
        overflow="auto" spacing="2" w="fit-content" p="1" {...group}>
        {data.map(({ title, value, children }) => {
            const radio = getRadioProps({ value })
            return <RadioCard colorScheme={colorScheme} key={value} checkboxProps={checkboxProps} checkedProps={checkedProps} {...radio}>
                {children || title || value}
            </RadioCard>
        })}
    </Box>
}