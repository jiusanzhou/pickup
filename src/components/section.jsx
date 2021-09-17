import { Box, Flex } from '@chakra-ui/react';
import React from 'react';
import settings from '../utils/settings';


export default ({children, ...props}) => {
    return <Flex as="section"
        flexDirection="column"
        alignItems="center"
        width={settings.maxContainerW} {...props}>
            {children}
    </Flex>
}