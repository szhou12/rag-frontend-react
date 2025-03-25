import { Button } from '@chakra-ui/react'
import { Link } from '@tanstack/react-router'

export const SidebarLink = (props) => {
    const { children, href, ...buttonProps } = props

    return (
        <Button
            variant="ghost"
            width="full"
            justifyContent="start"
            gap="3"
            color="fg.muted"
            _hover={{
                bg: 'colorPalette.subtle',
                color: 'colorPalette.fg',
            }}
            _currentPage={{
                color: 'colorPalette.fg',
            }}
            asChild
            {...buttonProps}
        >
            <Link to={href}>{children}</Link>
        </Button>
    )
}