import { Avatar } from '@chakra-ui/avatar';
import { useColorModeValue } from '@chakra-ui/color-mode';
import { Input } from '@chakra-ui/input';
import { Box, Flex, Text } from '@chakra-ui/layout';
import { inject, observer } from 'mobx-react';
import React from 'react';

const SiteInfo = ({ appStore, stateStore }) => {
    const { siteInformation } = stateStore;
    if (!siteInformation) return <Box></Box>
    let { icon, title, description, url, path, theme } = siteInformation;
    if (icon && icon.indexOf('//')<0) {
        // add origin
        icon = `${appStore.proxy.origin()}${icon}`;
    }
    if (title) title = title.split('-').slice(-1)[0].trim();
    
    return <Flex alignItems="center">
        <Avatar name={title} p="1" bg={theme||'gray.200'} borderRadius=".35rem" size="sm" src={icon} />
        <Text ml="2" isTruncated maxW="5rem">{title}</Text>
        
        <Box>
            <Input px="2" py="1" ml="2"
            _focus={{  }}
            variant="unstyled" onChange={()=>{}} value={path} />
        </Box>
    </Flex>
}

export default inject('appStore', 'stateStore')(observer(SiteInfo))