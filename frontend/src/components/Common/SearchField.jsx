import { Icon, Input } from '@chakra-ui/react'
import { LuSearch } from 'react-icons/lu'
import { InputGroup } from '@/components/ui/input-group'

export const SearchField = () => {
    return (
        <InputGroup
            flex="1"
            startElement={
                <Icon size="sm">
                    <LuSearch />
                </Icon>
            }
        >
            <Input
                placeholder="Search"
                _focusVisible={{
                    borderColor: "ui.main",
                    boxShadow: "0 0 0 1px var(--chakra-colors-ui-main)",
                }}
            />
        </InputGroup>
    )
}