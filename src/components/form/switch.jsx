import Icon from '@chakra-ui/icon';
import { QuestionOutlineIcon } from '@chakra-ui/icons';
import { Flex, Text } from '@chakra-ui/layout';
import { Switch } from '@chakra-ui/switch';
import { Tooltip } from '@chakra-ui/tooltip';
import React from 'react';

export default ({ title, help, isChecked, colorScheme, onChange = () => {}, ...props }) => {
    return <Flex alignItems="center" {...props}>
        <Text>
            {title}
            <Tooltip label={help} maxW="15rem">
                <Icon mx="2" icon={<QuestionOutlineIcon />} />
            </Tooltip>
            <Switch colorScheme={colorScheme} size="sm" isChecked={isChecked}
                onChange={onChange} />
        </Text>
    </Flex>
}