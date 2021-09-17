import React from 'react';
import { useColorMode, useColorModeValue, Icon, IconButton, Tooltip, Button, Text } from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';

export const ColorModeSwitcher = ({ simple = true, ...props }) => {
  const { toggleColorMode } = useColorMode();
  const SwitchIcon = useColorModeValue(MoonIcon, SunIcon);
  const text = `Switch to ${useColorModeValue('Dark', 'Light')}`;

  if (simple) return <Tooltip label="Change color mode">
    <IconButton
      size="md"
      fontSize="lg"
      aria-label={text}
      variant="ghost"
      color="current"
      onClick={toggleColorMode}
      icon={<SwitchIcon />}
      {...props}
    />
  </Tooltip>;

  return <Tooltip label="Change color mode">
    <Text onClick={toggleColorMode} {...props}>
        <Icon mr="2" as={SwitchIcon} />
        {text}
    </Text>
  </Tooltip>
}
