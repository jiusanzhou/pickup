import { Button, IconButton } from '@chakra-ui/button';
import { useColorModeValue } from '@chakra-ui/color-mode';
import {
    AddIcon,
    ArrowDownIcon,
    ArrowUpIcon,
    CheckIcon,
    DeleteIcon,
    HamburgerIcon,
    InfoOutlineIcon,
    TriangleDownIcon,
    TriangleUpIcon,
} from '@chakra-ui/icons';
import { Input } from '@chakra-ui/input';
import { Box, Flex, HStack, Text } from '@chakra-ui/layout';
import { Tooltip } from '@chakra-ui/tooltip';
import React, { useCallback, useMemo, useState } from 'react';

// <turn object and array in the generator>
// input: oci

// root type must be object or array

// this can also be a form

const ItemContainer = ({
    depth,
    type,
    name,
    description,
    required,

    _canAddField,
    _canExpand,
    _extType,

    otherPropsContent,

    inputProps = {},

    primaryColor,

    ...props
}) => {
    return (
        <Flex py="1" role="group" fontSize=".875rem" {...props}>
            {/* add field button */}
            <IconButton
                visibility={_canAddField ? 'visible' : 'hidden'}
                variant="ghost"
                size="xs"
                icon={<AddIcon />}
            />
            {/* main body data */}
            <Flex pl={`${depth * 0.5}rem`} flex="1" alignItems="center">
                {/* expand button */}
                {/* <TriangleUpIcon /> */}
                <IconButton
                    visibility={_canExpand ? 'visible' : 'hidden'}
                    size="xs"
                    variant="ghost"
                    icon={<TriangleDownIcon size="xs" />}
                />
                {/* name */}
                <Box w="fit-content" minW="2.5rem">
                    <Input fontSize=".875rem"
                        placeholder="name"
                        variant="unstyled"
                        {...inputProps}
                    />
                </Box>
                {/* type change */}:
                <Button
                    ml="2"
                    fontSize=".875rem"
                    fontWeight="normal"
                    color="green"
                    variant="link"
                >
                    {type}
                </Button>
                {/* ext type */}
                <Text ml=".2rem" color={`gray.600`}>{_extType}</Text>
                {/* info */}
            </Flex>
            {/* actions - 1 */}
            <HStack
                spacing="1"
                visibility="hidden"
                _groupHover={{ visibility: 'visible' }}
            >
                {/* up */}
                <Tooltip label="Move Up">
                    <IconButton
                        variant="ghost"
                        size="xs"
                        icon={<ArrowUpIcon />}
                    />
                </Tooltip>
                <Tooltip label="Move Down">
                    <IconButton
                        variant="ghost"
                        size="xs"
                        icon={<ArrowDownIcon />}
                    />
                </Tooltip>
                <Tooltip label="Delete">
                    <IconButton
                        variant="ghost"
                        size="xs"
                        icon={<DeleteIcon />}
                    />
                </Tooltip>
            </HStack>
            <HStack spacing="1">
                {/* other props */}
                <Tooltip label="Other Properties">
                    <IconButton
                        variant="ghost"
                        size="xs"
                        icon={<HamburgerIcon />}
                    />
                </Tooltip>
                {/* required */}
                <Tooltip label="Required">
                    <IconButton
                        variant="ghost"
                        size="xs"
                        icon={<CheckIcon />}
                    />
                </Tooltip>
                {/* description */}
                <Tooltip label="Description">
                    <IconButton
                        variant="ghost"
                        size="xs"
                        icon={<InfoOutlineIcon />}
                    />
                </Tooltip>
            </HStack>
        </Flex>
    );
};

const oci2tree = ({ keyPrefix, depth = 0, name='', type, properties, items }) => {
    let key = keyPrefix ? `${keyPrefix}.${name}` : name
    switch (type) {
        case 'object':
            let _keys = Object.keys(properties);
            return [
                {
                    key,
                    depth,
                    name,
                    type,
                    _canAddField: true,
                    _canExpand: true,
                    _extType: `{${_keys.length}}`,
                },
            ].concat(
                ..._keys.map(_key =>
                    oci2tree({
                        keyPrefix: `${key}`,
                        name: _key,
                        ...properties[_key], // can rewrite the name
                        depth: depth + 1,
                    })
                )
            );
        case 'array':
            return [{
                key,
                depth,
                name,
                type,

                _extType: `[${items.type}]`,
            }].concat(
                oci2tree({ ...items, keyPrefix: `${key}`, depth: depth + 1 })
            );
        default:
            return {
                key,
                depth,
                name,
                type,
            };
    }
};

const _demoData = {
    type: 'object',
    name: '', // root have no name
    properties: {
        field1: { type: 'string' },
        field2: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    arrayfield1: { type: 'string' },
                    arrayfield2: { type: 'string' },
                },
            },
        },
        field3: {
            type: 'array',
            items: {
                type: 'string',
            },
        },
        field4: {
            type: 'object',
            properties: {
                objectfield1: { type: 'string' },
                objectfield2: { type: 'string' },
            },
        },
        field5: {
            type: 'array',
            items: {
                type: 'string',
                description: 'Array\' item'
            },
        },
        field6: {
            type: 'object',
            properties: {
                objectfield1: { type: 'string' },
                objectfield2: { type: 'string' },
            },
        },
    },
};

const OCITreeEditor = ({
    scheme = _demoData,
    onNodeClick,
    onNodeDelete,
    onNodeAdd,
}) => {

    const nodes = useMemo(() => oci2tree(scheme), [scheme])

    console.log("==========>", nodes)
    const [collapsed, setCollapseds] = useState([])

    return (
        <Box py="2" borderStyle="solid" borderWidth="1px">
            {nodes.map((node, idx) => (
                <ItemContainer
                    _even={{ bg: useColorModeValue(`gray.50`, `gray.700`) }}
                    inputProps={{ _focus: { bg: useColorModeValue(`gray.300`, `gray.800`) } }}
                    {...node}
                />
            ))}
        </Box>
    );
};

export { OCITreeEditor };
