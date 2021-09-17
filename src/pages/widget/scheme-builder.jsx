import { Box, Divider, Flex, SimpleGrid } from '@chakra-ui/layout';
import { inject } from 'mobx-react';
import { observer } from 'mobx-react-lite';
import React from 'react';

import DataPreviewer from "../../views/data-previewer"
import SchemeEditor from '../../views/scheme-editor';

const SchemeBuilder = () => {
    return <Flex w="full" h="full">
        {/* scheme */}
        <SchemeEditor maxW="50%"flex="50%" />

        {/* divider */}
        <Box py="5" px="1">
            <Divider orientation="vertical" />
        </Box>

        {/* data previewer */}
        <DataPreviewer maxW="50%" flex="50%" />
    </Flex>
}

export default inject('stateStore')(observer(SchemeBuilder));