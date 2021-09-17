import React from 'react';
import { Flex, Box, SimpleGrid, useColorModeValue } from '@chakra-ui/react';
import { ColorModeSwitcher } from '../components/ColorModeSwitcher';
import settings from "../utils/settings";

const Header = ({ w, h, fixed, bordered, ...props }) => {
  return <Box top={0} left={0} right={0}
    w="full" h={h} position={fixed && "fixed"}
    p=".5rem"
    borderBottomWidth={bordered && "1px"}
    borderBottomStyle="solid"
  >
    <SimpleGrid as="header" m="0 auto" h="100%" alignItems="center" w={w} {...props}>
      {/* Logo */}
      <ColorModeSwitcher justifySelf="flex-end" />
    </SimpleGrid>
  </Box>
};

const Footer = ({ w, h, bg, fixed = true, bordered, ...props }) => {
  return <Box bottom={0} left={0} right={0}
    w="full" h={h} position={fixed && "fixed"}
    p=".5rem"
    borderTopWidth={bordered && "1px"}
    borderTopStyle="solid"
    bg={Array.isArray(bg) ? useColorModeValue(...bg) : bg}
  >
    <SimpleGrid as="footer" m="0 auto" h="100%" alignItems="center" w={w} {...props}>
      {/* <ColorModeSwitcher justifySelf="flex-end" /> */}
    </SimpleGrid>
  </Box>
};

export default ({ children, header = {}, footer = {}, ...props }) => {

  const {headerH, footerH, maxContainerW} = settings

  return (
    <Box bg={useColorModeValue("white", "gray.800")}>
      <Header h={header.height || headerH} w={header.width || maxContainerW} {...header} />
      <Box as="main" pt={header.fixed&&headerH} minH="100vh" d="flex">
        {children}
      </Box>
      <Footer h={header.height || footerH} w={header.width || maxContainerW} {...footer} />
    </Box>
  );
};
