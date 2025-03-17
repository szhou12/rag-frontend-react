import {
    Badge,
    Box,
    Container,
    EmptyState,
    Flex,
    Heading,
    Table,
    VStack,
} from "@chakra-ui/react"
import { useQuery } from "@tanstack/react-query"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { FiSearch } from "react-icons/fi"

import { Tooltip } from "@/components/ui"
import DataTableLayout from "../DataTableLayout"
import UserActionsMenu from "./UserActionsMenu"


const PER_PAGE = 5

function UsersTable() {
    // ... data fetching logic ...

    return (
        <DataTableLayout>
            <Table.Root size={{ base: "sm", md: "md" }}>
                <Table.Header>
                    <Table.Row>
                        <Table.ColumnHeader w="sm">Email</Table.ColumnHeader>
                        <Table.ColumnHeader w="sm">Role</Table.ColumnHeader>
                        <Table.ColumnHeader w="sm">Created At</Table.ColumnHeader>
                        <Table.ColumnHeader w="sm">Last Login</Table.ColumnHeader>
                        <Table.ColumnHeader w="sm">Status</Table.ColumnHeader>
                        <Table.ColumnHeader w="sm">Actions</Table.ColumnHeader>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {users?.map((user) => {
                        <Table.Row key={user.id} opacity={isPlaceholderData ? 0.5 : 1}>
                            <Table.Cell truncate maxW="sm">
                                <Tooltip
                                    content={user.email}
                                    showArrow
                                >
                                    <Box as="span" isTruncated>
                                        {user.email}
                                    </Box>
                                </Tooltip>
                                {user.email}
                                {currentUser?.id === user.id && (
                                    <Badge ml="1" colorPalette="teal">
                                        You
                                    </Badge>
                                )}
                            </Table.Cell>

                            <Table.Cell>
                                {user.role}
                            </Table.Cell>

                            <Table.Cell>
                                {user.created_at}
                            </Table.Cell>

                            <Table.Cell>
                                {user.last_login}
                            </Table.Cell>

                            <Table.Cell>
                                <Flex gap={2}>
                                    <Box 
                                        w="2"
                                        h="2"
                                        borderRadius="50%"
                                        bg={user.is_active ? "teal" : "red"}
                                        alignSelf="center"
                                    />
                                    {user.is_active ? "Active" : "Inactive"}
                                </Flex>
                            </Table.Cell>
                            
                            <Table.Cell>
                                <UserActionsMenu
                                    user={user}
                                    disabled={currentUser?.id === user.id}
                                />
                            </Table.Cell>
                            
                        </Table.Row>
                    })}
                </Table.Body>
            </Table.Root>

        </DataTableLayout>
    )
}

export default UsersTable