import { ChevronRightIcon, TriangleUpIcon } from '@chakra-ui/icons';
import {
    Popover,
    PopoverBody,
    PopoverContent,
    PopoverTrigger,
} from '@chakra-ui/popover';
import { Box, Text, Flex, Icon, useColorModeValue } from '@chakra-ui/react';
import { useState } from 'react';

const _Menu = ({ children, ...props }) => {
    return (
        <Box
            boxShadow="md"
            p="1"
            borderRadius="xs"
            borderStyle="solid"
            borderWidth="1"
            {...props}
        >
            {children}
        </Box>
    );
};

const _MenuItem = ({ icon, text, children, ...props }) => {
    const bg = useColorModeValue(`gray.100`, `gray.700`);

    if (!children)
        return (
            <Flex
                minW="4rem"
                alignItems="center"
                cursor="pointer"
                _hover={{ bg }}
                p="2"
                {...props}
            >
                {icon && <Box mr="2">{icon}</Box>}
                {text}
            </Flex>
        );

    return (
        <Popover trigger="hover" placement="right">
            <PopoverTrigger>
                <Flex cursor="pointer" alignItems="center" _hover={{ bg }} p="2" {...props}>
                    {icon && <Box mr="2">{icon}</Box>}
                    {text}
                    {<ChevronRightIcon ml="2" justifySelf="flex-end" size="sm" />}
                </Flex>
            </PopoverTrigger>
            <PopoverContent sx={{ width: 'max-content', padding: 'unset' }}>
                <PopoverBody sx={{ width: 'max-content', padding: 'unset' }}>
                    <_Menu>{children}</_Menu>
                </PopoverBody>
            </PopoverContent>
        </Popover>
    );
};

const buildMenuItem = ({ icon, title, onClick, onClose, items, ...props }) => {
    if (!items || items.length === 0) {
        return (
            <_MenuItem
                icon={icon}
                text={title}
                {...props}
                onClick={() => {
                    onClick && onClick();
                    onClose();
                }}
            />
        );
    }

    return (
        <_MenuItem icon={icon} text={title} {...props}>
            {items &&
                items.length !== 0 &&
                items.map((i, idx) =>
                    buildMenuItem({ ...i, onClose, key: idx })
                )}
        </_MenuItem>
    );
};

const CustomMenu = ({ children, items = [] }) => {
    return (
        <Popover>
            {({ onClose }) => (
                <>
                    <PopoverTrigger>{children}</PopoverTrigger>
                    <PopoverContent
                        sx={{ width: 'max-content', padding: 'unset' }}
                    >
                        <PopoverBody
                            sx={{ width: 'max-content', padding: 'unset' }}
                        >
                            <_Menu>
                                {items.map((i, idx) =>
                                    buildMenuItem({ ...i, onClose, key: idx })
                                )}
                            </_Menu>
                        </PopoverBody>
                    </PopoverContent>
                </>
            )}
        </Popover>
    );
};

export default CustomMenu;
