import { Flex, HStack, Text } from "@chakra-ui/react";
import React from "react";
import settings from "../utils/settings";

const _colors = [
    "#4285f4",
    "#ea4335",
    "#fbbc06",
    "#4285f4",
    "#34a854",
    "#ea4335",
]

const _genColor = (i) => _colors[i%_colors.length]

export default ({ name = settings.title, ...props }) => {
    // mode: simple, full

    return <HStack {...props}>
        {name.split("").map((n, index) => <Text key={n}
        fontSize="5rem"
        fontWeight="bold"
        userSelect="none"
        casing={index===0?"uppercase":""}
        color={_genColor(index)}
        as="span">{n}</Text>)}
    </HStack>
}