import {
    Badge,
    Box,
    Flex,
    Table,
} from "@chakra-ui/react"
import { useQuery, useQueryClient } from "@tanstack/react-query"

import { Tooltip } from "@/components/ui/tooltip"
import DataTableLayout from "../DataTableLayout"
import UserActionsMenu from "./UserActionsMenu"
import { PendingDataTable } from "@/components/Dashboard/PendingDataTable"
import { Route } from "@/routes/_dashboard-layout/admin"
import { usePagination } from "@/hooks/usePagination"

// TODO: DELETE when backend is ready
// Fake user data
const MOCK_USERS = Array.from({ length: 23 }, (_, index) => ({
    id: index + 1,
    email: `user${index + 1}@example.com`,
    role: index === 0 ? 'admin' : (index < 3 ? 'staff' : 'user'),
    created_at: new Date(2024, 0, index + 1).toLocaleDateString(),
    last_login: index < 5 ? new Date().toLocaleDateString() : 'Never',
    is_active: Math.random() > 0.3, // 70% chance of being active
}));

// TODO: DELETE when backend is ready
// Mock service that simulates API calls
const MockUsersService = {
    readUsers: ({ skip, limit }) => {
        // Simulate API delay
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    data: MOCK_USERS.slice(skip, skip + limit),
                    count: MOCK_USERS.length
                });
            }, 1000); // 1 second delay
        });
    }
};




const PER_PAGE = 5 // 5 data per page

/**
 * Creates query options for fetching paginated users data.
 * Used with React Query to manage server state and caching.
 * 
 * @param {Object} params - The parameters object
 * @param {number} params.page - Current page number (starts from 1)
 * @returns {Object} Query options for React Query
 *   @returns {Function} .queryFn - Function to fetch users data with pagination
 *   @returns {Array} .queryKey - Cache key for React Query ['users', page]
 * 
 * @example
 * queryKey = ["users", 1]: get first 5 users data for page 1
 * const options = getUsersQueryOptions({ page: 1 })
 * // Returns { skip: 0, limit: 5 }
 * 
 * queryKey = ["users", 2]: get users data (6-10) for page 2
 * const options = getUsersQueryOptions({ page: 2 })
 * // Returns { skip: 5, limit: 5 }
 */
function getUsersQueryOptions({ page }) {
    return {
        // API call to backend to fetch users data
        // TODO: Comment off when backend is ready
        // queryFn: () => 
        //     UsersService.readUsers({ 
        //         skip: (page - 1) * PER_PAGE, 
        //         limit: PER_PAGE // how many data to fetch
        //     }),

        // TODO: Uncomment when backend is ready
        queryFn: () => 
            MockUsersService.readUsers({ 
                skip: (page - 1) * PER_PAGE, 
                limit: PER_PAGE
            }),

        queryKey: ["users", page],
    }
}

function UsersTable() {
    // fetch current user data
    const queryClient = useQueryClient()
    const currentUser = queryClient.getQueryData(["currentUser"])

    // Set new page number in the URL
    const { setPage } = usePagination({ from: Route.fullPath })

    // Get current page number from the URL: /admin?page=2 -> {page: 2}
    const { page } = Route.useSearch()

    // Fetch users data from the backend
    const { data, isLoading, isPlaceholderData } = useQuery({
        ...getUsersQueryOptions({ page }),
        placeholderData: (prevData) => prevData,  // Keep previous page data visible while loading new data
    })

    // extract data from API response: data = { data: [user1, user2, user3], count: 25 }
    const users = data?.data.slice(0, PER_PAGE) ?? []
    const count = data?.count ?? 0


    const columnHeaders = [
        "Email",
        "Role",
        "Created At",
        "Last Login",
        "Status",
        "Actions",
    ]

    return (
        <DataTableLayout
            isLoading={isLoading}
            pendingComponent={<PendingDataTable columnHeaders={columnHeaders} />}
            paginationProps={{
                count,
                pageSize: PER_PAGE,
                onPageChange: ({ page }) => setPage(page)
            }}
        >
            <Table.Root size={{ base: "sm", md: "md" }}>

                <Table.Header>
                    <Table.Row>
                        {columnHeaders.map((header, index) => (
                            <Table.ColumnHeader key={index} w="sm">
                                {header}
                            </Table.ColumnHeader>
                        ))}
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {users?.map((user) => (
                        <Table.Row key={user.id} opacity={isPlaceholderData ? 0.5 : 1}>
                            <Table.Cell truncate maxW="sm">
                                <Tooltip
                                    content={user.email}
                                    showArrow
                                    positioning={{ placement: "left-end" }}
                                >
                                    <Box as="span" isTruncated>
                                        {user.email}
                                        {currentUser?.id === user.id && (
                                            <Badge ml="1" colorPalette="teal">
                                                You
                                            </Badge>
                                        )}
                                    </Box>
                                </Tooltip>
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
                    ))}
                </Table.Body>
            </Table.Root>

        </DataTableLayout>
    )
}

export default UsersTable