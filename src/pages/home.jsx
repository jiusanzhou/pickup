import React from 'react';
import { Flex, Code, Text, Box } from '@chakra-ui/react';
import { inject, observer } from 'mobx-react';

import Logo from "../components/logo"
import Enter from '../components/enter';
import Section from '../components/section';

const Home = ({
  staticContext,
  match, history, location,
  appStore,
  ...props
}) => {
  return (
    <Flex w="full" {...props} justifyContent="center">
      <Section>
        <Logo mt={["7rem", "7rem", "7rem", "7rem", "10rem"]} />

        <Enter appStore={appStore} mt="1rem" />
      </Section>
    </Flex>
  );
};


export default inject('appStore')(observer(Home))
