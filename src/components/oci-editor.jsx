import { Button, IconButton } from '@chakra-ui/button';
import { useColorModeValue } from '@chakra-ui/color-mode';
import {
    AddIcon,
    ArrowDownIcon,
    ArrowUpIcon,
    CheckCircleIcon,
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

import _demoData1 from "../test/data/oci-demo1"
import _demoData2 from "../test/data/oci-demo2"

// <turn object and array in the generator>
// input: oci

// root type must be object or array

// this can also be a form

const ItemContainer = ({
    index, path, depth, keyPrefix,
    type,
    name,
    description,
    required,

    _canAddField,
    _canExpand,
    _extType,
    _collapsed,
    _needName = true,

    otherPropsContent,

    inputProps = {},

    primaryColor,

    onCollapsed,
    onDelete,
    onAddField,
    onFieldChanged,

    nodes, // for ignore
    children,
    itemProps = {},
    ...props
}) => {
    
    const [_name, _setName] = useState(name)

    return <Box {...props}>
        <Flex py="1" px="2" role="group" fontSize=".875rem"
            bg={index%2===1?useColorModeValue(`gray.50`, `gray.700`):null}
            {...itemProps}>
            {/* add field button */}
            <IconButton
                visibility={_canAddField ? 'visible' : 'hidden'}
                variant="ghost"
                size="xs"
                onClick={()=>{ onAddField && onAddField(path) }}
                icon={<AddIcon />}
            />
            {/* main body data */}
            <Flex pl={`${depth * 1}rem`} alignItems="center">
                {/* expand button */}
                {/* <TriangleUpIcon /> */}
                <IconButton
                    visibility={_canExpand ? 'visible' : 'hidden'}
                    size="xs"
                    variant="ghost"
                    onClick={() => onCollapsed(path)}
                    icon={<TriangleDownIcon transform={_collapsed?"rotate(-90deg)":null} size="xs" />}
                />
                {/* name */}
                {_needName&&<Box w="fit-content" w="3.5rem" mr="2">
                    <Input fontSize=".875rem"
                        placeholder="name"
                        variant="unstyled"
                        value={_name}
                        onChange={(e) => _setName(e.target.value)}
                        onBlur={() => { (onFieldChanged&&_name!==name) && onFieldChanged('name', _name) }}
                        {...inputProps}
                    />
                </Box>}
                {/* type change */}
                <Button
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
            {/* selector rule adn transitions */}
            <Flex flex="1">
                
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
                        disabled={index===0}
                        variant="ghost"
                        size="xs"
                        icon={<ArrowUpIcon />}
                    />
                </Tooltip>
                <Tooltip label="Move Down">
                    <IconButton
                        disabled={index===0}
                        variant="ghost"
                        size="xs"
                        icon={<ArrowDownIcon />}
                    />
                </Tooltip>
                <Tooltip label="Delete">
                    <IconButton
                        disabled={index===0}
                        variant="ghost"
                        size="xs"
                        onClick={() => onDelete && onDelete(path)}
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
                        icon={<CheckCircleIcon />}
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
        {children&&<Box display={_collapsed && 'none'}>{children}</Box>}
    </Box>;
};

const oci2tree = ({ keyPrefix='', depth=0, name='', type, properties, items }) => {
    let key = depth>0 ? `${keyPrefix}.${name}` : name
    switch (type) {
        case 'object':
            let _keys = Object.keys(properties);
            return {
                path: key, keyPrefix,
                depth,
                name,
                type,
                _canAddField: true,
                _canExpand: true,
                _extType: `{${_keys.length}}`,
                _needName: depth !== 0, // depth is 0 must only root
                nodes: _keys.map(_key =>
                    oci2tree({
                        keyPrefix: `${key}`,
                        name: _key,
                        ...properties[_key], // can rewrite the name
                        depth: depth + 1,
                    })
                )
            };
        case 'array':
            let _items = oci2tree({ ...items, keyPrefix: `${key}`, depth: depth })
            return {
                ..._items,
                
                // below fields use original
                path: key, keyPrefix,
                depth,
                name,
                type: `${type}[${items.type}]`,
                // _extType: `[${items.type}]`,
            };
        default:
            return {
                path: key, keyPrefix,
                depth,
                name,
                type,
            };
    }
};

const _nodesView = ({ node, index=0, genProps=(node)=>({}), ...props }) => {
    if (!node.nodes) return <ItemContainer {...node} {...props} {...genProps(node)} />
    return <ItemContainer {...node} {...props} {...genProps(node)} >
        {node.nodes.map((xnode, idx) => <_nodesView key={idx}
            genProps={genProps}
            node={xnode} {...props} />)}
    </ItemContainer>
}

const OCITreeEditor = ({
    scheme = _demoData1,
    onNodeClick,
    onNodeDelete,
    onNodeAdd,
}) => {

    const root = useMemo(() => oci2tree(scheme), [scheme])

    console.log("root ==>", root)

    const [collapsed, setCollapseds] = useState({})

    // every render should recreate
    let _count = -1
    const genProps = useCallback(({ path }) => {
        _count += 1
        return {
            index: _count,
            _collapsed: collapsed[path],
        }
    })

    const _onCollapsed = useCallback((path) => {
        collapsed[path] ? delete collapsed[path] : collapsed[path] = true
        setCollapseds({...collapsed})
    }, [])

    return (
        <Box py="2" borderStyle="solid" borderWidth="1px">
            <_nodesView node={root}
                onCollapsed={_onCollapsed}
                onAddField={(v)=>console.log("add field ===>", v)}
                onDelete={(v)=>console.log("delete ===>", v)}
                onFieldChanged={(k, v) => console.log("field change ===>", k, v)}
                genProps={genProps}
                inputProps={{ _focus: { bg: useColorModeValue(`gray.300`, `gray.800`) } }} />
        </Box>
    );
};

export { OCITreeEditor };
