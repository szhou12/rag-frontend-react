import {
    Badge,
    Box,
    Container,
    Flex,
    Heading,
    Link,
    Table,
    VStack,
} from "@chakra-ui/react"
import { useQuery } from "@tanstack/react-query"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { FiSearch } from "react-icons/fi"

import { Tooltip } from "@/components/ui"
import DataTableLayout from "../DataTableLayout"
import WebpageActionsMenu from "./WebpageActionsMenu"
import { PendingDataTable } from "@/components/Dashboard/PendingDataTable"

const PER_PAGE = 5

function WebpagesTable() {
    // ... data fetching logic ...

    const columnHeaders = [
        "URL",
        "Date Updated",
        "Language",
        "Frequency (Days)",
        "Actions",
    ]

    return (
        <DataTableLayout
            isLoading={isLoading}
            isEmpty={items.length === 0}
            pendingComponent={<PendingDataTable columnHeaders={columnHeaders} />}
            emptyStateProps={{
                title: "No webpages found in Database",
                description: "Scrape a webpage to get started"
            }}
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
                    {webpages?.map((webpage) => {
                        <Table.Row key={webpage.id} opacity={isPlaceholderData ? 0.5 : 1}>
                            <Table.Cell truncate maxW="sm">
                                <Tooltip
                                    content={webpage.url}
                                    showArrow
                                    positioning={{ placement: "left-end" }}
                                >
                                    <Link variant="underline" href={webpage.url}>
                                        {webpage.url}
                                    </Link>
                                </Tooltip>
                            </Table.Cell>

                            <Table.Cell>
                                {webpage.date_updated}
                            </Table.Cell>

                            <Table.Cell>
                                {webpage.language==="en" ? "English" : "中文"}
                            </Table.Cell>

                            <Table.Cell>
                                {webpage.frequency}
                            </Table.Cell>

                            <Table.Cell>
                                <WebpageActionsMenu
                                    webpage={webpage}
                                />
                            </Table.Cell>
                        </Table.Row>
                    })}
                </Table.Body>
            </Table.Root>
        </DataTableLayout>
    )
    
    
}

export default WebpagesTable