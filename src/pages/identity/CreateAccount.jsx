import React from 'react'
import { Box, Heading, Input, Button, Text, VStack, Checkbox, InputGroup, InputRightElement, FormControl, FormLabel, FormErrorMessage, Link } from '@chakra-ui/react'
import { Formik, Field, Form } from 'formik'
import * as Yup from 'yup'

const isUniqueUsername = (username) => {
    const existingUsernames = ['user1', 'user2', 'naruto']
    return !existingUsernames.includes(username)
}

const validationSchema = Yup.object({
    username: Yup.string()
        .required('Username is required')
        .test('is-unique', 'Username is already taken', (value) => isUniqueUsername(value)),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Confirm Password is required'),
})

function CreateAccount() {
    const [showPassword, setShowPassword] = React.useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)

    const handleShowPassword = () => setShowPassword(!showPassword)
    const handleShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword)

    return (
        <Box
            bgPosition="center"
            display="flex"
            bgColor={'gray'}
        >
            <Box
                w="50%"
                h="100%"
                bg="rgba(255, 255, 255, 0.8)"
                display="flex"
                alignItems="center"
                justifyContent="center"
            >
                <VStack spacing={4} w="full">
                    <Heading as="h1" size="xl" mb={4} mt={20} textAlign="center">
                        Create an account
                    </Heading>
                    <Formik
                        initialValues={{
                            username: '',
                            email: '',
                            password: '',
                            confirmPassword: '',
                        }}
                        validationSchema={validationSchema}
                        onSubmit={(values, actions) => {
                            const { confirmPassword, ...submitValues } = values
                            setTimeout(() => {
                                alert(JSON.stringify(submitValues, null, 2))
                                actions.setSubmitting(false)
                            }, 1000)
                        }}
                    >
                        {(props) => (
                            <Form>
                                <Field name='username'>
                                    {({ field, form }) => (
                                        <FormControl isInvalid={form.errors.username && form.touched.username} mb={4}>
                                            <FormLabel fontSize='15px'>Username</FormLabel>
                                            <Input {...field} placeholder='Username' borderColor='black' size='sm' borderRadius='5px' w="400px" />
                                            <FormErrorMessage fontSize='12px'>{form.errors.username}</FormErrorMessage>
                                        </FormControl>
                                    )}
                                </Field>
                                <Field name='email'>
                                    {({ field, form }) => (
                                        <FormControl isInvalid={form.errors.email && form.touched.email} mb={4}>
                                            <FormLabel fontSize='15px'>Email</FormLabel>
                                            <Input {...field} placeholder='Email' type='email' borderColor='black' size='sm' borderRadius='5px' />
                                            <FormErrorMessage fontSize='12px'>{form.errors.email}</FormErrorMessage>
                                        </FormControl>
                                    )}
                                </Field>
                                <Field name='password'>
                                    {({ field, form }) => (
                                        <FormControl isInvalid={form.errors.password && form.touched.password} mb={4}>
                                            <FormLabel fontSize='15px'>Password</FormLabel>
                                            <InputGroup>
                                                <Input {...field} placeholder='Password' type={showPassword ? 'text' : 'password'} borderColor='black' size='sm' borderRadius='5px' />
                                                <InputRightElement width='4.5rem'>
                                                    <Button mb='8px' h='1.5rem' size='xs' onClick={handleShowPassword}>
                                                        {showPassword ? 'Hide' : 'Show'}
                                                    </Button>
                                                </InputRightElement>
                                            </InputGroup>
                                            <FormErrorMessage fontSize='12px'>{form.errors.password}</FormErrorMessage>
                                        </FormControl>
                                    )}
                                </Field>
                                <Field name='confirmPassword'>
                                    {({ field, form }) => (
                                        <FormControl isInvalid={form.errors.confirmPassword && form.touched.confirmPassword} mb={4}>
                                            <FormLabel fontSize='15px'>Confirm Password</FormLabel>
                                            <InputGroup>
                                                <Input {...field} placeholder='Confirm Password' type={showConfirmPassword ? 'text' : 'password'} borderColor='black' size='sm' borderRadius='5px' />
                                                <InputRightElement width='4.5rem'>
                                                    <Button mb='8px' h='1.5rem' size='xs' onClick={handleShowConfirmPassword}>
                                                        {showConfirmPassword ? 'Hide' : 'Show'}
                                                    </Button>
                                                </InputRightElement>
                                            </InputGroup>
                                            <FormErrorMessage fontSize='12px'>{form.errors.confirmPassword}</FormErrorMessage>
                                        </FormControl>
                                    )}
                                </Field>
                                <Box w="100%" display="flex" justifyContent="start">
                                    <Checkbox defaultChecked fontSize='15px' mb={5}>I want to be a host</Checkbox>
                                </Box>
                                <Button
                                    colorScheme='purple'
                                    isLoading={props.isSubmitting}
                                    type='submit'
                                    width='150px'
                                    mb={5}
                                >
                                    Get Started
                                </Button>
                            </Form>
                        )}
                    </Formik>
                    <Text textAlign='center' fontSize='12px' mb={5}>
                        Already have an account? <Link href='./login'>Sign In</Link>
                    </Text>
                </VStack>
            </Box>
        </Box>
    )
}

export default CreateAccount
