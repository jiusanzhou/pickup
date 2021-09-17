import React, { useState } from 'react';
import { Box, Flex, HStack, SimpleGrid,
    useToast, Button, useClipboard,
    Tooltip, Text, Switch, Icon } from "@chakra-ui/react";
import { inject, observer } from 'mobx-react';
import { QuestionOutlineIcon } from '@chakra-ui/icons';

import CustomSwitch from "../components/form/switch";
import { OCITreeEditor } from '../components/oci-editor';
import CustomRadioGroup from "../components/radiogroup"

const SchemeEditor = ({ appStore, stateStore, ...props }) => {
    const toast = useToast()
    
    const [ viewMode, setViewMode ] = useState('tree')

    return <Flex p="2" flexDirection="column" {...props}>

        <SimpleGrid mb="2" columns={3}>
            <CustomRadioGroup colorScheme={appStore.colorScheme}
                onChange={(v) => setViewMode(v)} defaultValue={viewMode} items={{
                    tree: 'Tree',
                    json: 'JSON'
                }} />

            <Box></Box>
            <Flex justifyContent="flex-end">
                <HStack>
                    {/* fast mode */}
                    <CustomSwitch title="Fast Mode"
                        help="Fast mode will auto apply current selected element to scheme editor."
                        colorScheme={appStore.colorScheme} />

                </HStack>
            </Flex>
        </SimpleGrid>

        <Box flex="1" overflow="auto">
            <OCITreeEditor />
        </Box>
    </Flex>
}

export default inject('appStore', 'stateStore')(observer(SchemeEditor));