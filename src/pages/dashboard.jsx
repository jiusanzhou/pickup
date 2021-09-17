import { DragHandleIcon, HamburgerIcon, TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons';
import { Flex, Button, IconButton, Box, SimpleGrid,
    Input, Textarea, useToast, TabList, TabPannels, TabPannel, Tabs,
    Icon, useColorModeValue, HStack, Tab } from '@chakra-ui/react';
import { inject, observer } from 'mobx-react';
import React, { useEffect, useRef } from 'react';
import { useHistory, withRouter } from 'react-router';
import { FiHome } from "react-icons/fi";

import ColorPick from '../components/color-pick';
import pickup from '../pickup/pickup';
import { ColorModeSwitcher } from '../components/ColorModeSwitcher';

import { withEvents } from "../components/events"
import ActiveElementPannel from '../views/active-element-pannel';
import HoverElementTip from '../views/hover-element-tip';
import { css, Global } from '@emotion/react';
import SchemeBuilder from './widget/scheme-builder';
import CustomMenu from '../components/menu';

import SiteInfo from "../views/site-info";
import CustomSwitch from "../components/form/switch";

// dynamic height and width 30rem

const _positions = {
    left: {
        wrapper: {
            top: 0, left: 0,
            h: "100vh", w: "30rem",
            borderRightWidth: "1px",
            transform: ["translateX(-30rem)", null]
        },
        arrow: {
            right: 0, top: 0,
            // transform: "rotate(90deg)",
            transform: "rotate(90deg) translateX(2rem) translateY(-4rem)", // translateX(2rem)
        },
        arrowButton: {
            rightIcon: [<TriangleUpIcon />, <TriangleDownIcon />],
            children: ["SHOW", "HIDE"],
        }
    },
    right: {
        wrapper: {
            top: 0, right: 0,
            h: "100vh", w: "30rem",
            borderLeftWidth: "1px",
            transform: ["translateX(30rem)", null]
        },
        arrow: {
        },
        arrowButton: {
            rightIcon: [null, null],
            children: ["SHOW", "HIDE"],
        }
    },
    top: {
        wrapper: {
            top: 0, left: 0,
            w: "100vw", h: "30rem",
            borderBottomWidth: "1px",
        },
        arrow: {
            bottom: 0,
            transform: "translateY(2rem)",
        },
        arrowButton: {
            rightIcon: [<TriangleDownIcon />, <TriangleDownIcon />],
        }
    },
    bottom: {
        wrapper: {
            bottom: 0, left: 0,
            w: "100vw", h: "30rem",
            // borderTopWidth: "1px",
            boxShadow: "rgb(0 0 60 / 15%) 0px 2px 30px 0px, rgb(0 0 80 / 6%) 0px 1px 3px 0px",
            transform: ["translateY(100%)", null],
            sizeKey: "h"
        },
        arrow: {
            right: 0,
            // top: "-2rem",
            position: "absolute",
            transform: "translateY(-100%)",
        },
        pannel: {
            w: '30rem', // h: "10rem",
            left: "50%", top: "-2rem",
            borderRadius: "lg",
            position: "absolute",
            transform: "translateX(-50%) translateY(-100%)",
        },
        arrowButton: {
            rightIcon: [<TriangleUpIcon />, <TriangleDownIcon />],
            children: ["SHOW", "HIDE"] // open closed
        }
    }
}

const _tabs = [
    {
        title: 'Scheme and Data',
    },
    {
        title: 'Network',
        disabled: true,
    },
    {
        title: 'Settings',
        disabled: true,
    },
]

const Dashboard = ({ appStore, stateStore, position = "bottom" }) => {

    const toast = useToast()

    useEffect(() => {
        // app store init
        appStore.init()
        stateStore.init()

        // pick init 
        pickup.init({
            // don't handle this elements
            exceptElements: ["#__pickup-ui", ".chakra-portal", "#chakra-toast-portal"],
            // shoudl we cache the css in to element attributes
            cacheCss: false, // dev mode, don't cache css
            onclick: (o) => {
                if (!stateStore.curActiveElement) {
                    o.picked(); // dont't auto picked
                    stateStore.setCurActiveElement(o)
                    return
                }

                // warning
                toast({
                    status: "warning",
                    title: "Apply first",
                    description: "Please apply current element first",
                    duration: 1000,
                })
            },
            onmouseover: (o) => {
                stateStore.setCurHoverElement(o)
            },
            onmouseout: () => {
                stateStore.setCurHoverElement(null)
            }
        });
    }, [])

    const history = useHistory();

    const ref = useRef();

    const { sizeKey, ...wrapperProps } = _positions[position].wrapper

    return <Box pos="fixed" ref={ref} zIndex="9999" borderBottomStyle="solid" display="flex" flexDirection="column"
        transition="all .3s ease-in-out" transform="translateX(0px) translateY(0px)"
        bg={useColorModeValue("white", "gray.800")}
        {...wrapperProps}
        {...{[sizeKey]: appStore.dashboardSize}}
        transform={_positions[position].wrapper.transform[0+appStore.visible]}>


        {/* global style reset primary color */}
        <Global styles={css`
        [__pickup__state] {
            outline-color: var(--chakra-colors-${appStore.colorScheme}-300) !important
        }
        `} />

        {/* arrow to toggle the dashboard */}
        <Box {..._positions[position].arrow}
            borderRadius="0.375rem"
            position="absolute" bg={useColorModeValue("white", "gray.800")}>
            <Button size="sm"
                onClick={() => appStore.toggle()}
                bg={useColorModeValue("gray.200", "gray.800")}
                rightIcon={_positions[position].arrowButton.rightIcon[0+appStore.visible]}
                children={_positions[position].arrowButton.children[0+appStore.visible]}/>
        </Box>

        {/* display hover tip */}
        <HoverElementTip />

        {/* display pannel for some top message */}
        <ActiveElementPannel {..._positions[position].pannel} />

        {/* the main dashboard */}
        <Flex flexDirection="column" h="full">
            {/* the main dashboard bar */}
            <SimpleGrid columns="3" h="2.875rem" p=".2rem" borderBottomStyle="solid" borderBottomWidth="1px" justifyContent="space-between">
                
                {/* site inforamtion */}
                <HStack>
                    <SiteInfo />
                </HStack>

                {/* title or tab nav */}
                <Flex justifyContent="center">
                    <Tabs colorScheme={appStore.colorScheme}>
                        <TabList>
                            {_tabs.map(({ title, disabled }) => <Tab key={title}
                            isDisabled={disabled}>{title}</Tab>)}
                        </TabList>
                    </Tabs>
                </Flex>

                {/* actions */}
                <HStack justifyContent="flex-end" px="1">
                    {/* switch for render */}
                    <CustomSwitch title="Render Mode" isChecked={appStore.enableRender}
                        onChange={() => appStore.changeRenderMode()}
                        help="Render mode will use html after browser rendered, will not follow requests to extract data."
                        colorScheme={appStore.colorScheme} />

                    <ColorPick color={appStore.colorScheme} onChange={(c) => appStore.setColorScheme(c)}/>

                    {/* use menu */}
                    <CustomMenu items={[
                        {
                            icon: <Icon alignSelf="center" as={FiHome} />,
                            title: 'Back Home',
                            onClick: ()=> location.href="/",
                        },
                        {
                            title:  <ColorModeSwitcher simple={false} size="sm" />,              
                        },
                    ]}>
                        <IconButton size="sm" icon={<HamburgerIcon />}/>
                    </CustomMenu>
                </HStack>
            </SimpleGrid>

            {/* dashboard content */}
            <Flex flex="1" h="calc(100% - 2.875rem)">
                <SchemeBuilder />
            </Flex>
        </Flex>
    </Box>
}

export default withEvents(inject('appStore', 'stateStore')(observer(Dashboard)))