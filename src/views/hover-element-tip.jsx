import { Box, Text } from '@chakra-ui/layout';
import { Portal } from '@chakra-ui/react';
import { inject, observer } from 'mobx-react';
import React, { useEffect, useMemo } from 'react';

const offset = (el) => {
    let rect = el.getBoundingClientRect(),
    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
}

const HoverElementTip = ({ stateStore, ...props}) => {
    const ele = stateStore.curHoverElement || {}

    let x = 0, y = 0, down = 0, left = 0

    // calculate the position of target
    if (ele.target) {
        const { left, top } = offset(ele.target)
        x = left
        y = top
        if (y < 30) down = true
        // if (x > bodyRect.x - 30) left = true
    }

    // display only when element is not null
    return <Portal>
        <Box position="absolute" bg="gray.700" color="gray.200" boxShadow="md"
            borderRadius="md" px="4" py="3" mb="2"
            style={{ left: x, top: down ? y + 10 : y - 10}}
            transform={`${down ? "translateY(50%)" : "translateY(-100%)"} ${left ? 'translateX(-100%)' : '' }` }
            visibility={stateStore.curHoverElement?null:"hidden"} {...props}>
            <Text noOfLines={1} fontSize="1rem" fontWeight="bold">{ele.css}</Text>
        </Box>
    </Portal>
}

// export default observer(HoverElementTip)

export default inject('stateStore')(observer(HoverElementTip))