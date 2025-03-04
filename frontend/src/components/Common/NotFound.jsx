import { Button, Center, Flex, Text } from "@chakra-ui/react"
import { Link } from "@tanstack/react-router"

const NotFound = () => {
    return (
        <>
            <Flex
                height="100vh"
                align="center"
                justify="center"
                flexDir="column"
                data-testid="not-found"
                p={4}
            >
                <Flex alignItems="center" zIndex={1}>
                    <Flex flexDir="column" ml={4} align="center" justify="center" p={4}>
                        <Text
                            fontSize={{ base: "6xl", md: "8xl" }}
                            fontWeight="bold"
                            lineHeight="1"
                            mb={4}
                        >
                            404
                        </Text>
                        <Text fontSzie="2xl" fontWeight="bold" mb={4}>
                            OOPS!
                        </Text>

                    </Flex>
                </Flex>

                <Text
                    fontSize="lg"
                    color="gray.500"
                    mb={4}
                    textAlign="center"
                    zIndex={1}
                >
                    The page you are looking for does not exist.
                </Text>

                <Center zIndex={1}>
                    <Link to="/">
                        <Button
                            variant="primary"
                            colorScheme="ui.main"
                            mt={4}
                            alignSelf="center"
                        >
                            Go Back
                        </Button>
                    </Link>
                </Center>

            </Flex>
        </>
    )
}

export default NotFound;