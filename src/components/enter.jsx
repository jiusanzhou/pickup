import { Box, Input, InputGroup, InputLeftElement, InputRightElement, IconButton, FormControl } from '@chakra-ui/react';
import { LinkIcon, ArrowForwardIcon, CloseIcon } from "@chakra-ui/icons";
import React from 'react';
import { Field, Form, Formik } from 'formik';


const _urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
const validateTarget = (url) => {
    return !url || _urlRegex.test(url) ? null : "Must be a url"
}

export default ({ appStore, ...props }) => {

    return <Box>
        <Formik initialValues={{target: ''}} onSubmit={(values, actions) => {
            // TODO:
            appStore.start(values.target, {})
        }}>
        {() => <Form>
            {/* input bar */}
            <Box w={["18rem", "40rem"]} {...props}>
                    <Field name="target" validate={validateTarget}>{({ field, form }) => <FormControl
                        isInvalid={form.errors.target && form.touched.target}>
                    <InputGroup size="lg">
                        <InputLeftElement pointerEvents="none">
                            <LinkIcon color="gray.400" />
                        </InputLeftElement>
                        <Input borderRadius="full"
                            paddingRight="6rem"
                            focusBorderColor="gray"
                            _hover={{boxShadow: "md"}}
                            _focus={{boxShadow: "md"}}
                            isDisabled={appStore.loading}
                            {...field}
                            id="target"
                            placeholder="Enter the page's url">
                        </Input>
                        <InputRightElement justifyContent="flex-end" padding=".2rem" w="6rem">
                            {field.value&&!appStore.loading&&<IconButton isRound size="sm" variant="link"
                                onClick={()=>form.setFieldValue("target", "")}
                                icon={<CloseIcon color="gray.400" />} />}
                            <IconButton type="submit" isLoading={appStore.loading} isRound size="sm"
                                icon={<ArrowForwardIcon color="gray.400" />} />
                        </InputRightElement>
                    </InputGroup>
                    </FormControl>}
                    </Field>
            </Box>
            
        </Form>}
        </Formik>
    </Box>
}