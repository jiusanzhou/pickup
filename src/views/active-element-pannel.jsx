import {
    CheckIcon,
    CloseIcon,
    CopyIcon,
    DeleteIcon,
    LinkIcon,
    RepeatIcon,
    SmallCloseIcon,
} from '@chakra-ui/icons';
import { Input, InputLeftElement, InputRightElement } from '@chakra-ui/input';
import { Badge, Box, Flex, HStack, Text } from '@chakra-ui/layout';
import {
    InputGroup,
    Tooltip,
    IconButton,
    useToast,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    Divider,
    CloseButton,
    Button,
    useColorModeValue,
    useTooltip,
    useClipboard,
    Select,
    Tag,
    Checkbox,
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { inject, observer } from 'mobx-react';
import { useState } from 'react';
import CustomMenu from '../components/menu';
import CheckboxList from '../components/checkbox-list';

const ActiveElementPannel = ({ appStore, stateStore, ...props }) => {
    const ele = stateStore.curActiveElement || { siblings: [] };

    const [focused, setFocused] = useState(false);

    return (
        <Box
            p="4"
            bg={useColorModeValue('gray.300', 'gray.700')}
            {...props}
            // transition="all .16s ease-in-out"
            visibility={!stateStore.curActiveElement ? 'hidden' : null}
        >
            {/* css selector input */}
            <InputGroup>
                <InputLeftElement w="20">
                    <Select pl="2" variant="unstyled" value={appStore.selectorType} size="xs"
                        onChange={(e) => appStore.setSelectorType(e.currentTarget.value)}>
                        {['css', 'xpath'].map((s) => <option key={s} value={s}>{s.toUpperCase()}</option>)}
                    </Select>
                </InputLeftElement>
                <Input
                    variant="filled"
                    placeholder=""
                    pl="20"
                    focusBorderColor={useColorModeValue('gray.600', 'gray.300')}
                    colorScheme={'whiteAlpha' || appStore.colorScheme}
                    onChange={() => { }}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    value={ele[appStore.selectorType] || ''}
                />
                <InputRightElement>
                    {!focused || true ? (
                        <Tooltip label="Apply the selector change">
                            <IconButton size="sm" icon={<CheckIcon />} />
                        </Tooltip>
                    ) : (
                        <Tooltip label="Copy rule to clipboard">
                            <IconButton size="sm" icon={<CopyIcon />} />
                        </Tooltip>
                    )}
                </InputRightElement>
            </InputGroup>

            {/* value transforms */}
            {/* html text attr href src */}
            {/* <Flex mt="2" p="2" bg="gray.100" borderRadius="md"
                alignItems="center" justifyContent="space-between">
                <HStack>
                    <CheckboxList colorScheme={`${appStore.colorScheme}`}
                    items={stateStore.supportedTransformers.map(tr => {
                        const isChecked = stateStore.isTransformerUsed(tr)
                        return {
                            isChecked,
                            title: <Text>{tr.name.toUpperCase()}</Text>,
                            onChange: (e) => e.target.checked ?
                                stateStore.unuseTransformer(tr) :
                                stateStore.useTransformer(tr)
                        }
                    })} />
                </HStack>
            </Flex> */}

            <Flex
                mt="2"
                p="2"
                bg={useColorModeValue("gray.100", `gray.800`)}
                borderRadius="md"
                alignItems="center"
                justifyContent="space-between"
            >
                {/* empty state */}
                {stateStore.noTransformerUsed && (
                    <Alert p="2" status="warning" size="sm">
                        <AlertIcon size="sm" />
                        <AlertTitle>No transformers:</AlertTitle>
                        <AlertDescription>
                            will not extact value.
                        </AlertDescription>
                    </Alert>
                )}

                {/* used transformers */}
                <HStack spacing="1">
                    {stateStore.usedTransformers.map(([tr, key], index) => (
                        <Box key={index}>
                            <Button
                                px="2"
                                variant="ghost"
                                onClick={() =>
                                    stateStore.unuseTransformer(index)
                                }
                                colorScheme={`${appStore.colorScheme}`}
                                size="sm"
                            >
                                {tr.name.toUpperCase() +
                                    (key ? `[${key}]` : '')}
                            </Button>
                        </Box>
                    ))}
                </HStack>

                {/* add button */}
                <Box zIndex={3}>
                    {ele.target && (
                        <CustomMenu
                            items={stateStore.supportedTransformers.map(tr => ({
                                // get icon
                                title: <Text>{tr.name.toUpperCase()}</Text>,
                                onClick: () => stateStore.useTransformer(tr),
                                items:
                                    tr.name !== 'attr'
                                        ? null
                                        : Array.from(ele.target.attributes)
                                            .map(attr => ({
                                                title: `[${attr.nodeName}]`,
                                                onClick: () =>
                                                    stateStore.useTransformer(
                                                        tr,
                                                        attr.nodeName
                                                    ),
                                            }))
                                            .filter(
                                                i =>
                                                    !/__pickup__/.test(
                                                        i.title
                                                    )
                                            ),
                            }))}
                        >
                            <IconButton ml="2" size="sm" icon={<AddIcon />} />
                        </CustomMenu>
                    )}
                </Box>
            </Flex>

            {/* <Divider colorScheme={`${appStore.colorScheme}`} my="2" /> */}

            {/* actions */}
            <Flex justifyContent="space-between">
                {/* display selector result information */}
                <Box
                    w="max-content"
                    py="1"
                    px="3"
                    mt="2"
                    borderRadius="full"
                    bg={`${appStore.colorScheme}.100`}
                >
                    <Text
                        fontSize=".875rem"
                        color={`${appStore.colorScheme}.700`}
                    >
                        {ele.siblings.length + 1} items selected
                    </Text>
                </Box>

                {/* action buttons */}
                <HStack mt="2" spacing="4" justifyContent="flex-end">
                    {/* <Tooltip label="Delete this element from DOM">
                        <IconButton
                        size="sm"
                        variant="ghost"
                        color="red"
                        icon={<DeleteIcon />}
                        onClick={() => {
                            ele.remove();
                            stateStore.setCurActiveElement(null);
                        }}
                        />
                    </Tooltip> */}
                    <Tooltip label="Remove this field">
                        <CloseButton
                            size="md"
                            variant="ghost"
                            color="red"
                            onClick={() => {
                                ele.unpicked();
                                stateStore.setCurActiveElement(null);
                            }}
                        />
                    </Tooltip>
                    <Tooltip label="Apply and save this field">
                        <IconButton
                            size="xs"
                            variant="solid"
                            colorScheme="green"
                            icon={<CheckIcon />}
                        />
                    </Tooltip>
                </HStack>
            </Flex>
        </Box>
    );
};

export default inject('appStore', 'stateStore')(observer(ActiveElementPannel));
