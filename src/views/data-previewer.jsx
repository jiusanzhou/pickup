import { IconButton } from '@chakra-ui/button';
import { CopyIcon, DownloadIcon } from '@chakra-ui/icons';
import { Box, Flex, HStack, SimpleGrid, Text } from '@chakra-ui/layout';
import { Center } from '@chakra-ui/react';
import { inject, observer } from 'mobx-react';
import React, { useMemo, useState } from 'react';
import { useColorModeValue, Tooltip } from "@chakra-ui/react";
import CustomMenu from '../components/menu';
import CustomTable from "../components/table"
import CustomRadioGroup from "../components/radiogroup"
import saveFile from "../components/save-file"

const _viewrs = {
    json: (data, props) => <Box width="100%" overflow="auto" bg="gray.200" p="2" {...props}>
        <Box textAlign="left" as="pre">
            {JSON.stringify(data, null, 2)}
        </Box>
    </Box>,
    table: (data) => <CustomTable borderStyle="solid" borderWidth="1px" p="1"
        size="sm" data={data}>
        <Center>
            <Text>No data selected</Text>        
        </Center>
    </CustomTable>
}

const DataPreviewer = ({ stateStore, appStore, ...props }) => {

    // const data = stateStore.curActiveGenData

    const [ viewMode, setViewMode ] = useState('table')

    return <Flex p="2" flexDirection="column" {...props}>
        <SimpleGrid mb="2" columns={3}>
            <CustomRadioGroup colorScheme={appStore.colorScheme}
            onChange={(v) => setViewMode(v)}defaultValue={viewMode} items={{
                table: 'Table',
                json: 'JSON'
            }} />

            {/* cented title */}
            <Text textAlign="center" fontWeight="bold">
                Current Selected
            </Text>

            {/* button acitoons */}
            <HStack justifyContent="flex-end">
                {/* copy */}
                <Tooltip label="Copy content to clipboard">
                    <IconButton size="sm" icon={<CopyIcon />} />
                </Tooltip>

                {/* download */}
                <CustomMenu disabled={stateStore.curActiveGenData.length <= 0} items={[
                    {title: 'JSON', onClick: () => {
                        if (stateStore.curActiveGenData.length <= 0) return
                        saveFile("data.json", JSON.stringify(stateStore.curActiveGenData))
                    }},
                    {title: 'CSV', onClick: () => {
                        console.log("=====>")
                    }}
                ]}>
                    <IconButton size="sm" icon={<DownloadIcon />} />
                </CustomMenu>
            </HStack>
        </SimpleGrid>

        <Box flex="1" overflow="auto">
            {_viewrs[viewMode] && _viewrs[viewMode](stateStore.curActiveGenData, {
                bg: useColorModeValue(`gray.200`, `gray.700`)
            })}
        </Box>
        
    </Flex>
}

export default inject('appStore', 'stateStore')(observer(DataPreviewer));