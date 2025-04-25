import {
    Box,
    Button,
    Icon,
    Text,
} from '@chakra-ui/react'

export const PromptButton = (props) => {
    const { icon, children, onClick, ...rest } = props

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
            onClick={() => onClick?.(children)}  // Pass prompt text to handler
            position="relative" // ensure Icon's Box is positioned relative to this Button
            {...rest}
        >
            <Text 
                overflow="hidden"
                textOverflow="ellipsis"
                width="100%"
                lineClamp={{ base: "2", md: "4" }} // truncate text to 2 lines on mobile, 4 lines on desktop
            >
                {children}
            </Text>
            
            <Box pos="absolute" bottom="4" insetEnd="4">
                <Icon size="lg" color="colorPalette.fg/50">
                    {icon}
                </Icon>
            </Box>
        </Button>
    )
}