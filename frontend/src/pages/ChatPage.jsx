import {
    Box,
    Button,
    Center,
    Container,
    Flex,
    HStack,
    Heading,
    Icon,
    IconButton,
    SimpleGrid,
    Span,
    Stack,
    Text,
    Textarea,
  } from '@chakra-ui/react'
import { HiBookOpen, HiLightBulb, HiMap } from 'react-icons/hi'
import { LuImagePlus, LuMic, LuSendHorizontal } from 'react-icons/lu'

export const PromptButton = (props) => {
    const { icon, children, ...rest } = props
    return (
      <Button
        variant="subtle"
        minH={{ base: '100px', md: '200px' }}
        alignItems="flex-start"
        p="4"
        textStyle="md"
        fontWeight="medium"
        whiteSpace="normal"
        textAlign="start"
        {...rest}
      >
        {children}
        <Box pos="absolute" bottom="4" insetEnd="4">
          <Icon size="lg" color="colorPalette.fg/50">
            {icon}
          </Icon>
        </Box>
      </Button>
    )
  }

export default function ChatPage() {
    return (
      <Flex direction="column" height="full">
        <Box flex="1" overflow="auto">
          <Container maxW="4xl" pt="32">
            <Stack gap="10">
              <Heading size="4xl" fontWeight="normal">
                <Span color="colorPalette.fg">Hello, Client</Span> <br />
                <Span color="fg.muted">How can I help you today?</Span>
              </Heading>
  
              <SimpleGrid columns={{ base: 2, md: 4 }} gap="4">
                <PromptButton icon={<HiLightBulb />}>请分析动力电池的核心特性和发展趋势</PromptButton>
                <PromptButton icon={<HiMap />}>当前热泵技术有哪些发展路线?</PromptButton>
                <PromptButton icon={<HiLightBulb />}>请分析直接电解技术有哪些主要的应用场景</PromptButton>
                <PromptButton icon={<HiBookOpen />}>请分析液流电池储能技术在市场的发展趋势</PromptButton>
              </SimpleGrid>
            </Stack>
          </Container>
        </Box>
        <Box flex="0" mt="6">
          <Container maxW="4xl">
            <Flex bg="bg.muted" borderRadius="l2" px="4" py="3" align="flex-start">
              <Textarea
                unstyled
                outline="none"
                bg="transparent"
                resize="none"
                width="full"
                placeholder="Ask me anything about clean energy..."
              />
              <HStack>
                <IconButton variant="ghost" aria-label="Add image">
                  <LuImagePlus />
                </IconButton>
                <IconButton variant="ghost" aria-label="Record audio">
                  <LuMic />
                </IconButton>
                <IconButton aria-label="Send message">
                  <LuSendHorizontal />
                </IconButton>
              </HStack>
            </Flex>
          </Container>
          <Center height="10" bg="currentBg">
            <Text textStyle="xs" color="fg.subtle" textAlign="center">
              Our AI model can make mistakes. Please be kind and respectful.
            </Text>
          </Center>
        </Box>
      </Flex>
    )
  }